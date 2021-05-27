import { Emitter } from "Emitter";

interface ProgressEvents {
  progress: [
    current: number,
    total: number,
    ratio: number,
    message: string | null
  ];
}

interface ProgressOptions {
  current?: number;
  total?: number;
}

export class Progress extends Emitter<ProgressEvents> {
  private current: number;
  private total: number | null;

  constructor({ current, total }: ProgressOptions = {}) {
    super();
    this.current = current ?? 0;
    this.total = total ?? null;
  }

  //#region properties
  public getCurrent(): number {
    return this.current;
  }

  public setCurrent(value: number) {
    this.current = value;
    return this;
  }

  public getTotal(): number {
    if (this.total == null) {
      throw new Error("'total' is not set.");
    }
    return this.total;
  }

  public setTotal(value: number) {
    this.total = value;
    return this;
  }

  public getRatio() {
    if (this.total === null || this.total === 0) {
      return this.current ? 1 : 0;
    }
    if (this.current <= 0) {
      return 0;
    }
    if (this.current >= this.total) {
      return 1;
    }
    return this.current / this.total;
  }
  //#endregion

  //#region updates
  public update(current: number, msg?: string) {
    if (current < this.current) {
      throw new Error("'current' cannot be reduced by an update.");
    }
    this.current = current;
    const total = this.getTotal();
    if (total < this.current) {
      this.total = current;
    }
    this.emitProgress(msg);
  }

  public tick(msg?: string) {
    this.update(this.current + 1, msg);
  }

  public end(msg?: string) {
    const maxCurrent = Math.max(this.getTotal(), this.current);
    this.update(maxCurrent, msg);
  }

  private emitProgress(msg: string | undefined) {
    this.emit(
      "progress",
      this.getCurrent(),
      this.getTotal(),
      this.getRatio(),
      msg ?? null
    );
  }
  //#endregion
}
