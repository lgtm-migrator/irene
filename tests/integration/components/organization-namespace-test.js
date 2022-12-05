import { render, findAll, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import dayjs from 'dayjs';
import { Response } from 'miragejs';

import Service from '@ember/service';

class OrganizationMeStub extends Service {
  org = {
    is_owner: true,
    is_admin: true,
  };
}

class NotificationsStub extends Service {
  errorMsg = null;
  successMsg = null;

  error(msg) {
    this.errorMsg = msg;
  }
  success(msg) {
    this.successMsg = msg;
  }
}

module('Integration | Component | organization-namespace', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    this.server.createList('organization', 1);

    const namespaces = this.server.createList('namespace', 10);
    const users = this.server.createList('organization-user', 2);

    namespaces.forEach((namespace, index) => {
      namespace.update({
        requested_by: users[0].id,
        approved_by: index === 5 ? null : users[1].id,
        is_approved: index !== 5,
        platform: [2, 3, 7].includes(index) ? 1 : 0,
      });
    });

    this.setProperties({ namespaces, users });

    await this.owner.lookup('service:organization').load();

    this.owner.register('service:me', OrganizationMeStub);
    this.owner.register('service:notifications', NotificationsStub);
  });

  test('it renders organization namespace', async function (assert) {
    this.server.get('/organizations/:id/namepsaces', (schema) => {
      return schema.namespaces.all().models;
    });

    this.server.get('/organizations/:id/users/:userId', (schema, req) => {
      const user = schema.organizationUsers.find(req.params.userId);

      return user?.toJSON();
    });

    await render(hbs`
      <OrganizationNamespace />
    `);

    const rows = findAll('[data-test-ak-table-row]');

    const headerRow = rows[0].querySelectorAll(
      '[data-test-ak-table-header-cell]'
    );

    // +1 for header row
    assert.strictEqual(rows.length, 11);

    // assert header row
    assert.dom(headerRow[0]).hasText('t:namespace:()');
    assert.dom(headerRow[1]).hasText('t:requestStatus:()');
    assert.dom(headerRow[2]).hasText('t:approvalStatus:()');

    // sanity check
    const contentRow = rows[1].querySelectorAll('[data-test-ak-table-cell]');

    const approvedUser = this.users.find(
      (user) => user.id === this.namespaces[0].approved_by
    );

    const requestedUser = this.users.find(
      (user) => user.id === this.namespaces[0].requested_by
    );

    assert.dom(contentRow[0]).hasText(this.namespaces[0].value);

    assert
      .dom(contentRow[1])
      .hasText(
        `${dayjs(this.namespaces[0].created_on).fromNow()} t:by:() ${
          requestedUser.username
        }`
      );

    assert
      .dom(contentRow[2])
      .hasText(
        `${dayjs(this.namespaces[0].approved_on).fromNow()} t:by:() ${
          approvedUser.username
        }`
      );
  });

  test('test approve namespace success', async function (assert) {
    this.server.get('/organizations/:id/namepsaces', (schema) => {
      return schema.namespaces.all().models;
    });

    this.server.get('/organizations/:id/users/:userId', (schema, req) => {
      const user = schema.organizationUsers.find(req.params.userId);

      return user?.toJSON();
    });

    await render(hbs`
      <OrganizationNamespace />
    `);

    const rows = findAll('[data-test-ak-table-row]');

    // 6th row has not approved namespace and +1 for header row
    const contentRow = rows[6].querySelectorAll('[data-test-ak-table-cell]');

    const approveBtn = contentRow[2].querySelector(
      '[data-test-namespace-approve-btn]'
    );

    const rejectBtn = contentRow[2].querySelector(
      '[data-test-namespace-reject-btn]'
    );

    assert.dom(approveBtn).exists();
    assert.dom(rejectBtn).exists();

    await click(approveBtn);

    const notify = this.owner.lookup('service:notifications');

    assert
      .dom(contentRow[2])
      .hasText(dayjs(this.namespaces[5].approved_on).fromNow());

    assert.strictEqual(notify.successMsg, 't:namespaceApproved:()');
  });

  test('test approve namespace failure', async function (assert) {
    this.server.get('/organizations/:id/namepsaces', (schema) => {
      return schema.namespaces.all().models;
    });

    this.server.get('/organizations/:id/users/:userId', (schema, req) => {
      const user = schema.organizationUsers.find(req.params.userId);

      return user?.toJSON();
    });

    this.server.put('/organizations/:id/namespaces/:namespaceId', () => {
      return new Response(500);
    });

    await render(hbs`
      <OrganizationNamespace />
    `);

    const rows = findAll('[data-test-ak-table-row]');

    // 6th row has not approved namespace and +1 for header row
    const contentRow = rows[6].querySelectorAll('[data-test-ak-table-cell]');

    const approveBtn = contentRow[2].querySelector(
      '[data-test-namespace-approve-btn]'
    );

    const rejectBtn = contentRow[2].querySelector(
      '[data-test-namespace-reject-btn]'
    );

    assert.dom(approveBtn).exists();
    assert.dom(rejectBtn).exists();

    await click(approveBtn);

    const notify = this.owner.lookup('service:notifications');

    assert.dom(approveBtn).exists();

    assert.strictEqual(notify.errorMsg, 't:pleaseTryAgain:()');
  });

  test('test reject namespace success', async function (assert) {
    this.server.get('/organizations/:id/namepsaces', (schema) => {
      return schema.namespaces.all().models;
    });

    this.server.get('/organizations/:id/users/:userId', (schema, req) => {
      const user = schema.organizationUsers.find(req.params.userId);

      return user?.toJSON();
    });

    await render(hbs`
      <OrganizationNamespace />
    `);

    const rows = findAll('[data-test-ak-table-row]');

    // 6th row has not approved namespace and +1 for header row
    const contentRow = rows[6].querySelectorAll('[data-test-ak-table-cell]');

    const approveBtn = contentRow[2].querySelector(
      '[data-test-namespace-approve-btn]'
    );

    const rejectBtn = contentRow[2].querySelector(
      '[data-test-namespace-reject-btn]'
    );

    assert.dom(approveBtn).exists();
    assert.dom(rejectBtn).exists();

    await click(rejectBtn);

    // check confirm popup is visible
    assert
      .dom('[data-test-confirmbox-rejectConfirmText]')
      .hasText('t:confirmBox.rejectNamespace:()');

    assert.dom('[data-test-confirmbox-rejectConfirm]').exists();
    assert.dom('[data-test-confirmbox-rejectCancel]').exists();

    await click('[data-test-confirmbox-rejectConfirm]');

    const notify = this.owner.lookup('service:notifications');

    // check confirm popup is not visible
    assert.dom('[data-test-confirmbox-rejectConfirmText]').doesNotExist();
    assert.dom('[data-test-confirmbox-rejectConfirm]').doesNotExist();
    assert.dom('[data-test-confirmbox-rejectCancel]').doesNotExist();

    // check row is not visible
    assert.dom(contentRow[0]).isNotVisible();
    assert.dom(contentRow[1]).isNotVisible();
    assert.dom(contentRow[2]).isNotVisible();

    assert.strictEqual(notify.successMsg, 't:namespaceRejected:()');
  });

  test('test reject namespace failure', async function (assert) {
    this.server.get('/organizations/:id/namepsaces', (schema) => {
      return schema.namespaces.all().models;
    });

    this.server.get('/organizations/:id/users/:userId', (schema, req) => {
      const user = schema.organizationUsers.find(req.params.userId);

      return user?.toJSON();
    });

    this.server.delete('/organizations/:id/namespaces/:namespaceId', () => {
      return new Response(500);
    });

    await render(hbs`
      <OrganizationNamespace />
    `);

    const rows = findAll('[data-test-ak-table-row]');

    // 6th row has not approved namespace and +1 for header row
    const contentRow = rows[6].querySelectorAll('[data-test-ak-table-cell]');

    const approveBtn = contentRow[2].querySelector(
      '[data-test-namespace-approve-btn]'
    );

    const rejectBtn = contentRow[2].querySelector(
      '[data-test-namespace-reject-btn]'
    );

    assert.dom(approveBtn).exists();
    assert.dom(rejectBtn).exists();

    await click(rejectBtn);

    // check confirm popup is visible
    assert
      .dom('[data-test-confirmbox-rejectConfirmText]')
      .hasText('t:confirmBox.rejectNamespace:()');

    assert.dom('[data-test-confirmbox-rejectConfirm]').exists();
    assert.dom('[data-test-confirmbox-rejectCancel]').exists();

    await click('[data-test-confirmbox-rejectConfirm]');

    const notify = this.owner.lookup('service:notifications');

    // check row is visible
    assert.dom(contentRow[0]).exists();
    assert.dom(rejectBtn).exists();

    assert.strictEqual(notify.errorMsg, 't:pleaseTryAgain:()');
  });
});
