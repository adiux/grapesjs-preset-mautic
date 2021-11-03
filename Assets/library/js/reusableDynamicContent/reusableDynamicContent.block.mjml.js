export default class reusableDynamicContentBlockMjml {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  addReusableDynamicContentBlock() {
    this.editor.BlockManager.add('reusable-dynamic-content', {
      label: Mautic.translate('grapesjsbuilder.reusableDynamicContentBlockLabel'),
      category: Mautic.translate('grapesjsbuilder.categoryBlockLabel'),
      activate: true,
      select: true,
      stylable: true,
      attributes: { class: 'fa fa-tag' },
      // style: { padding: '10px' },
      type: 'reusable-dynamic-content',
      content: `<mj-text data-slot='reusableDynamicContent'></mj-text>`,
      activeOnRender: 1,
    });
  }
}
