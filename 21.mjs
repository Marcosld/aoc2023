import { readInput, getStraightAdjacentPositions } from "./utils.mjs";

const input = readInput(import.meta);

const isCycling = (arr, cycleLength) => {
  for (let i = 0; i < cycleLength; i++) {
    if (arr[i] !== arr[i + cycleLength]) {
      return false;
    }
  }
  return true;
};

const addToCircular = (arr, el, cycleLength) => {
  arr.push(el);
  if (arr.length > 2 * cycleLength) {
    arr.shift();
  }
};

const solve = (input, targetStep, hasBounds = false) => {
  const lines = input.split("\n");
  const [I, J] = [lines.length, lines[0].length];

  const rocks = new Set();
  let bounds = new Set();
  let lastVisited = new Set();

  for (const [i, line] of lines.entries()) {
    for (const [j, c] of line.split("").entries()) {
      if (c === "#") rocks.add(JSON.stringify([i, j]));
      if (c === "S") {
        bounds.add(JSON.stringify([i, j]));
      }
    }
  }

  const transpose = ([i, j]) => {
    const nI = i % I;
    const nJ = j % J;
    return [nI < 0 ? I + nI : nI, nJ < 0 ? J + nJ : nJ];
  };

  const inBounds = ([i, j]) => i >= 0 && i < I && j >= 0 && j < J;

  const boundPointsVariations = [];
  const diffVariations = [];
  const cycleLength = I;
  let result = 0n;
  let cycleStart;

  let k = 0;
  for (; k < targetStep + 1; k++) {
    const newBounds = new Set();
    const visited = new Set();

    if (k % 2 === targetStep % 2) {
      result += BigInt(bounds.size);
    }

    for (const pointStr of bounds) {
      const [oI, oJ] = JSON.parse(pointStr);

      visited.add(pointStr);

      getStraightAdjacentPositions(oI, oJ)
        .filter(
          ([i, j]) =>
            (!hasBounds || inBounds([i, j])) &&
            !rocks.has(JSON.stringify(transpose([i, j]))) &&
            !lastVisited.has(JSON.stringify([i, j])),
        )
        .forEach(([i, j]) => {
          newBounds.add(JSON.stringify([i, j]));
        });
    }

    const boundPointsVariation = BigInt(newBounds.size - bounds.size);
    const boundPointsVariationDiff = BigInt(
      boundPointsVariation - (boundPointsVariations.at(-cycleLength) ?? 0n),
    );

    addToCircular(boundPointsVariations, boundPointsVariation, cycleLength);
    addToCircular(diffVariations, boundPointsVariationDiff, cycleLength);

    bounds = newBounds;
    lastVisited = visited;

    if (isCycling(diffVariations, cycleLength)) {
      if (!cycleStart) {
        cycleStart = k;
      }
      if (k - cycleStart > cycleStart) {
        // has been cycling for more steps than the step it started cycling (random heuristic xd)
        break;
      }
    } else {
      cycleStart = undefined;
    }
  }

  let boundSize = BigInt(bounds.size);
  let cycleBoundPointVariations = boundPointsVariations.slice(cycleLength);
  let cycleDiffVariations = diffVariations.slice(cycleLength);

  k += 1; // next iteration
  const offset = k % cycleLength;
  for (; k < targetStep + 1; k++) {
    if (k % 2 === targetStep % 2) {
      result += BigInt(boundSize);
    }

    const index = (k - offset) % cycleLength;
    cycleBoundPointVariations[index] += cycleDiffVariations[index];
    boundSize += cycleBoundPointVariations[index];
  }

  return result;
};

console.log(solve(input, 64, true));
console.time("run p2");
console.timeLog("run p2", solve(input, 26501365));
