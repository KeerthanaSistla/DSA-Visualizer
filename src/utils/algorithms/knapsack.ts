export interface Item {
  weight: number;
  value: number;
  name: string;
}

export interface KnapsackStep {
  dp: number[][];
  currentRow: number;
  currentCol: number;
  description: string;
}

export const runKnapsack = (items: Item[], capacity: number): KnapsackStep[] => {
  const steps: KnapsackStep[] = [];
  const n = items.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: 0,
    currentCol: 0,
    description: "Initialize DP table with zeros",
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const item = items[i - 1];

      if (item.weight <= w) {
        const includeValue = item.value + dp[i - 1][w - item.weight];
        const excludeValue = dp[i - 1][w];

        dp[i][w] = Math.max(includeValue, excludeValue);

        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: w,
          description: `Item ${item.name}: weight ${item.weight} ≤ ${w}. Include (${includeValue}) vs Exclude (${excludeValue}). Choose ${dp[i][w]}`,
        });
      } else {
        dp[i][w] = dp[i - 1][w];

        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: w,
          description: `Item ${item.name}: weight ${item.weight} > ${w}. Cannot include. Take previous value: ${dp[i][w]}`,
        });
      }
    }
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: n,
    currentCol: capacity,
    description: `Maximum value: ${dp[n][capacity]}`,
  });

  return steps;
};
