import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { createComponent } from 'ember-functional-component';

module('Integration | Component | main', function(hooks) {
  setupRenderingTest(hooks);

  test('it can render', async function(assert) {
    this.owner.register('template:components/under-test', hbs`{{this.fullName}}`);
    this.owner.register('component:under-test', createComponent(function(props: { firstName: string, lastName: string }) {
      let fullName = `${props.firstName} ${props.lastName}`

      return {
        fullName,
      }
    }));

    await render(hbs`<UnderTest @firstName="Jacquie" @lastName="Jackson" />`);

    assert.dom().hasText('Jacquie Jackson');
  });
});
