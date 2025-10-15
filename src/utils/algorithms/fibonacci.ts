export interface FibStep {
  computing: number;
  memo: Map<number, number>;
  description: string;
}

export const runFibonacci = (n: number): FibStep[] => {
  const steps: FibStep[] = [];
  const memo = new Map<number, number>();

  // Set base cases
  memo.set(0, 0);
  memo.set(1, 1);

  steps.push({
    computing: 0,
    memo: new Map(memo),
    description: "Base case: fib(0) = 0",
  });

  steps.push({
    computing: 1,
    memo: new Map(memo),
    description: "Base case: fib(1) = 1",
  });

  const compute = (num: number) => {
    if (memo.has(num)) {
      return;
    }

    steps.push({
      computing: num,
      memo: new Map(memo),
      description: `Computing fib(${num}) = fib(${num - 1}) + fib(${num - 2})`,
    });

    // Ensure dependencies are computed
    if (!memo.has(num - 1)) {
      compute(num - 1);
    }
    if (!memo.has(num - 2)) {
      compute(num - 2);
    }

    const value = memo.get(num - 1)! + memo.get(num - 2)!;
    memo.set(num, value);

    steps.push({
      computing: num,
      memo: new Map(memo),
      description: `Stored: fib(${num}) = ${value}`,
    });
  };

  // Compute fibonacci for all numbers from 2 to n
  for (let i = 2; i <= n; i++) {
    compute(i);
  }

  return steps;
};
