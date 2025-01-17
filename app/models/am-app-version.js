import Model, { attr, belongsTo } from '@ember-data/model';
import ENUMS from 'irene/enums';

export default class AmAppVersionModel extends Model {
  @attr('string') createdOn;
  @attr('string') version;
  @attr('string') versionCode;

  @belongsTo('am-app') amApp;
  @belongsTo('file', { inverse: null }) latestFile;

  get comparableVersion() {
    const platform = this.amApp?.get('project')?.get('platform');
    if (platform === ENUMS.PLATFORM.IOS) {
      return this.version;
    }
    return this.versionCode;
  }
}
