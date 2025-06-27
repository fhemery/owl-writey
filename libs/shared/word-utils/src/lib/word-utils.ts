import * as cheerio from 'cheerio';

export function countWordsFromHtml(text: string): number {
  if (!text) {
    return 0;
  }

  // Count words in the extracted text
  return countWords(
    cheerio.load(clearHtmlCharacters(text.replace(/>/g, '> '))).text()
  );
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
    .replace(/[«;:!?»,.]/g, ' ')
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

function clearHtmlCharacters(text: string): string {
  return cheerio.load(text.replace(/&nbsp;/g, ' ')).text();
}
