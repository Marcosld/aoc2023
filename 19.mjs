import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const parseInput = (input) => {
  const [workflowsStr, partsStr] = input.split("\n\n");
  const workflows = {};

  for (const workflowStr of workflowsStr.split("\n")) {
    const [name, insList] = workflowStr.slice(0, -1).split("{");
    workflows[name] = insList
      .split(",")
      .map((instruction) => instruction.split(":").reverse());
  }

  return { workflows, parts: partsStr.split("\n") };
};

const solve1 = (input) => {
  const { workflows, parts } = parseInput(input);

  let result = 0;
  for (const part of parts) {
    const [x, m, a, s] = part
      .slice(1, -1)
      .split(",")
      .map((propStr) => +propStr.split("=")[1]);

    let wfName = "in";

    while (wfName !== "R") {
      for (const [to, cond] of workflows[wfName]) {
        if (!cond || eval(cond)) {
          wfName = to;
          break;
        }
      }
      if (wfName === "A") {
        result += x + m + a + s;
        break;
      }
    }
  }
  return result;
};

const apply = (_flowConfig, [min, max], part) => {
  const flowConfig = structuredClone(_flowConfig);
  if (min) {
    flowConfig[part][0] = Math.max(flowConfig[part][0], min + 1);
  }
  if (max) {
    flowConfig[part][1] = Math.min(flowConfig[part][1], max);
  }
  return flowConfig;
};

const parseCondition = (cond) => {
  if (cond) {
    const [, part, constraint, numStr] = cond.match(/(\w)([<>])(\d+)/);
    const num = +numStr;
    return {
      cond: [constraint === ">" ? [num, undefined] : [undefined, num], part],
      rCond: [
        constraint === ">" ? [undefined, num + 1] : [num - 1, undefined],
        part,
      ],
    };
  }
  return { cond: [[undefined, undefined]], rCond: [[undefined, undefined]] };
};

const resolve = (flowConfig) =>
  "xmas"
    .split("")
    .reduce(
      (acc, part) => acc * (flowConfig[part][1] - flowConfig[part][0]),
      1,
    );

const solve2 = (input) => {
  const { workflows } = parseInput(input);

  const followInstructions = (wf, flowConfig) => {
    const [[to, cond]] = wf;

    let result = 0;

    const {
      cond: [condition, part],
      rCond: [rCond, rPart],
    } = parseCondition(cond);

    if (to === "A") {
      result += resolve(apply(flowConfig, condition, part));
    }
    if (to !== "A" && to !== "R") {
      result += followInstructions(
        workflows[to],
        apply(flowConfig, condition, part),
      );
    }

    const stayWf = wf.slice(1);

    if (stayWf.length) {
      result += followInstructions(stayWf, apply(flowConfig, rCond, rPart));
    }
    return result;
  };

  const [gte, lt] = [1, 4001];

  return followInstructions(workflows["in"], {
    x: [gte, lt],
    m: [gte, lt],
    a: [gte, lt],
    s: [gte, lt],
  });
};

console.log(solve1(input));
console.log(solve2(input));
