import underscore from 'underscore';
import { Events } from 'backbone';

const EventEmitter = underscore.clone(Events);

export default class {
    constructor() {
      this.eventEmitter = underscore.clone(EventEmitter);
    }

    on(...args) {
      this.eventEmitter.on.apply(this.eventEmitter, args);

      return this;
    }

    off(...args) {
      this.eventEmitter.off.apply(this.eventEmitter, args);

      return this;
    }

    trigger(...args) {
      this.eventEmitter.trigger.apply(this.eventEmitter, args);

      return this;
    }
}
