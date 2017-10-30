export type AnimationEventType = "animation-end";

export interface AnimationEventData {
  type: AnimationEventType;
}

export class AnimationEvent implements AnimationEventData {
  type: AnimationEventType;

  constructor(type: AnimationEventType) {
    this.type = type;
  }
}
