import { Entity } from "../entities/entity";
import { RenderData } from "../components/render-component";
import { AnimationData } from "../components/animation-component";
import { AnimationEvent } from "../events/animation-event";
import { IntervalEventData } from "../events/interval-event";
import { RenderEventData } from "../events/render-event";

export interface AnimationEntity extends Entity {
  render: RenderData;
  animation: AnimationData;
}

export function AnimationSystem(entity: AnimationEntity): void {
  entity.on("interval", (ev: IntervalEventData) => {
    if (entity.animation.tag.length > 0) {
      entity.animation.t += ev.dt;
    }
  });

  entity.on("prerender", (ev: RenderEventData) => {
    if (entity.animation.tag.length > 0 &&
        entity.render.sprite !== undefined) {
      const sprite = ev.backend.assets().loadSprite(entity.render.sprite);

      if (entity.animation.duration <= entity.animation.t) {
        const index = sprite.nextIndex(entity.animation.tag,
                                       entity.render.spriteFrame);
        entity.animation.t = 0;

        if (_isAnimationEnd(index, entity)) {
          entity.send("animation-end", new AnimationEvent("animation-end"));
        } else {
          entity.render.spriteFrame = index;
          entity.animation.duration = sprite.duration(index);
        }
      }
    }
  });
}

function _isAnimationEnd(index: number, entity: AnimationEntity): boolean {
  const currentIndex = entity.render.spriteFrame;

  if (currentIndex !== undefined) {
    return !entity.animation.loop && index < currentIndex;
  } else {
    return false;
  }
}
