import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const tilt = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] === "O") {
        let rI = i;
        while (lines[rI - 1] && lines[rI - 1][j] === ".") {
          rI -= 1;
        }
        lines[i][j] = ".";
        lines[rI][j] = "O";
      }
    }
  }
};

const rotate = (lines) =>
  lines.map((_, i) => lines.map((_, j) => lines[lines.length - 1 - j][i]));

const performCycle = (lines) => {
  for (let n = 0; n < 4; n++) {
    tilt(lines);
    lines = rotate(lines);
  }
  return lines;
};

const addWeights = (lines) => {
  const totalLines = lines.length;
  return lines.reduce(
    (acc, line, i) =>
      acc + line.filter((c) => c === "O").length * (totalLines - i),
    0,
  );
};

const solve1 = (input) => {
  const lines = input.split("\n").map((line) => line.split(""));
  tilt(lines);

  return addWeights(lines);
};

const solve2 = (input) => {
  const CYCLES = 1000000000;
  const hashes = new Map();
  let lines = input.split("\n").map((line) => line.split(""));
  for (let i = 0; i < CYCLES; i++) {
    const key = JSON.stringify(lines);

    lines = performCycle(lines);

    if (hashes.has(key)) {
      const cycleLength = i - hashes.get(key);
      const resultCacheI =
        hashes.size - cycleLength + ((CYCLES - hashes.size) % cycleLength);
      const resultLines = JSON.parse([...hashes.keys()][resultCacheI]);
      return addWeights(resultLines);
    }

    hashes.set(key, i);
  }
};

console.log(solve1(input));
console.log(solve2(input));
