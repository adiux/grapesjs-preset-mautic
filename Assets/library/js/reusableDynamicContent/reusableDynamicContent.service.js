import ReusableDynamicContentBlockHtml from './reusableDynamicContent.block.html';
import ReusableDynamicContentDomComponentsHtml from './reusableDynamicContent.domcomponent.html';
import ReusableDynamicContentBlockMjml from './reusableDynamicContent.block.mjml';

export default class reusableDynamicContentBlocks {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  init() {
    const dc = this.editor.DomComponents;

    if (dc.getType('mjml')) {
      const reusableDynamicContentBlockMjml = new ReusableDynamicContentBlockMjml(this.editor);
      reusableDynamicContentBlockMjml.addReusableDynamicContentBlock();
    } else {
      ReusableDynamicContentDomComponentsHtml.addReusableDynamicContentType(this.editor);

      const reusableDynamicContentBlockHtml = new ReusableDynamicContentBlockHtml(this.editor);
      reusableDynamicContentBlockHtml.addReusableDynamicContentBlock();
    }
  }
}
