import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    if (!(key in cache)) {
      cache[key] = fn(...args);
    }
    return cache[key];
  };
};

const getPossibleCombinations = memoize((line, constraints) => {
  if (!line.length) {
    return !constraints.length ? 1 : 0;
  }

  if (!constraints.length) {
    return line.includes("#") ? 0 : 1;
  }

  if (line[0] === "#") {
    const [constraint, ...newConstraints] = constraints;
    const match = line.match(
      new RegExp(`^[#?]{${constraint}}([.?]\\.*(.*)|$)`),
    );
    if (!match) {
      return 0;
    }
    return getPossibleCombinations(match[2] ?? "", newConstraints);
  }

  return (
    getPossibleCombinations("#" + line.slice(1), constraints) +
    getPossibleCombinations(line.replace(/\?[.]*/, ""), constraints)
  );
});

const solve = (input, repeats) => {
  let result = 0;
  for (const inputLine of input.split("\n")) {
    const [p1, p2] = inputLine.split(" ");
    const line = `${p1}?`.repeat(repeats).slice(0, -1).replace(/^\.+/, "");
    const constraints = `${p2},`
      .repeat(repeats)
      .slice(0, -1)
      .split(",")
      .map(Number);

    result += getPossibleCombinations(line, constraints);
  }
  return result;
};

console.log(solve(input, 1));
console.log(solve(input, 5));
