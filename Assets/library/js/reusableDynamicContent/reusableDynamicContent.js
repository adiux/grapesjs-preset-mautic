import loadCommands from './commands';

import ReusableDynamicContentDomComponentsHtml from './reusableDynamicContent.domcomponent.html';
import ReusableDynamicContentDomComponentsMjml from './reusableDynamicContent.domcomponent.mjml';
import ReusableDynamicContentBlockHtml from './reusableDynamicContent.block.html';
import ReusableDynamicContentBlockMjml from './reusableDynamicContent.block.mjml';

export default class ReusableDynamicContent {
  editor;

  constructor(editor) {
    this.editor = editor;

    loadCommands(this.editor);
  }

  initHtml() {
    ReusableDynamicContentDomComponentsHtml.addReusableDynamicContentType(
      this.editor
    );
    const reusableDynamicContentBlock = new ReusableDynamicContentBlockHtml(this.editor);
    reusableDynamicContentBlock.addReusableDynamicContentBlock();
  }

  initMjml() {
    ReusableDynamicContentDomComponentsMjml.addReusableDynamicContentType(
      this.editor
    );
    const reusableDynamicContentBlock = new ReusableDynamicContentBlockMjml(this.editor);
    reusableDynamicContentBlock.addReusableDynamicContentBlock();
  }
}
