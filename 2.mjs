import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const goal = {
  red: 12,
  green: 13,
  blue: 14,
};

const colors = ["red", "green", "blue"];

const isValidSubset = (subset) =>
  colors.every((color) => goal[color] >= (subset[color] || 0));

const isValidGame = (game) => game.every(isValidSubset);

const parseInput = (input) =>
  input
    .split("\n")
    .map((line) => line.split(": ")[1])
    .map((line) =>
      line.split("; ").map((subset) =>
        [...subset.matchAll(/(\d+) (blue|red|green)/g)].reduce(
          (subsetObj, [, numString, color]) => ({
            ...subsetObj,
            [color]: +numString,
          }),
          {},
        ),
      ),
    );

const solve1 = (input) => {
  const games = parseInput(input);

  return games.reduce(
    (acc, game, i) => (isValidGame(game) ? acc + i + 1 : acc),
    0,
  );
};

const solve2 = (input) => {
  const games = parseInput(input);
  const maxesByGame = games.map((game) =>
    game.reduce(
      (maxesByColor, subset) => ({
        red: Math.max(subset.red ?? 0, maxesByColor.red),
        green: Math.max(subset.green ?? 0, maxesByColor.green),
        blue: Math.max(subset.blue ?? 0, maxesByColor.blue),
      }),
      {
        red: 0,
        green: 0,
        blue: 0,
      },
    ),
  );

  return maxesByGame.reduce(
    (result, game) =>
      result + Object.values(game).reduce((acc, val) => acc * val, 1),
    0,
  );
};

console.log(solve1(input));
console.log(solve2(input));
