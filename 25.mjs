import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const find = (subsets, key) => {
  if (subsets[key].p === key) {
    return key;
  }
  return (subsets[key].p = find(subsets, subsets[key].p));
};

const union = (subsets, k1, k2) => {
  const [p1, p2] = [k1, k2].map((k) => find(subsets, k));
  const s1 = subsets[p1];
  const s2 = subsets[p2];

  if (s1.r > s2.r) {
    s2.p = p1;
    s1.c += s2.c;
    s2.c = 0;
  }
  if (s1.r <= s2.r) {
    s1.p = p2;
    s2.c += s1.c;
    s1.c = 0;
  }
  if (s1.r === s2.r) {
    s1.r++;
  }
};

const applyKarger = (edges, nodes) => {
  let N = nodes.size;

  const subsets = Object.fromEntries(
    [...nodes.entries()].map(([k, v]) => [k, { p: v, r: 0, c: 1 }]),
  );

  while (N > 2) {
    const i = Math.floor(Math.random() * edges.length);

    const [s1, s2] = edges[i].map((n) => find(subsets, n));

    if (s1 === s2) {
      continue;
    }

    N--;
    union(subsets, s1, s2);
  }

  let cutEdgesCount = 0;
  const parents = new Set();

  for (const edge of edges) {
    const [p1, p2] = edge.map((n) => find(subsets, n));
    if (p1 !== p2) {
      cutEdgesCount++;
      parents.add(p1);
      parents.add(p2);
    }
  }
  if (cutEdgesCount === 3) {
    return [...parents].reduce((acc, p) => acc * subsets[p].c, 1);
  }
};

const solve1Karger = (input) => {
  const edges = [];
  let nodes = new Set();

  for (let line of input.split("\n")) {
    const [n1s, n2s] = line.split(": ").map((part) => part.split(" "));
    nodes.add(n1s[0]);
    for (const n2 of n2s) {
      edges.push([n1s[0], n2]);
      nodes.add(n2);
    }
  }

  while (true) {
    const result = applyKarger(edges, nodes);
    if (result) {
      return result;
    }
  }
};

console.time("solve1Karger");
console.timeLog("solve1Karger", solve1Karger(input));
