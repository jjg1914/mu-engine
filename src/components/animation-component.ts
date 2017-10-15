export interface AnimationData {
  t: number;
  duration: number;
  tag: string;
}

export class AnimationComponent implements AnimationData {
  t: number;
  duration: number;
  tag: string;

  constructor(options: Partial<AnimationData> = {}) {
    Object.assign(this, {
      t: 0,
      duration: 0,
      tag: "",
    }, options);
  }
}
