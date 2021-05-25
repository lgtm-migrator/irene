import Component from '@glimmer/component';
import {
  inject as service
} from '@ember/service';
import {
  task
} from 'ember-concurrency';
import {
  tracked
} from '@glimmer/tracking';
import {
  action
} from '@ember/object';

export default class PartnerClientDetailComponent extends Component {
  @service partner;
  @service store;

  @tracked clientPlan = {};
  @tracked clientStatistics = {};
  @tracked showOwnerEmails = false;

  ownerEmailCount = this.args.client.ownerEmails.length - 1;

  @action
  toggleOwnerEmailList() {
    this.showOwnerEmails = !this.showOwnerEmails;
  }

  @task(function* () {
    this.clientPlan = yield this.store.find('partner/partnerclient-plan', this.args.client.id);
  }) getClientPlan;
}
