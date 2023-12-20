import { readInput } from "./utils.mjs";

const input = readInput(import.meta);

const parseInput = (input) => {
  const config = {};
  let targetConjModule;
  let initialModules;

  for (const line of input.split("\n")) {
    const [p1, p2] = line.split(" -> ");
    const outputs = p2.split(", ");
    if (p1 === "broadcaster") {
      initialModules = outputs;
      continue;
    }
    if (outputs.includes("rx")) {
      targetConjModule = p1.slice(1);
    }
    config[p1.slice(1)] = {
      type: p1[0],
      outputs,
      state: 0,
      iStates: {},
    };
  }

  for (const [module, { outputs }] of Object.entries(config)) {
    for (const output of outputs) {
      if (config[output] && config[output].type === "&") {
        config[output].iStates[module] = 0;
      }
    }
  }

  return { config, initialModules, targetConjModule };
};

const sendPulses = (signals, config, modTo, signal) =>
  signals.push(
    ...config[modTo].outputs.map((modName) => [modName, modTo, signal]),
  );

const pushButton = (config, initialModules, targetConjModule) => {
  const signals = initialModules.map((mod) => [mod, "broadcaster", 0]);

  const signalCount = [1, 0]; // push button signal
  let toggledTargetInput;
  while (signals.length) {
    const [modTo, modFrom, signal] = signals.shift();

    signalCount[+signal]++;

    if (modTo === targetConjModule && signal === 1) {
      toggledTargetInput = modFrom;
    }

    if (!config[modTo] || (config[modTo].type === "%" && signal === 1)) {
      continue;
    }

    config[modTo].state ^= 1;
    config[modTo].iStates[modFrom] = signal;

    const nextSignal =
      config[modTo].type === "%"
        ? config[modTo].state
        : Object.values(config[modTo].iStates).every(Boolean) ^ 1;

    sendPulses(signals, config, modTo, nextSignal);
  }
  return { signalCount, toggledTargetInput };
};

const solve1 = (input) => {
  const { config, initialModules, targetConjModule } = parseInput(input);

  let result = [0, 0];
  for (let i = 0; i < 1000; i++) {
    const { signalCount } = pushButton(
      config,
      initialModules,
      targetConjModule,
    );
    result[0] += signalCount[0];
    result[1] += signalCount[1];
  }
  return result[0] * result[1];
};

const solve2 = (input) => {
  const { config, initialModules, targetConjModule } = parseInput(input);

  let leftToToggle = Object.keys(config[targetConjModule].iStates).length;
  let result = 1;

  for (let i = 1; leftToToggle > 0; i++) {
    const { toggledTargetInput } = pushButton(
      config,
      initialModules,
      targetConjModule,
    );
    if (toggledTargetInput) {
      leftToToggle--;
      result *= i;
    }
  }
  return result;
};

console.log(solve1(input));
console.log(solve2(input));
