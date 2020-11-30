type Input = Record<string, string>;
type Output = number | string | (number | string)[];
type Runner = (input?: Input) => Output | Promise<Output>;
type Result =
  | { status: "success"; value: Output; path: string; time: number }
  | { status: "failure"; error: string; path: string };
