import ContentService from 'grapesjs-preset-mautic/dist/content.service';
import MjmlService from 'grapesjs-preset-mautic/dist/mjml/mjml.service';
import ButtonCloseCommands from 'grapesjs-preset-mautic/dist/buttons/buttonClose.command';
import ViewsApplyService from './views.apply.service';

export default class ViewsApplyCommand {
  /**
   * The command to run on button click
   */
  static name = 'preset-mautic:apply-email';

  static applyEmail(editor, sender) {
    const emailForm = ViewsApplyService.getEmailForm();
    const emailFormSubject = ViewsApplyService.getEmailFormSubject();
    const emailFormName = ViewsApplyService.getEmailFormName();
    const btnViewsApply = ViewsApplyService.getBtnViewsApply();

    setTimeout(() => {
      ViewsApplyService.activateButtonLoadingIndicator(btnViewsApply, true);
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
      emailFormSubject.val(ViewsApplyService.getDefaultEmailName());
    }
    if (emailFormName.val() === '') {
      emailFormName.val(ViewsApplyService.getDefaultEmailName());
    }

    ViewsApplyService.applyForm(emailForm);

    setTimeout(() => {
      ViewsApplyService.activateButtonLoadingIndicator(btnViewsApply, false);
      sender.attributes.active = false;
    }, 1000);
  }
}
