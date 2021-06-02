import { IProgress, IProgressEvents } from "IProgress";
import { Progress } from "Progress";

export class ProgressDecorator implements IProgress {
  constructor(private _: Progress) {}

  public get current(): number {
    return this._.current;
  }

  public set current(value: number) {
    this._.current = value;
  }

  public get total(): number {
    return this._.total;
  }

  public set total(value: number) {
    this._.total = value;
  }

  public get ratio() {
    return this._.ratio;
  }

  public update(current: number, msg?: string): this {
    this._.update(current, msg);
    return this;
  }
  public tick(msg?: string): this {
    this._.tick(msg);
    return this;
  }

  public end(msg?: string): this {
    this._.end(msg);
    return this;
  }

  public on(
    event: "progress",
    cb: (...args: IProgressEvents["progress"]) => void
  ): this {
    this._.on(event, cb);
    return this;
  }
  public off(
    event: "progress",
    cb: (...args: IProgressEvents["progress"]) => void
  ): this {
    this._.off(event, cb);
    return this;
  }
  public emit(event: "progress", ...args: IProgressEvents["progress"]): this {
    this._.emit(event, ...args);
    return this;
  }
}
