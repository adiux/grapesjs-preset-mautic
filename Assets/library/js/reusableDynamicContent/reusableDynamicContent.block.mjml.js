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
      type: 'reusable-dynamic-content',
      style: { padding: '10px' },
      content: `<mj-text data-slot='reusableDynamicContent'>{% TWIG_BLOCK %}{{ include('dc:0') }}{% END_TWIG_BLOCK %}</mj-text>`,
    });
  }
}
