export default class EditorFontsService {
    static loadEditorFonts(editor: any): void;
    static updateFontList(editor: any, fontList: any): any;
    static sortFontList(fontList: any): any;
    static addFontLinksToHtml(htmlCode: any): string;
    static appendFontStyleLink(head: any, url: any): any;
    static createStylesheetLink(url: any): HTMLLinkElement;
}
