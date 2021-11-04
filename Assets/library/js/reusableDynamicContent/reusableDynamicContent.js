import loadCommands from './commands';

import ReusableDynamicContentDomComponentsHtml from './reusableDynamicContent.domcomponent.html';
import ReusableDynamicContentDomComponentsMjml from './reusableDynamicContent.domcomponent.mjml';
import ReusableDynamicContentBlockHtml from './reusableDynamicContent.block.html';
import ReusableDynamicContentBlockMjml from './reusableDynamicContent.block.mjml';
import ReusableDynamicContentService from './reusableDynamicContent.service';

export default class ReusableDynamicContent {
  editor;

  listRDC;

  constructor(editor) {
    this.editor = editor;
    this.listRDC = ReusableDynamicContentService.getDynamicContents();

    loadCommands(this.editor);
  }

  initHtml() {
    ReusableDynamicContentDomComponentsHtml.addReusableDynamicContentType(
      this.editor,
      this.listRDC
    );
    const reusableDynamicContentBlock = new ReusableDynamicContentBlockHtml(this.editor);
    reusableDynamicContentBlock.addReusableDynamicContentBlock();
  }

  initMjml() {
    ReusableDynamicContentDomComponentsMjml.addReusableDynamicContentType(
      this.editor,
      this.listRDC
    );
    const reusableDynamicContentBlock = new ReusableDynamicContentBlockMjml(this.editor);
    reusableDynamicContentBlock.addReusableDynamicContentBlock();
  }
}
