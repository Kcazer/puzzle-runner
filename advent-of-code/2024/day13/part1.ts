export default ({ input }: Input) => {
  type Vector = { x: number; y: number };
  type System = { a: Vector; b: Vector; r: Vector };
  type Solution = { A: number; B: number };

  // Parse input into a list of systems for ease of use
  const data = input.split("\n\n").map((item): System => {
    const res = [...item.match(/\d+/g) ?? []].map(Number);
    const a = { x: res[0], y: res[1] };
    const b = { x: res[2], y: res[3] };
    const r = { x: res[4], y: res[5] };
    return { a, b, r };
  });

  // Linear equations system solver, uses Cramer's rule
  const solve = (a: Vector, b: Vector, r: Vector) => {
    const det = a.x * b.y - a.y * b.x;
    if (det === 0) return null;
    const detA = r.x * b.y - r.y * b.x;
    const detB = a.x * r.y - a.y * r.x;
    return { A: detA / det, B: detB / det };
  };

  // Check if a solution is valid
  const isValid = (value: Solution | null): value is Solution => {
    if (value === null) return false;
    if (!Number.isInteger(value.A)) return false;
    if (!Number.isInteger(value.B)) return false;
    if (value.A < 0 || value.B < 0) return false;
    if (value.A > 100 || value.B > 100) return false;
    return true;
  };

  // Find solution
  const solutions = data.map((system) => {
    const solution = solve(system.a, system.b, system.r);
    if (!isValid(solution)) return { system, solution, valid: false, cost: 0 };
    return { system, solution, valid: true, cost: 3 * solution.A + 1 * solution.B };
  });

  // Return the total cost
  return solutions.reduce((acc, { cost }) => acc + cost, 0);
};
