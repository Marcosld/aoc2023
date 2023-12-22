import { readInput, getStraightAdjacentPositions } from "./utils.mjs";

const input = readInput(import.meta);

const readLines = (input) => {
  const lines = input.split("\n");
  const [I, J] = [lines.length, lines[0].length];

  return { lines, I, J };
};

const solve1 = (input) => {
  const { lines, I, J } = readLines(input);

  const rocks = new Set();
  let positions = new Set();
  let newPositions = new Set();

  for (const [i, line] of lines.entries()) {
    for (const [j, c] of line.split("").entries()) {
      if (c === "#") rocks.add(JSON.stringify([i, j]));
      if (c === "S") positions.add(JSON.stringify([i, j]));
    }
  }

  for (let i = 0; i < 64; i++) {
    for (const pos of positions.keys()) {
      getStraightAdjacentPositions(...JSON.parse(pos))
        .filter(
          ([i, j]) =>
            i >= 0 &&
            j >= 0 &&
            i < I &&
            j < J &&
            !rocks.has(JSON.stringify([i, j])),
        )
        .forEach(([i, j]) => newPositions.add(JSON.stringify([i, j])));
    }
    positions = newPositions;
    newPositions = new Set();
  }

  return positions.size;
};

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

const solve2 = (input, targetStep) => {
  const { lines, I, J } = readLines(input);

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

  let result = [1n, 0n];

  const boundPointsVariations = [];
  const diffVariations = [];

  const cycleLength = I;
  let cycleStart;

  let k = 0;
  for (; k < targetStep; k++) {
    const newBounds = new Set();
    const visited = new Set();
    for (const pointStr of bounds) {
      const [oI, oJ] = JSON.parse(pointStr);

      visited.add(pointStr);

      getStraightAdjacentPositions(oI, oJ)
        .filter(([i, j]) => !rocks.has(JSON.stringify(transpose([i, j]))))
        .forEach(([i, j]) => {
          const key = JSON.stringify([i, j]);
          if (!lastVisited.has(key)) {
            newBounds.add(key);
          }
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
    result[(k + 1) % 2] += BigInt(newBounds.size);

    if (isCycling(diffVariations, cycleLength)) {
      if (!cycleStart) {
        cycleStart = k;
      }
      if (k - cycleStart > cycleStart) {
        // has been cycling for more steps than the step it started cycling (random heuristic xd)
        k += 1;
        break;
      }
    } else {
      cycleStart = undefined;
    }
  }

  let boundSize = BigInt(bounds.size);
  let cycleBoundPointVariations = boundPointsVariations.slice(cycleLength);
  let cycleDiffVariations = diffVariations.slice(cycleLength);

  const offset = k % cycleLength;
  for (; k < targetStep; k++) {
    const index = (k - offset) % cycleLength;
    cycleBoundPointVariations[index] += cycleDiffVariations[index];
    boundSize += cycleBoundPointVariations[index];
    result[(k + 1) % 2] += BigInt(boundSize);
  }

  return result[targetStep % 2];
};

console.log(solve1(input));
console.log(solve2(input, 26501365));
