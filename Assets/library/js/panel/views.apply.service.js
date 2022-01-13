export default class ViewsApplyService {
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

  static applyForm(emailForm) {
    Mautic.inBuilderSubmissionOn(emailForm);

    Mautic.postForm(emailForm, (response) => {
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
      if (this.strcmp(emailForm[0].baseURI, emailForm[0].action) !== 0) {
        emailForm[0].action = emailForm[0].baseURI;
      }
    });
    Mautic.inBuilderSubmissionOff();
  }

  static activateButtonLoadingIndicator(btn, isActive) {
    if (isActive) {
      Mautic.activateButtonLoadingIndicator(btn);
    } else {
      Mautic.removeButtonLoadingIndicator(btn);
    }
  }
}
