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

const getIntersection3d = (
  [x1, y1, z1],
  [x2, y2, z2],
  [dx1, dy1, dz1],
  [dx2, dy2, dz2],
) => {
  // n = s - t
  const eq1 = [x2 - x1, dx1, -dx2];
  const eq2 = [y2 - y1, dy1, -dy2];
  const eq3 = [z2 - z1, dz1, -dz2];

  const fac = -eq2[2] / eq1[2];

  const eq1T = eq1.map((n) => n * fac);

  const res = eq1T.map((n, i) => eq2[i] + n);

  const s = Math.floor(res[0] / res[1]);
  const t1 = Math.floor((eq1[0] - eq1[1] * s) / eq1[2]);
  const t2 = Math.floor((eq2[0] - eq2[1] * s) / eq2[2]);
  const t3 = Math.floor((eq3[0] - eq3[1] * s) / eq3[2]);

  if (t1 !== t2 || t2 !== t3) {
    return undefined;
  }

  const x = x1 + dx1 * s;
  const y = y1 + dy1 * s;
  const z = z1 + dz1 * s;

  const ox = x2 + dx2 * t1;
  const oy = y2 + dy2 * t1;
  const oz = z2 + dz2 * t1;

  if (x !== ox || y !== oy || z !== oz) {
    return undefined;
  }

  return [x, y, z];
};

const solve2 = (input) => {
  const points = [];
  const directions = [];
  for (const line of input.split("\n")) {
    const [x, y, z, dx, dy, dz] = line
      .split(" @ ")
      .flatMap((part) => part.split(/,\s+/g).map(Number));

    points.push([x, y, z]);
    directions.push([dx, dy, dz]);
  }

  const MIN_D = -1000,
    MAX_D = 1000;
  let possibleVelocities = [];

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
              if (!possibleVelocities[k]) {
                pRDList.push(posD);
                continue;
              }
              if (possibleVelocities[k].has(posD)) {
                pRDList.push(posD);
              }
            }
          }
          possibleVelocities[k] = new Set(pRDList);
        }
      }
    }
  }

  const rdx = possibleVelocities[0].keys().next().value;
  const rdy = possibleVelocities[1].keys().next().value;
  const rdz = possibleVelocities[2].keys().next().value;

  const [dx1, dy1, dz1] = directions[0];
  const dirs1 = [dx1 - rdx, dy1 - rdy, dz1 - rdz];
  const [dx2, dy2, dz2] = directions[1];
  const dirs2 = [dx2 - rdx, dy2 - rdy, dz2 - rdz];

  const [x, y, z] = getIntersection3d(points[0], points[1], dirs1, dirs2);

  return x + y + z;
};

console.log("p1", solve1(input, 200000000000000, 400000000000000));
console.log("p2", solve2(input));
