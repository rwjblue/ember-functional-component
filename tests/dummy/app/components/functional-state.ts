import { createComponent, useState } from 'ember-functional-component';

export default createComponent(() => {
  const [counter, increment] = useState(1);

  return {
    counter,
    increment: () => {
      increment(counter + 1);
    },
  };
});
