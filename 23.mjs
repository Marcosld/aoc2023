import { readInput, getStraightAdjacentPositions } from "./utils.mjs";

const input = readInput(import.meta);

const isValid =
  (grid) =>
  ([i, j]) =>
    i in grid && j in grid[i] && grid[i][j] !== "#";

const getNeighboursP2 = (grid, [i, j]) =>
  getStraightAdjacentPositions(i, j).filter(isValid(grid));

const getNeighboursP1 = (grid, [i, j]) =>
  (
    ({
      ".": getNeighboursP2(grid, [i, j]),
      ">": [[i, j + 1]],
      "<": [[i, j - 1]],
      "^": [[i - 1, j]],
      v: [[i + 1, j]],
    })[grid[i][j]] ?? []
  ).filter(isValid(grid));

const getNextVertex = (grid, [i, j], end, getNeighbours, visited, d = 0) => {
  const neighs = getNeighbours(grid, [i, j]).filter(
    (neigh) => !visited.has(JSON.stringify(neigh)),
  );

  const node = JSON.stringify([i, j]);

  if (neighs.length > 1 || node === end) {
    return [node, d + 1];
  }

  if (!neighs.length) {
    return undefined;
  }

  visited.add(node);

  return getNextVertex(grid, neighs[0], end, getNeighbours, visited, d + 1);
};

const findMax = (vertexMap, node, end, visited = new Set(), d = 0) => {
  if (visited.has(node)) {
    return -1;
  }

  if (node === end) {
    return d;
  }

  visited.add(node);
  const newResult = Math.max(
    ...vertexMap
      .get(node)
      .map(([nextNode, deltaD]) =>
        findMax(vertexMap, nextNode, end, visited, d + deltaD),
      ),
  );
  visited.delete(node);

  return newResult;
};

const solve = (input, getNeighbours) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const start = [0, grid.at(0).indexOf(".")];
  const end = [grid[0].length - 1, grid.at(-1).indexOf(".")];
  const [startKey, endKey] = [JSON.stringify(start), JSON.stringify(end)];

  const vertexMap = new Map([[startKey, getNeighbours(grid, start)]]);

  for (const [i, line] of grid.entries()) {
    for (const [j, char] of line.entries()) {
      const neighs = getNeighbours(grid, [i, j]);
      if (char !== "#" && neighs.length > 2) {
        vertexMap.set(JSON.stringify([i, j]), neighs);
      }
    }
  }

  for (const [vertex, adjacents] of vertexMap) {
    const adjVertex = adjacents
      .map(([i, j]) =>
        getNextVertex(grid, [i, j], endKey, getNeighbours, new Set([vertex])),
      )
      .filter(Boolean);
    vertexMap.set(vertex, adjVertex);
  }

  return findMax(vertexMap, startKey, endKey);
};

console.time("p1");
console.timeLog("p1", solve(input, getNeighboursP1));
console.time("p2");
console.timeLog("p2", solve(input, getNeighboursP2));
