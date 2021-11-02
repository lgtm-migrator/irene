import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';

function serializer(data) {
  return {
    count: data.length,
    next: null,
    previous: null,
    results: data.models.map((d) => {
      return {
        id: d.id,
        data: d.attrs,
        domain_name: d.domainName,
      };
    }),
  };
}

module('Integration | Component | organization-email-domain', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    await this.server.createList('organization', 2);
    await this.owner.lookup('service:organization').load();
    await this.owner.lookup('service:me');
  });

  test('it should render title & description', async function (assert) {
    this.server.get('/organizations/:id/email_domains', () => {
      return [];
    });
    await render(hbs`<OrganizationEmailDomain />`);
    assert
      .dom(`[data-test-org-email-domain-title]`)
      .hasText(`t:emailDomainRestriction:()`);
    assert
      .dom(`[data-test-org-email-domain-desc]`)
      .hasText(`t:emailRestrictDesc:()`);
  });

  test('it should not render input box & save button', async function (assert) {
    this.server.get('/organizations/:id/email_domains', () => {
      return [];
    });
    this.set('isEditable', false);
    await render(
      hbs`<OrganizationEmailDomain @isEditable={{this.isEditable}}/>`
    );
    assert.dom(`[data-test-organization-email-input-container]`).doesNotExist();
  });

  test('it should show 5 domains by default', async function (assert) {
    this.server.createList('organization-email-domain', 5);
    this.server.get('/organizations/:id/email_domains', (schema) => {
      return serializer(schema.organizationEmailDomains.all());
    });
    await render(hbs`<OrganizationEmailDomain />`);
    assert.equal(
      this.element.querySelectorAll(`[data-test-organization-email-domain]`)
        .length,
      5
    );
    assert.dom(`[data-test-organization-email-no-domain]`).doesNotExist();
  });

  test('it should handle delete domain', async function (assert) {
    this.server.createList('organization-email-domain', 5);
    this.server.get('/organizations/:id/email_domains', (schema) => {
      return serializer(schema.organizationEmailDomains.all());
    });
    this.server.delete(
      '/organizations/:org_id/email_domains/:id',
      (schema, req) => {
        return schema.organizationEmailDomains.find(req.params.id).destroy();
      }
    );
    this.set('isEditable', true);
    await render(
      hbs`<OrganizationEmailDomain @isEditable={{this.isEditable}}/>`
    );
    assert.equal(
      this.element.querySelectorAll(`[data-test-organization-email-domain]`)
        .length,
      5,
      'should have 5 domains'
    );
    await click(
      this.element.querySelector(
        `[data-test-organization-email='delete-domain-1']`
      )
    );
    assert.equal(
      this.element.querySelectorAll(`[data-test-organization-email-domain]`)
        .length,
      4,
      'should only have 4 domains'
    );
  });

  test('it should handle add domain workflow', async function (assert) {
    this.server.get('/organizations/:id/email_domains', () => {
      return [];
    });
    this.server.post('/organizations/:id/email_domains', (schema, req) => {
      return schema.organizationEmailDomains.create(
        JSON.parse(req.requestBody)
      );
    });
    this.set('isEditable', true);
    await render(
      hbs`<OrganizationEmailDomain @isEditable={{this.isEditable}}/>`
    );

    assert.equal(
      this.element.querySelectorAll(`[data-test-organization-email-domain]`)
        .length,
      0,
      'empty domains'
    );
    await fillIn(
      this.element.querySelector(`[data-test-organization-email-input]`),
      'test.io'
    );
    await click(
      this.element.querySelector(`[data-test-organization-email-save-btn]`)
    );

    assert.equal(
      this.element.querySelectorAll(`[data-test-organization-email-domain]`)
        .length,
      1,
      'one domain added'
    );
  });

  test('add domain btn should be disabled by default & enabled only if input exist', async function (assert) {
    this.server.get('/organizations/:id/email_domains', () => {
      return [];
    });
    this.set('isEditable', true);
    await render(
      hbs`<OrganizationEmailDomain @isEditable={{this.isEditable}}/>`
    );
    assert
      .dom(`[data-test-organization-email-save-btn]`)
      .hasAttribute('disabled');
  });

  test('it should show no domain found UX', async function (assert) {
    this.server.get('/organizations/:id/email_domains', () => {
      return [];
    });
    await render(hbs`<OrganizationEmailDomain />`);
    assert.dom(`[data-test-organization-email-no-domain]`).exists();
    assert
      .dom(`[data-test-organization-email-no-domain-title]`)
      .hasText(`t:noDataFound:()`);
    assert
      .dom(`[data-test-organization-email-no-domain-exp]`)
      .hasText(`t:noDomainAdded:()`);
  });
});
