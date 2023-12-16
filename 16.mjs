import fs from "node:fs";

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
  const c = grid[i][j];
  const unreflectedBeam = Beam(i + di, j + dj, di, dj);
  switch (c) {
    case ".": {
      return [unreflectedBeam];
    }
    case "|": {
      if (dj === 0) {
        // from top or bottom
        return [unreflectedBeam];
      }
      // from left or right
      return [reflectBeam([i, j], [1, 0]), reflectBeam([i, j], [-1, 0])];
    }
    case "-": {
      if (di === 0) {
        // from left or right
        return [unreflectedBeam];
      }
      // from top or bottom
      return [reflectBeam([i, j], [0, 1]), reflectBeam([i, j], [0, -1])];
    }
    case "/": {
      return [reflectBeam([i, j], [-dj, -di])];
    }
    case "\\": {
      return [reflectBeam([i, j], [dj, di])];
    }
  }
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

const input = fs.readFileSync("16.in", "utf8");

console.log(solve1(input));
console.log(solve2(input));
