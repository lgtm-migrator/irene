import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

export default class AppMonitoringSettingsComponent extends Component {
  @service intl;
  @service me;
  @service organization;
  @service appmonitoring;

  get canEditSettings() {
    return (
      this.me.get('org.is_admin') &&
      this.organization?.selected?.projectsCount > 0
    );
  }

  @task(function* (event, checked) {
    const settings = yield this.args.settings;

    settings.set('enabled', checked);
    yield settings.save();

    this.appmonitoring.reload();
  })
  toggleAppMonitoringEnabled;
}
