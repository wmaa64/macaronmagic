import sanityClient from "@sanity/client";
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
projectId: '6h7nts69',
dataset: 'production',
apiVersion: "2022-11-27",
useCdn: true,
token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
