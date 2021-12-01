import { equals, fromKey, Position, toKey } from "./position";
import { KeyVal } from "./types";

export function dijkstra(start: Position, dest: Position, neighborsFn: (n: Position) => Position[]): number | undefined {
    const nodes = new Set([toKey(start)]);
    const seenNodes = new Set([toKey(start)]);
    const distances = new Map<string, number>();
  
    const minBy = (cb: { (n: string): number; (arg0: string): number; }) => (a: string, b: string) => (cb(b) < cb(a) ? b : a);
    const getDist = (key: string): number => (distances.has(key) ? distances.get(key) as number : Infinity);
  
    distances.set(toKey(start), 0);
  
    while (nodes.size) {
      const closest = [...nodes].reduce(minBy((n:string) => getDist(n)));
      if (dest && closest === toKey(dest)) {
        return distances.get(toKey(dest));
      }
      nodes.delete(closest);
      const neighbors = neighborsFn(fromKey(closest));
      neighbors.forEach((n:Position) => {
        const k:string = toKey(n);
        if (!seenNodes.has(k)) {
          seenNodes.add(k);
          nodes.add(k);
        }
  
        const alt = getDist(closest) + 1;
        if (alt < getDist(k)) {
          distances.set(k, alt);
        }
      });
    }
    return undefined;
  }

export function shortestPath(source:Position, target:Position,  neighborsFn: (n: Position) => Position[]): Position[] | undefined{
  if (equals(source, target)) {
    return [];
  }
  const queue = [ toKey(source) ];
  const visited = new Set([toKey(source)]);
  const predecessor:KeyVal<string> = {};
  let tail = 0;
  while (tail < queue.length) {
    let u = queue[tail++];  // Pop a vertex off the queue.
    const neighbors = neighborsFn(fromKey(u));
    for (let i = 0; i < neighbors.length; ++i) {
      const v = neighbors[i];
      const vKey = toKey(v);
      if (visited.has(vKey)) {
        continue;
      }
      visited.add(vKey);
      if (equals(v, target)) {   // Check if the path is complete.
        const path = [ v ];   // If so, backtrack through the path.
        while (!equals(fromKey(u), source)) {
          path.push(fromKey(u));
          u = predecessor[u];          
        }
        path.push(fromKey(u));
        path.reverse();
        return path;
      }
      predecessor[vKey] = u;
      queue.push(vKey);
    }
  }
  return undefined;
}