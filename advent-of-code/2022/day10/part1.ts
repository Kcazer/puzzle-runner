type State = { cycle: number; value: number; next: number };
type Instruction = { type: "noop" } | { type: "addx"; value: number };

export default ({ input }: Input) => {
  const data = input.split("\n").map((line): Instruction => {
    const args = line.split(" ");
    if (args[0] === "noop") return { type: "noop" };
    else return { type: "addx", value: Number(args[1]) };
  });

  const store: State[] = [];
  const state: State = { cycle: 0, value: 1, next: 1 };
  const execute = (amount: number) => {
    state.value = state.next;
    state.next += amount;
    state.cycle += 1;
    if (state.cycle % 40 === 20) store.push({ ...state });
  };

  data.forEach((cmd) => {
    if (cmd.type === "noop") execute(0);
    else [execute(0), execute(cmd.value)];
  });

  const signals = store.map(({ cycle, value }) => cycle * value);
  return signals.reduce((a, b) => a + b, 0);
};
