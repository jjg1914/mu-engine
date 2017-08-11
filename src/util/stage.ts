import { Entity } from "../entities/entity";
import { Bounds, Circle, Polygon } from "./shape";

interface BuildableProperty {
  value: any;
  type: "value" | "asset";
}

interface BuildableComponent {
  [key: string]: BuildableProperty;
}

interface BuildableEntity {
  type: string;
  components: { [key: string]: BuildableComponent };
}

export interface EntityDefinition {
  new(config: { [ key: string ]: any }): any;
}

export interface BuildConfig {
  entities: { [ key: string ]: EntityDefinition };
  assets: { load(asset: string): any };
}

export class Stage {
  static fromTMX(data: any): Stage {
    const width = Number(data.map.$.width) * Number(data.map.$.tilewidth);
    const height = Number(data.map.$.height) * Number(data.map.$.tileheight);

    const stage = new Stage(width, height);

    for (let e of data.map.objectgroup) {
      for (let f of e.object) {
        const entity = {
          type: (f.$.type != null ? f.$.type : "default"),
          components: {},
        } as BuildableEntity;

        entity.components.position = {
          x: { value: Number(f.$.x), type: "value" },
          y: { value: Number(f.$.y), type: "value" },
          width: { value: Number(f.$.width), type: "value" },
          height: { value: Number(f.$.height), type: "value" },
        };

        if (f.ellipse) {
          const r = Number(f.$.width) / 2;
          entity.components.position.mask =
            { value: new Circle(r, 0, 0), type: "value" };
        } else if (f.polygon) {
          const points = f.polygon[0].$.points.split(" ").map((e: string) => {
            return e.split(",", 2).map((e) => Number(e));
          }) as ([ number, number ])[];

          let left = Infinity;
          let top = Infinity;
          let right = -Infinity;
          let bottom = -Infinity;

          for (let e of points) {
            left = Math.min(e[0], left);
            top = Math.min(e[1], top);
            right = Math.max(e[0], right);
            bottom = Math.max(e[1], bottom);
          }

          entity.components.position.mask = {
            type: "value",
            value: new Polygon(points.map((e) => {
              return [ e[0] - left, e[1] - top ] as [ number, number ];
            })),
          }
          entity.components.position.x.value += left;
          entity.components.position.y.value += top;
          entity.components.position.width.value = right - left + 1;
          entity.components.position.height.value = bottom - top + 1;
        }


        if (f.$.visible == null || Number(f.$.visible) !== 0) {
          entity.components.render = {};
        }

        if (f.properties != null) {
          for (let g of f.properties) {
            if (g.property != null) {
              for (let h of g.property) {
                _set(entity, h.$.name, h.$.value, h.$.type);
              }
            }
          }
        }

        stage._addEntity(entity);
      }
    }

    return stage;
  }

  static unserialize(data: any): Stage {
    return Stage.fromTMX(data) ;
  }

  private _width: number;
  private _height: number;
  private _entities: BuildableEntity[];

  constructor(width: number, height: number) {
    this._entities = [];
    this._width = width;
    this._height = height;
  }

  bounds(): Bounds {
    return {
      left: 0,
      top: 0,
      right: this._width - 1,
      bottom: this._height - 1,
    };
  }

  private _addEntity(entity: BuildableEntity): void {
    this._entities.push(entity);
  }

  build(dest: { put(entity: Entity): any }, config: BuildConfig): Entity[] {
    const rval = [];

    for (let e of this._entities) {
      if (config.entities.hasOwnProperty(e.type)) {
        const components = {} as { [key: string]: { [key: string ]: any } };

        for (let f in e.components) {
          if (e.components.hasOwnProperty(f)) {
            const component = e.components[f];

            for (let g in component) {
              if (component.hasOwnProperty(g)) {
                const value = component[g];
                if (!components.hasOwnProperty(f)) {
                  components[f] = {};
                }

                switch (value.type) {
                case "asset":
                  components[f][g] = config.assets.load(value.value);
                  break;
                case "value":
                default:
                  components[f][g] = value.value;
                  break;
                }
              }
            }
          }
        }

        const entity = new config.entities[e.type](components);
        dest.put(entity);
        rval.push(entity);
      }
    }

    return rval;
  }
}

function _set(dest: BuildableEntity, path: string, value: string, type: string) {
  const parts = path.split(".", 2);

  if (parts.length !== 2) {
    throw new Error("invalid path: " + path);
  } else {
    const [ component, key] = parts;

    if (dest.components[component] == null) {
      dest.components[component] = {};
    }

    switch (type) {
      case "color":
        dest.components[component][key] = {
          type: "value",
          value: "#" + value.substr(3, 6),
        };
        break;
      case "bool":
        dest.components[component][key] = {
          type: "value",
          value: (value === "true"),
        };
        break;
      case "file":
        dest.components[component][key] = {
          type: "asset",
          value: value,
        };
        break;
      default:
        try {
          dest.components[component][key] = {
            type: "value",
            value: JSON.parse(value),
          };
        } catch (e) {
          dest.components[component][key] = {
            type: "value",
            value: value,
          };
        }
        break;
    }
  }
}
