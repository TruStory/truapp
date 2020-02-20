import markdownit from 'markdown-it';

export const fixLinks = markdownit({
  typographer: true,
  linkify: true,
});

fixLinks.linkify.tlds('.py', false);  // disables .py as top level domain
fixLinks.linkify.tlds('onion', true);            // Add unofficial `.onion` domain
