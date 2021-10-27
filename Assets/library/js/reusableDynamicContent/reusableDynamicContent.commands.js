import ReusableDynamicContentService from './reusableDynamicContent.service';

export default class ReusableDynamicContentCommands {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  /**
   * Build and display the Reusable Dynamic Content popup/modal window
   *
   * @param editor
   * @param sender
   * @param options
   */
  showReusableDynamicContentPopup(editor, sender, options) {
    const title = Mautic.translate('grapesjsbuilder.dynamicContentBlockLabel');
    const modal = editor.Modal;
    modal.setTitle(title);

    this.rdcPopup = ReusableDynamicContentCommands.buildReusableDynamicContentPopup();
    this.addReusableDynamicContentItems(editor, options);
    modal.setContent(this.rdcPopup);
    mQuery('.gjs-mdl-content').css({
      'min-height': '75vh',
      'max-height': '75vh',
      'overflow-y': 'scroll',
    });
    modal.open();
  }

  /**
   * Build the basic popup/modal frame to choose the reusable dynamic content item
   * @returns HTMLDivElement
   */
  static buildReusableDynamicContentPopup() {
    const codePopup = document.createElement('div');
    codePopup.setAttribute('id', 'reusable-dynamic-content-popup');

    return codePopup;
  }

  /**
   * Load Frame with Reusable Dynamic Content items and append to the codePopup Modal
   *
   * @param editor
   * @param options
   */
  addReusableDynamicContentItems(editor, options) {
    const { target } = options;
    const rdcComponent = target || editor.getSelected();
    if (!rdcComponent) {
      throw new Error('No RDC Components found');
    }

    // Clean existing editor
    mQuery(this.rdcPopup).empty();

    // Insert inside popup
    const innerComponents = options.target.components();
    const listRDC = ReusableDynamicContentService.getDynamicContents();

    let activeRdc;
    innerComponents.forEach((component) => {
      activeRdc = component.toHTML();
    });

    const pos = activeRdc.indexOf('dc:') + 3;
    let idRdc = Number(activeRdc.slice(pos, pos + 1));

    if (idRdc === 0) {
      idRdc = listRDC[0].id;
      options.target.addAttributes({
        rdcid: idRdc,
      });
    }

    listRDC.forEach((rdc) => {
      mQuery(this.rdcPopup).append(
        ReusableDynamicContentService.getCard(rdc, idRdc === Number(rdc.id))
      );
    });

    const rdcButtons = this.rdcPopup.getElementsByClassName('rdc');
    Array.from(rdcButtons).forEach((btn) => {
      btn.addEventListener('click', (event) => {
        options.target.addAttributes({
          rdcid: mQuery(event.target).data('id'),
        });
      });
    });
  }
}
