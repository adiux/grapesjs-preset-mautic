import ViewsApplyCommand from './views.apply.command';

export default class ViewsApplyButton {
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
        id: 'views-apply',
        className: 'fa fa-check btn-views-apply',
        active: false,
        attributes: {
          title: Mautic.translate('grapesjsbuilder.panelsViewsButtonsApplyTitle'),
        },
        command: ViewsApplyCommand.name,
        context: 'views-apply',
      },
      removedBtn,
    ]);
  }
}
