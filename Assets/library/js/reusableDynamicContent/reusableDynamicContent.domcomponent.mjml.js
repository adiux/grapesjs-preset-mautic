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
          components:
            '<mj-text data-gjs-draggable="false" data-gjs-droppable="false" data-gjs-editable="false" data-gjs-hoverable="false" data-gjs-selectable="false" data-gjs-propagate="[\'draggable\', \'droppable\', \'editable\', \'hoverable\', \'selectable\']">Dynamic Content 0</mj-text>',
          activeOnRender: 1,
          activate: true,
          draggable: true,
          droppable: true,
          editable: true,
          stylable: true,
          disable: true,
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
          const content = `<mj-text data-gjs-draggable="false" data-gjs-droppable="false" data-gjs-editable="false" data-gjs-hoverable="false" data-gjs-selectable="false" data-gjs-propagate="['draggable', 'droppable', 'editable', 'hoverable', 'selectable']">Dynamic Content ${
            this.getAttributes().rdcid
          }<br>${rdcname}</mj-text>`;
          this.components(content);
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
      attributes: {
        style: 'pointer-events: all; display: table; width: 100%;',
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
        const target = this.model;
        const { options } = target.getTrait('rdcid').props();

        let rdcId = '';
        let rdcName = '';

        if (el.getAttribute('rdcid')) {
          options.forEach((option) => {
            if (Number(option.id) === Number(el.getAttribute('rdcid'))) {
              rdcName = option.name;
              rdcId = option.id;
            }
          });
        } else {
          rdcName = options[0].name;
          rdcId = options[0].id;
        }

        const content = `<mj-text data-gjs-draggable="false" data-gjs-droppable="false" data-gjs-editable="false" data-gjs-hoverable="false" data-gjs-selectable="false" data-gjs-propagate="['draggable', 'droppable', 'editable', 'hoverable', 'selectable']">Dynamic Content ${rdcId}<br>${rdcName}</mj-text>`;
        target.components(content);
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
