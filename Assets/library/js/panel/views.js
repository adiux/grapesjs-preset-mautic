import loadCommands from './commands';
import ViewsApplyButton from './views.apply.button';

export default class Views {
  editor;

  constructor(editor) {
    this.editor = editor;

    loadCommands(this.editor);
  }

  update() {
    new ViewsApplyButton(this.editor).add();
  }
}
