export interface AnimationData {
  t: number;
  duration: number;
  tag: string;
  loop: boolean;
}

export class AnimationComponent implements AnimationData {
  t: number;
  duration: number;
  tag: string;
  loop: boolean;

  constructor(options?: Partial<AnimationData>) {
    this.t = 0;
    this.duration = 0;
    this.tag = "";
    this.loop = true;

    Object.assign(this, options);
  }
}
