import Ember from 'ember';
import ApplicationInstance from '@ember/application/instance';
import { setProperties } from '@ember/object';
import { assign } from '@ember/polyfills';

interface setComponentManager<T> {
  (managerFactory: (owner: ApplicationInstance) => unknown, baseClass: T): T
}
export interface ComponentManagerArgs {
  named: object;
  positional: any[];
}
const setComponentManager = (Ember as any)._setComponentManager as setComponentManager<FunctionalComponent>;

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

  createComponent(fn: FunctionalComponent, args: ComponentManagerArgs): CreateComponentResult {
    let templateContext = assign({}, fn(args.named));

    return {
      fn,
      args,
      templateContext,
    }
  }

  updateComponent(bucket: CreateComponentResult, args: ComponentManagerArgs) {
    let updatedTemplateContext = bucket.fn(args.named);

    setProperties(bucket.templateContext, updatedTemplateContext);
  }

  destroyComponent(_bucket: CreateComponentResult) {}

  getContext(bucket: CreateComponentResult) {
    return bucket.templateContext;
  }

  didCreateComponent(_bucket: CreateComponentResult) {}

  didUpdateComponent(_bucket: CreateComponentResult) {}
}

export function createComponent(callback: FunctionalComponent) {
  setComponentManager((owner: ApplicationInstance) => FunctionalComponentManager.forOwner(owner), callback);

  return callback;
}
