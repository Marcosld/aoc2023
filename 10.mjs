import { getStraightAdjacentPositions, readInput } from "./utils.mjs";

const input = readInput(import.meta);

const getStartingPos = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") {
        return [i, j];
      }
    }
  }
};

const getPipeSurrounding = (grid, [i, j], [li, lj]) =>
  ({
    "|": {
      1: {
        A: [[i, j - 1]],
        B: [[i, j + 1]],
      },
      "-1": {
        A: [[i, j + 1]],
        B: [[i, j - 1]],
      },
    }[String(i - li)],
    "-": {
      1: {
        A: [[i + 1, j]],
        B: [[i - 1, j]],
      },
      "-1": {
        A: [[i - 1, j]],
        B: [[i + 1, j]],
      },
    }[String(j - lj)],
    7: {
      1: {
        A: [[i + 1, j - 1]],
        B: [
          [i - 1, j],
          [i - 1, j + 1],
          [i, j + 1],
        ],
      },
      0: {
        B: [[i + 1, j - 1]],
        A: [
          [i - 1, j],
          [i - 1, j + 1],
          [i, j + 1],
        ],
      },
    }[String(j - lj)],
    J: {
      0: {
        A: [[i - 1, j - 1]],
        B: [
          [i, j + 1],
          [i + 1, j + 1],
          [i + 1, j],
        ],
      },
      1: {
        B: [[i - 1, j - 1]],
        A: [
          [i, j + 1],
          [i + 1, j + 1],
          [i + 1, j],
        ],
      },
    }[String(j - lj)],
    L: {
      "-1": {
        A: [[i - 1, j + 1]],
        B: [
          [i + 1, j],
          [i + 1, j - 1],
          [i, j - 1],
        ],
      },
      0: {
        B: [[i - 1, j + 1]],
        A: [
          [i + 1, j],
          [i + 1, j - 1],
          [i, j - 1],
        ],
      },
    }[String(j - lj)],
    F: {
      0: {
        A: [[i + 1, j + 1]],
        B: [
          [i, j - 1],
          [i - 1, j - 1],
          [i - 1, j],
        ],
      },
      "-1": {
        B: [[i + 1, j + 1]],
        A: [
          [i, j - 1],
          [i - 1, j - 1],
          [i - 1, j],
        ],
      },
    }[String(j - lj)],
  })[grid[i][j]];

const getPipeAdjacents = (grid, [i, j]) =>
  ({
    "|": [
      [i - 1, j],
      [i + 1, j],
    ],
    "-": [
      [i, j - 1],
      [i, j + 1],
    ],
    L: [
      [i - 1, j],
      [i, j + 1],
    ],
    J: [
      [i, j - 1],
      [i - 1, j],
    ],
    7: [
      [i, j - 1],
      [i + 1, j],
    ],
    F: [
      [i + 1, j],
      [i, j + 1],
    ],
  })[grid[i][j]];

const isInBounds = ([i, j], grid) =>
  i >= 0 && i < grid.length && j >= 0 && j < grid[i].length;

const connectsBack = (to, points) =>
  points.some((p) => p[0] === to[0] && p[1] === to[1]);

const traversePipe = (input, onNode) => {
  const grid = input.split("\n");
  const start = getStartingPos(grid);
  const visited = new Set();
  visited.add(JSON.stringify(start));
  let nextNode = getStraightAdjacentPositions(...start)
    .filter((pos) => isInBounds(pos, grid))
    .find((pos) => {
      const pipeAdjacents = getPipeAdjacents(grid, pos);
      return connectsBack(start, pipeAdjacents);
    });
  onNode(start);
  while (nextNode) {
    onNode(nextNode);
    visited.add(JSON.stringify(nextNode));
    nextNode = getPipeAdjacents(grid, nextNode).find(
      (pos) => !visited.has(JSON.stringify(pos)),
    );
  }
};

const getBoundedCount = (point, grid) => {
  let count = 0;
  const nextNodes = [point];
  while (nextNodes.length) {
    const [i, j] = nextNodes.pop();
    if (!isInBounds([i, j], grid)) {
      return -1;
    }
    if (grid[i][j] !== ".") {
      continue;
    }
    count++;
    grid[i][j] = "x";
    nextNodes.push(...getStraightAdjacentPositions(i, j));
  }
  return count;
};

const solve1 = (input) => {
  let count = 0;
  traversePipe(input, () => count++);
  return Math.ceil(count / 2);
};

const solve2 = (input) => {
  const grid = input.split("\n");
  const enclosingGrid = Array.from({ length: grid.length })
    .fill(0)
    .map(() => Array.from({ length: grid[0].length }).fill("."));

  traversePipe(input, ([i, j]) => {
    enclosingGrid[i][j] = "x";
  });

  let lastNode;
  const countByZone = { A: 0, B: 0 };

  traversePipe(input, ([i, j]) => {
    if (lastNode) {
      const pipeBounding = getPipeSurrounding(grid, [i, j], lastNode);
      for (const zone of Object.keys(countByZone)) {
        for (const node of pipeBounding[zone]) {
          const boundedCount = getBoundedCount(node, enclosingGrid, zone);
          countByZone[zone] += boundedCount;
          if (boundedCount === -1) {
            delete countByZone[zone];
          }
        }
      }
    }
    lastNode = [i, j];
  });

  return Object.values(countByZone)[0];
};

console.log(solve1(input));
console.log(solve2(input));
