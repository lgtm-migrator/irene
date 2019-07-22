import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  me: service('me'),
  i18n: service(),

  actions: {
    openEditAnalysisModal() {
      const delegate = this.get("delegate");
      if (delegate && delegate.confirmCallback) {
        delegate.set("showEditAnalysisModal", true);
      }
    }
  }
});
