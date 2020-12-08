export default ({ input }: Input) => {
  // Parse the program
  const program = input.split("\n").map((line) => {
    const [cmd, arg] = line.split(/\s+/);
    return [cmd, +arg] as const;
  });

  // Execute the program
  const trace: number[] = [];
  const runner = { idx: 0, val: 0 };
  while (!trace.includes(runner.idx)) {
    trace.push(runner.idx);
    const [cmd, arg] = program[runner.idx];
    switch (cmd) {
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
      default:
        throw new Error("Unknown instruction");
    }
  }

  return runner.val;
};
