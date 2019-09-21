import Ember from 'ember';
import ApplicationInstance from '@ember/application/instance';
import { setProperties } from '@ember/object';
import { assign } from '@ember/polyfills';

const UpdateComponentSymbol = Symbol('STATE_UPDATE');
const StateSymbol = Symbol('STATE_CONTAINER');
let ACTIVE_CONTEXT: any = null;
let CALL_ID: number = -1;

function setContext(context: any) {
  ACTIVE_CONTEXT = context;
  CALL_ID = -1;
}
function resetContext() {
  ACTIVE_CONTEXT = null;
  CALL_ID = -1;
}
export function currentContext() {
  return ACTIVE_CONTEXT;
}

export function useState(initValue: any = undefined) {
  const context = currentContext();
  const state = context[StateSymbol];
  CALL_ID++;
  if (state[CALL_ID]) {
    return [state[CALL_ID][0], state[CALL_ID][1]];
  }
  let localCallId = CALL_ID;
  state.push([
    initValue,
    function updateState(this: any, value: any) {
      state[localCallId][0] = value;
      state[localCallId][2][UpdateComponentSymbol]();
    },
    context,
  ]);
  return state[localCallId];
}

interface setComponentManager<T> {
  (managerFactory: (owner: ApplicationInstance) => unknown, baseClass: T): T;
}
export interface ComponentManagerArgs {
  named: object;
  positional: any[];
}
const setComponentManager = (Ember as any)._setComponentManager as setComponentManager<
  FunctionalComponent
>;

interface CreateComponentResult {
  fn: FunctionalComponent;
  args: ComponentManagerArgs;
  templateContext: unknown;
}

interface FunctionalComponent {
  (props: object): object;
}

const MANAGERS = new WeakMap<ApplicationInstance, FunctionalComponentManager>();

class FunctionalComponentManager {
  //private owner: ApplicationInstance;
  public capabilities: any;

  static forOwner(owner: ApplicationInstance) {
    let instance = MANAGERS.get(owner);

    if (instance !== undefined) {
      return instance;
    }

    instance = new this(owner);
    MANAGERS.set(owner, instance);

    return instance;
  }

  constructor(_owner: ApplicationInstance) {
    //this.owner = owner;

    this.capabilities = (Ember as any)._componentManagerCapabilities('3.4', {
      destructor: true,
      asyncLifecycleCallbacks: true,
    });
  }

  createComponent(rawFn: FunctionalComponent, args: ComponentManagerArgs): CreateComponentResult {
    const ctx: any = {};
    ctx[StateSymbol] = [];
    const fn: FunctionalComponent = function(props: any) {
      setContext(ctx);
      const result = rawFn(props);
      resetContext();
      return result;
    };
    let templateContext = assign(ctx, fn(args.named));
    let bucket = {
      fn,
      args,
      templateContext,
    };

    ctx[UpdateComponentSymbol] = function() {
      setProperties(bucket.templateContext, bucket.fn(bucket.args.named));
    };
    return bucket;
  }

  updateComponent(bucket: CreateComponentResult, args: ComponentManagerArgs) {
    bucket.args = args;
    (bucket.templateContext as any)[UpdateComponentSymbol]();
  }

  destroyComponent(_bucket: CreateComponentResult) {}

  getContext(bucket: CreateComponentResult) {
    return bucket.templateContext;
  }

  didCreateComponent(_bucket: CreateComponentResult) {}

  didUpdateComponent(_bucket: CreateComponentResult) {}
}

export function createComponent(callback: FunctionalComponent) {
  setComponentManager(
    (owner: ApplicationInstance) => FunctionalComponentManager.forOwner(owner),
    callback
  );

  return callback;
}
