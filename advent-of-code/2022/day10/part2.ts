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
    store.push({ ...state });
  };

  data.forEach((cmd) => {
    if (cmd.type === "noop") execute(0);
    else [execute(0), execute(cmd.value)];
  });

  const screen = Array.from({ length: 6 }, () => {
    return Array.from({ length: 40 }, () => " ");
  });
  store.forEach(({ cycle, value }) => {
    const v = value % 40;
    const x = (cycle - 1) % 40;
    const y = ((cycle - 1) - x) / 40;
    if (Math.abs(v - x) < 2) screen[y][x] = "█";
  });

  return screen.map((row) => row.join("")).join("\n");
};
