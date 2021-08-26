import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { parseError } from 'irene/utils/utils';
import { validateLength } from 'ember-changeset-validations/validators';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

export default class OrganizationHeaderComponent extends Component {
  // Dependencies
  @service('notifications') notify;
  @service intl;

  // Properties
  /**
   * @property {String} orgName
   */
  @tracked orgnamePOJO = {
    organizationName: this.selectedOrgName,
  };

  /**
   * @property {Boolean} isShowEditOrgName
   */
  @tracked isShowEditOrgName = false;

  /**
   * @property {object} orgNameValidator
   */
  get orgNameValidator() {
    return {
      organizationName: validateLength({ min: 1, max: 255 }),
    };
  }

  get selectedOrgName() {
    return this.args.organization.name;
  }

  get isShowEdit() {
    return this.args.isShowEdit && this.args.isOwner;
  }

  get isShowSettings() {
    return (this.args.isAdmin || this.args.isOwner) && this.args.isShowSettings;
  }

  // Actions

  // Action triggered while edit button DOM initialized {{did-insert}}
  @action
  initChangeset() {
    if (this.isShowEdit) {
      this.changeset = new Changeset(
        this.orgnamePOJO,
        lookupValidator(this.orgNameValidator),
        this.orgNameValidator
      );
    }
  }

  // Action triggered while clicking edit name action elements
  @action
  toggleEditNameModal() {
    this.isShowEditOrgName = !this.isShowEditOrgName;
    this.orgName = this.selectedOrgName;
  }

  // Action triggered while clicking at save btn
  @action
  updateOrgName() {
    this.updateOrganizationName.perform();
  }

  // Functions

  // Function to update organization name
  @task(function* () {
    yield this.changeset.validate();
    if (this.changeset.get('isValid')) {
      try {
        const org = this.args.organization;
        yield org.set('name', this.changeset.organizationName);
        yield org.save();
        this.notify.success(this.intl.t('organizationNameUpdated'));
        this.toggleEditNameModal();
      } catch (err) {
        this.get('notify').error(
          parseError(err),
          this.intl.t('pleaseTryAgain')
        );
      }
    }
  })
  updateOrganizationName;
}
