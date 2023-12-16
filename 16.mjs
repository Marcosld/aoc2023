import { readInput } from "./utils.mjs";

const notInBounds = ([i, j], grid) =>
  i < 0 || j < 0 || i >= grid.length || j >= grid[i].length;

const moveBeam = ([i, j, di, dj], grid) => {
  const advanceBeam = ([di, dj]) => [i + di, j + dj, di, dj];

  if (grid[i][j] === "|" && dj !== 0)
    return [advanceBeam([1, 0]), advanceBeam([-1, 0])];
  if (grid[i][j] === "-" && di !== 0)
    return [advanceBeam([0, 1]), advanceBeam([0, -1])];
  if (grid[i][j] === "/") return [advanceBeam([-dj, -di])];
  if (grid[i][j] === "\\") return [advanceBeam([dj, di])];

  return [advanceBeam([di, dj])];
};

const solve = (input, initialBeam) => {
  const grid = input.split("\n");
  const seen = new Set();

  const beams = [initialBeam];
  while (beams.length) {
    const beam = beams.pop();
    if (notInBounds(beam, grid) || seen.has(JSON.stringify(beam))) {
      continue;
    }
    seen.add(JSON.stringify(beam));
    const beamsAfterStep = moveBeam(beam, grid);
    beams.push(...beamsAfterStep);
  }

  return new Set(
    [...seen.keys()].map((str) => JSON.parse(str).slice(0, 2).toString()),
  ).size;
};

const solve1 = (input) => solve(input, [0, 0, 0, 1]);

const solve2 = (input) => {
  const grid = input.split("\n");
  // as it is a squared grid
  return Math.max(
    ...grid.flatMap((_, i) => [
      solve(input, [i, 0, 0, 1]),
      solve(input, [i, grid[i].length - 1, 0, -1]),
      solve(input, [0, i, 1, 0]),
      solve(input, [grid.length - 1, i, -1, 0]),
    ]),
  );
};

const input = readInput(import.meta);

console.log(solve1(input));
console.log(solve2(input));
