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
    const emailForm = ViewsApplyButton.getEmailForm();
    const emailFormList = ViewsApplyButton.getEmailFormList(emailForm);
    const emailType = ViewsApplyButton.getEmailType(emailForm);

    const removedBtn = this.editor.Panels.removeButton('views', 'close');
    const emailTypeSegment = 'list';

    let title = Mautic.translate('grapesjsbuilder.panelsViewsButtonsApplyTitle');
    let disabled = '';
    let command = ViewsApplyCommand.name;

    if (emailType.val() === emailTypeSegment && !emailFormList.val().length) {
      title = Mautic.translate('grapesjsbuilder.panelsViewsButtonsApplyTitleError');
      disabled = ' disabled';
      command = '';
    }

    this.editor.Panels.addButton('views', [
      {
        id: 'views-apply',
        className: `fa fa-check ${disabled}`,
        active: false,
        attributes: {
          id: 'btn-views-apply',
          title,
        },
        command,
        context: 'views-apply',
      },
      removedBtn,
    ]);
  }

  static getEmailForm() {
    return mQuery('form[name=emailform]');
  }

  static getEmailFormList(emailForm) {
    return emailForm.find('#emailform_lists');
  }

  static getEmailType(emailForm) {
    return emailForm.find('#emailform_emailType');
  }
}
