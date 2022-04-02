import { createCurrentUserHook, createClient } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'
import { config } from './config'

// createClient sets up the client, fetching data in the getProps page functions
export const sanityClient = createClient(config)
/**
 * Set up a helper function for generating Image URLs with only the asset
 * reference data in your documents.
 * Read more: https://www.sanity.io/docs/image-urls
 **/
export const urlFor = (source) => createImageUrlBuilder(config).image(source)
// Helper function for using the current logged in user account
export const currentUser = createCurrentUserHook(config)
