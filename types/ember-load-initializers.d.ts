import Ember from "ember";

declare module 'ember-load-initializers' {
  export default function(App: typeof Ember.Application, modulePrefix: string): void;
}
