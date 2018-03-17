import { Entity } from "../entities/entity";
import { Bounds, Circle, Polygon } from "./shape";

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

export interface BuildableTileLayer {
  width: number;
  height: number;
  data: number[][];
}

export interface BuildConfig {
  assets: { load(asset: string): any };
}

export interface StageTMXProperty {
  "#name": "property";
  $: {
    name: string;
    type: string;
    value: string;
  };
}

export interface StageTMXProperties {
  "#name": "properties";
  $$?: StageTMXProperty[];
}

export interface StageTMXTileset {
  "#name": "tileset";
  $: { source: string };
}

export interface StageTMXLayerData {
  "#name": "data";
  $: { encoding: string };
  _?: string;
}

export interface StageTMXLayer {
  "#name": "layer";
  $: {
    width: string;
    height: string;
  };
  $$: [ StageTMXLayerData ];
}

export interface StageTMXImage {
  "#name": "image";
  $: {
    source: string;
    width: string;
    height: string;
  };
}

export interface StageTMXImageLayer {
  "#name": "imagelayer";
  $$: [ StageTMXImage ];
}

export interface StageTMXEllipse {
  "#name": "ellipse";
}

export interface StageTMXPolygon {
  "#name": "polygon";
  $: { points: string };
}

export type StageTMXObjectChild = StageTMXProperties |
                                  StageTMXPolygon |
                                  StageTMXEllipse ;

export interface  StageTMXObject {
  "#name": "object";
  $: {
    type?: string;
    x: string;
    y: string;
    width: string;
    height: string;
    visible?: string;
  };
  $$?: StageTMXObjectChild[];
}

export interface StageTMXObjectGroup {
  "#name": "objectgroup";
  $$?: StageTMXObject[];
}

export type StageTMXChild = StageTMXProperties |
                            StageTMXImageLayer |
                            StageTMXObjectGroup |
                            StageTMXTileset |
                            StageTMXLayer;

export interface StageTMX {
  "#name": "map";
  $: {
    width: string;
    height: string;
    tilewidth: string;
    tileheight: string;
  };
  $$?: StageTMXChild[];
}

export class Stage {
  private _width: number;
  private _height: number;
  private _entities: BuildableEntity[];
  private _props: { [key: string]: any };

  constructor(width: number, height: number) {
    this._entities = [];
    this._width = width;
    this._height = height;
    this._props = {};
  }

  static fromTMX(map: StageTMX): Stage {
    const width = Number(map.$.width) * Number(map.$.tilewidth);
    const height = Number(map.$.height) * Number(map.$.tileheight);

    const stage = new Stage(width, height);

    if (map.$$ !== undefined) {
      for (let i = 0; i < map.$$.length; i += 1) {
        const e = map.$$[i];

        if (_isTMXTileset(e)) {
          _fromTMXTileset(stage, e);
        } else if (_isTMXProperties(e)) {
          _fromTMXProperties(stage, e);
        } else if (_isTMXImageLayer(e)) {
          _fromTMXImageLayer(stage, e);
        } else if (_isTMXLayer(e)) {
          _fromTMXLayer(stage, e);
        } else if (_isTMXObjectGroup(e)) {
          _fromTMXObjectGroup(stage, e);
        }
      }
    }

    return stage;
  }

  static unserialize(data: any): Stage {
    return Stage.fromTMX(data.map) ;
  }

  prop(name: string): any;
  prop(name: string, value: any): void;

