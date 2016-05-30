import IO from "./io";

type Pair<T> = [ number, (t: T) => IO<T> ]

export default function Timeline<T>(timeline: Pair<T>[]): IO<T> {
  return IO.All<T>(timeline.reduce((m: Pair<T>[], v: Pair<T>) => {
    let last = (m.length > 0) ? m[m.length - 1][0] : 0;

    return m.concat([ [ last + v[0], v[1] ] ]);
  }, []).map((e: Pair<T>) => {
    return IO.Delay(e[0]).bind(e[1]);
  }));
}
