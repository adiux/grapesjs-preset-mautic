import ViewsApplyCommand from './views.apply.command';

export default class ViewsApplyButton {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  /**
   * Add the save button before the close button
   */
  add() {
    const emailForm = ViewsApplyButton.getEmailForm();
    const emailFormList = ViewsApplyButton.getEmailFormList(emailForm);
    const emailType = ViewsApplyButton.getEmailType(emailForm);

    const removedBtn = this.editor.Panels.removeButton('views', 'close');
    const emailTypeSegment = 'list';

    let title = Mautic.translate('grapesjsbuilder.panelsViewsButtonsApplyTitle');
    let disable = false;
    let command = ViewsApplyCommand.name;

    if (emailType.val() === emailTypeSegment && !emailFormList.val().length) {
      title = Mautic.translate('grapesjsbuilder.panelsViewsButtonsApplyTitleError');
      disable = true;
      command = '';
    }

    this.editor.Panels.addButton('views', [
      {
        id: 'views-apply',
        className: `fa fa-check`,
        active: false,
        disable,
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
