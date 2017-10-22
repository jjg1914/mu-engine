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
    Object.assign(this, {
      t: 0,
      duration: 0,
      tag: "",
      loop: true,
    }, options);
  }
}
