import Ember from 'ember';
import ENV from 'irene/config/environment';
import { translationMacro as t } from 'ember-i18n';

const PersonaltokenDetailComponent = Ember.Component.extend({
  i18n: Ember.inject.service(),
  ajax: Ember.inject.service(),
  notify: Ember.inject.service('notification-messages-service'),
  tagName: '',


  // revoke token

  isNotRevoked: true,
  isDeletingToken: false,
  tTokenRevoked: t('personalTokenRevoked'),

  confirmCallback() {
    const tTokenRevoked = this.get('tTokenRevoked');
    const personaltokenId = this.get('personaltoken.id');

    const that = this;
    const url = [ENV.endpoints.personaltokens, personaltokenId].join('/');
    this.set("isDeletingToken", true);
    this.get('ajax').delete(url)
    .then(function() {
      if(!that.isDestroyed) {
        that.set('isNotRevoked', false);
        that.set("isDeletingToken", false);
        that.send('closeRevokePersonalTokenConfirmBox');
      }
      that.get('notify').success(tTokenRevoked);
    })
    .catch(function(error) {
      if(!that.isDestroyed) {
        that.set("isDeletingToken", false);
        that.get("notify").error(error.payload.message);
      }
    });
  },

  actions: {
    openRevokePersonalTokenConfirmBox() {
      this.set('showRevokePersonalTokenConfirmBox', true);
    },

    closeRevokePersonalTokenConfirmBox() {
      this.set('showRevokePersonalTokenConfirmBox', false);
    }
  }
});


export default PersonaltokenDetailComponent;