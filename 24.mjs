import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const parseInput = (input) => {
  const points = [];
  const directions = [];

  for (const line of input.split("\n")) {
    const [x, y, z, dx, dy, dz] = line
      .split(" @ ")
      .flatMap((part) => part.split(/,\s+/g).map(Number));

    points.push([x, y, z]);
    directions.push([dx, dy, dz]);
  }

  return { points, directions };
};

const getIntersection = ([m, n], [m2, n2]) => {
  const iX = -(n - n2) / (m - m2);
  const iY = m * iX + n;
  return [iX, iY];
};

const solve1 = (input, minAxis, maxAxis) => {
  const { points, directions } = parseInput(input);
  const equations = directions.map(([dx, dy], i) => {
    const m = dy / dx;
    return [m, -m * points[i][0] + points[i][1]];
  });

  let result = 0;
  for (let i = 0; i < equations.length; i++) {
    for (let j = i + 1; j < equations.length; j++) {
      const [iX, iY] = getIntersection(equations[i], equations[j]);
      if (
        iX === Infinity ||
        iY === Infinity ||
        [i, j].some((k) => (points[k][0] - iX) * directions[k][0] > 0) || // crossed in past (what is important is signs)
        [iX, iY].some((axis) => axis < minAxis || axis > maxAxis)
      ) {
        continue;
      }
      result++;
    }
  }
  return result;
};

const getIntersection3d = (p1, p2, d1, d2) => {
  // n = s - t
  const [eq1, eq2, eq3] = [0, 1, 2].map((i) => [p2[i] - p1[i], d1[i], -d2[i]]);

  const fac = -eq2[2] / eq1[2];

  const eq1T = eq1.map((n) => n * fac);

  const res = eq1T.map((n, i) => eq2[i] + n);

  const s = Math.floor(res[0] / res[1]);
  const [t1, t2, t3] = [eq1, eq2, eq3].map((eq) =>
    Math.floor((eq[0] - eq[1] * s) / eq[2]),
  );

  if (t1 !== t2 || t2 !== t3) {
    return undefined;
  }

  const [iX1, iY1, iZ1] = p1.map((n, i) => n + d1[i] * s);
  const [iX2, iY2, iZ2] = p2.map((n, i) => n + d2[i] * t1);

  if (iX1 !== iX2 || iY1 !== iY2 || iZ1 !== iZ2) {
    return undefined;
  }

  return [iX1, iY1, iZ1];
};

const solve2 = (input) => {
  const { directions, points } = parseInput(input);

  const MIN_D = -1000,
    MAX_D = 1000;
  let possibleDs = [];

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      for (let k = 0; k < 3; k++) {
        const x1 = points[i][k];
        const x2 = points[j][k];
        const dx1 = directions[i][k];
        const dx2 = directions[j][k];
        if (dx1 === dx2) {
          const xDiff = x2 - x1;
          const pRDList = [];
          for (let posD = MIN_D; posD < MAX_D; posD++) {
            if (xDiff % (posD - dx1) === 0) {
              if (!possibleDs[k]) {
                pRDList.push(posD);
                continue;
              }
              if (possibleDs[k].has(posD)) {
                pRDList.push(posD);
              }
            }
          }
          possibleDs[k] = new Set(pRDList);
        }
      }
    }
  }

  const [rdx, rdy, rdz] = [0, 1, 2].map(
    (i) => possibleDs[i].keys().next().value,
  );

  const [dx1, dy1, dz1] = directions[0];
  const dirs1 = [dx1 - rdx, dy1 - rdy, dz1 - rdz];
  const [dx2, dy2, dz2] = directions[1];
  const dirs2 = [dx2 - rdx, dy2 - rdy, dz2 - rdz];

  const [x, y, z] = getIntersection3d(points[0], points[1], dirs1, dirs2);

  return x + y + z;
};

console.log("p1", solve1(input, 200000000000000, 400000000000000));
console.log("p2", solve2(input));
