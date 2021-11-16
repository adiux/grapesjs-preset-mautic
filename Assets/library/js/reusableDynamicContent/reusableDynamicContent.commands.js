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
    const listRDC = ReusableDynamicContentService.getDynamicContents();

    modal.setTitle(title);
    this.rdcPopup = ReusableDynamicContentCommands.buildReusableDynamicContentPopup();
    this.addReusableDynamicContentItems(options, modal, listRDC);
    options.target.onUpdateTraitOptions('rdcid', listRDC);
    modal.setContent(this.rdcPopup);
    modal.open();
    modal.onceClose(() => {
      if (listRDC && !options.target.getAttributes().rdcid) {
        const idRdc = listRDC[0] && listRDC[0].id;
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
   * @param options
   * @param modal
   * @param listRDC
   */
  addReusableDynamicContentItems(options, modal, listRDC) {
    // Clean existing editor
    mQuery(this.rdcPopup).empty();

    const { target } = options;
    const rdcComponent = target || this.editor.getSelected();
    if (!rdcComponent) {
      mQuery(this.rdcPopup).append('<div>No Dynamic Content was found</div>');
      return;
    }

    if (!listRDC || listRDC.length === 0) {
      rdcComponent.getEl().remove();
      mQuery(this.rdcPopup).append('<div>No Dynamic Content was found</div>');
      return;
    }

    mQuery(this.rdcPopup).css({
      'min-height': '75vh',
      'max-height': '75vh',
      'overflow-y': 'scroll',
    });

    const pos = options.target.getEl().getAttribute('data-rdc-id');
    const idRdc = pos && Number(pos);

    listRDC.forEach((rdc) => {
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

    const rdcUrl = `${mauticBaseUrl}s/dwc/edit/${rdc.id}`;

    const card = `<div class="gjs-am-asset gjs-am-preview-cont gjs-mdl-dc-card ${isActive}" >
      <div class="gjs-mdl-dc-block">
        <div class="gjs-mdl-dc-row">
          <div class="gjs-mdl-dc-col w-90">
            <p class="gjs-mdl-dc-title"> ${rdc.name} </p>
            <p class="gjs-mdl-dc-text">ID: ${rdc.id}</p>
          </div>
          <div class="gjs-mdl-dc-col a-end">
            <a href="${rdcUrl}" target="_blank"><span class="gjs-mdl-dc-pn-btn fa fa-edit"></span></a>
          </div>
        </div>
        <button id="rdc-${rdc.id}" type="button" class="btn gjs-mdl-dc-btn rdc ${isActive}" data-id="${rdc.id}" data-name="${rdc.name}">Add</button>
      </div>
    </div>`;
    return card;
  }
}
