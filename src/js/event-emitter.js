import { clone } from 'lodash';
import { Events } from 'backbone';


export default class {
    constructor() {
      this.eventEmitter = clone(Events);
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
