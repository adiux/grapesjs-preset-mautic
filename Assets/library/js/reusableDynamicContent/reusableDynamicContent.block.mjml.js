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
      attributes: { class: 'fa fa-cube' },
      content: `<mj-section background-color="#FFFFFF">
                      <mj-column width="100%" border-radius="0 0 0 0" padding="10px">
                         <mj-text font-family="Roboto, Helvetica, sans-serif" font-size="14px" line-height="18px" color="#616161" align="center">
                           {% TWIG_BLOCK %}<br>{{ include('dc:4') }}<br>{% END_TWIG_BLOCK %}
                         </mj-text>
                      </mj-column>
                   </mj-section>`,
    });
  }
}
