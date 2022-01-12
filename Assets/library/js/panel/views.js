import loadCommands from './commands';
import ViewsSaveButton from './views.save.button';

export default class Views {
  editor;

  constructor(editor) {
    this.editor = editor;

    loadCommands(this.editor);
  }

  update() {
    new ViewsSaveButton(this.editor).add();
  }
}
