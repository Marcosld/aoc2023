import { getAdjacentPositions, readInput } from "./utils.mjs";

const input = readInput(import.meta);

const parseInput = (input) => input.split("\n");

const isSymbol = (char) => !/\d|\./.test(char);

const isNumber = (char) => /\d/.test(char);

const getNumberPositions = (lines, i, j, dir = "rl") => {
  if (
    i < 0 ||
    j < 0 ||
    i > lines[0].length ||
    j > lines.length ||
    !isNumber(lines[i][j])
  ) {
    return [];
  }
  if (dir === "rl") {
    return [
      ...getNumberPositions(lines, i, j - 1, "l"),
      [i, j],
      ...getNumberPositions(lines, i, j + 1, "r"),
    ];
  }
  if (dir === "r") {
    return [[i, j], ...getNumberPositions(lines, i, j + 1, "r")];
  }

  return [...getNumberPositions(lines, i, j - 1, "l"), [i, j]];
};

const hashNumberPositions = (arrayIj) =>
  arrayIj.map((ij) => ij.join(",")).join(";");

const getNumber = (lines, hashedNumberPositions) =>
  +hashedNumberPositions
    .split(";")
    .reduce(
      (numStr, ij) => numStr + lines[ij.split(",")[0]][ij.split(",")[1]],
      "",
    );

const solve1 = (input) => {
  const lines = parseInput(input);
  const symbolAdjacentPositions = [];
  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (isSymbol(lines[i][j])) {
        symbolAdjacentPositions.push(...getAdjacentPositions(i, j));
      }
    }
  }

  const uniqueNumberPositions = new Set();
  for (const [i, j] of symbolAdjacentPositions) {
    const numberPositions = getNumberPositions(lines, i, j);
    if (numberPositions.length) {
      uniqueNumberPositions.add(hashNumberPositions(numberPositions));
    }
  }

  return [...uniqueNumberPositions].reduce(
    (acc, hashedNumberPositions) =>
      acc + getNumber(lines, hashedNumberPositions),
    0,
  );
};

const couldBeGear = (char) => char === "*";

const solve2 = (input) => {
  const lines = parseInput(input);

  let result = 0;

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (couldBeGear(lines[i][j])) {
        const adjacentPositions = getAdjacentPositions(i, j);

        const uniqueNumberPositions = new Set();
        for (const [i, j] of adjacentPositions) {
          const numberPositions = getNumberPositions(lines, i, j);
          if (numberPositions.length) {
            uniqueNumberPositions.add(hashNumberPositions(numberPositions));
          }
        }
        if (uniqueNumberPositions.size >= 2) {
          result += [...uniqueNumberPositions].reduce(
            (acc, hashedNumberPositions) =>
              acc * getNumber(lines, hashedNumberPositions),
            1,
          );
        }
      }
    }
  }

  return result;
};

console.log(solve1(input));
console.log(solve2(input));
