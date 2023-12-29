import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const parseInput = (input) => {
  const lines = input.split("\n");
  const seeds = lines[0].split(" ").map(Number).filter(Boolean);
  const transformations = [];
  let transformation = [];
  for (const line of lines.slice(1).filter(Boolean)) {
    if (!/\d/.test(line[0])) {
      if (transformation.length) {
        transformations.push(transformation);
        transformation = [];
      }
      continue;
    }
    const [dest, source, range] = line.trim().split(/\s+/).map(Number);
    transformation.push({
      source: [source, source + range],
      offset: dest - source,
    });
  }
  transformations.push(transformation);
  return { seeds, transformations };
};

const transform = (num, transformation) => {
  for (const {
    source: [min, max],
    offset,
  } of transformation) {
    if (num >= min && num < max) {
      return num + offset;
    }
  }

  return num;
};

const solve1 = (input) => {
  const { seeds, transformations } = parseInput(input);
  let numsIn = new Set(seeds);
  let numsOut = new Set();
  for (const transformation of transformations) {
    for (const num of numsIn) {
      numsOut.add(transform(num, transformation));
    }
    numsIn = numsOut;
    numsOut = new Set();
  }
  return Math.min(...numsIn);
};

const isValid = ([p1, p2]) => p2 > p1;

const getIntersected = ([a1, a2], [b1, b2]) => {
  const left = [a1, Math.min(b1, a2)];
  const mid = [Math.max(a1, b1), Math.min(a2, b2)];
  const right = [Math.max(a1, b2), a2];

  return { left, mid, right };
};

const applyTransformation = (segments, transformation) => {
  const transformed = [];
  let untransformed = segments.slice();
  for (const { source: s2, offset } of transformation) {
    const nextUntransformed = [];
    while (untransformed.length) {
      const s1 = untransformed.pop();

      const { left, mid, right } = getIntersected(s1, s2);
      if (isValid(left)) {
        nextUntransformed.push(left);
      }
      if (isValid(mid)) {
        transformed.push([mid[0] + offset, mid[1] + offset]);
      }
      if (isValid(right)) {
        nextUntransformed.push(right);
      }
    }
    untransformed = nextUntransformed;
  }
  return transformed.concat(untransformed);
};

const solve2 = (input) => {
  const { seeds, transformations } = parseInput(input);
  let segments = [];
  for (let i = 0; i < seeds.length; i += 2) {
    segments.push([seeds[i], seeds[i] + seeds[i + 1]]);
  }
  for (const transformation of transformations) {
    segments = applyTransformation(segments, transformation);
  }
  return Math.min(...segments.map((seg) => seg[0]));
};

console.log(solve1(input));
console.log(solve2(input));
