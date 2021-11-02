export default class ReusableDynamicContentService {
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
        if (data.dynamicContents) {
          for (const item in data.dynamicContents) {
            const elem = [];
            if (data.dynamicContents[item]) {
              elem.id = data.dynamicContents[item].id;
              elem.name = data.dynamicContents[item].name;
              elem.content = data.dynamicContents[item].content;
              result.push(elem);
            }
          }
        }
      },
      error(errors) {
        console.log(errors);
      },
    });
    return result;
  }
}