  prop(name: string, value?: any): any | void {
    if (value !== undefined) {
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

  buildEntities(config: BuildConfig): Entity[] {
    const rval = [];

    for (let e of this._entities) {
      const ctor = config.assets.load(e.type + "-entity");

      if (ctor !== undefined) {
        const components = {} as {
          [key: string]: { [key: string ]: any } | undefined
        };

        if (e.type === "tileset") {
          components.position = {
            width: this._width,
            height: this._height,
          };

          components.tileset = {
            tileset: this.prop("tileset") || "",
            assets: config.assets, 
          };
        }

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

  addEntity(entity: BuildableEntity): void {
    this._entities.push(entity);
  }
}

function _set(dest: BuildableEntity,
              path: string,
              value: string,
              type: string) {
  const parts = path.split(".", 2);

  if (parts.length !== 2) {
    throw new Error("invalid path: " + path);
  } else {
    const [ component, key] = parts;

    if (dest.components.hasOwnProperty(component)) {
      const destComponent = dest.components[component];
      destComponent[key] = _valueForProperty(type, value);
    } else {
      dest.components[component] = {
        [key]: _valueForProperty(type, value),
      };
    }
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
        value: (value.split("/").reverse()[0]),
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

function _isTMXProperties (e: StageTMXChild | StageTMXObjectChild)
: e is StageTMXProperties {
  return e["#name"] === "properties";
}

function _isTMXPolygon(e: StageTMXObjectChild): e is StageTMXPolygon {
  return e["#name"] === "polygon";
}

function _isTMXEllipse(e: StageTMXObjectChild): e is StageTMXEllipse{
  return e["#name"] === "ellipse";
}

function _isTMXImageLayer(e: StageTMXChild): e is StageTMXImageLayer {
  return e["#name"] === "imagelayer";
}

function _isTMXObjectGroup(e: StageTMXChild): e is StageTMXObjectGroup {
  return e["#name"] === "objectgroup";
}

function _isTMXTileset(e: StageTMXChild): e is StageTMXTileset {
  return e["#name"] === "tileset";
}

function _isTMXLayer(e: StageTMXChild): e is StageTMXLayer {
  return e["#name"] === "layer";
}

function _fromTMXTileset(stage: Stage, tileset: StageTMXTileset): void {
  stage.prop("tileset", tileset.$.source.split("/").reverse()[0]);
}

function _fromTMXProperties(stage: Stage, props: StageTMXProperties): void {
  if (props.$$ !== undefined) {
    for (let i = 0; i < props.$$.length; i += 1) {
      const e = props.$$[i];

      stage.prop(e.$.name, _valueForProperty(e.$.type, e.$.value).value);
    }
  }
}

function _fromTMXImageLayer(stage: Stage, layer: StageTMXImageLayer): void {
  stage.addEntity({
    type: "background",
    components: {
      position: {
        x: { type: "value", value: 0 },
        y: { type: "value", value: 0 },
        width: { type: "value", value: Number(layer.$$[0].$.width) },
        height: { type: "value", value: Number(layer.$$[0].$.height) },
      },
      render: {
        image: {
          type: "asset",
          value: layer.$$[0].$.source.split("/").reverse()[0],
        },
      },
    },
  });
}

function _fromTMXLayer(stage: Stage, layer: StageTMXLayer): void {
  const width = Number(layer.$.width);
  const height = Number(layer.$.height);

  const data = layer.$$[0]._
  const dataRows = data !== undefined ? data.trim().split("\n") : [];

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

  stage.addEntity({
    type: "tileset",
    components: {
      tileset: {
        data: {
          type: "value",
          value: tiles,
        },
      },
    },
  });
}

function _fromTMXObjectGroup(stage: Stage, group: StageTMXObjectGroup): void {
  if (group.$$ !== undefined) {
    for (let i = 0; i < group.$$.length; i += 1) {
      const e = group.$$[i];

      const entity = {
        type: (e.$.type !== undefined ? e.$.type : "default"),
        components: {},
      } as BuildableEntity;

      entity.components.position = {
        x: { value: Number(e.$.x), type: "value" },
        y: { value: Number(e.$.y), type: "value" },
        width: { value: Number(e.$.width), type: "value" },
        height: { value: Number(e.$.height), type: "value" },
      };

      entity.components.render = {
        visible: {
          value: (e.$.visible === undefined || Number(e.$.visible) !== 0),
          type: "value",
        },
      };

      if (e.$$ !== undefined) {
        for (let j = 0; j < e.$$.length; j += 1) {
          const f = e.$$[j];

          if (_isTMXProperties(f)) {
            _fromTMXObjectProperties(entity, f);
          } else if (_isTMXEllipse(f)) {
            entity.components.position.mask = _ellipseForTMX(e);
          } else if (_isTMXPolygon(f)) {
            const mask = _polygonForTMX(f);
            const bounds = mask.value.bounds();

            entity.components.position.x.value += bounds.left;
            entity.components.position.y.value += bounds.top;
            entity.components.position.width.value =
              bounds.right - bounds.left + 1;
            entity.components.position.height.value =
              bounds.bottom - bounds.top + 1;

            mask.value.translate(-bounds.left, -bounds.top);

            entity.components.position.mask = mask;
          }
        }
      }

      stage.addEntity(entity);
    }
  }
}

function _fromTMXObjectProperties(object: BuildableEntity,
                                  props: StageTMXProperties)
: void {
  if (props.$$ !== undefined) {
    for (let i = 0; i < props.$$.length; i += 1) {
      const e = props.$$[i];

      _set(object, e.$.name, e.$.value, e.$.type);
    }
  }
}

function _ellipseForTMX(object: StageTMXObject): BuildableProperty {
  const r = Number(object.$.width) / 2;
  return {
    value: new Circle(r, 0, 0),
    type: "value",
  };
}

function _polygonForTMX(polygon: StageTMXPolygon)
: BuildableProperty {
  const pairs = polygon.$.points.split(" ");
  const points = pairs.map((e: string) => {
    return e.split(",", 2).map((e) => Number(e));
  }) as ([ number, number ])[];

  return {
    type: "value",
    value: new Polygon(points.map((e) => {
      return [ e[0], e[1] ] as [ number, number ];
    })),
  };
}
