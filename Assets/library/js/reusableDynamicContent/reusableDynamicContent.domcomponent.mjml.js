import ReusableDynamicContentService from './reusableDynamicContent.service';

export default class ReusableDynamicContentDomComponentsMjml {
  static addReusableDynamicContentType(editor) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType('mjml');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const model = defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          name: 'Reusable Dynamic Content',
          activeOnRender: 1,
          activate: true,
          draggable: '[data-gjs-type=mj-column]',
          droppable: true,
          editable: true,
          stylable: true,
          attributes: {
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
          const content = `{% TWIG_BLOCK %}{{ include('dc:${this.getAttributes().rdcid}')}}{% END_TWIG_BLOCK %}`;

          this.components(content);
          this.addAttributes({
            'data-rdc-name': rdcname,
            'data-rdc-id': this.getAttributes().rdcid,
          });
          this.view.onRender(this.getView());
        },
      },
      {
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
      tagName: 'tr',
      events: {
        dblclick: 'onActive',
      },
      onActive() {
        const target = this.model;
        editor.runCommand('preset-mautic:reusable-dynamic-content-open', { target });
      },
      init() {
        const target = this.model;
        const listRDC = ReusableDynamicContentService.getDynamicContents();
        const options = [];

        listRDC.forEach((rdc) => {
          options.push({ id: rdc.id, name: rdc.name });
        });

        target.updateTrait('rdcid', {
          options,
        });
      },
      onRender({ el }) {
        const rdcid = el.getAttribute('data-rdc-id') ?? '';
        const rdcname = el.getAttribute('data-rdc-name') ?? '';

        el.innerHTML = `<tr data-gjs-type="mj-text" padding="10px 25px 10px 25px" font-size="13px" line-height="22px" align="left" id="i6tc2" style="pointer-events: all; display: table; width: 100%;">
          <td align="left" style="font-size: 0px; padding: 10px 25px; word-break: break-word; pointer-events: none;">
            <div style="font-family: Ubuntu, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 22px; text-align: left; color: rgb(0, 0, 0); pointer-events: all;">
              Dynamic Content ${rdcid}<br>${rdcname}
            </div>
          </td></tr>`;
      },
    });

    /**
     * Add Reusable Dynamic Content component
     */
    dc.addType('reusable-dynamic-content', {
      model,
      view,
    });

    // editor.on(`component:create`, model => editor.runCommand('preset-mautic:reusable-dynamic-content-open', { model }));
  }
}
