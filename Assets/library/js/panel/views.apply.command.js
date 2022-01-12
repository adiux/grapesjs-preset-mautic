import ContentService from 'grapesjs-preset-mautic/dist/content.service';
import MjmlService from 'grapesjs-preset-mautic/dist/mjml/mjml.service';

export default class ViewsApplyCommand {
  /**
   * The command to run on button click
   */
  static name = 'preset-mautic:apply-email';

  static applyEmail(editor, sender) {
    let content;

    const form = mQuery('form[name=emailform]');
    const btnViewsApply = mQuery('.btn-views-apply');

    const getEmailName = () => `E-Mail ${moment().format('YYYY-MM-D hh:mm:ss')}`;

    const strcmp = (str1, str2) => {
      if (str1.toString() < str2.toString()) return -1;
      if (str1.toString() > str2.toString()) return 1;
      return 0;
    };

    setTimeout(() => {
      Mautic.activateButtonLoadingIndicator(btnViewsApply);
    }, 300);

    if (ContentService.isMjmlMode(editor)) {
      const mjmlContent = MjmlService.getEditorMjmlContent(editor);
      mQuery('#grapesjsbuilder_customMjml').val(mjmlContent);

      content = MjmlService.mjmlToHtml(mjmlContent).html;
    } else {
      content = ContentService.getEditorHtmlContent(editor);
      mQuery('#grapesjsbuilder_customHtml').val(content);
    }

    mQuery('.builder-html').val(content);

    !mQuery('#emailform_subject').val() && mQuery('#emailform_subject').val(getEmailName());
    !mQuery('#emailform_name').val() && mQuery('#emailform_name').val(getEmailName());

    if (!mQuery('#emailform_lists').val().length && mQuery('#emailform_lists option:first')) {
      mQuery('#emailform_lists option:first').prop('selected', true);

      mQuery('<li></li>')
        .addClass('search-choice')
        .html(mQuery('<span></span>').html(mQuery('#emailform_lists option:first').text()))
        .prependTo('#emailform_lists_chosen ul');

      mQuery('<a />')
        .addClass('search-choice-close')
        .attr('data-option-array-index', 0)
        .appendTo('#emailform_lists_chosen ul li.search-choice');

      mQuery('#emailform_lists_chosen ul li.search-field input')
        .removeClass('default')
        .css({ width: '33px' })
        .val('');
    }

    Mautic.inBuilderSubmissionOn(form);

    // Mautic.postMauticForm(form);
    // form.submit();

    Mautic.postForm(form, (response) => {
      if (response.errors && mauticEnv === 'dev') {
        alert(response.errors[0].message);
        console.log(response.errors);
      }

      if (response.route) {
        // update URL in address bar
        MauticVars.manualStateChange = false;
        History.pushState(null, 'Mautic', response.route);

        // update Title
        Mautic.generatePageTitle(response.route);
      }

      // update form action
      if (strcmp(form[0].baseURI, form[0].action) !== 0) {
        form[0].action = form[0].baseURI;
      }
    });
    Mautic.inBuilderSubmissionOff();

    setTimeout(() => {
      Mautic.removeButtonLoadingIndicator(btnViewsApply);
      sender.attributes.active = false;
    }, 1000);
  }
}
