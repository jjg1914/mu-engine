import { Entity } from "../entities/entity";
import { Tileset } from "./tileset";
import { Bounds, Circle, Polygon } from "./shape";
import { RenderData } from "../components/render-component";

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

interface BuildableTileLayer {
  width: number;
  height: number;
  data: number[][];
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

    const stage = (data.map.tileset != null && data.map.tileset.length > 0) ?
      new Stage(width, height, data.map.tileset[0].$.source) :
      new Stage(width, height);

    if (data.map.properties != null) {
      for (let e of data.map.properties) {
        if (e.property != null) {
          for (let f of e.property) {
            stage.prop(f.$.name, _valueForProperty(f.$.type, f.$.value).value);
          }
        }
      }
    }

    if (data.map.layer != null) {
      for (let e of data.map.layer) {
        const width = Number(e.$.width);
        const height = Number(e.$.height);

        let data = "";
        for (let f of e.data ) {
          if (f.hasOwnProperty("_")) {
            data += f._;
          }
        }
        const dataRows = data.trim().split("\n");

        const tiles = new Array(height) as number[][];
        for (let i = 0; i < height; ++i) {
          tiles[i] = new Array(width);
          tiles[i].fill(0);

          if (i < dataRows.length) {
            const row = dataRows[i].split(",");

            for (let j = 0; j < Math.min(row.length, tiles[i].length); ++j) {
              tiles[i][j] = Number(row[j]);
            }
          }
        }

        stage._tiles.push({
          width: width,
          height: height,
          data: tiles,
        });
      }
    }

    if (data.map.objectgroup != null) {
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
    }

    return stage;
  }

  static unserialize(data: any): Stage {
    return Stage.fromTMX(data) ;
  }

  private _width: number;
  private _height: number;
  private _entities: BuildableEntity[];
  private _tiles: BuildableTileLayer[];
  private _tileset?: string | null;
  private _props: { [key: string]: any };

  constructor(width: number, height: number, tileset?: string | null) {
    this._entities = [];
    this._tiles = [];
    this._width = width;
    this._height = height;
    this._tileset = tileset;
    this._props = {};
  }

  prop(name: string): any;
  prop(name: string, value: any): void;

  prop(name: string, value?: any): any | void {
    if (value != null)  {
      this._props[name] = value;
    } else {
      return this._props[name];
    }
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

  buildLayers(config: BuildConfig): RenderData[] {
    const rval = [] as RenderData[];

    if (this._tileset != null) {
      const tileset = config.assets.load(this._tileset) as Tileset;

      for (let e of this._tiles) {
        const layer = document.createElement("canvas");
        layer.width = this._width;
        layer.height = this._height;
        const layerCtx = layer.getContext("2d");

        if (layerCtx == null) {
          throw new Error("Failed to create 2d context");
        }

        tileset.ready(() => {
          for (let j = 0; j < e.data.length; j += 1){
            for (let i = 0; i < e.data[j].length; i += 1){
              tileset.drawTile(layerCtx, e.data[j][i], i, j);
            }
          }
        });

        rval.push({
          image: layer,
          depth: 0,
          transform: [ 1, 0, 0, 0, 1, 0 ],
          children: [],
        });
      }
    }

    return rval;
  }

  buildEntities(config: BuildConfig): Entity[] {
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

    dest.components[component][key] = _valueForProperty(type, value);
  }
}

function _valueForProperty(type: string, value: string): BuildableProperty {
  switch (type) {
    case "color":
      return {
        type: "value",
        value: "#" + value.substr(3, 6),
      };
    case "bool":
      return {
        type: "value",
        value: (value === "true"),
      };
    case "file":
      return {
        type: "asset",
        value: value,
      };
    default:
      try {
        return {
          type: "value",
          value: JSON.parse(value),
        };
      } catch (e) {
        return {
          type: "value",
          value: value,
        };
      }
  }
}
