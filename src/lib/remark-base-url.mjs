import { visit } from 'unist-util-visit';

/**
 * Remark plugin to add base URL to image paths in production
 */
export function remarkBaseUrl() {
  return (tree) => {
    const base = process.env.NODE_ENV === 'production' ? '/agentcore-avengers' : '';

    visit(tree, 'image', (node) => {
      if (node.url && node.url.startsWith('/')) {
        node.url = `${base}${node.url}`;
      }
    });
  };
}
