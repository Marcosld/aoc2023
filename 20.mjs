import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const BC_NAME = "broadcaster";
const LAST_CONJ_MOD_NAME = "gq";

const parseInput = (input) => {
  const config = {};
  let initialModules;

  for (const line of input.split("\n")) {
    const [p1, p2] = line.split(" -> ");
    const outputs = p2.split(", ");
    if (p1 === BC_NAME) {
      initialModules = outputs;
      continue;
    }
    config[p1.slice(1)] = {
      type: p1[0],
      outputs,
      state: p1[0] === "%" ? 0 : {},
    };
  }

  for (const [module, { outputs }] of Object.entries(config)) {
    for (const output of outputs) {
      if (config[output] && config[output].type === "&") {
        config[output].state[module] = 0;
      }
    }
  }

  return { config, initialModules };
};

const sendPulses = (signals, config, modTo, signal) =>
  signals.push(
    ...config[modTo].outputs.map((modName) => [modName, modTo, signal]),
  );

const pushButton = (config, initialModules) => {
  const signals = initialModules.map((mod) => [mod, BC_NAME, 0]);

  const signalCount = [1, 0]; // push button signal
  let toggledGQInput;
  while (signals.length) {
    const [modTo, modFrom, signal] = signals.shift();

    signalCount[+signal]++;

    if (modTo === LAST_CONJ_MOD_NAME && signal === 1) {
      toggledGQInput = modFrom;
    }

    if (!config[modTo]) {
      continue;
    }

    if (config[modTo].type === "%") {
      if (signal === 1) {
        continue;
      }
      config[modTo].state ^= 1;
      sendPulses(signals, config, modTo, config[modTo].state);
    }

    if (config[modTo].type === "&") {
      config[modTo].state[modFrom] = signal;
      const nextSignal = Object.values(config[modTo].state).every(Boolean) ^ 1;
      sendPulses(signals, config, modTo, nextSignal);
    }
  }
  return { signalCount, toggledGQInput };
};

const solve1 = (input) => {
  const { config, initialModules } = parseInput(input);

  let result = [0, 0];
  for (let i = 0; i < 1000; i++) {
    const { signalCount } = pushButton(config, initialModules);
    result[0] += signalCount[0];
    result[1] += signalCount[1];
  }
  return result[0] * result[1];
};

const solve2 = (input) => {
  const { config, initialModules } = parseInput(input);

  let toToggleGQInputs = Object.keys(config[LAST_CONJ_MOD_NAME].state).length;
  let result = 1;

  for (let i = 1; toToggleGQInputs > 0; i++) {
    const { toggledGQInput } = pushButton(config, initialModules, i);
    if (toggledGQInput) {
      toToggleGQInputs--;
      result *= i;
    }
  }
  return result;
};

console.log(solve1(input));
console.log(solve2(input));
