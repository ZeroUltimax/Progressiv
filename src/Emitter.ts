type EventMap<T = any> = {
  [k in keyof T]: T[k] extends any[] ? T[k] : never;
};

export class Emitter<M extends EventMap = any> {
  private eventsMap: { [E in keyof M]?: ((...args: M[E]) => void)[] } = {};

  public on<E extends keyof M>(event: E, cb: (...args: M[E]) => void) {
    this.eventsMap[event] = [...(this.eventsMap[event] || [])!, cb];
    return this;
  }

  public off<E extends keyof M>(event: E, cb: (...args: M[E]) => void) {
    const events = (this.eventsMap[event] || [])!.filter((x) => x !== cb);
    if (events.length) {
      this.eventsMap[event] = events;
    } else {
      delete this.eventsMap[event];
    }
    return this;
  }

  public emit<E extends keyof M>(event: E, ...args: M[E]) {
    this.eventsMap[event]?.forEach((cb) => cb(...args));
    return this;
  }
}
