export default class ReusableDynamicContentDomComponentsMjml {
  static addReusableDynamicContentType(editor, listRDC) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType('mjml');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const type = 'reusable-dynamic-content';

    const createHtmlElement = (tagName, styles, content) => {
      const elem = document.createElement(tagName);
      elem.style.cssText = styles;
      elem.innerHTML = content;

      return elem;
    };

    /**
     * Change view of component
     */
    const changeContent = (el, child) => {
      const rdcId = el.getAttribute('data-rdc-id') ?? '';
      const rdcName = el.getAttribute('data-rdc-name') ?? '';
      const elChild = child;

      elChild.innerHTML = `Dynamic Content. ID: ${rdcId}. Name: ${rdcName}`;
      elChild.style.pointerEvents = 'all';
      elChild.closest('td').style.border = '1px dashed grey';

      const linkBlock = createHtmlElement(
        'div',
        'pointer-events: all; font-size: 12px; text-align: right; width: 100%;',
        ``
      );
      elChild.closest('td').insertBefore(linkBlock, elChild);

      const link = createHtmlElement('a', 'pointer-events: all; color:grey;', `edit`);
      link.href = `${mauticBaseUrl}s/dwc/edit/${rdcId}`;
      // link.style.color = '#e63312';
      linkBlock.appendChild(link);
    };

    /**
     * Add Reusable Dynamic Content mjml component
     */
    dc.addType(type, {
      extend: 'mj-text',

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
          activate: true,
          draggable: '[data-gjs-type=mj-column]',
          droppable: false,
          attributes: {
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
            'align',
            'text-transform',
            'padding',
            'padding-top',
            'padding-left',
            'padding-right',
            'padding-bottom',
            'container-background-color',
          ],
          'style-default': {
            'font-size': '16px',
          },
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
          this.on('change:style', this.onChangeStyle);
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
        onChangeStyle(ev) {
          const items = Object.entries(ev.changed.style);
          for (const item in items) {
            const name = items[item][0];
            this.addAttributes({
              [name]: items[item][1],
            });
          }
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
          this.listenTo(this.model, 'change:style', this.render);

          if (!this.attr['font-size']) {
            this.attr['font-size'] = '16px';
          }
        },
        renderChildren() {
          changeContent(this.el, this.getChildrenContainer());
        },
        onRender({ el }) {
          changeContent(el, this.getChildrenContainer());
        },
      },
    });
  }
}
