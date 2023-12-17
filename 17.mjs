import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const estimateScoreLeft = ([i, j, , , straightCount], minStraight, I, J) => {
  const mDis = Math.abs(I - 1 - i) + Math.abs(J - 1 - j);
  return straightCount >= minStraight
    ? mDis
    : mDis + straightCount - minStraight;
};

const turn90 = ([i, j, di]) =>
  [1, -1].map((newD) => (di ? [i, j, 0, newD, 0] : [i, j, newD, 0, 0]));

const advance = ([i, j, di, dj, straightCount]) => [
  i + di,
  j + dj,
  di,
  dj,
  straightCount + 1,
];

const inBounds = ([i, j], I, J) => i >= 0 && j >= 0 && i < I && j < J;

const getNeighbours = (node1, maxStraight, minStraight, I, J) =>
  [node1]
    .concat(node1[4] >= minStraight ? turn90(node1) : [])
    .filter(([, , , , straightCount]) => straightCount < maxStraight)
    .map(advance)
    .filter(([i, j]) => inBounds([i, j], I, J));

const insort = (arr, node, score, low = 0, high = arr.length) => {
  const mid = Math.floor((low + high) / 2);
  if (high <= low) {
    return arr[mid] && score >= arr[mid][1]
      ? arr.splice(low + 1, 0, [node, score])
      : arr.splice(low, 0, [node, score]);
  }
  const [, midScore] = arr[mid];
  if (score > midScore) {
    return insort(arr, node, score, mid + 1, high);
  }
  return insort(arr, node, score, low, mid - 1);
};

const solve = (minStraight, maxStraight) => {
  const grid = input.split("\n");
  const [I, J] = [grid.length, grid[grid.length - 1].length];
  const node = [0, 0, 0, 1, 0];
  const nodeKey = JSON.stringify(node);
  const score = 0;
  const eScore = estimateScoreLeft(node, minStraight, I, J);

  const toVisit = [[nodeKey, score]];
  const scores = { [nodeKey]: score };
  const eScores = { [nodeKey]: eScore };

  while (toVisit.length) {
    const [nodeKey, score] = toVisit.shift();
    const [i, j, di, dj, straightCount] = JSON.parse(nodeKey);

    if (i === I - 1 && j === J - 1 && straightCount >= minStraight) {
      return score;
    }

    const neighbours = getNeighbours(
      [i, j, di, dj, straightCount],
      maxStraight,
      minStraight,
      I,
      J,
    );

    for (const neighbour of neighbours) {
      const [i, j] = neighbour;
      const neighKey = JSON.stringify(neighbour);

      const neighScore = score + Number(grid[i][j]);
      const neighEScore =
        neighScore + estimateScoreLeft(neighbour, minStraight, I, J);

      if (neighScore < (scores[neighKey] ?? Infinity)) {
        insort(toVisit, neighKey, neighScore);

        scores[neighKey] = score;
        eScores[neighKey] = neighEScore;
      }
    }
  }
};

console.log(solve(0, 3));
console.log(solve(4, 10));
