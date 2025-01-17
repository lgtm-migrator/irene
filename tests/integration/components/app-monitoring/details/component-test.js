import { render } from '@ember/test-helpers';
import dayjs from 'dayjs';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import styles from 'irene/components/app-monitoring/details/index.scss';
import { module, test } from 'qunit';

module('Integration | Component | app-monitoring/details', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    this.file = this.server.create('file');
    this.latestAmAppVersion = this.server.create('am-app-version');
    this.lastSync = this.server.create('am-app-sync');

    this.project = this.server.create('project', {
      lastFile: this.file,
      platformIconClass: 'apple',
    });

    this.settings = {
      id: 1,
      enabled: true,
    };

    this.closeDrawer = function () {
      return;
    };
  });

  test('it renders with the right data assuming monitoring is enabled and settings is active', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      latestFile: this.file,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      isActive: true,
      lastSync: this.lastSync,
    });

    this.settings.enabled = true;

    await render(hbs`
      <AppMonitoring::Details
        @showRightDrawer={{true}}
        @appDetails={{this.amApp}}
        @closeModalHandler={{this.closeDrawer}}
        @settings={{this.settings}}
      />
    `);

    assert.dom('[data-test-ak-drawer-container]').exists();
    assert.dom('[data-test-am-drawer-header-close-icon]').exists();
    assert.dom('[data-test-am-drawer-header-title]').exists();
    assert
      .dom('[data-test-am-drawer-name]')
      .hasText(`${this.amApp.project.lastFile.name}`);
    assert
      .dom('[data-test-am-drawer-namespace]')
      .hasText(`${this.amApp.project.packageName}`);

    assert
      .dom('[data-test-am-drawer-platform]')
      .hasClass(styles[`platform-${this.amApp.project.platformIconClass}`]);

    assert
      .dom('[data-test-am-drawer-last-scanned-version]')
      .containsText(`${this.amApp.project.lastFile.comparableVersion}`)
      .containsText(`File ID - ${this.amApp.project.lastFile.id}`);

    assert
      .dom('[data-test-am-drawer-store-version]')
      .containsText(`${this.amApp.latestAmAppVersion.comparableVersion}`)
      .containsText(`File ID - ${this.amApp.latestAmAppVersion.latestFile.id}`);

    // In this scenario settings === true and isActive === true
    assert
      .dom('[data-test-am-app-status] [data-test-am-status-element]')
      .exists()
      .hasText('t:activeCaptital:()');

    assert
      .dom('[data-test-am-app-status] [data-test-am-app-last-sync]')
      .exists()
      .containsText(
        `${new dayjs(this.amApp.lastSync.syncedOn).format('DD MMM YYYY')}`
      );
  });

  test('it renders with the right data assuming monitoring is enabled and settings is inactive', async function (assert) {
    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      isActive: true,
      lastSync: this.lastSync,
    });

    this.settings.enabled = false;

    await render(hbs`
    <AppMonitoring::Details
      @showRightDrawer={{true}}
      @appDetails={{this.amApp}}
      @closeModalHandler={{this.closeDrawer}}
      @settings={{this.settings}}
    />
  `);

    assert.dom('[data-test-ak-drawer-container]').exists();
    assert.dom('[data-test-am-drawer-header-close-icon]').exists();
    assert.dom('[data-test-am-drawer-header-title]').exists();
    assert
      .dom('[data-test-am-drawer-name]')
      .hasText(`${this.amApp.project.lastFile.name}`);
    assert
      .dom('[data-test-am-drawer-namespace]')
      .hasText(`${this.amApp.project.packageName}`);

    assert
      .dom('[data-test-am-drawer-platform]')
      .hasClass(styles[`platform-${this.amApp.project.platformIconClass}`]);

    assert
      .dom('[data-test-am-drawer-last-scanned-version]')
      .containsText(`${this.amApp.project.lastFile.comparableVersion}`)
      .containsText(`File ID - ${this.amApp.project.lastFile.id}`);

    assert
      .dom('[data-test-am-drawer-store-version]')
      .containsText(`${this.amApp.latestAmAppVersion.comparableVersion}`)
      .containsText(`t:notScanned:()`);

    assert
      .dom('[data-test-am-app-status] [data-test-am-status-element]')
      .exists();

    // isActive === true
    assert
      .dom('[data-test-am-app-status] [data-test-am-status-element]')
      .exists()
      .hasText('t:inactiveCaptital:()');

    assert
      .dom('[data-test-am-app-status] [data-test-am-app-last-sync]')
      .exists()
      .containsText(
        `${new dayjs(this.amApp.lastSync.syncedOn).format('DD MMM YYYY')}`
      );
  });

  test('it renders "PENDING" status in store version column if comparableVersion is empty and lastSync are null', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      comparableVersion: null,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      lastSync: null,
      isActive: true,
    });

    this.settings.enabled = true;

    await render(hbs`
    <AppMonitoring::Details
      @showRightDrawer={{true}}
      @appDetails={{this.amApp}}
      @closeModalHandler={{this.closeDrawer}}
      @settings={{this.settings}}
    />
  `);

    assert.dom('[data-test-ak-drawer-container]').exists();
    assert.dom('[data-test-am-drawer-header-close-icon]').exists();
    assert.dom('[data-test-am-drawer-header-title]').exists();

    assert
      .dom('[data-test-am-drawer-store-version] [data-test-am-status-element]')
      .exists()
      .hasText(`t:pending:()`);

    assert.dom('[data-test-am-app-last-sync-spinner]').exists();
  });

  test('it renders "NOT FOUND" status in store version column if comparableVersion is empty and latestAmAppVersion is null', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      comparableVersion: '',
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: null,
      lastSync: this.lastSync,
      isActive: true,
    });

    this.settings.enabled = true;

    await render(hbs`
    <AppMonitoring::Details
      @showRightDrawer={{true}}
      @appDetails={{this.amApp}}
      @closeModalHandler={{this.closeDrawer}}
      @settings={{this.settings}}
    />
  `);

    assert.dom('[data-test-ak-drawer-container]').exists();
    assert.dom('[data-test-am-drawer-header-close-icon]').exists();
    assert.dom('[data-test-am-drawer-header-title]').exists();

    assert
      .dom('[data-test-am-drawer-store-version] [data-test-am-status-element]')
      .exists()
      .hasText(`t:notFound:()`);
  });

  test('it hides drawer when "showRightDrawer" property is set to false', async function (assert) {
    await render(hbs`
    <AppMonitoring::Details
      @showRightDrawer={{false}}
      @appDetails={{this.amApp}}
      @closeModalHandler={{this.closeDrawer}}
      />
      `);

    assert.dom('[data-test-drawer-container]').doesNotExist();

    assert.dom('[data-test-drawer-content]').doesNotExist();
  });

  test('it renders "NOT SCANNED" in store version field when latestFile in latestAmAppVersion is null', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      latestFile: null,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      lastSync: this.lastSync,
      isActive: true,
    });

    await render(
      hbs`
      <AppMonitoring::Details
        @showRightDrawer={{true}}
        @appDetails={{this.amApp}}
        @closeModalHandler={{this.closeDrawer}}
        @settings={{this.settings}}
      />`
    );

    assert
      .dom('[data-test-am-drawer-store-version]')
      .containsText(`${this.amApp.latestAmAppVersion.comparableVersion}`)
      .containsText(`t:notScanned:()`);

    assert
      .dom('[data-test-am-drawer-store-version] [data-test-am-status-element]')
      .exists()
      .containsText(`t:notScanned:()`);
  });

  test('it hides "sync in progress" status section when store monitoring is inactive', async function (assert) {
    this.latestAmAppVersion = this.server.create('am-app-version', {
      comparableVersion: null,
    });

    this.amApp = this.server.create('am-app', 1, {
      project: this.project,
      latestAmAppVersion: this.latestAmAppVersion,
      lastSync: null,
      isActive: false,
    });

    this.settings.enabled = false;

    await render(hbs`
    <AppMonitoring::Details
      @showRightDrawer={{true}}
      @appDetails={{this.amApp}}
      @closeModalHandler={{this.closeDrawer}}
      @settings={{this.settings}}
    />
  `);

    assert
      .dom('[data-test-am-drawer-store-version] [data-test-am-status-element]')
      .exists()
      .hasText(`t:pending:()`);

    assert.dom('[data-test-am-app-last-sync-spinner]').doesNotExist();
  });
});
