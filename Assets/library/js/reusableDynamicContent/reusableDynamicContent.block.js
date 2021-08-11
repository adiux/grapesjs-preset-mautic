export default class ReusableDynamicContentBlock {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  addReusableDynamicContentBlock() {
    this.editor.BlockManager.add('reusable-dynamic-content', {
      label: Mautic.translate('grapesjsbuilder.reusableDynamicContentBlockLabel'),
      activate: true,
      select: true,
      attributes: { class: 'fa fa-cubes' },
      category: Mautic.translate('grapesjsbuilder.categoryBlockLabel'),
      content: {
        type: 'reusable-dynamic-content',
        content:
          '<div>{% TWIG_BLOCK %}<br>r\n' +
          "{{ include('dc:Meet Adrian') }}<br>r\n" +
          '{% END_TWIG_BLOCK %}</div>',
        style: { padding: '10px' },
        activeOnRender: 1,
      },
    });
  }
}
