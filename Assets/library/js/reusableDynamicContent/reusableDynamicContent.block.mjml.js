export default class reusableDynamicContentBlockMjml {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  addReusableDynamicContentBlock() {
    this.editor.BlockManager.add('reusable-dynamic-content', {
      label: Mautic.translate('grapesjsbuilder.reusableDynamicContentBlockLabel'),
      category: Mautic.translate('grapesjsbuilder.categoryBlockLabel'),
      attributes: { class: 'fa fa-puzzle-piece' },
      activate: true,
      type: 'reusable-dynamic-content',
      content: `<mj-text data-slot='reusableDynamicContent'></mj-text>`,
      activeOnRender: 1,
    });
  }
}
