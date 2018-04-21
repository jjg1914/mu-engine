export type ParticleEventType = "particle";

export interface ParticleEventData {
  type: ParticleEventType;
  count: number | [ number, number ];
  lifetime: number | [ number, number ];
  xOffset: number | [ number, number ];
  yOffset: number | [ number, number ];
  speed: number | [ number, number ];
  direction: number | [ number, number ];
  accel: number | [ number, number ];
  spriteFrame: number | [ number, number ];
}

export class ParticleEvent implements ParticleEvent {
  type: ParticleEventType;
  count: number | [ number, number ];
  lifetime: number | [ number, number ];
  xOffset: number | [ number, number ];
  yOffset: number | [ number, number ];
  speed: number | [ number, number ];
  direction: number | [ number, number ];
  accel: number | [ number, number ];
  spriteFrame: number | [ number, number ];

  constructor(options?: Partial<ParticleEventData>) {
    this.type = "particle";
    this.count = 1;
    this.lifetime = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.speed = 0;
    this.direction = 0;
    this.accel = 0;
    this.spriteFrame = 0;

    Object.assign(this, options);
  }
}
