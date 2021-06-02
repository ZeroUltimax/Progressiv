import { Emitter } from "Emitter";
import { IProgress, IProgressEvents, IProgressOptions } from "IProgress";

export class Progress extends Emitter<IProgressEvents> implements IProgress {
  private _current: number;
  private _total: number | null;

  constructor({ current, total }: IProgressOptions = {}) {
    super();
    this._current = current ?? 0;
    this._total = total ?? null;
  }

  //#region properties
  public get current(): number {
    return this._current;
  }

  public set current(value: number) {
    this._current = value;
  }

  public get total(): number {
    if (this._total == null) {
      throw new Error("'total' is not set.");
    }
    return this._total;
  }

  public set total(value: number) {
    this._total = value;
  }

  public get ratio(): number {
    if (this._total === null || this._total === 0) {
      return this._current ? 1 : 0;
    }
    if (this._current <= 0) {
      return 0;
    }
    if (this._current >= this._total) {
      return 1;
    }
    return this._current / this._total;
  }
  //#endregion

  //#region updates
  public update(current: number, msg?: string) {
    if (current < this._current) {
      throw new Error("'current' cannot be reduced by an update.");
    }
    this.current = current;

    if (this.total < this.current) {
      this.total = this.current;
    }
    this.emitProgress(msg);
    return this;
  }

  public tick(msg?: string) {
    this.update(this._current + 1, msg);
    return this;
  }

  public end(msg?: string) {
    const maxCurrent = Math.max(this.total, this.current);
    this.update(maxCurrent, msg);
    return this;
  }

  private emitProgress(msg: string | undefined) {
    this.emit("progress", this.current, this.total, this.ratio, msg ?? null);
  }
  //#endregion
}
