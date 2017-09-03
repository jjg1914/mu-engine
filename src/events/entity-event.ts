import { Entity } from "../entities/entity";

export type EntityEventType = "put" | "remove" | "push" | "pop" | "swap";

export interface EntityAddEventData {
  type: "put" | "push" | "swap";
  target: Entity;
}

export interface EntityDestroyEventData {
  type: "remove" | "pop";
}

export type EntityEventData = EntityAddEventData | EntityDestroyEventData;

export class EntityAddEvent implements EntityAddEventData {
  type: "put" | "push" | "swap";
  target: Entity;

  constructor(type: "put" | "push" | "swap", target: Entity) {
    this.type = type;
    this.target = target;
  }
}

export class EntityDestroyEvent implements EntityDestroyEventData {
  type: "remove" | "pop";

  constructor(type: "remove" | "pop") {
    this.type = type;
  }
}
