import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const insortDescByMaxZ = (arr, el) => {
  arr.push(el);
  for (let i = arr.length - 1; i > 0 && arr[i][2][1] > arr[i - 1][2][1]; i--) {
    let tmp = arr[i];
    arr[i] = arr[i - 1];
    arr[i - 1] = tmp;
  }
  return arr;
};

const liesOn = ([a1, a2], [b1, b2]) => {
  const [p1, p2] = [Math.max(a1, b1), Math.min(a2, b2)];

  return p2 > p1;
};

const settleBricks = (input) => {
  const lowestZ = 1;

  const fallingBlocks = input
    .split("\n")
    .map((line) => {
      const [[x1, y1, z1], [x2, y2, z2]] = line
        .split("~")
        .map((pos) => pos.split(",").map(Number));

      return [
        // assuming [min-max] segments for all blocks, converting to [-----)
        [x1, x2 + 1],
        [y1, y2 + 1],
        [z1, z2 + 1],
      ];
    })
    .sort(([, , [lZ1]], [, , [lZ2]]) => lZ1 - lZ2); // sort ascending

  const settledBlocks = [];
  const holds = {};
  const heldBy = {};

  while (fallingBlocks.length) {
    const fBlock = fallingBlocks.shift(); // Retrieve lowest block
    let settlingZ = lowestZ;
    const matchingSBlockKeys = [];
    for (
      let i = 0;
      i < settledBlocks.length && settledBlocks[i][2][1] >= settlingZ;
      i++
    ) {
      const sBlock = settledBlocks[i];
      if (liesOn(fBlock[0], sBlock[0]) && liesOn(fBlock[1], sBlock[1])) {
        // intersects x and y
        settlingZ = sBlock[2][1]; // upper z of settled block

        matchingSBlockKeys.push(JSON.stringify(sBlock));
      }
    }
    fBlock[2] = [settlingZ, settlingZ + fBlock[2][1] - fBlock[2][0]];
    const fBlockKey = JSON.stringify(fBlock);

    matchingSBlockKeys.forEach((sBlockKey) => {
      (heldBy[fBlockKey] ??= []).push(sBlockKey);
      (holds[sBlockKey] ??= []).push(fBlockKey);
    });

    insortDescByMaxZ(settledBlocks, fBlock);
  }

  return { settledBlocks, holds, heldBy };
};

const solve1 = (input) => {
  const { settledBlocks, holds, heldBy } = settleBricks(input);

  let result = 0;
  for (const block of settledBlocks) {
    const blockKey = JSON.stringify(block);
    if (
      !(blockKey in holds) ||
      holds[blockKey].every((heldBlockKey) => heldBy[heldBlockKey].length > 1)
    ) {
      result += 1;
    }
  }

  return result;
};

const calcFallenBlocks = (_blockKey, holds, heldBy) => {
  const removedBlocks = new Set([_blockKey]);
  const toRemoveBlocks = new Set([_blockKey]);
  while (toRemoveBlocks.size) {
    const blockKey = toRemoveBlocks.values().next().value;
    toRemoveBlocks.delete(blockKey);

    if (
      blockKey in heldBy &&
      heldBy[blockKey].every((heldByKey) => removedBlocks.has(heldByKey))
    ) {
      // if all that held this were removed
      removedBlocks.add(blockKey);
    }

    if (blockKey in holds) {
      // add to toRemove set every block that was held by this one
      holds[blockKey].forEach((heldKey) => toRemoveBlocks.add(heldKey));
    }
  }
  return removedBlocks.size - 1;
};

const solve2 = (input) => {
  const { settledBlocks, holds, heldBy } = settleBricks(input);

  let result = 0;
  for (const block of settledBlocks) {
    result += calcFallenBlocks(JSON.stringify(block), holds, heldBy);
  }

  return result;
};

console.log(solve1(input));
console.log(solve2(input));
