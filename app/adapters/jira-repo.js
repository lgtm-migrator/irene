import DRFAdapter from './drf';
import ENV from 'irene/config/environment';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DRFAdapter.extend(DataAdapterMixin, {
  host: ENV.host,
  namespace: ENV.namespace,
  addTrailingSlashes: false,
  authorizer: 'authorizer:irene',
  _buildURL: function (modelName, id) {
    const baseurl = `${this.get('host')}/${this.get('namespace')}/projects/${id}/jira`;
    return baseurl;
  },
  urlForCreateRecord: function(modelName, snapshot) {
    return this._buildURL(modelName, snapshot.id, snapshot);
  }
});