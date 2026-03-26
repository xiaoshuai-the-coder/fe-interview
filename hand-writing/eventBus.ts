interface EventHandler {
  fn: Function[];
  once: boolean;
}

interface EventBusInterface {
  events: Map<string, EventHandler>;
  on: (event: string, fn: Function, once: boolean) => void;
  off: (event: string, fn?: Function) => void;
  emit: (event: string, args: unknown[]) => void;
  once: (event: string, fn: Function) => void;
}
class EventBus implements EventBusInterface {
  events: Map<string, EventHandler>;
  constructor() {
    this.events = new Map();
  }

  on(event: string, fn: Function, once: boolean = false) {
    this.events.set(event, {
      fn: this.events.has(event)
        ? (this.events.get(event)?.fn || []).concat([fn])
        : [fn],
      once,
    });
  }

  emit(event: string, ...args: unknown[]) {
    const fnObject = this.events.get(event);
    if (fnObject && fnObject.fn.length) {
      fnObject.fn.forEach((f) => {
        f(...args);
        if (fnObject.once) {
          this.off(event);
        }
      });
    } 
  }
  off(event: string, fn?: Function) {
    const eventInfo = this.events.get(event);
    if (fn && eventInfo?.fn.includes(fn)) {
      const fnIndex = eventInfo.fn.indexOf(fn);
      eventInfo.fn.splice(fnIndex, 1);
      this.events.set(event, eventInfo);
    } else {
      this.events.delete(event);
    }
  }

  once(event: string, fn: Function) {
    this.on(event, fn, true);
  }
}

module.exports = { EventBus };
