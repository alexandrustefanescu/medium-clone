import { GetStaticProps } from 'next';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import PortableText from 'react-portable-text';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onFormSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <main>
      <Header />
      <img
        className="h-40 w-full object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="Post Image"
      />
      <article className="mx-auto max-w-4xl p-5">
        <h1 className="mt-10 mb-4 text-4xl">{post.title}</h1>
        <h2 className="mb-4 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt="Author Image"
          />
          <p className="text-sm font-extralight">
            Author: {post.author.name} - posted at{' '}
            <span className="font-medium">
              {new Date(post._createdAt).toLocaleString()}
            </span>
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body || []} // if there is no body text, use an empty array
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="my-5 mx-auto max-w-4xl border-2 border-green-600" />
      {/* Blog comment section */}
      {submitted ? (
        <div className="my-10 mx-auto flex max-w-4xl flex-col bg-green-600 p-10 text-white">
          <h3 className="text-3xl font-bold">
            You have submitted your comment succesfully!
          </h3>
          <p>It will be public for other people only if it will be approved.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="my-10 mx-auto mb-10 flex max-w-4xl flex-col border border-green-600 p-5"
        >
          <h3 className="text-lg text-green-600">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment bellow!</h4>
          <hr className="mt-2 py-3" />
          {/* Form inputs fields */}
          <input
            {...register('_id')}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="mb-5 block">
            <span className="text-zinc-800">Name</span>
            <input
              {...register('name', { required: true })} // react-hook-form validation
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-600 focus:ring-2"
              type="text"
              placeholder="First Name Last Name"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-zinc-800">Email</span>
            <input
              {...register('email', { required: true })} // react-hook-form validation
              className="form-input mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-green-600 focus:ring-2"
              type="email"
              placeholder="example@mail.com"
            />
          </label>
          <label className="mb-5 block">
            <span className="text-zinc-800">Comment</span>
            <textarea
              {...register('comment', { required: true })} // react-hook-form validation
              className="form-textarea mt-1 block w-full resize-none rounded border py-2 px-3 shadow outline-none ring-green-600 focus:ring-2"
              placeholder="Type a text"
              rows={10}
            />
          </label>
          {/* Errors will be shown if the form state is invalid */}
          <div>
            {errors.name && <p className="text-red-600">Name is required</p>}
            {errors.email && <p className="text-red-600">Email is required</p>}
            {errors.comment && (
              <p className="text-red-600">Comment is required</p>
            )}
          </div>
          <input
            className="focus:shadow-outline cursor-pointer rounded bg-green-600 py-2 px-4 font-bold text-white shadow hover:bg-green-500 focus:outline-none"
            type="submit"
          />
        </form>
      )}
      {/* Comments */}
      <div className="my-10 mx-auto flex max-w-4xl flex-col space-y-2 p-10 shadow shadow-green-600">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p className="text-black">
              <span className="text-green-600">{comment.name}:</span>{' '}
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

// Async function to get all posts from the database
export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
    _id,
    slug {
      current
    }
  }`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
// Async function to get static props for a specific post
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    author -> {
      name,
      image
    },
    'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
    description,
    mainImage,
    slug,
    body
  }`;
  const post = await sanityClient.fetch(query, { slug: params?.slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // updates the old cached version after 60 seconds
  };
};
