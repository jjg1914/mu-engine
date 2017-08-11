export interface Constructor<T> {
  new(...args: any[]): T;
}

export function mixin<T>(mixins: Function[], klass: Constructor<T>)
: Constructor<T> {
  return mixins.reduce((m, v) => v(m), klass);
}
