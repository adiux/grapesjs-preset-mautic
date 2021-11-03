export default class ReusableDynamicContentCommands {
  editor;

  listRDC;

  constructor(editor, listRDC) {
    this.editor = editor;
    this.listRDC = listRDC;
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
    this.addReusableDynamicContentItems(options, modal);
    modal.setContent(this.rdcPopup);
    modal.open();
    modal.onceClose(() => {
      if (this.listRDC && !options.target.getAttributes().rdcid) {
        const idRdc = this.listRDC[0] && this.listRDC[0].id;
        options.target.addAttributes({
          rdcid: idRdc,
        });
      }
    });
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
  addReusableDynamicContentItems(options, modal) {
    // Clean existing editor
    mQuery(this.rdcPopup).empty();

    const { target } = options;
    const rdcComponent = target || this.editor.getSelected();
    if (!rdcComponent) {
      mQuery(this.rdcPopup).append('<div>No Dynamic Content was found</div>');
      return;
    }

    if (!this.listRDC || this.listRDC.length === 0) {
      rdcComponent.getEl().remove();
      mQuery(this.rdcPopup).append('<div>No Dynamic Content was found</div>');
      return;
    }

    mQuery(this.rdcPopup).css({
      'min-height': '75vh',
      'max-height': '75vh',
      'overflow-y': 'scroll',
    });

    let activeRdc;
    options.target.components().forEach((component) => {
      activeRdc = component.toHTML();
    });
    const pos = activeRdc && activeRdc.indexOf('dc:') + 3;
    const idRdc = pos && Number(activeRdc.slice(pos, pos + 1));

    this.listRDC.forEach((rdc) => {
      mQuery(this.rdcPopup).append(this.getCard(rdc, idRdc === Number(rdc.id)));
    });

    const rdcButtons = this.rdcPopup.getElementsByClassName('rdc');
    Array.from(rdcButtons).forEach((btn) => {
      btn.addEventListener('click', (event) => {
        options.target.addAttributes({
          rdcid: mQuery(event.target).data('id'),
        });
        modal.close();
      });
    });
  }

  /**
   * Create a dynamic content item card for a modal window
   *
   * @param rdc
   * @param active
   */
  getCard(rdc, active) {
    const isActive = active ? 'active' : '';

    const button = `<button id="rdc-${rdc.id}" type="button" class="btn btn-primary rdc ${isActive}" data-id="${rdc.id}" data-name="${rdc.name}" style="width: 98%; padding-top: 5px;">Add</button>`;

    return (
      `${
        '<div class="gjs-am-asset gjs-am-preview-cont" style="width: 31%; height: auto; margin: 5px;">\n' +
        '  <div class="gjs-am-meta" style="width: 100%; padding: 5px;">\n' +
        '    <div class="card-title"> Dynamic Content '
      }${rdc.id}</div>\n` +
      `    <div class="card-title">${rdc.name}</div>\n` +
      `    ${button}\n` +
      `  </div>\n` +
      `</div>`
    );
  }
}
