export const getAdjacentPositions = (i, j) => [
  ...getStraightAdjacentPositions(i, j),
  [i + 1, j + 1],
  [i + 1, j - 1],
  [i - 1, j - 1],
  [i - 1, j + 1],
];

export const getStraightAdjacentPositions = (i, j) => [
  [i, j + 1],
  [i, j - 1],
  [i + 1, j],
  [i - 1, j],
];
