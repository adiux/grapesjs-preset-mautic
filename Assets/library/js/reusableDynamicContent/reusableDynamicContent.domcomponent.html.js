export default class ReusableDynamicContentDomComponents {
  static addReusableDynamicContentType(editor, listRDC) {
    const dc = editor.DomComponents;
    const type = 'reusable-dynamic-content';

    /**
     * Add Reusable Dynamic Content mjml component
     */
    dc.addType(type, {
      isComponent(el) {
        if (el.getAttribute && el.getAttribute('data-slot') === 'reusableDynamicContent') {
          return {
            type,
          };
        }
        return false;
      },
      model: {
        defaults: {
          name: 'Reusable Dynamic Content',
          draggable: '[data-gjs-type=cell]',
          droppable: false,
          editable: true,
          attributes: {
            'data-gjs-type': type,
            'data-slot': 'reusableDynamicContent',
          },
          stylable: [
            'height',
            'font-style',
            'font-size',
            'font-weight',
            'font-family',
            'color',
            'line-height',
            'letter-spacing',
            'text-decoration',
            'text-align',
            'text-transform',
            'padding',
            'padding-top',
            'padding-left',
            'padding-right',
            'padding-bottom',
            'container-background-color',
            'border',
            'border-style',
            'border-color',
            'border-width',
            'box-shadow',
          ],
          traits: [
            'id',
            'title',
            {
              type: 'select',
              label: 'DC',
              name: 'rdcid',
              options: [],
            },
          ],
        },
        init() {
          this.onUpdateTraitOptions('rdcid', listRDC);

          this.on('change:attributes:rdcid', this.onChangeRdcId);
        },
        onChangeRdcId() {
          const rdcId = this.getAttributes().rdcid;
          let rdcName = '';
          const { options } = this.getTrait('rdcid').props();

          options.forEach((option) => {
            if (Number(option.id) === Number(rdcId)) {
              rdcName = option.name;
            }
          });

          const content = `{% TWIG_BLOCK %}{{ include('dc:${rdcId}')}}{% END_TWIG_BLOCK %}`;

          this.components(content);
          this.addAttributes({
            'data-rdc-name': rdcName,
            'data-rdc-id': rdcId,
          });
        },
        onUpdateTraitOptions(traitName, list) {
          const options = [];

          if (list) {
            list.forEach((elem) => {
              options.push({ id: elem.id, name: elem.name });
            });
            this.updateTrait(traitName, {
              options,
            });
          }
        },
      },
      view: {
        events: {
          dblclick: 'onActive',
        },
        onActive() {
          const target = this.model;
          editor.runCommand('preset-mautic:reusable-dynamic-content-open', { target });
        },
        init() {
          this.listenTo(this.model, 'change:attributes:rdcid', this.render);
        },
        onRender({ el }) {
          const elem = el;
          const rdcId = el.getAttribute('data-rdc-id') ?? '';
          let rdcName = el.getAttribute('data-rdc-name') ?? '';

          elem.innerText = '';
          rdcName = rdcName.replace(/^\w/, (ch) => ch.toUpperCase());

          const linkBlock = this.createHtmlElement(
            'div',
            'font-size: 13px; text-align: right; width: 100%; padding: 10px 10px 0px 0px;',
            ''
          );
          elem.appendChild(linkBlock);

          const contentBlock = this.createHtmlElement(
            'div',
            'pointer-events: all; padding: 0px 5px 5px;',
            `Dynamic Content ${rdcId}: ${rdcName}`
          );
          elem.appendChild(contentBlock);
        },
        createHtmlElement(tagName, styles, content) {
          const elem = document.createElement(tagName);
          elem.style.cssText = styles;
          elem.innerHTML = content;

          return elem;
        },
      },
    });
  }
}
