import { Entity } from "../entities/entity";

export type EntityEventType = "put" | "remove" | "push" | "pop" | "swap";

export interface Config {
  block: boolean;
}

export interface EntityAddEventData {
  type: "put" | "push" | "swap";
  target: Entity;
  config: Partial<Config>;
}

export interface EntityDestroyEventData {
  type: "remove" | "pop";
  target: Entity;
}

export type EntityEventData = EntityAddEventData | EntityDestroyEventData;

export class EntityAddEvent implements EntityAddEventData {
  type: "put" | "push" | "swap";
  target: Entity;
  config: Partial<Config>;

  constructor(type: "put" | "push" | "swap",
              target: Entity,
              config: Partial<Config> = {}) {
    this.type = type;
    this.target = target;
    this.config = config;
  }
}

export class EntityDestroyEvent implements EntityDestroyEventData {
  type: "remove" | "pop";
  target: Entity;

  constructor(type: "remove" | "pop", target: Entity) {
    this.type = type;
    this.target = target;
  }
}
