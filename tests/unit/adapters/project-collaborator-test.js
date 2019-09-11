import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:project-collaborator', 'Unit | Adapter | project collaborator', {
  // Specify the other units that are required for this test.
  needs: [
    'service:session',
    'service:organization',
  ]
});

// Replace this with your real tests.
test('it exists', function (assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});
