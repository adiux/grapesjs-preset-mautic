import ReusableDynamicContentService from './reusableDynamicContent.service';

export default class ReusableDynamicContentDomComponentsMjml {
  static addReusableDynamicContentType(editor) {
    const dc = editor.DomComponents;

    const type = 'reusable-dynamic-content';

    const listRDC = ReusableDynamicContentService.getDynamicContents();

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
      const elChild = child;
      const rdcId = el.getAttribute('data-rdc-id') ?? '';
      let rdcName = el.getAttribute('data-rdc-name') ?? '';
      rdcName = rdcName.replace(/\w/, (c) => c.toUpperCase());

      elChild.innerHTML = `Dynamic Content ${rdcId}: ${rdcName}`;
      elChild.style.pointerEvents = 'all';
      elChild.closest('td').style.border = '1px dashed grey';

      const linkBlock = createHtmlElement(
        'div',
        'pointer-events: all; font-size: 12px; text-align: right; width: 100%;',
        ``
      );
      elChild.closest('td').insertBefore(linkBlock, elChild);
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
          this.onUpdateTraitOptions('rdcid', listRDC);

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
          for (const item of Object.keys(items)) {
            const name = items[item][0];
            this.addAttributes({
              [name]: items[item][1],
            });
          }
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
