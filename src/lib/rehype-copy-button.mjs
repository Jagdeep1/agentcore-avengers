import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to add copy buttons to code blocks
 */
export function rehypeCopyButton() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Find pre > code elements (code blocks)
      if (
        node.tagName === 'pre' &&
        node.children &&
        node.children.some((child) => child.tagName === 'code')
      ) {
        const codeNode = node.children.find((child) => child.tagName === 'code');

        // Extract language from className (e.g., "language-python")
        let language = '';
        if (codeNode.properties?.className) {
          const langClass = codeNode.properties.className.find((c) =>
            c.startsWith('language-')
          );
          if (langClass) {
            language = langClass.replace('language-', '');
          }
        }

        // Generate unique ID for this code block
        const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;

        // Add ID to the pre element
        if (!node.properties) {
          node.properties = {};
        }
        node.properties.id = codeId;
        node.properties.className = node.properties.className || [];
        if (!node.properties.className.includes('code-block')) {
          node.properties.className.push('code-block');
        }

        // Create wrapper div with copy button positioned absolutely
        const wrapper = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['code-block-wrapper'],
          },
          children: [
            // Copy button (positioned absolutely in top-right)
            {
              type: 'element',
              tagName: 'button',
              properties: {
                className: ['copy-button'],
                'data-code-id': codeId,
                'aria-label': 'Copy code to clipboard',
                type: 'button',
              },
              children: [
                // Copy icon (SVG)
                {
                  type: 'element',
                  tagName: 'svg',
                  properties: {
                    className: ['copy-icon'],
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '16',
                    height: '16',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'rect',
                      properties: {
                        x: '9',
                        y: '9',
                        width: '13',
                        height: '13',
                        rx: '2',
                        ry: '2',
                      },
                      children: [],
                    },
                    {
                      type: 'element',
                      tagName: 'path',
                      properties: {
                        d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
                      },
                      children: [],
                    },
                  ],
                },
                // Check icon (SVG)
                {
                  type: 'element',
                  tagName: 'svg',
                  properties: {
                    className: ['check-icon', 'hidden'],
                    xmlns: 'http://www.w3.org/2000/svg',
                    width: '16',
                    height: '16',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': '2',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                  },
                  children: [
                    {
                      type: 'element',
                      tagName: 'polyline',
                      properties: {
                        points: '20 6 9 17 4 12',
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Original pre element
            node,
          ],
        };

        // Replace the pre element with the wrapper
        parent.children[index] = wrapper;
      }
    });
  };
}
