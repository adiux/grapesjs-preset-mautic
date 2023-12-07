import { Editor } from 'grapesjs';
// @ts-ignore-next-line
import mjml2html from 'mjml-browser';

export default class MjmlService {
  /**
   * Get the mjml document from the dom
   *
   * @returns string
   */
  static getOriginalContentMjml() {
    // @ts-ignore-next-line
    return mQuery('textarea.builder-mjml').val();
  }

  /**
   * Get the editors mjml and transform it to html
   */
  static getEditorHtmlContent(editor: Editor): string {
    // Try catch for mjml parser error
    try {
      // html needs to be beautified for the click tracking to work. Therefore, we can
      // not use the built in command: mjml-get-code
      const mjml = this.getEditorMjmlContent(editor);
      const html = this.mjmlToHtml(mjml);

      return html ? html.trim() : '';
    } catch (error) {
      console.warn(error);
      alert('Errors inside your template. Template will not be saved.');
    }
    return '';
  }

  /**
   * Get the editors mjml
   * @param {Grapesjs Editor} editor
   * @returns string
   */
  static getEditorMjmlContent(editor: Editor) {
    // cleanId: Remove unnecessary IDs (eg. those created automatically)
    return editor.getHtml({ cleanId: true }).trim();
  }

  /**
   * Transform MJML to HTML
   * @todo show validation errors in the UI
   */
  static mjmlToHtml(mjml: string, endpoint = ''): string {
    let html = '';

    try {
      if (typeof mjml !== 'string' || !mjml.includes('<mjml>')) {
        throw new Error('No valid MJML provided');
      }

      if (endpoint !== '') {
        html = MjmlService.mjmlToHtmlViaEndpoint(mjml, endpoint);
      } else {
        // html needs to be beautified for the click tracking to work.
        // strict mode not working with e.g. id="" and data-type parameters that
        // are e.g. used for Dynamic Content
        html = mjml2html(mjml, { beautify: true });
      }
    } catch (error) {
      console.warn(error);
    }

    return html;
  }

  /**
   * Transform MJML to HTML via endpoint
   */
  private static mjmlToHtmlViaEndpoint(mjml: string, endpoint: string): string {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open('POST', endpoint, false);
    xmlHttpRequest.setRequestHeader('Content-type', 'application/json');
    xmlHttpRequest.send(JSON.stringify({ mjml }));

    return xmlHttpRequest.responseText ? JSON.parse(xmlHttpRequest.responseText) : '';
  }
}
