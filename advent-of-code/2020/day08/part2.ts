export default ({ input }: Input) => {
  // Parse the program
  const source = input.split("\n").map((line) => {
    const [cmd, arg] = line.split(/\s+/);
    return [cmd, +arg] as [string, number];
  });

  // Add a special `out` instruction
  source.push(["out", 0]);

  // Create a program executor
  const execute = (program: [string, number][]) => {
    const trace: number[] = [];
    const runner = { idx: 0, val: 0 };
    while (!trace.includes(runner.idx)) {
      trace.push(runner.idx);
      const [cmd, arg] = program[runner.idx] ?? [];
      switch (cmd) {
        case "out":
          return runner.val;
        case "nop":
          runner.idx += 1;
          break;
        case "jmp":
          runner.idx += arg;
          break;
        case "acc":
          runner.val += arg;
          runner.idx += 1;
          break;
        default: // Force exit
          runner.idx = 0;
      }
    }
    return null;
  };

  // Try all possible replacement
  for (let i = 0; i < source.length; i++) {
    const instr = source[i];
    const copy = [...source];
    if (instr[0] == "nop") copy[i] = ["jmp", instr[1]];
    else if (instr[0] === "jmp") copy[i] = ["nop", 0];
    else continue;
    // Execute patched program
    const result = execute(copy);
    if (result != null) return result;
  }

  return null;
};
