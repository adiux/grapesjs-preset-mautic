import ContentService from 'grapesjs-preset-mautic/dist/content.service';
import MjmlService from 'grapesjs-preset-mautic/dist/mjml/mjml.service';
import ButtonCloseCommands from 'grapesjs-preset-mautic/dist/buttons/buttonClose.command';

export default class ViewsApplyCommand {
  /**
   * The command to run on button click
   */
  static name = 'preset-mautic:apply-email';

  static applyEmail(editor, sender) {
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

    ViewsApplyCommand.applyForm(editor, sender);
  }

  static applyForm(editor, sender) {
    const emailForm = ViewsApplyCommand.getEmailForm();

    const emailFormSubject = ViewsApplyCommand.getEmailFormSubject(emailForm);
    const emailFormName = ViewsApplyCommand.getEmailFormName(emailForm);

    sender.set('disable', true);
    if (emailFormSubject.val() === '') {
      emailFormSubject.val(ViewsApplyCommand.getDefaultEmailName());
    }
    if (emailFormName.val() === '') {
      emailFormName.val(ViewsApplyCommand.getDefaultEmailName());
    }

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
      sender.set('disable', false);
    });
    Mautic.inBuilderSubmissionOff();
  }

  static showModal(editor, title, text) {
    const modal = editor.Modal;
    modal.setTitle(`<h4 class="text-danger">${title}</h4>`);

    const body = document.createElement('div');
    const content = document.createElement('div');
    const footer = document.createElement('div');
    const btnClose = document.createElement('button');

    content.classList.add('panel-body');
    content.innerText = text;
    body.appendChild(content);

    btnClose.classList.add('btn', 'btn-lg', 'btn-default', 'text-primary');
    btnClose.innerText = 'Close';
    btnClose.onclick = () => {
      modal.close();
    };
    footer.classList.add('panel-footer', 'text-center');
    footer.appendChild(btnClose);
    body.appendChild(footer);

    modal.setContent(body);
    modal.open({
      attributes: {
        class: 'modal-content',
      },
    });
  }

  static getBtnViewsApply() {
    return mQuery('#btn-views-apply');
  }

  static getEmailForm() {
    return mQuery('form[name=emailform]');
  }

  static getEmailFormSubject(emailForm) {
    return emailForm.find('#emailform_subject');
  }

  static getEmailFormName(emailForm) {
    return emailForm.find('#emailform_name');
  }

  static getEmailFormList(emailForm) {
    return emailForm.find('#emailform_lists');
  }

  static getEmailType(emailForm) {
    return emailForm.find('#emailform_emailType');
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
