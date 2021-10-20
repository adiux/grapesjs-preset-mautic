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
      class: 'gjs-fonts gjs-f-b37',
      content: `<mj-section data-slot='reusableDynamicContent'>
                <mj-column>
                   <mj-text>
                   </mj-text>
                </mj-column>
             </mj-section>`,
    });
  }
}
