import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import faker from 'faker';

module(
  'Integration | Component | partner/credit-transfer-confirm',
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('it renders partner credits section', async function (assert) {
      this.set('partnerPlan', { scansLeft: 26 });
      this.set('remainingCredits', 2);

      await render(hbs`<Partner::CreditTransferConfirm
      @partnerPlan={{this.partnerPlan}}
      @remainingCredits={{this.remainingCredits}}/>`);
      assert.equal(
        this.element.querySelectorAll(
          `[data-test='partner-credits'] [data-test='row']`
        ).length,
        2,
        'Partner credits has two rows'
      );

      assert
        .dom(`[data-test='partner-current-credits-key']`)
        .hasText(`t:currentCredits:():`);
      assert
        .dom(`[data-test='partner-current-credits-value']`)
        .hasText(
          `${this.partnerPlan.scansLeft} t:pluralScans:("itemCount":${this.partnerPlan.scansLeft})`
        );

      assert
        .dom(`[data-test='partner-remaining-credits-key']`)
        .hasText(`t:remainingCredits:():`);
      assert
        .dom(`[data-test='partner-remaining-credits-value']`)
        .hasText(
          `${this.remainingCredits} t:pluralScans:("itemCount":${this.remainingCredits})`
        );
    });

    test('it renders client credits section', async function (assert) {
      this.set('clientPlan', { scansLeft: 26 });
      this.set('clientName', faker.company.companyName());
      this.set('transferCount', 15);

      await render(hbs`<Partner::CreditTransferConfirm
      @clientPlan={{this.clientPlan}}
      @clientName={{this.clientName}}
      @transferCount={{this.transferCount}}/>`);

      assert.equal(
        this.element.querySelectorAll(
          `[data-test='client-credits'] [data-test='row']`
        ).length,
        3,
        'Client credits has three rows'
      );

      assert.dom(`[data-test='client-key']`).hasText(`t:client:():`);
      assert.dom(`[data-test='client-value']`).hasText(this.clientName);
      assert
        .dom(`[data-test='client-current-credits-key']`)
        .hasText(`t:currentCredits:():`);
      assert
        .dom(`[data-test='client-current-credits-value']`)
        .hasText(
          `${this.clientPlan.scansLeft} t:pluralScans:("itemCount":${this.clientPlan.scansLeft})`
        );

      assert.dom(`[data-test='new-credits-key']`).hasText(`t:newCredits:():`);
      assert
        .dom(`[data-test='new-credits-value']`)
        .hasText(
          `${this.transferCount} t:pluralScans:("itemCount":${this.transferCount})`
        );
    });

    test('it render confirm & back btns', async function (assert) {
      this.set('tranferCredits', () => {});
      this.set('toggleMode', () => {});
      await render(hbs`<Partner::CreditTransferConfirm
      @tranferCredits={{this.tranferCredits}}
      @toggleMode={{this.toggleMode}}
      />`);

      assert.dom(`[data-test='confirm-btn']`).hasText(`t:confirmTransfer:()`);
      assert.dom(`[data-test='back-btn']`).hasText(`t:back:()`);
    });

    test('it render only confirm btn', async function (assert) {
      this.set('tranferCredits', () => {});
      await render(hbs`<Partner::CreditTransferConfirm
      @tranferCredits={{this.tranferCredits}}
      />`);

      assert.dom(`[data-test='confirm-btn']`).exists();
      assert.dom(`[data-test='confirm-btn']`).hasText(`t:confirmTransfer:()`);
      assert.dom(`[data-test='back-btn']`).doesNotExist();
    });

    test('it render only back btn', async function (assert) {
      this.set('toggleMode', () => {});
      await render(hbs`<Partner::CreditTransferConfirm
      @toggleMode={{this.toggleMode}}
      />`);

      assert.dom(`[data-test='confirm-btn']`).doesNotExist();
      assert.dom(`[data-test='back-btn']`).hasText(`t:back:()`);
    });
  }
);
