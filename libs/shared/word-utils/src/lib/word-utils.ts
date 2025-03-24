import * as parseHtml from 'html-parse-stringify';

export function countWordsFromHtml(text: string): number {
  if (!text) {
    return 0;
  }

  // Parse the HTML string into a tree structure
  const ast = parseHtml.parse(text);

  // Extract text content from the AST
  const textContent = extractTextFromAst(ast);

  // Count words in the extracted text
  return countWords(textContent);
}

/**
 * Recursively extracts text content from HTML AST
 */
function extractTextFromAst(ast: any[]): string {
  if (!ast || !ast.length) {
    return '';
  }

  return ast
    .reduce((text, node) => {
      // If it's a text node, add its content
      if (node.type === 'text') {
        return text + ' ' + node.content;
      }

      // If it has children, recursively process them
      if (node.children && node.children.length) {
        return text + ' ' + extractTextFromAst(node.children);
      }

      return text;
    }, '')
    .trim();
}

/**
 * Counts words in a text string with French language considerations
 * In French, punctuation marks like colons, semicolons, question marks, etc.
 * are surrounded by spaces
 */
function countWords(text: string): number {
  if (!text) {
    return 0;
  }

  // Normalize spaces around French punctuation
  const normalizedText = text
    // Remove punctuation (: ; ! ? » « etc.)
    .replace(/[«;:!?»,]/g, '')
    .replace(/'/g, ' ')
    // Replace multiple spaces with a single space
    .replace(/\s+/g, ' ')
    .trim();

  // Split by spaces and filter out empty strings
  const words = normalizedText
    .split(' ')
    .filter((word) => word.trim().length > 0);

  return words.length;
}
