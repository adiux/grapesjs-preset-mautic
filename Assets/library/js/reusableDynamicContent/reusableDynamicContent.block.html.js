export default class reusableDynamicContentBlockHtml {
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
      style: { padding: '10px' },
      type: 'reusable-dynamic-content',
      content: `<div data-slot='reusableDynamicContent'>{% TWIG_BLOCK %}{{ include('dc:0') }}{% END_TWIG_BLOCK %}</div>`,
      activeOnRender: 1,
    });
  }
}
