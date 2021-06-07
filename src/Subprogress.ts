import { IProgress, IProgressCB, IProgressOptions } from "IProgress";
import { Progress } from "Progress";
import { ProgressDecorator } from "ProgressDecorator";

interface Suboptions extends IProgressOptions {
  size?: number;
}

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

  public sub({ current, total, size = 1 }: Suboptions = {}): Subprogress {
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

  private updateTotal() {
    const remainingSub = this.totalSub - this.currentSub;
    const totalWithSub = this.current + remainingSub;
    if (totalWithSub > this.total) {
      this.total = totalWithSub;
    }
  }
}
