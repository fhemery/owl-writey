declare const htmlParseStringify: htmlParseStringify.htmlParseStringify;

declare namespace htmlParseStringify {
  export interface htmlParseStringify {
    parse_tag(tag: string): IDoc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse(html: string, options?: IOptions): Array<any>;
    stringify(doc: IDoc): string;
  }

  export interface IDoc {
    type: string;
    content?: string;
    voidElement: boolean;
    name: string;
    attrs: Record<string, string>;
    children: IDoc[];
  }

  export interface IOptions {
    components: string[];
  }
}

declare module 'html-parse-stringify' {
  export = htmlParseStringify;
}
