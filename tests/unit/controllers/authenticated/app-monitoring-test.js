import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Controller | authenticated/app-monitoring', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const controller = this.owner.lookup(
      'controller:authenticated/app-monitoring'
    );
    assert.ok(controller);
  });

  test('it contains default app_limit and app_offset', function (assert) {
    const controller = this.owner.lookup(
      'controller:authenticated/app-monitoring'
    );
    assert.strictEqual(controller.app_limit, 10, 'Contains default app limit');
    assert.strictEqual(controller.app_offset, 0, 'Contains default app offset');
  });

  test('it updates app_limit and app_offset', function (assert) {
    const controller = this.owner.lookup(
      'controller:authenticated/app-monitoring'
    );

    assert.strictEqual(controller.app_limit, 10, 'Contains default app limit');
    assert.strictEqual(controller.app_offset, 0, 'Contains default app offset');

    controller.set('app_limit', 20);
    controller.set('app_offset', 20);

    assert.strictEqual(controller.app_limit, 20);
    assert.strictEqual(controller.app_offset, 20);
  });
});
