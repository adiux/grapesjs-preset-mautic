export default class reusableDynamicContentBlockMjml {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  addReusableDynamicContentBlock() {
    this.editor.BlockManager.add('reusable-dynamic-content', {
      label: Mautic.translate('grapesjsbuilder.reusableDynamicContentBlockLabel'),
      category: Mautic.translate('grapesjsbuilder.categoryBlockLabel'),
      attributes: { class: 'fa fa-tag' },
      type: 'reusable-dynamic-content',
      style: { padding: '10px' },
      // content: `<mj-section data-slot='reusableDynamicContent'>
      //           <mj-column padding="10px">
      //              <mj-text>
      //              </mj-text>
      //           </mj-column>
      //        </mj-section>`,
      content: `<mj-raw data-slot='reusableDynamicContent'>
             </mj-raw>`,
    });
  }
}
