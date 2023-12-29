import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const calcNextVal = (sequence, isP2) => {
  let lastVal = sequence[0];
  const nextSeq = [];
  for (const val of sequence.slice(1)) {
    nextSeq.push(val - lastVal);
    lastVal = val;
  }
  if (nextSeq.every((val) => val === 0)) {
    return isP2 ? sequence.at(0) : sequence.at(-1);
  }
  return isP2
    ? sequence.at(0) - calcNextVal(nextSeq, isP2)
    : sequence.at(-1) + calcNextVal(nextSeq, isP2);
};

const solve = (input, isP2 = false) => {
  let result = 0;
  for (const line of input.split("\n")) {
    result += calcNextVal(line.split(" ").map(Number), isP2);
  }
  return result;
};

const solve1 = (input) => solve(input);
const solve2 = (input) => solve(input, true);

console.log(solve1(input));
console.log(solve2(input));
