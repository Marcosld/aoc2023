import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const dirs = {
  U: [-1, 0],
  D: [1, 0],
  R: [0, 1],
  L: [0, -1],
};

const isValid = ([p1, p2]) => p2 > p1;

const getIntersected = ([a1, a2], [b1, b2]) => {
  const left = [a1, Math.min(b1, a2)];
  const mid = [Math.max(a1, b1), Math.min(a2, b2)];
  const right = [Math.max(a1, b2), a2];

  return { left, mid, right };
};

const insort = (arr, el, val) => {
  arr.push([el, val]);
  for (let i = arr.length - 1; i > 0 && arr[i][1] < arr[i - 1][1]; i--) {
    let tmp = arr[i];
    arr[i] = arr[i - 1];
    arr[i - 1] = tmp;
  }
  return arr;
};

const getNextPoint = ([i, j], [di, dj], count) => {
  const [rI, rJ] = [i + di * count, j + dj * count];
  return [rI, rJ];
};

const solve = (instructions) => {
  let cursor = [0, 0];
  let area = 0;
  const sortedHSegments = [];
  const vSegmentsByJ = {};

  for (const [dir, count] of instructions) {
    const [i, j] = cursor;
    const [di, dj] = dirs[dir];
    const [rI, rJ] = getNextPoint([i, j], [di, dj], count);

    if (dj) {
      const segment = [Math.min(j, rJ), Math.max(j, rJ)];
      insort(sortedHSegments, segment, i);
    }

    cursor = [rI, rJ];
  }

  // sum area of all rectangles (as they are sorted we can assume a segment will always form a rectangle within bounds with the next segment that intersects)
  while (sortedHSegments.length) {
    const [s1, s1i] = sortedHSegments.shift();

    for (const [i, [s2, s2i]] of sortedHSegments.entries()) {
      const { left: l1, mid, right: r1 } = getIntersected(s1, s2);
      if (isValid(mid)) {
        const { left: l2, right: r2 } = getIntersected(s2, s1);
        area += (s2i - s1i + 1) * (mid[1] - mid[0] + 1); // Rectangle area. There will be overlapping vertical lines of points counted twice
        sortedHSegments.splice(i, 1); // remove intersecting segment
        [l1, r1].forEach((segment) => insort(sortedHSegments, segment, s1i));
        [l2, r2].forEach((segment) => insort(sortedHSegments, segment, s2i));
        // add vertical box bounds to vSegments
        [mid[0], mid[1]].forEach((j) => {
          (vSegmentsByJ[j] ??= []).push([s1i, s2i + 1]);
        });
        break;
      }
    }
  }

  // Remove vertical box bounds counted twice
  for (const segments of Object.values(vSegmentsByJ)) {
    while (segments.length) {
      const s1 = segments.shift();
      for (const [i, s2] of segments.entries()) {
        const { left: l1, mid, right: r1 } = getIntersected(s1, s2);
        if (isValid(mid)) {
          const { left: l2, right: r2 } = getIntersected(s2, s1);
          area -= mid[1] - mid[0];
          segments.splice(i, 1); // remove intersecting segment
          segments.push(l1, r1, l2, r2);
          break;
        }
      }
    }
  }

  return area;
};

const solve1 = (input) => {
  const instructions = input.split("\n").map((line) => line.split(" "));
  return solve(instructions);
};

const solve2 = (input) => {
  const dirNumToDir = {
    0: "R",
    1: "D",
    2: "L",
    3: "U",
  };
  const instructions = input
    .split("\n")
    .map((line) => line.split(" "))
    .map(([, , hexStr]) => {
      const hex = hexStr.slice(2, -1);
      const count = parseInt(hex.slice(0, -1), 16);
      const dirNum = hex.slice(-1);
      return [dirNumToDir[dirNum], count];
    });

  return solve(instructions);
};

console.log(solve1(input));
console.log(solve2(input));
