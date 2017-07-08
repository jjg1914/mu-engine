import { Circle, Polygon } from "./shape";

export default class Stage {
  static unserialize(data) {
    return new Stage(data);
  }

  constructor(data) {
    this._data = data;
    this._bounds = {
      left: 0,
      top: 0,
      right: Number(data.map.$.width) * Number(data.map.$.tilewidth),
      bottom: Number(data.map.$.height) * Number(data.map.$.tileheight),
    };
  }

  bounds() {
    return this._bounds;
  }

  build(engine, config) {
    const data = _fromTMX(this._data, config.assets);
    const rval = [];

    for (let e of data.entities) {
      let entity = {};

      for (let f in e) {
        if (e.hasOwnProperty(f)) {
          entity[f] = new config.components[f](e[f]);
        }
      }

      engine.addEntity(entity);

      rval.push(entity);
    }

    return rval;
  }
}

function _fromTMX(tmx, assets) {
  return {
    entities: tmx.map.objectgroup.map((e) => {
      return e.object.map((f) => {
        const entity = {};

        entity.position = {
          x: Number(f.$.x),
          y: Number(f.$.y),
          width: Number(f.$.width),
          height: Number(f.$.height),
        };

        if (f.ellipse) {
          const r = entity.position.width / 2;
          //entity.position.x += r;
          //entity.position.y += r;
          entity.position.mask = new Circle(r, 0, 0);
        }

        if (f.polygon) {
          const points = f.polygon[0].$.points.split(" ").map((e) => {
            return e.split(",", 2).map((e) => Number(e));
          });

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

          entity.position.mask = new Polygon(points.map((e) => {
            return [ e[0] - left, e[1] - top ];
          }));
          entity.position.x += left;
          entity.position.y += top;
          entity.position.width = right - left + 1;
          entity.position.height = bottom - top + 1;
        }

        entity.render = {};

        if (f.properties != null) {
          for (let g of f.properties) {
            if (g.property != null) {
              for (let h of g.property) {
                _set(entity, h.$.name, h.$.value, h.$.type, assets);
              }
            }
          }
        }

        if (f.$.visible != null && Number(f.$.visible) === 0) {
          delete entity.render;
        }

        return entity;
      });
    }).reduce((m, v) => m.concat(v)),
  };
}


function _set(dest, path, value, type, assets) {
  return path.split(".").reduce((m, v, i, c) => {
    const key = v.trim();

    if (i === c.length - 1) {
      switch (type) {
        case "color":
          m[key] = "#" + value.substr(3, 6);
          break;
        case "bool":
          m[key] = (value === "true");
          break;
        case "file":
          m[key] = assets.load(value);
          break;
        default:
          try {
            m[key] = JSON.parse(value);
          } catch (e) {
            m[key] = value;
          }
          break;
      }

      return dest;
    } else {
      if (m[key] == null) {
        m[key] = {};
      }

      return m[key];
    }
  }, dest);
}
