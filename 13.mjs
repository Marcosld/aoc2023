import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const rotate = (pattern) =>
  pattern[0].split("").map((_, j) => pattern.map((line) => line[j]).join(""));

const reflects = (pattern, i, j, toFix) => {
  if (i < 0 || j >= pattern.length || toFix < 0) {
    return toFix === 0;
  }

  const differing = pattern[i]
    .split("")
    .filter((c, k) => c !== pattern[j][k]).length;

  return reflects(pattern, i - 1, j + 1, toFix - differing);
};

const getMirrorValue = (pattern, toFix) => {
  for (let i = 0; i < pattern.length - 1; i++) {
    if (reflects(pattern, i, i + 1, toFix)) {
      return (i + 1) * 100;
    }
  }

  const rotatedPattern = rotate(pattern);

  for (let i = 0; i < rotatedPattern.length - 1; i++) {
    if (reflects(rotatedPattern, i, i + 1, toFix)) {
      return i + 1;
    }
  }

  throw Error(`Unreflected pattern ${JSON.stringify(pattern)}`);
};

const solve = (input, toFix) => {
  let nextPattern = [];
  let result = 0;
  for (const line of input.split("\n").concat("")) {
    if (!line.length) {
      result += getMirrorValue(nextPattern, toFix);
      nextPattern = [];
      continue;
    }
    nextPattern.push(line);
  }
  return result;
};

console.log(solve(input, 0));
console.log(solve(input, 1));
