export default class ReusableDynamicContentDomComponents {
  static addReusableDynamicContentType(editor) {
    const dc = editor.DomComponents;
    const defaultType = dc.getType('default');
    const defaultModel = defaultType.model;
    const defaultView = defaultType.view;

    const model = defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          name: 'Reusable Dynamic Content',
          components: [
            {
              tagName: 'div',
              components: `{% TWIG_BLOCK %}<br>{{ include('dc:4') }}<br>{% END_TWIG_BLOCK %}`,
              type: 'text',
              editable: true,
              droppable: false,
              draggable: false,
            },
          ],
          draggable: '[data-gjs-type=cell]',
          droppable: false,
          editable: true,
          stylable: false,
          attributes: {
            // Default attributes
            'data-gjs-type': 'reusable-dynamic-content', // Type for GrapesJS
            'data-slot': 'reusableDynamicContent', // Retro compatibility with old template
          },
        },
        /**
         * Initilize the component
         */
        init() {},
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
    });

    // add the Dynamic Content component
    dc.addType('reusable-dynamic-content', {
      model,
      view,
    });
  }
}
