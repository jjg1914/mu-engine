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
