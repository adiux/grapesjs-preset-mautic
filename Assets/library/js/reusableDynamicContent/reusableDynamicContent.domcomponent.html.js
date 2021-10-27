import ReusableDynamicContentService from './reusableDynamicContent.service';

export default class ReusableDynamicContentDomComponents {
  static addReusableDynamicContentType(editor) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType('default');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const listRDC = ReusableDynamicContentService.getDynamicContents();

    const model = defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          name: 'Reusable Dynamic Content',
          components: `<span style="font-size: 14px;">{% TWIG_BLOCK %}{{ include('dc:0') }}{% END_TWIG_BLOCK %}</span>`,
          draggable: true,
          droppable: false,
          editable: true,
          stylable: true,
          style: { fontSize: '14px' },
          attributes: {
            'data-gjs-type': 'reusable-dynamic-content',
            'data-slot': 'reusableDynamicContent',
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
          this.on('change:attributes:rdcid', this.handleTypeChange);
        },
        handleTypeChange() {
          const { options } = this.getTrait('rdcid').props();
          let rdcname = '';

          options.forEach((option) => {
            if (Number(option.id) === Number(this.getAttributes().rdcid)) {
              rdcname = option.name;
            }
          });
          const content = `<span style="font-size: 14px;">{% TWIG_BLOCK %}{{ include('dc:${
            this.getAttributes()['data-rdc-id']
          }')}}{% END_TWIG_BLOCK %}</span>`;
          this.components(content);
          this.addAttributes({
            'data-rdc-name': rdcname,
            'data-rdc-id': this.getAttributes().rdcid,
          });
          this.view.onRender(this.getView());
        },
      },
      {
        // Reusable Dynamic Content component detection
        isComponent(el) {
          if (el.getAttribute && el.getAttribute('data-slot') === 'reusableDynamicContent') {
            return {
              type: 'reusable-dynamic-content',
            };
          }
          return false;
        },
      }
    );

    const view = defaultView.extend({
      attributes: {
        style: 'pointer-events: all; width: 100%;',
      },
      events: {
        dblclick: 'onActive',
      },
      onActive() {
        const target = this.model;
        editor.runCommand('preset-mautic:reusable-dynamic-content-open', { target });
      },
      init() {
        const target = this.model;
        const options = [];

        listRDC.forEach((rdc) => {
          options.push({ id: rdc.id, name: rdc.name });
        });

        target.updateTrait('rdcid', {
          options,
        });
      },
      onRender({ el }) {
        let rdcid = el.getAttribute('data-rdc-id') ?? '';
        let rdcname = el.getAttribute('data-rdc-name') ?? '';

        el.innerHTML = `<span style="font-size: 14px;">Dynamic Content ${rdcid}<br>${rdcname}</span>`;
      },
    });
    /**
     * Add Reusable Dynamic Content component
     */
    dc.addType('reusable-dynamic-content', {
      model,
      view,
    });
  }
}
