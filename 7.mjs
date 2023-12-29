import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const order2 = {
  A: 12,
  K: 11,
  Q: 10,
  T: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1,
  J: 0,
};

const order1 = {
  A: 12,
  K: 11,
  Q: 10,
  J: 9,
  T: 8,
  9: 7,
  8: 6,
  7: 5,
  6: 4,
  5: 3,
  4: 2,
  3: 1,
  2: 0,
};

const compareByCard = (h1, h2, order, i = 0) =>
  order[h1[i]] - order[h2[i]] || compareByCard(h1, h2, order, i + 1);

const solve = (input, sortHandVals, cardOrder) => {
  const hands = [];
  for (const line of input.split("\n")) {
    const [handStr, scoreStr] = line.split(" ");

    const handVals = {};
    for (const card of handStr) {
      handVals[card] = (handVals[card] || 0) + 1;
    }
    const sortedHandVals = sortHandVals(handVals);
    const handWeight = 2 * sortedHandVals[0] + (sortedHandVals[1] || 0);

    hands.push([handStr, handWeight, +scoreStr]);
  }

  const sortedHands = hands.sort((a, b) => {
    const [aHandStr, aWeight] = a;
    const [bHandStr, bWeight] = b;
    return aWeight - bWeight || compareByCard(aHandStr, bHandStr, cardOrder);
  });

  return sortedHands.reduce((acc, hand, i) => acc + hand.at(-1) * (i + 1), 0);
};

const solve1 = (input) => {
  const sortHandVals = (handVals) =>
    Object.values(handVals).sort((a, b) => b - a);

  return solve(input, sortHandVals, order1);
};

const solve2 = (input) => {
  const sortHandVals = (handVals) => {
    const sortedHandKeys = Object.entries(handVals)
      .sort(([, a], [, b]) => b - a)
      .map(([card]) => card);

    if (handVals.J > 0 && handVals.J < 5) {
      handVals[sortedHandKeys[sortedHandKeys[0] === "J" ? 1 : 0]] += handVals.J;
      handVals.J = 0;
    }
    return Object.values(handVals).sort((a, b) => b - a);
  };

  return solve(input, sortHandVals, order2);
};

console.log(solve1(input));
console.log(solve2(input));
