import { Entity } from "../entities/entity";
import { Assets } from "../util/assets";
import {
  ParticleData,
  ParticleField,
  PARTICLE_FIELDS_ENUM,
  PARTICLE_FIELDS,
} from "../components/particle-component";
import { PositionData } from "../components/position-component";
import { RenderData } from "../components/render-component";
import { IntervalEventData } from "../events/interval-event";
import { ParticleEventData } from "../events/particle-event";
import { RenderEventData } from "../events/render-event";

import { accelerate } from "../modules/movement";

export interface ParticleSystemEntity extends Entity {
  particle: ParticleData;
  position: PositionData;
  render?: RenderData;
}

export function ParticleSystem(entity: ParticleSystemEntity): void {
  const paintf = (ctx: CanvasRenderingContext2D, assets: Assets) => {
    const sprite = assets.loadSprite(entity.particle.sprite);

    for (let i = 0; i < entity.particle.length; ++i) {
      const offset = i * PARTICLE_FIELDS.length;

      const x = entity.particle.data[offset + PARTICLE_FIELDS_ENUM["X"]];
      const y = entity.particle.data[offset + PARTICLE_FIELDS_ENUM["Y"]];
      const frame =
        entity.particle.data[offset + PARTICLE_FIELDS_ENUM["SPRITE_FRAME"]];

      sprite.drawFrame(ctx, frame, x, y);
    }
  };

  entity.on("particle", (event: ParticleEventData) => {
    const count = Math.floor(_randomRange(event.count));

    for (let i = 0; i < count; ++i) {
      if (entity.particle.capacity === entity.particle.length) {
        const block = PARTICLE_FIELDS.length;
        entity.particle.capacity += 256;
        entity.particle.data.length = entity.particle.capacity * block;
      }

      const j = entity.particle.length;
      entity.particle.length += 1;

      _set(entity, j, "LIFETIME", _randomRange(event.lifetime));
      _set(entity, j, "X",
           Math.floor(_randomRange(event.xOffset)) + entity.position.x);
      _set(entity, j, "Y",
           Math.floor(_randomRange(event.yOffset) + entity.position.y));
      _set(entity, j, "X_SUBPIXEL", 0);
      _set(entity, j, "Y_SUBPIXEL", 0);

      const direction = _randomRange(event.direction);
      const speed = _randomRange(event.speed);
      const accel = _randomRange(event.accel);

      const xUnit = Math.cos(direction);
      const yUnit = Math.sin(direction);

      _set(entity, j, "X_SPEED", speed * xUnit);
      _set(entity, j, "Y_SPEED", speed * yUnit);
      _set(entity, j, "X_ACCEL", accel * xUnit);
      _set(entity, j, "Y_ACCEL", accel * yUnit);

      _set(entity, j, "SPRITE_FRAME",
           Math.floor(_randomRange(event.spriteFrame)));
    }
  });

  entity.on("interval", (event: IntervalEventData) => {
    for (let i = 0; i < entity.particle.length;) {
      const lifetime = _get(entity, i, "LIFETIME") - event.dt;

      if (lifetime > 0) {
        const xAccel = _get(entity, i, "X_ACCEL");
        const yAccel = _get(entity, i, "Y_ACCEL");
        let xSpeed = _get(entity, i, "X_SPEED");
        let ySpeed = _get(entity, i, "Y_SPEED");
        let xSubpixel = _get(entity, i, "X_SUBPIXEL");
        let ySubpixel = _get(entity, i, "Y_SUBPIXEL");
        let x = _get(entity, i, "X");
        let y = _get(entity, i, "Y");

        xSpeed = accelerate(event.dt, xSpeed, xAccel);
        ySpeed = accelerate(event.dt, ySpeed, yAccel);

        if (xSpeed !== 0) {
          xSubpixel += Math.floor(event.dt * xSpeed);
          x += Math.trunc(xSubpixel / 1000);
          xSubpixel = Math.trunc(xSubpixel % 1000);
        } else {
          xSubpixel = 0;
        }

        if (ySpeed !== 0) {
          ySubpixel += Math.floor(event.dt * ySpeed);
          y += Math.trunc(ySubpixel / 1000);
          ySubpixel = Math.trunc(ySubpixel % 1000);
        } else {
          ySubpixel = 0;
        }

        _set(entity, i, "LIFETIME", lifetime);
        _set(entity, i, "X_SPEED", xSpeed);
        _set(entity, i, "Y_SPEED", ySpeed);
        _set(entity, i, "X_SUBPIXEL", xSubpixel);
        _set(entity, i, "Y_SUBPIXEL", ySubpixel);
        _set(entity, i, "X", x);
        _set(entity, i, "Y", y);

        i += 1;
      } else {
        const block = PARTICLE_FIELDS.length;
        entity.particle.length -= 1;
        entity.particle.data.copyWithin(i * block,
                                        entity.particle.length * block,
                                        (entity.particle.length + 1) * block);
      }
    }
  });

  entity.on("render", (event: RenderEventData) => {
    event.backend.add({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      render: {
        paint: paintf,
        depth: entity.render && entity.render.depth || 0,
      },
    });
  });
}

function _get(entity: ParticleSystemEntity,
              index: number,
              field: ParticleField): number {
  const offset = index * PARTICLE_FIELDS.length;
  return entity.particle.data[offset + PARTICLE_FIELDS_ENUM[field]];
}

function _set(entity: ParticleSystemEntity,
              index: number,
              field: ParticleField,
              value: number): void {
  const offset = index * PARTICLE_FIELDS.length;
  entity.particle.data[offset + PARTICLE_FIELDS_ENUM[field]] = value;
}

function _randomRange(n: number | [ number, number ]): number {
  if (n instanceof Array) {
    return Math.random() * Math.abs(n[1] - n[0]) + Math.min(n[0], n[1]);
  } else {
    return n;
  }
}
