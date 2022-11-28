import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import styles from 'irene/components/ak-stack/index.scss';
import { module, test } from 'qunit';

module('Integration | Component | ak-stack', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with the yielded content', async function (assert) {
    await render(hbs`
    <AkStack>
      <span data-test-ak-stack-item>
        Item - 1
      </span>
      <span data-test-ak-stack-item>
        Item - 2
      </span>
      <span data-test-ak-stack-item>
        Item - 3
      </span>
    </AkStack>
    `);

    const stackItems = this.element.querySelectorAll(
      '[data-test-ak-stack-item]'
    );

    assert.strictEqual(
      stackItems.length,
      3,
      'Yields correct number of stack items.'
    );
  });

  test('it renders with the right stack class names and styles', async function (assert) {
    // Spacing ranges from 0 - 8 units
    this.spacing = 7;

    // All "flex-direction properties
    this.direction = 'row-reverse';

    // Flex align properties
    this.alignItems = 'center';

    // Flex justify properties
    this.justifyContent = 'space-between';

    // Width based on a 12-column system
    this.width = '11/12';

    await render(hbs`
     <AkStack 
       @spacing={{this.spacing}} 
       @direction={{this.direction}} 
       @alignItems={{this.alignItems}} 
       @justifyContent={{this.justifyContent}} 
       @width={{this.width}}
       class="p-3"
       style="height: fit-content; border:1px solid #ff4d3f"
     >
       <span class="p-2" style="border:1px solid #eee" data-test-ak-stack-item>
         Item - 1
       </span>
       <span class="p-2" style="border:1px solid #eee" data-test-ak-stack-item>
         Item - 2
       </span>
       <span class="p-2" style="border:1px solid #eee" data-test-ak-stack-item>
         Item - 3
       </span>
     </AkStack>`);

    assert
      .dom('[data-test-ak-stack]')
      .exists()
      .hasClass(styles[`ak-stack-direction-${this.direction}`])
      .hasClass(styles[`ak-stack-spacing-${this.spacing}`])
      .hasClass(styles[`ak-stack-alignitems-${this.alignItems}`])
      .hasClass(styles[`ak-stack-justifycontent-${this.justifyContent}`])
      .hasClass(styles[`ak-stack-width-${this.width}`])
      .hasStyle({
        display: 'flex',
        'flex-direction': this.direction,
        'align-items': this.alignItems,
        'justify-content': this.justifyContent,
        gap: `${this.spacing * 0.25 * 14}px`,
      });
  });
});
