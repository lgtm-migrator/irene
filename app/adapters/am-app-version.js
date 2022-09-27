import commondrf from './commondrf';

export default class AmAppVersionAdapter extends commondrf {
  _buildURL(modelName, id) {
    const baseurl = `${this.namespace_v2}/am_app_versions`;
    if (id) {
      return this.buildURLFromBase(`${baseurl}/${encodeURIComponent(id)}`);
    }
    return this.buildURLFromBase(baseurl);
  }
  _buildNestedURL(modelName, amAppId) {
    const baseURL = `${this.namespace_v2}/am_apps/${amAppId}/am_app_versions`;
    return this.buildURLFromBase(baseURL);
  }
  urlForQuery(query, modelName) {
    if (query.amAppId) {
      const amAppId = query.amAppId;
      delete query.amAppId;
      return this._buildNestedURL(modelName, amAppId);
    }
    return super.urlForQuery(query, modelName);
  }
}