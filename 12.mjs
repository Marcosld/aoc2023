const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

const isValid = (groups, constraint, isFinished) => {
  if (isFinished) {
    if (groups.length !== constraint.length) {
      return false;
    }
    for (const [i, n] of groups.entries()) {
      if (n !== constraint[i]) {
        return false;
      }
    }
    return true;
  }
  // not finished
  if (groups.length > constraint.length) {
    return false;
  }
  for (const [i, n] of groups.entries()) {
    if (n > constraint[i]) {
      return false;
    }
    if (i + 1 in groups && n !== constraint[i]) {
      return false;
    }
  }
  return true;
};

const getPossibleCombinations = (
  line,
  constraint,
  endings = { dot: 0, hash: 0 },
  groups = [],
  i = 0,
) => {
  if (isValid(groups, constraint, true)) {
    if (line[i - 1] === ".") {
      endings.dot++;
    }
    if (line[i - 1] === "#") {
      endings.hash++;
    }
    return 1;
  }

  if (i >= line.length) {
    return 0;
  }

  if (!isValid(groups, constraint, false)) {
    return 0;
  }

  const nextI = i + 1;
  const modifiedGroups =
    !line[i - 1] || line[i - 1] === "."
      ? groups.concat(1)
      : groups.toSpliced(-1, 1, groups.at(-1) + 1);

  if (line[i] === "#") {
    return getPossibleCombinations(
      line,
      constraint,
      endings,
      modifiedGroups,
      nextI,
    );
  }

  if (line[i] === ".") {
    return getPossibleCombinations(line, constraint, endings, groups, nextI);
  }

  return (
    getPossibleCombinations(
      line.toSpliced(i, 1, "#"),
      constraint,
      endings,
      modifiedGroups,
      nextI,
    ) +
    getPossibleCombinations(
      line.toSpliced(i, 1, "."),
      constraint,
      endings,
      groups,
      nextI,
    )
  );
};

const solve1 = (input) => {
  const linesWithConstraints = input.split("\n").map((line) => {
    const [p1, p2] = line.split(" ");
    return [p1.split(""), p2.split(",").map(Number)];
  });
  let result = 0;
  for (const [line, constraint] of linesWithConstraints) {
    result += getPossibleCombinations(line, constraint);
  }
  return result;
};

const solve2 = (input) => {
  const linesWithConstraints = input.split("\n").map((line) => {
    const [p1, p2] = line.split(" ");
    return [p1.split(""), p2.split(",").map(Number)];
  });
  let result = 0;
  for (const [i, [line, constraint]] of linesWithConstraints.entries()) {
    let nOfCombs = 0;
    if (line.at(-1) === ".") {
      nOfCombs =
        getPossibleCombinations(line, constraint) *
        Math.pow(getPossibleCombinations(["?"].concat(line), constraint), 4);
    }
    if (line.at(-1) === "#") {
      nOfCombs =
        getPossibleCombinations(line, constraint) *
        Math.pow(getPossibleCombinations(["."].concat(line), constraint), 4);
    }
    if (line.at(-1) === "?") {
      const lineEndsDot = line.splice(-1, 1, ".");
      const lineEndsHash = line.splice(-1, 1, "#");
      const combsDot =
        getPossibleCombinations(lineEndsDot, constraint) *
        Math.pow(
          getPossibleCombinations(["?"].concat(lineEndsDot), constraint),
          4,
        );
      const combsHash =
        getPossibleCombinations(lineEndsHash, constraint) *
        Math.pow(
          getPossibleCombinations(["."].concat(lineEndsHash), constraint),
          4,
        );
      nOfCombs += combsDot * combsHash;
    }
    result += nOfCombs;
  }
  return result;
};

console.log(solve1(input));
console.log(solve2(input));
