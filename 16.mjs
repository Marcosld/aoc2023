import { readInput } from "./utils.mjs";

const Beam = (i, j, di, dj) => [
  [i, j],
  [di, dj],
];

const reflectBeam = ([i, j], [di, dj]) => Beam(i + di, j + dj, di, dj);

const notInBounds = ([i, j], grid) =>
  i < 0 || j < 0 || i >= grid.length || j >= grid[i].length;

const hasBeenSeen = (pos, dir, beamsSeen) =>
  beamsSeen.has(JSON.stringify([pos, dir]));

const addToSeen = (pos, dir, beamsSeen) =>
  beamsSeen.add(JSON.stringify([pos, dir]));

const moveBeam = ([i, j], [di, dj], grid) => {
  if (grid[i][j] === "|" && dj !== 0)
    return [reflectBeam([i, j], [1, 0]), reflectBeam([i, j], [-1, 0])];
  if (grid[i][j] === "-" && di !== 0)
    return [reflectBeam([i, j], [0, 1]), reflectBeam([i, j], [0, -1])];
  if (grid[i][j] === "/") return [reflectBeam([i, j], [-dj, -di])];
  if (grid[i][j] === "\\") return [reflectBeam([i, j], [dj, di])];

  return [Beam(i + di, j + dj, di, dj)];
};

const solve = (input, initialBeam) => {
  const grid = input.split("\n");
  const beamsSeen = new Set();

  const beams = [initialBeam];
  while (beams.length) {
    const [pos, dir] = beams.pop();
    if (notInBounds(pos, grid) || hasBeenSeen(pos, dir, beamsSeen)) {
      continue;
    }
    addToSeen(pos, dir, beamsSeen);
    const beamsAfterStep = moveBeam(pos, dir, grid);
    beams.push(...beamsAfterStep);
  }

  const uniqueSet = new Set();
  for (const strBeam of beamsSeen) {
    const [pos] = JSON.parse(strBeam);
    uniqueSet.add(JSON.stringify(pos));
  }
  return uniqueSet.size;
};

const solve1 = (input) => solve(input, Beam(0, 0, 0, 1));

const solve2 = (input) => {
  const grid = input.split("\n");
  let maxEnergized = 0;
  for (let i = 0; i < grid.length; i++) {
    maxEnergized = Math.max(maxEnergized, solve(input, Beam(i, 0, 0, 1)));
    maxEnergized = Math.max(
      maxEnergized,
      solve(input, Beam(i, grid[i].length - 1, 0, -1)),
    );
  }
  for (let j = 0; j < grid[0].length; j++) {
    maxEnergized = Math.max(maxEnergized, solve(input, Beam(0, j, 1, 0)));
    maxEnergized = Math.max(
      maxEnergized,
      solve(input, Beam(grid.length - 1, j, -1, 0)),
    );
  }
  return maxEnergized;
};

const input = readInput(import.meta);

console.log(solve1(input));
console.log(solve2(input));
