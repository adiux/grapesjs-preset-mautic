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
      attributes: { class: 'fa fa-puzzle-piece' },
      style: { padding: '10px' },
      type: 'reusable-dynamic-content',
      content: `<div data-slot='reusableDynamicContent' style="font-size: 16px;"></div>`,
      activeOnRender: 1,
    });
  }
}
