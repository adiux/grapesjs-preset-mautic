export default class ReusableDynamicContentDomComponentsMjml {
  static addReusableDynamicContentType(editor, listRDC) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType('mjml');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const type = 'reusable-dynamic-content';

    /**
     * Change view of component
     */
    const changeContent = (el, child) => {
      const rdcId = el.getAttribute('data-rdc-id') ?? '';
      const rdcName = el.getAttribute('data-rdc-name') ?? '';
      const elem = child;

      elem.innerHTML = `Dynamic Content. ID: ${rdcId}. Name: ${rdcName}`;
      elem.style.pointerEvents = 'all';
      elem.closest('td').style.border = '1px dashed grey';
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
          this.on('change:attributes:rdcid', this.onChangeRdcId);
          this.on('change:style', this.onChangeStyle);

          const options = [];

          listRDC.forEach((rdc) => {
            options.push({ id: rdc.id, name: rdc.name });
          });

          this.updateTrait('rdcid', {
            options,
          });
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
