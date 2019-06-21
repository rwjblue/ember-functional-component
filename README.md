ember-functional-component
==============================================================================

Attempting to use "pure functions" as components. Partially inspired by [vuejs/rfcs#42](https://github.com/vuejs/rfcs/pull/42).

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v3.4 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-functional-component
```


Usage
------------------------------------------------------------------------------

```js
import { createComponent } from 'ember-functional-component';

export default createComponent(props => {
  return {
    fullName: `${props.first} ${props.last}`,
  }
})
```

```handlebars
{{this.fullName}}
```

The function you provide will be called whenever the incoming arguments change.

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
