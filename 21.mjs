import { readInput, getStraightAdjacentPositions } from "./utils.mjs";

const input = readInput(import.meta);

const solve1 = (input) => {
  const lines = input.split("\n");
  const [I, J] = [lines.length, lines[0].length];

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

const solve2 = (input) => {
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

  let maxI = I - 1,
    minI = 0,
    minJ = 0,
    maxJ = J - 1;

  const transpose = ([i, j]) => {
    const nI = i % I;
    const nJ = j % J;
    return [nI < 0 ? I + nI : nI, nJ < 0 ? J + nJ : nJ];
  };

  const printGrid = () => {
    for (let i = minI; i < maxI + 1; i++) {
      let line = "";
      for (let j = minJ; j < maxJ + 1; j++) {
        const key = JSON.stringify([i, j]);
        const transposedKey = JSON.stringify(transpose([i, j]));
        const c = bounds.has(key) ? "x" : rocks.has(transposedKey) ? "#" : ".";
        line += c;
      }
      console.log(line);
    }
  };

  let result = [1n, 0n];

  const lastPointVariations = [];
  const lastDiffVariations = [];

  const cycleLength = I;

  console.time("start");
  // full for example = 39 / 42
  // full for input = 7450 / 7421
  let k = 0;
  for (; k < 1477; k++) {
    // 270
    // cycle ends at 139
    // console.log(`k: ${k}`);
    // printGrid();
    // if (k % 1000 === 0) {
    //   console.timeLog("start", `k: ${k}, bounds size: ${bounds.size}`);
    // }
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

          minI = Math.min(oI, minI);
          minJ = Math.min(oJ, minJ);
          maxI = Math.max(maxI, oI);
          maxJ = Math.max(maxJ, oJ);
        });
    }
    const pointVariation = BigInt(newBounds.size - bounds.size);
    const diffVariation = lastPointVariations.at(-cycleLength)
      ? BigInt(pointVariation - lastPointVariations.at(-cycleLength))
      : 0n;

    lastPointVariations.push(pointVariation);
    if (lastPointVariations.length > cycleLength) {
      lastPointVariations.shift();
    }

    lastDiffVariations.push(diffVariation);
    if (lastDiffVariations.length > cycleLength) {
      lastDiffVariations.shift();
    }

    // console.log(`Diff to last ${cycleLength}th point variation`, diffVariation);
    // console.log(`Point variation: ${pointVariation}`);
    bounds = newBounds;
    lastVisited = visited;
    result[(k + 1) % 2] += BigInt(newBounds.size);
    // console.log(`k: ${k}, result: ${result}`);
  }

  // k = 264
  let boundSize = BigInt(bounds.size);
  for (; k < 26501365; k++) {
    const index = (k - 36) % cycleLength;
    lastPointVariations[index] += lastDiffVariations[index];
    boundSize += lastPointVariations[index];
    result[(k + 1) % 2] += BigInt(boundSize);
    // console.log(`k: ${k}, result: ${result}`);
  }
  // console.log(lastPointVariations);
  // console.log(JSON.stringify(lastDiffVariations));
  // console.log(k);

  // console.log(bounds.size);

  return result;
};

// console.log(solve1(input));
console.log(solve2(input));

// steps: 26501365
