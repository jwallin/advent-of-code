import { fromKey, Position, toKey } from "./position";

export function weightedDijkstraWithDistances(start: Position, dest: Position | undefined, neighborsFn: (n: Position) => [Position, number][]): [number | undefined,  Map<string, number>]{
  const nodes = new Set([toKey(start)]);
  const seenNodes = new Set([toKey(start)]);
  const distances = new Map<string, number>();

  const minBy = (cb: { (n: string): number; (arg0: string): number; }) => (a: string, b: string) => (cb(b) < cb(a) ? b : a);
  const getDist = (key: string): number => (distances.has(key) ? distances.get(key) as number : Infinity);

  distances.set(toKey(start), 0);

  while (nodes.size) {
    const closest = [...nodes].reduce(minBy((n:string) => getDist(n)));
    if (dest && closest === toKey(dest)) {
      return [distances.get(toKey(dest)), distances];
    }
    nodes.delete(closest);
    const neighbors = neighborsFn(fromKey(closest));
    neighbors.forEach(([n, d]) => {
      const k:string = toKey(n);
      if (!seenNodes.has(k)) {
        seenNodes.add(k);
        nodes.add(k);
      }

      const alt = getDist(closest) + d;
      if (alt < getDist(k)) {
        distances.set(k, alt);
      }
    });
  }
  return [undefined, distances];
}

export function weightedDijkstra(start: Position, dest: Position | undefined, neighborsFn: (n: Position) => [Position, number][]): number | undefined { 
  const [d,] = weightedDijkstraWithDistances(start, dest, neighborsFn);
  return d;
}

export function dijkstra(start: Position, dest: Position | undefined, neighborsFn: (n: Position) => Position[]): number | undefined {
  return weightedDijkstra(start, dest, (n) => neighborsFn(n).map(x => [x, 1]));
}

export function dijkstraWithDistances(start: Position, dest: Position | undefined, neighborsFn: (n: Position) => Position[]): [number | undefined,  Map<string, number>] {
  return weightedDijkstraWithDistances(start, dest, (n) => neighborsFn(n).map(x => [x, 1]));
}
