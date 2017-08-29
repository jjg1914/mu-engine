export type Transform = [ number, number, number, number, number, number ];

export function transform(dest: Transform, src: Transform): void;
export function transform(dest: Transform,
                          a: number, b: number, c: number,
                          d: number, e: number, f: number): void;

export function transform(dest: Transform) {
  if (arguments.length === 2) {
    transform(dest, arguments[1][1], arguments[1][2], arguments[1][3],
                    arguments[1][4], arguments[1][5], arguments[1][6]);
  } else {
    // args     dest 
    // a b c    x y z
    // e g f    u v w
    // 0 0 1    0 0 1

    const a = arguments[1] * dest[0] + arguments[2] * dest[3];
    const b = arguments[1] * dest[1] + arguments[2] * dest[4];
    const c = arguments[1] * dest[2] + arguments[2] * dest[5] + arguments[3];
    const d = arguments[4] * dest[0] + arguments[5] * dest[3];
    const e = arguments[4] * dest[1] + arguments[5] * dest[4];
    const f = arguments[4] * dest[2] + arguments[5] * dest[5] + arguments[6];

    // A B C D
    // D (C (B (A I)))

    dest[0] = a;
    dest[1] = b;
    dest[2] = c;
    dest[3] = d;
    dest[4] = e;
    dest[5] = f;
  }
}

export function translate(dest: Transform, x: number, y: number): void {
  transform(dest, 1, 0, x, 0, 1, y);
}

export function scale(dest: Transform, x: number, y: number): void {
  transform(dest, x, 0, 0, 0, y, 0);
}

export function rotate(dest: Transform, r: number): void {
  const sin = Math.sin(r);
  const cos = Math.cos(r);

  transform(dest, cos, -sin, 0, sin, cos, 0);
}

export function identity(dest: Transform): void {
  dest[0] = 1;
  dest[1] = 0;
  dest[2] = 0;
  dest[3] = 0;
  dest[4] = 1;
  dest[5] = 0;
}
