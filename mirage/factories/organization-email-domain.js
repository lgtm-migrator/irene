/* eslint-disable prettier/prettier */
import {
  Factory
} from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  domainName: faker.internet.domainName
});
