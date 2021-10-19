export default class reusableDynamicContentBlocks {
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
      attributes: { class: 'fa fa-tag' },
      content: {
        type: 'reusable-dynamic-content',
        content: '{reusabledynamiccontent="Reusable Dynamic Content"}',
        style: { padding: '10px' },
        activeOnRender: 1,
        attributes: {
          'data-slot': 'reusableDynamicContent',
        },
      },
    });
  }
}
