export type ParticleField = "LIFETIME" |
                            "X" | "Y" |
                            "X_SUBPIXEL" | "Y_SUBPIXEL" |
                            "X_SPEED" | "Y_SPEED" |
                            "X_ACCEL" | "Y_ACCEL" |
                            "SPRITE_FRAME";

export const PARTICLE_FIELDS = [
  "LIFETIME",
  "X",
  "Y",
  "X_SUBPIXEL",
  "Y_SUBPIXEL",
  "X_SPEED",
  "Y_SPEED",
  "X_ACCEL",
  "Y_ACCEL",
  "SPRITE_FRAME",
] as ParticleField[];

export const PARTICLE_FIELDS_ENUM = {} as { [key in ParticleField]: number };
for (let i = 0; i < PARTICLE_FIELDS.length; ++i) {
  PARTICLE_FIELDS_ENUM[PARTICLE_FIELDS[i]] = i;
}

export interface ParticleData {
  sprite: string;
  length: number;
  capacity: number;
  data: number[];
}

export class ParticleComponent implements ParticleData {
  sprite: string;
  length: number;
  capacity: number;
  data: number[];

  constructor(options?: Partial<ParticleData>) {
    this.sprite = "";
    this.length = 0;
    this.capacity = 0;
    this.data = [];

    Object.assign(this, options);
  }
}
