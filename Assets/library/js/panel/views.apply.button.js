import ViewsApplyCommand from './views.apply.command';

export default class ViewsApplyButton {
  editor;

  /**
   * Add save button before close button
   */
  constructor(editor) {
    this.editor = editor;
  }

  add() {
    const emailFormList = this.getEmailFormList();
    const emailType = this.getEmailType();

    const removedBtn = this.editor.Panels.removeButton('views', 'close');
    const emailTypeSegment = 'list';

    let disabled = '';

    if (emailType.val() === emailTypeSegment && !emailFormList.val().length) {
      disabled = ' disabled';
    }

    this.editor.Panels.addButton('views', [
      {
        id: 'views-apply',
        className: `fa fa-check btn-views-apply${disabled}`,
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

  getEmailFormList() {
    return mQuery('#emailform_lists');
  }

  getEmailType() {
    return mQuery('#emailform_emailType');
  }
}
