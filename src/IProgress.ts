import { IEmitter } from "Emitter";

export interface IProgressEvents {
  progress: [
    current: number,
    total: number,
    ratio: number,
    message: string | null
  ];
}

export interface IProgressOptions {
  current?: number;
  total?: number;
}

export interface IProgressConstructor {
  new (options?: IProgressOptions): IProgress;
}

export interface IProgress extends IEmitter<IProgressEvents> {
  current: number;
  total: number;
  readonly ratio: number;

  update(current: number, msg?: string): this;
  tick(msg?: string): this;
  end(msg?: string): this;
}
