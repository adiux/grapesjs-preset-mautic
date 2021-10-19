import loadCommands from './commands';

import ReusableDynamicContentDomComponentsHtml from './reusableDynamicContent.domcomponent.html';
import ReusableDynamicContentDomComponentsMjml from './reusableDynamicContent.domcomponent.mjml';
import ReusableDynamicContentBlock from './reusableDynamicContent.block';

export default class ReusableDynamicContent {
  editor;

  constructor(editor) {
    this.editor = editor;
    loadCommands(this.editor);
  }

  init() {
    ReusableDynamicContentDomComponentsHtml.addReusableDynamicContentType(this.editor);
    this.addBlock();
  }

  initMjml() {
    ReusableDynamicContentDomComponentsMjml.addReusableDynamicContentType(this.editor);
    this.addBlock();
  }

  addBlock() {
    const reusableDynamicContentBlock = new ReusableDynamicContentBlock(this.editor);
    reusableDynamicContentBlock.addReusableDynamicContentBlock();
  }
}
