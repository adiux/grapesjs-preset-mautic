import { Editor } from 'grapesjs';
import Logger from './logger';


export default class ContentService {
  static modeEmailHtml = 'email-html';

  static modeEmailMjml = 'email-mjml';

  static modePageHtml = 'page-html';

  static isMjmlMode(editor: Editor) {
    if (!editor) {
      throw new Error('editor is required.');
    }
    return ContentService.getMode(editor) === ContentService.modeEmailMjml;
  }

  static getMode(editor: Editor) {
    const cfg = editor.getConfig();

    if (
      !cfg.pluginsOpts ||
      !cfg.pluginsOpts['grapesjsmautic'] ||
      !cfg.pluginsOpts['grapesjsmautic']['mode']
    ) {
      throw new Error('Wrong Mautic Grapesjs mode');
    }

    return cfg.pluginsOpts['grapesjsmautic']['mode'];
  }

  /**
   * Get the current Canvas content as complete HTML document:
   * Combine original doctype, header, editor styles and content
   */
  static getCanvasAsHtmlDocument(editor: Editor): Document
   {
    const parser = new DOMParser();
    const logger = new Logger(editor);

    // get original doctype, header and add it to the html
    const originalContent = ContentService.getOriginalContentHtml();
    const doctype = ContentService.serializeDoctype(originalContent.doctype);

    ContentService.sanitize();

    const htmlCombined = `${doctype}<html>${editor.getHtml()}<style>${editor.getCss({
      avoidProtected: true,
    })}</style></html>`;

    // get a DocumentHTML from the string
    const htmlDocument = parser.parseFromString(htmlCombined, 'text/html');

    // if no header is set on the canvas, replace it with existing from theme
    if (!htmlDocument.head.innerHTML && originalContent.head.innerHTML) {
      logger.debug('Set head based on the original content', {
        head: originalContent.head.innerHTML,
      });
      htmlDocument.head.innerHTML = originalContent.head.innerHTML;
    }

    return htmlDocument;
  }

  static sanitize(): string
  {
    /**
     * Removes stuff the Builder needs for it's magic but cannot be in the HTML result. E.g for dynamic content.
     * 
     * This updates the originalContent variable directly
     * (as it's passed by reference), so we don't need to re-assign anything here
     */
    //@ts-ignore
    return Mautic.sanitizeHtmlBeforeSave(mQuery(originalContent));
  }

  /**
   * Get complete current html. Including doctype and original header.
   * @returns string
   */
  static getEditorHtmlContent(editor: Editor) {
    if (!editor) {
      throw new Error('Editor is required.');
    }

    const contentDocument = ContentService.getCanvasAsHtmlDocument(editor);

    if (!contentDocument || !contentDocument.body) {
      throw new Error('No html content found');
    }
    return ContentService.serializeHtmlDocument(contentDocument);
  }

  /**
   * Serialize a DocumentHTML Object to a <html> string
   */
  static serializeHtmlDocument(contentDocument: Document) {
    if (contentDocument === null || !(contentDocument instanceof Document)) {
      throw new Error('No Html Document');
    }

    // @todo add the lang parameter. E.g. <html lang="de-DE">
    return `${ContentService.serializeDoctype(contentDocument.doctype)}<html>${
      contentDocument.head.outerHTML
    }${contentDocument.body.outerHTML}</html>`;
  }

  /**
   * Returns the correct string for valid (HTML5) doctypes, eg:
   * <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0//EN" "http://www.w3.org/TR/REC-html40/strict.dtd">
   */
  static serializeDoctype(doctype: DocumentType | null): string {
    if (!doctype) {
      return '';
    }
    return new XMLSerializer().serializeToString(doctype);
  }

  /**
   * Get the selected themes original or the users last saved
   * content from the db. Loaded via Mautic PHP into the textarea.
   */
  static getOriginalContentHtml(): Document {
    // Parse HTML theme/template
    const parser = new DOMParser();
    //@ts-ignore
    const textareaHtml = mQuery('textarea.builder-html');
    const doc = parser.parseFromString(textareaHtml.val(), 'text/html');
    if (!doc.body.innerHTML || !doc.head.innerHTML) {
      throw new Error('No valid HTML template found');
    }
    return doc;
  }

  /**
   * Extract all stylesheets from the template <head>
   * @todo use DocumentHTML Styles directly
   */
   getStyles() {
    const content = ContentService.getOriginalContentHtml();

    if (!content.head) {
      return [];
    }
    const links = content.head.querySelectorAll('link');
    const styles: string[] = [];

    if (links) {
      links.forEach((link) => {
        if (link && link.rel === 'stylesheet') {
          styles.push(link.href);
        }
      });
    }

    return styles;
  }
}
