import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service headData;
  @service intl;
  @service whitelabel;
  @service configuration;

  async beforeModel() {
    await this.configuration.getFrontendConfig();
    return this.intl.setLocale(['en']);
  }

  afterModel() {
    this.headData.title = this.whitelabel.name;
    this.headData.favicon = this.whitelabel.favicon;
  }

  model() {
    return {
      body_classes: `theme-${this.whitelabel.theme}`,
    };
  }
}
