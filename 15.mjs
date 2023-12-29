import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const hashStr = (str) => {
  let hashed = 0;
  while (str.length) {
    hashed += str.charCodeAt(0);
    hashed *= 17;
    hashed %= 256;
    str = str.slice(1);
  }
  return hashed;
};

const solve1 = (input) =>
  input.split(",").reduce((acc, str) => acc + hashStr(str), 0);

const solve2 = (input) => {
  const boxes = new Map();
  const instructions = input.split(",");
  for (const ins of instructions) {
    const [label, value] = ins.split(/[=-]/);
    const box = hashStr(label);
    boxes.set(box, boxes.get(box) ?? new Map());
    if (value) {
      boxes.get(box).set(label, Number(value));
    } else {
      boxes.get(box).delete(label);
    }
  }
  let result = 0;
  for (const [i, box] of boxes.entries()) {
    for (const [j, power] of [...box.values()].entries()) {
      result += (i + 1) * (j + 1) * power;
    }
  }
  return result;
};

console.log(solve1(input));
console.log(solve2(input));
