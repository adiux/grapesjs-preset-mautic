export default class ReusableDynamicContentDomComponents {
  static addReusableDynamicContentType(editor, listRDC) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType('default');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

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
        ...defaultModel,
        defaults: {
          name: 'Reusable Dynamic Content',
          draggable: true,
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
          const options = [];

          listRDC.forEach((rdc) => {
            options.push({ id: rdc.id, name: rdc.name });
          });
          this.updateTrait('rdcid', {
            options,
          });

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
      },
      view: {
        ...defaultView,
        events: {
          dblclick: 'onActive',
          click: 'onOpenLink',
        },
        onActive() {
          const target = this.model;
          editor.runCommand('preset-mautic:reusable-dynamic-content-open', { target });
        },
        onOpenLink(ev) {
          if (ev.path[0].tagName === 'A') {
            window.open(ev.path[0].getAttribute('href'), '_blank');
          }
        },
        init() {
          this.listenTo(this.model, 'change:attributes:rdcid', this.render);
        },
        onRender({ el }) {
          const rdcId = el.getAttribute('data-rdc-id') ?? '';
          const rdcName = el.getAttribute('data-rdc-name') ?? '';
          const elem = el;

          elem.innerText = '';

          const link = this.createHtmlElement('a', 'pointer-events: all; color: grey;', 'edit');
          link.href = `${mauticBaseUrl}s/dwc/edit/${rdcId}`;

          const linkBlock = this.createHtmlElement(
            'div',
            'font-size: 13px; text-align: right; width: 100%; padding: 10px 10px 0px 0px;',
            ''
          );
          linkBlock.appendChild(link);
          elem.appendChild(linkBlock);

          const contentBlock = this.createHtmlElement(
            'div',
            'pointer-events: all; padding: 0px 5px 5px;',
            `Dynamic Content. ID: ${rdcId}. Name: ${rdcName}`
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
