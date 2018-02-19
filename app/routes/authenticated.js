// jshint ignore: start
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import surveyMonkey from 'irene/utils/survey-monkey';
import ENV from 'irene/config/environment';
import ENUMS from 'irene/enums';
import { CSBMap } from 'irene/router';
import triggerAnalytics from 'irene/utils/trigger-analytics';

const { location } = window;

const {inject: {service}, isEmpty, RSVP} = Ember;

const AuthenticatedRoute = Ember.Route.extend(AuthenticatedRouteMixin, {

  lastTransition: null,
  i18n: service(),
  moment: service(),
  session: service(),
  realtime: service(),
  mixpanel: service(),
  trial: service(),
  socketIOService: service('socket-io'),

  beforeModel(transition){
    this.set("lastTransition", transition);
    return this._super(transition);
  },

  model() {
    const userId = this.get("session.data.authenticated.user_id");
    return this.get('store').find('user', userId);
  },

  afterModel(user, transition){
    let error;
    const data = {
      userId: user.get("email"),
      accountId: user.get("email").split("@").pop().trim()
    };
    triggerAnalytics('login', data);
    try {
      window.Intercom("boot", {
        app_id: ENV.intercomAppID,
        name: user.get("username"),
        email: user.get("email"),
        alignment: 'left',
        horizontal_padding: 20,
        vertical_padding: 20,
        custom_launcher_selector: '#intercom_support',
        user_hash: user.get("intercomHash")
      }
      );
      window.Intercom('trackEvent', 'logged-in');
    } catch (error2) {}
    try {
      const mixpanel = this.get("mixpanel");
      mixpanel.identify(user.get("id"));
      mixpanel.peopleSet({
        "$name": user.get("username"),
        "$email": user.get("email")
      });
    } catch (error3) {}
    try {
      pendo.initialize({
        visitor: {
          id: user.get("id"),
          email: user.get("email")
        },
        account: {
          id: user.get("email").split("@").pop().trim()
        }
      });

    } catch (error1) { error = error1; }

    const trial = this.get("trial");
    trial.set("isTrial", user.get("isTrial"));

    this.get('notify').setDefaultAutoClear(ENV.notifications.autoClear);

    const socketId = user != null ? user.get("socketId") : undefined;
    if (Ember.isEmpty(socketId)) {
      return;
    }
    this.set('i18n.locale', user.get("lang"));
    this.get('moment').changeLocale(user.get("lang"));

    const that = this;
    const store = this.get("store");
    const realtime = this.get("realtime");

    const allEvents = {

      object(data) {
        store.pushPayload({data});
      },

      newobject(data) {
        store.pushPayload({data});
        if (data.type === "files") {
          const fileId = data.id;
          that.get("notify").info(`New scan started <a class='click-here' href='/file/${fileId}'>Show</a>`, {htmlContent: true, autoClear: false});
        }
      },

      message(data) {
        const { message } = data;
        const { notifyType } = data;
        if (notifyType === ENUMS.NOTIFY.INFO) { that.get("notify").info(message, ENV.notifications); }
        if (notifyType === ENUMS.NOTIFY.SUCCESS) { that.get("notify").success(message, ENV.notifications); }
        if (notifyType === ENUMS.NOTIFY.WARNING) { that.get("notify").warning(message, ENV.notifications); }
        if (notifyType === ENUMS.NOTIFY.ALERT) { that.get("notify").alert(message, ENV.notifications); }
        if (notifyType === ENUMS.NOTIFY.ERROR) { return that.get("notify").error(message, ENV.notifications); }
      },

      logout() {
        localStorage.clear();
        location.reload();
      },

      reload() {
        location.reload();
      },

      counter(data) {
        realtime.incrementProperty(`${data.type}Counter`);
      },

      namespace(data) {
        realtime.set("namespace", data.namespace);
      }
    };

    const socket = this.get('socketIOService').socketFor(ENV.socketPath);

    socket.emit("subscribe", {room: socketId});
    return (() => {
      const result = [];
      for (let key in allEvents) {
        const value = allEvents[key];
        result.push(socket.on(key, value));
      }
      return result;
    })();
  },

  actions: {

    willTransition(transition) {
      const currentRoute = transition.targetName;
      const csbDict = CSBMap[currentRoute];
      if (!Ember.isEmpty(csbDict)) {
        triggerAnalytics('feature', csbDict);
      }
    },

    invalidateSession() {
      triggerAnalytics('logout');
      this.get('session').invalidate();
    },

    giveFeeback() {
      surveyMonkey();
    }
  }
}
);

export default AuthenticatedRoute;
