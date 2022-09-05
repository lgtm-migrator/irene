/* eslint-disable ember/no-computed-properties-in-native-classes */
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { notEmpty, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Inflector from 'ember-inflector';
import ENUMS from 'irene/enums';

const inflector = Inflector.inflector;
inflector.irregular('asvs', 'asvses');

export default class Analysis extends Model {
  @service intl;

  @attr() findings;
  @attr() cvssMetricsHumanized;

  @attr('string') cvssVector;
  @attr('string') overriddenRiskComment;

  @attr('number') risk;
  @attr('number') status;
  @attr('number') cvssBase;
  @attr('number') cvssVersion;
  @attr('number') computedRisk;
  @attr('number') overriddenRisk;
  @attr('number') analiserVersion;

  @hasMany('owasp') owasp;
  @hasMany('cwe') cwe;
  @hasMany('asvs') asvs;
  @hasMany('mstg') mstg;
  @hasMany('pcidss') pcidss;
  @hasMany('hipaa') hipaa;
  @hasMany('gdpr') gdpr;
  @hasMany('attachment') attachments;

  @belongsTo('vulnerability') vulnerability;
  @belongsTo('file', { inverse: 'analyses' }) file;

  @notEmpty('overriddenRisk') isOverriddenRisk;

  @oneWay('file.profile.reportPreference.show_pcidss.value') showPcidss;
  @oneWay('file.profile.reportPreference.show_hipaa.value') showHipaa;
  @oneWay('file.profile.reportPreference.show_gdpr.value') showGdpr;

  hasType(type) {
    const types = this.vulnerability.get('types');

    if (isEmpty(types)) {
      return false;
    }
    return types.includes(type);
  }

  iconClass(risk) {
    switch (risk) {
      case ENUMS.RISK.UNKNOWN:
        return 'fa-spinner fa-spin';
      case ENUMS.RISK.NONE:
        return 'fa-check';
      case ENUMS.RISK.CRITICAL:
      case ENUMS.RISK.HIGH:
      case ENUMS.RISK.LOW:
      case ENUMS.RISK.MEDIUM:
        return 'fa-warning';
    }
  }

  labelClass(risk) {
    const cls = 'tag';
    switch (risk) {
      case ENUMS.RISK.UNKNOWN:
        return `${cls} is-progress`;
      case ENUMS.RISK.NONE:
        return `${cls} is-success`;
      case ENUMS.RISK.LOW:
        return `${cls} is-info`;
      case ENUMS.RISK.MEDIUM:
        return `${cls} is-warning`;
      case ENUMS.RISK.HIGH:
        return `${cls} is-danger`;
      case ENUMS.RISK.CRITICAL:
        return `${cls} is-critical`;
    }
  }

  get hasCvssBase() {
    return this.cvssVersion === 3;
  }

  get tLow() {
    return this.intl.t('low');
  }

  get tNone() {
    return this.intl.t('none');
  }

  get tHigh() {
    return this.intl.t('high');
  }

  get tMedium() {
    return this.intl.t('medium');
  }

  get tCritical() {
    return this.intl.t('critical');
  }

  get isScanning() {
    const risk = this.computedRisk;
    return risk === ENUMS.RISK.UNKNOWN;
  }

  get isRisky() {
    const risk = this.computedRisk;
    return ![ENUMS.RISK.NONE, ENUMS.RISK.UNKNOWN].includes(risk);
  }

  get riskIconClass() {
    return this.iconClass(this.risk);
  }

  get overriddenRiskIconClass() {
    return this.iconClass(this.overriddenRisk);
  }

  get computedRiskIconClass() {
    return this.iconClass(this.computedRisk);
  }

  get riskLabelClass() {
    return this.labelClass(this.risk);
  }

  get overriddenRiskLabelClass() {
    return this.labelClass(this.overriddenRisk);
  }
}
