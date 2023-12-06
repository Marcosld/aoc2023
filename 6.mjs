import { performance } from "node:perf_hooks";

const input = `Time:        40     81     77     72
Distance:   219   1012   1365   1089`;

const parseInput = (input) => {
  const timesAndDistances = input
    .split("\n")
    .map((line) => line.split(" ").filter(Boolean).slice(1));
  const timeDis = [];
  for (const [i, time] of Object.entries(timesAndDistances[0])) {
    timeDis.push([time, timesAndDistances[1][i]]);
  }
  return timeDis;
};

const solve1 = (input) => {
  const timeDistances = parseInput(input);

  let ans = 1;
  for (const [time, distance] of timeDistances) {
    let waysToWin = 0;
    for (let holdTime = 1; holdTime < time; holdTime++) {
      const speed = holdTime;

      const runDistance = speed * (time - holdTime);
      if (runDistance > distance) {
        waysToWin++;
      }
    }
    ans *= waysToWin;
  }
  return ans;
};

performance.mark("p2");
console.log(solve1(input));
performance.measure("p2-measure", "p2");
console.log(
  "Duration (ms):",
  performance.getEntriesByName("p2-measure")[0].duration,
);
