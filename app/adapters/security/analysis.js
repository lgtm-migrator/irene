/* eslint-disable prettier/prettier, ember/no-get, ember/classic-decorator-no-classic-methods */
import commondrf from '../commondrf';

export default class analysis extends commondrf {
  namespace = "api/hudson-api"
  _buildURL(modelName, id) {
    if (id) {
      return this.buildURLFromBase(`${this.get('namespace')}/analyses/${id}`);
    } else {
      return this.buildURLFromBase(`${this.get('namespace')}/analyses`);
    }
  }
}
