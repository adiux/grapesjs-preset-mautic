export default class ReusableDynamicContentService {
  /**
   * Get list of dynamic content items
   * Use REST API request Get List DC
   */
  static getDynamicContents() {
    const result = [];

    mQuery.ajax({
      url: `${mauticBaseUrl}api/dynamiccontents?limit=100&where[0][col]=isPublished&where[0][expr]=in&where[0][val]=1`,
      type: 'GET',
      async: false,
      success(data) {
        if (data.dynamicContents) {
          for (const item of Object.keys(data.dynamicContents)) {
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
