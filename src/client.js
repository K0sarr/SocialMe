import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-11-16',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_TOKEN, // or leave blank to be anonymous user

});

const builder = imageUrlBuilder(client);
    // const builder = client.image;

export const urlFor = (source) => builder.image(source);