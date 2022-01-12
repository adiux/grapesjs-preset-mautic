import ViewsSaveCommand from './views.save.command';

export default class ViewsSaveButton {
  editor;

  /**
   * Add save button before close button
   */
  constructor(editor) {
    if (!editor) {
      throw new Error('no editor');
    }
    this.editor = editor;
  }

  add() {
    const removedBtn = this.editor.Panels.removeButton('views', 'close');

    this.editor.Panels.addButton('views', [
      {
        id: 'views-save',
        className: 'fa fa-floppy-o icon-blank btn-views-save',
        active: false,
        attributes: {
          title: Mautic.translate('grapesjsbuilder.panelsViewsButtonsSaveTitle'),
        },
        command: ViewsSaveCommand.name,
        context: 'views-save',
      },
      removedBtn,
    ]);
  }
}
