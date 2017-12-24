export class Store {
  private _store: { [key: string ]: any };

  constructor() {
    this._store = {};
  }

  has(name: string): boolean {
    return this._store.hasOwnProperty(name);
  }

  set(name: string, value: any): void {
    this._store[name] = value;
  }

  unset(name: string): void {
    delete this._store[name];
  }

  get(name: string): any | undefined {
    return this._store[name];
  }
}
