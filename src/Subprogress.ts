import { IProgress, IProgressCB, IProgressOptions } from "IProgress";
import { Progress } from "Progress";
import { ProgressDecorator } from "ProgressDecorator";

interface SubSizeOptions extends IProgressOptions {
  size?: number;
}

interface SubToOptions extends IProgressOptions {
  to?: number;
}

type SubOptions = SubSizeOptions & SubToOptions;

interface Subinfo {
  subprogress: Subprogress;
  tally: number;
  size: number;
  cb: IProgressCB;
}

export class Subprogress extends ProgressDecorator implements IProgress {
  private subId = 0;
  private subs: { [id: number]: Subinfo } = {};
  private currentSub = 0;
  private totalSub = 0;

  constructor(o?: IProgressOptions) {
    super(new Progress(o));
  }

  public sub(options: SubSizeOptions): Subprogress;
  public sub(options: SubToOptions): Subprogress;
  public sub({ current, total, size, to }: SubOptions = {}): Subprogress {
    if (to != null) {
      if (size != null) {
        throw new Error(`"size" and "to" optiosn cannot be both specified`);
      } else {
        const totalWithSub = this.totalWithSub();
        size = to - totalWithSub;
        if (size < 0) {
          throw new Error(
            `Cannot sub to a regressive total. "to" was ${to}, but expected total is already ${totalWithSub}.`
          );
        }
      }
    } else if (size == null) {
      size = 1;
    }

    const subprogress = new Subprogress({ current, total });
    const tally = 0;
    const id = this.subId++;
    const cb: IProgressCB = (current, total, ratio, message) => {
      this.updateSub(id, ratio, message);
    };

    this.subs[id] = {
      subprogress,
      tally,
      size,
      cb,
    };

    subprogress.on("progress", cb);

    // Manage total here!!!
    this.totalSub += size;
    this.updateTotal();

    return subprogress;
  }

  public update(total: number, msg?: string) {
    super.update(total, msg);
    this.updateTotal();
    return this;
  }

  public tick(msg?: string) {
    super.tick(msg);
    this.updateTotal();
    return this;
  }

  public end(msg?: string) {
    super.end(msg);
    Object.values(this.subs).forEach(({ subprogress, cb }) => {
      subprogress.off("progress", cb);
    });
    this.subs = {};
    return this;
  }

  private updateSub(id: number, ratio: number, message: string | undefined) {
    const sub = this.subs[id]!;
    const { subprogress, tally, size, cb } = sub;

    let newTally = ratio * size;
    if (newTally < tally) newTally = tally;

    const deltaCurrent = newTally - tally;
    const newCurrent = this.current + deltaCurrent;
    this.update(newCurrent, message);

    if (ratio >= 1.0) {
      subprogress.off("progress", cb);
      delete this.subs[id];
    }
  }

  private totalWithSub() {
    const remainingSub = this.totalSub - this.currentSub;
    return this.current + remainingSub;
  }

  private updateTotal() {
    const totalWithSub = this.totalWithSub();
    if (totalWithSub > this.total) {
      this.total = totalWithSub;
    }
  }
}
