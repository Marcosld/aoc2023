import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const findGalaxies = (grid, expansionFactor) => {
  const galaxies = [];
  let iOffset = 0;
  for (let i = 0; i < grid.length; i++) {
    if (grid[i].every((c) => c === ".")) {
      iOffset += expansionFactor - 1;
    }

    let jOffset = 0;
    for (let j = 0; j < grid[i].length; j++) {
      if (grid.every((row) => row[j] === ".")) {
        jOffset += expansionFactor - 1;
      }

      if (grid[i][j] === "#") {
        galaxies.push([i + iOffset, j + jOffset]);
      }
    }
  }
  return galaxies;
};

const mDis = ([i, j], [ii, jj]) => Math.abs(i - ii) + Math.abs(j - jj);

const solve = (input, expansionFactor) => {
  const grid = input.split("\n").map((line) => line.split(""));

  const galaxies = findGalaxies(grid, expansionFactor);

  let result = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i; j < galaxies.length; j++) {
      result += mDis(galaxies[i], galaxies[j]);
    }
  }

  return result;
};

const solve1 = (input) => solve(input, 2);

const solve2 = (input) => solve(input, 1000000);

console.log(solve1(input));
console.log(solve2(input));
