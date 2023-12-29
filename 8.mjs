import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const parseInput = (input) => {
  const lines = input.split("\n");
  const ins = lines[0];
  const nodes = {};
  for (let i = 2; i < lines.length; i++) {
    const [node, str2] = lines[i].split(" = ");
    const [L, R] = str2.slice(1, -1).split(", ");
    nodes[node] = { L, R };
  }
  return { ins, nodes };
};

const gcd = (a, b) => {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
};

const lcm = (a, b) => {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
};

const solve2 = (input) => {
  const { ins, nodes } = parseInput(input);

  let steps = 0;
  const startingNodes = Object.keys(nodes).filter((name) => name.endsWith("A"));
  const paths = startingNodes.map((node) => [node]);
  const loops = {};

  while (true) {
    const dir = ins[steps % ins.length];
    steps++;
    for (const [i, path] of paths.entries()) {
      const nextNode = nodes[path.at(-1)][dir];
      paths[i].push(nextNode);
      if (nextNode.endsWith("Z")) {
        loops[i] = steps;
      }
      if (Object.keys(loops).length === startingNodes.length) {
        return Object.values(loops).reduce(lcm);
      }
    }
  }
};

console.log(solve2(input));
