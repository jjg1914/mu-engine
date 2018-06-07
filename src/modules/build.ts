import { Entity } from "../entities/entity";

export interface BuildableProperty {
  value: any;
  type: "value" | "asset";
}

export interface BuildableComponent {
  [key: string]: BuildableProperty;
}

export interface BuildableEntity {
  type: string;
  components: { [key: string]: BuildableComponent };
}

export interface BuildConfig {
  assets: { load(asset: string): any };
}

export function buildEntities(entities: BuildableEntity[],
                              config: BuildConfig): Entity[] {
  const rval = [];

  for (let e of entities) {
    const ctor = config.assets.load(e.type + "-entity");

    if (ctor !== undefined) {
      const components = {} as {
        [key: string]: { [key: string ]: any } | undefined
      };

      for (let f in e.components) {
        const component = e.components[f];

        const dest = components[f] || ({} as BuildableComponent);
        components[f] = dest;

        for (let g in component) {
          const value = component[g];

          switch (value.type) {
            case "asset":
              dest[g] = config.assets.load(value.value);
              break;
            case "value":
            default:
              dest[g] = value.value;
              break;
          }
        }
      }

      const entity = new ctor(components);
      rval.push(entity);
    }
  }

  return rval;
}
