import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const solve1 = (input) => {
  const lines = input.split("\n");
  let result = 0;
  for (const line of lines) {
    const [p1, p2nums] = line.split(" | ");
    const p1nums = p1.split(": ").at(1);
    const numsGot = p1nums.trim().split(/\s+/);
    const winningNums = new Set(p2nums.trim().split(/\s+/));

    const winningNumsGot = numsGot.filter((num) => winningNums.has(num));

    if (winningNumsGot.length > 0) {
      result += Math.pow(2, winningNumsGot.length - 1);
    }
  }
  return result;
};

const solve2 = (input) => {
  const lines = input.split("\n");
  const cardQty = Array.from({ length: lines.length }).fill(1);
  for (const [i, line] of lines.entries()) {
    const [p1, p2nums] = line.split(" | ");
    const p1nums = p1.split(": ").at(1);
    const numsGot = p1nums.trim().split(/\s+/);
    const winningNums = new Set(p2nums.trim().split(/\s+/));

    const winningNumsGot = numsGot.filter((num) => winningNums.has(num));

    for (let j = 0; j < winningNumsGot.length; j++) {
      cardQty[i + j + 1] += cardQty[i];
    }
  }
  return cardQty.reduce((acc, num) => acc + num, 0);
};

console.log(solve1(input));
console.log(solve2(input));
