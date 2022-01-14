import ContentService from 'grapesjs-preset-mautic/dist/content.service';
import MjmlService from 'grapesjs-preset-mautic/dist/mjml/mjml.service';
import ButtonCloseCommands from 'grapesjs-preset-mautic/dist/buttons/buttonClose.command';

export default class ViewsApplyCommand {
  /**
   * The command to run on button click
   */
  static name = 'preset-mautic:apply-email';

  static applyEmail(editor, sender) {
    const emailForm = ViewsApplyCommand.getEmailForm();
    const emailFormSubject = ViewsApplyCommand.getEmailFormSubject();
    const emailFormName = ViewsApplyCommand.getEmailFormName();
    const btnViewsApply = ViewsApplyCommand.getBtnViewsApply();

    setTimeout(() => {
      ViewsApplyCommand.activateButtonLoadingIndicator(btnViewsApply, true);
    }, 300);

    const mode = ContentService.getMode(editor);
    editor.runCommand('preset-mautic:dynamic-content-components-to-tokens');

    if (mode === ContentService.modePageHtml) {
      const htmlDocument = ContentService.getCanvasAsHtmlDocument(editor);
      ButtonCloseCommands.returnContentToTextarea(
        editor,
        ContentService.serializeHtmlDocument(htmlDocument)
      );
    }

    if (mode === ContentService.modeEmailHtml) {
      const html = ContentService.getEditorHtmlContent(editor);
      ButtonCloseCommands.returnContentToTextarea(editor, html);
    }

    if (mode === ContentService.modeEmailMjml) {
      const htmlCode = MjmlService.getEditorHtmlContent(editor);
      const mjmlCode = MjmlService.getEditorMjmlContent(editor);

      if (!htmlCode || !mjmlCode) {
        throw new Error('Could not generate html from MJML');
      }

      ButtonCloseCommands.returnContentToTextarea(editor, htmlCode, mjmlCode);
    }

    if (emailFormSubject.val() === '') {
      emailFormSubject.val(ViewsApplyCommand.getDefaultEmailName());
    }
    if (emailFormName.val() === '') {
      emailFormName.val(ViewsApplyCommand.getDefaultEmailName());
    }

    ViewsApplyCommand.applyForm(editor, emailForm);

    setTimeout(() => {
      ViewsApplyCommand.activateButtonLoadingIndicator(btnViewsApply, false);
      sender.attributes.active = false;
    }, 1000);
  }

  static activateButtonLoadingIndicator(btn, isActive) {
    if (isActive) {
      Mautic.activateButtonLoadingIndicator(btn);
    } else {
      Mautic.removeButtonLoadingIndicator(btn);
    }
  }

  static applyForm(editor, emailForm) {
    Mautic.inBuilderSubmissionOn(emailForm);
    Mautic.postForm(emailForm, (response) => {
      if (response.validationError !== null) {
        const title = Mautic.translate('grapesjsbuilder.panelsViewsCommandModalTitleError');
        ViewsApplyCommand.showModal(editor, title, response.validationError);
      } else {
        if (response.route) {
          // update URL in address bar
          MauticVars.manualStateChange = false;
          History.pushState(null, 'Mautic', response.route);

          // update Title
          Mautic.generatePageTitle(response.route);
        }

        // update form action
        if (ViewsApplyCommand.strcmp(emailForm[0].baseURI, emailForm[0].action) !== 0) {
          emailForm[0].action = emailForm[0].baseURI;
        }
      }
    });
    Mautic.inBuilderSubmissionOff();
  }

  static showModal(editor, title, text) {
    const modal = editor.Modal;
    modal.setTitle(title);
    modal.setContent(text);
    modal.open({
      attributes: {
        class: 'modal-content',
      },
    });
  }

  static getEmailForm() {
    return mQuery('form[name=emailform]');
  }

  static getEmailFormSubject() {
    return mQuery('#emailform_subject');
  }

  static getEmailFormName() {
    return mQuery('#emailform_name');
  }

  static getBtnViewsApply() {
    return mQuery('.btn-views-apply');
  }

  static getEmailFormList() {
    return mQuery('#emailform_lists');
  }

  static getEmailType() {
    return mQuery('#emailform_emailType');
  }

  static getDefaultEmailName() {
    return `E-Mail ${moment().format('YYYY-MM-D hh:mm:ss')}`;
  }

  static strcmp(str1, str2) {
    if (str1.toString() < str2.toString()) return -1;
    if (str1.toString() > str2.toString()) return 1;
    return 0;
  }
}
