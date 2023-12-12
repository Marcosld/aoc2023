import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const lettersToDigits = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const addNumbers = (numbersPerLine) =>
  numbersPerLine.reduce(
    (acc, numbers) => acc + Number(numbers.at(0) + numbers.at(-1)),
    0,
  );

const solve1 = (input) =>
  addNumbers(input.split("\n").map((line) => [...line.match(/\d/g)]));

const solve2 = (input) => {
  const numbersPerLine = input
    .split("\n")
    .map((line) =>
      [
        ...line.matchAll(
          new RegExp(
            `(?=(\\d|${Object.keys(lettersToDigits).join("|")}))`,
            "g",
          ),
        ),
      ]
        .map((matchAllResult) => matchAllResult.at(1))
        .map((numberOrLetters) =>
          numberOrLetters in lettersToDigits
            ? String(lettersToDigits[numberOrLetters])
            : numberOrLetters,
        ),
    );

  return addNumbers(numbersPerLine);
};

console.log(solve1(input));
console.log(solve2(input));
