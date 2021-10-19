export default class ReusableDynamicContentService {
  editor;

  constructor(editor) {
    this.editor = editor;
  }

  /**
   * Create a dynamic content item card for a modal window
   */
  static getCard(rdc, active) {
    const isActive = active ? 'active' : '';

    const button = `<button id="rdc-${rdc.id}" type="button" class="btn btn-primary rdc ${isActive}" data-id="${rdc.id}" data-name="${rdc.name}" style="width: 98%; padding-top: 5px;">Add</button>`;

    return (
      `${
        '<div class="gjs-am-asset gjs-am-preview-cont" style="width: 31%; height: auto; margin: 5px;">\n' +
        '  <div class="gjs-am-meta" style="width: 100%; padding: 5px;">\n' +
        '    <div class="card-title"> Dynamic Content '
      }${rdc.id}</div>\n` +
      `    <div class="card-title">${rdc.name}</div>\n` +
      `    ${button}\n` +
      `  </div>\n` +
      `</div>`
    );
  }

  /**
   * Get list of dynamic content items
   * Use REST API request Get List DC
   */
  static getDynamicContents() {
    const result = [];

    mQuery.ajax({
      url: `${mauticBaseUrl}api/dynamiccontents?limit=100`,
      type: 'GET',
      async: false,
      success(data) {
        for (let i = 1; i <= data.total; i++) {
          const elem = [];
          if (data.dynamicContents[i]) {
            elem.id = data.dynamicContents[i].id;
            elem.name = data.dynamicContents[i].name;
            elem.content = data.dynamicContents[i].content;
            result.push(elem);
          }
        }
      },
    });

    return result;
  }
}
