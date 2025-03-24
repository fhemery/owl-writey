import { countWordsFromHtml } from './word-utils';

describe('countWordsFromHtml', () => {
  describe('Basic HTML parsing', () => {
    it('should count words in simple HTML', () => {
      const html = '<p>Hello world</p>';
      expect(countWordsFromHtml(html)).toBe(2);
    });

    it('should count words across multiple HTML elements', () => {
      const html = '<div><p>Hello</p><p>beautiful world</p></div>';
      expect(countWordsFromHtml(html)).toBe(3);
    });

    it('should handle nested HTML elements', () => {
      const html =
        '<div>This is <strong>very <em>important</em></strong> text</div>';
      expect(countWordsFromHtml(html)).toBe(5);
    });

    it('should return 0 for empty HTML', () => {
      expect(countWordsFromHtml('')).toBe(0);
      expect(countWordsFromHtml('<div></div>')).toBe(0);
    });
  });

  describe('French text handling', () => {
    it('should correctly count words with French accents', () => {
      const html = '<p>Voilà un café très délicieux</p>';
      expect(countWordsFromHtml(html)).toBe(5);
    });

    it('should handle French punctuation with spaces', () => {
      const html = '<p>Bonjour ! Comment allez-vous ? Très bien : merci.</p>';
      expect(countWordsFromHtml(html)).toBe(6);
    });

    it('should handle French quotation marks', () => {
      const html = '<p>Il a dit : « Je suis content » et il est parti.</p>';
      expect(countWordsFromHtml(html)).toBe(10);
    });

    it('should handle complex French sentences with mixed punctuation', () => {
      const html =
        "<div>L'été, c'est la saison où il fait chaud ; l'hiver, c'est la saison où il fait froid !</div>";
      expect(countWordsFromHtml(html)).toBe(20);
    });
  });

  describe('English text handling', () => {
    it('should correctly count words in English sentences', () => {
      const html = '<p>This is a simple English sentence.</p>';
      expect(countWordsFromHtml(html)).toBe(6);
    });

    it('should handle English punctuation', () => {
      const html = "<p>Hello, world! How are you? I'm fine: thanks.</p>";
      expect(countWordsFromHtml(html)).toBe(9);
    });

    it('should handle English quotation marks', () => {
      const html = '<p>He said, "I am happy" and left.</p>';
      expect(countWordsFromHtml(html)).toBe(7);
    });
  });

  describe('Mixed language and complex HTML', () => {
    it('should handle mixed French and English text', () => {
      const html = '<div>Hello world! <span>Bonjour le monde !</span></div>';
      expect(countWordsFromHtml(html)).toBe(5);
    });

    it('should handle complex HTML with attributes and mixed content', () => {
      const html = `
        <article class="post">
          <h1>Le Café</h1>
          <p>J'aime le <strong>café</strong> le matin.</p>
          <p>It's <em>very</em> delicious!</p>
          <ul>
            <li>Espresso : fort</li>
            <li>Latte : doux</li>
          </ul>
        </article>
      `;
      expect(countWordsFromHtml(html)).toBe(16);
    });

    it('should handle HTML entities', () => {
      const html = '<p>Caf&eacute; &amp; th&eacute;</p>';
      expect(countWordsFromHtml(html)).toBe(3);
    });
  });
});
