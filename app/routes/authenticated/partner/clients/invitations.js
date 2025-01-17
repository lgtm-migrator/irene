/* eslint-disable ember/no-get, ember/classic-decorator-no-classic-methods */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthenticatedPartnerInvitationsRoute extends Route {
  @service me;
  @service partner;

  beforeModel() {
    if (!this.get('me.org.can_access_partner_dashboard')) {
      this.transitionTo('authenticated.partner.clients');
    }
  }
}
