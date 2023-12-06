const input = `Time:        40     81     77     72
Distance:   219   1012   1365   1089`;

const parseInput = (input) => {
  const [times, distances] = input
    .split("\n")
    .map((line) => line.split(":")[1].trim().split(/\s+/).map(Number));
  return [times, distances];
};

const operateQuadratic = (t, d, op) =>
  op(-t, Math.sqrt(Math.pow(t, 2) - 4 * d)) / -2;

const solveQuadratic = (t, d) => [
  operateQuadratic(t, d, (a, b) => a + b),
  operateQuadratic(t, d, (a, b) => a - b),
];

const solve = (ts, ds) => {
  let result = 1;
  for (let i = 0; i < ts.length; i++) {
    const [t, d] = [ts[i], ds[i]];

    const [p1, p2] = solveQuadratic(t, d);
    const nOfSolutions = Math.ceil(p2) - Math.floor(p1) - 1;
    result *= nOfSolutions;
  }
  return result;
};

const solve1 = (input) => {
  const [ts, ds] = parseInput(input);
  return solve(ts, ds);
};

const solve2 = (input) => {
  const [ts, ds] = parseInput(input).map((arr) => [Number(arr.join(""))]);
  return solve(ts, ds);
};

console.log(solve1(input));
console.log(solve2(input));
