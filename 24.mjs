import { readInput, getStraightAdjacentPositions } from "./utils.mjs";

const input = readInput(import.meta);

const getIntersection = ([m, n], [m2, n2]) => {
  const iX = -(n - n2) / (m - m2);
  const iY = m * iX + n;
  return [iX, iY];
};

const solve1 = (input, minAxis, maxAxis) => {
  const equations = [];
  const points = [];
  for (const line of input.split("\n")) {
    const [x, y, z, dx, dy, dz] = line
      .split(" @ ")
      .flatMap((part) => part.split(/,\s+/g).map(Number));

    equations.push([dy / dx, (-dy / dx) * x + y]);
    points.push([x, y, z, dx, dy, dz]);
  }

  let result = 0;
  for (let i = 0; i < equations.length; i++) {
    for (let j = i + 1; j < equations.length; j++) {
      const [iX, iY] = getIntersection(equations[i], equations[j]);
      if (
        iX === Infinity ||
        iY === Infinity ||
        [i, j].some((k) => (points[k][0] - iX) * points[k][3] > 0) || // crossed in past
        [iX, iY].some((axis) => axis < minAxis || axis > maxAxis)
      ) {
        continue;
      }
      result++;
    }
  }
  return result;
};

console.time("p1");
console.timeLog("p1", solve1(input, 200000000000000, 400000000000000));

// p1 28174
