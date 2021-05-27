import { Emitter } from "Emitter";

interface ProgressEvents {
  progress: [current: number, total: number, message?: string];
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

  public getCurrent(): number {
    return this.current;
  }

  public setCurrent(value: number) {
    this.current = value;
    return this;
  }

  public getTotal(): number {
    if (this.total == null) {
      throw new Error("total is not set.");
    }
    return this.total;
  }

  public setTotal(value: number) {
    this.total = value;
    return this;
  }
}