import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { createComponent } from 'ember-functional-component';
import { TestContext } from 'ember-test-helpers';

module('Integration | Component | main', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(this: TestContext) {
    this.owner.register('template:components/under-test', hbs`{{this.fullName}}`);
    this.owner.register('component:under-test', createComponent(function(props: { firstName: string, lastName: string }) {
      let fullName = `${props.firstName} ${props.lastName}`;

      return {
        fullName,
      }
    }));
  });

  test('it can render', async function(assert) {
    await render(hbs`<UnderTest @firstName="Jacquie" @lastName="Jackson" />`);

    assert.dom().hasText('Jacquie Jackson');
  });

  test('it can update', async function(assert) {
    this.set('first', 'Max');
    this.set('last', 'Jackson');

    await render(hbs`<UnderTest @firstName={{this.first}} @lastName={{this.last}} />`);

    assert.dom().hasText('Max Jackson');

    this.set('first', 'James');

    assert.dom().hasText('James Jackson');
  });
});
