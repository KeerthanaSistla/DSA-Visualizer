export interface SubsetSumStep {
  currentItem: number;
  currentSum: number;
  dp: boolean[][];
  description: string;
  currentCell: { row: number; col: number } | null;
}

export const runSubsetSum = (nums: number[], target: number): SubsetSumStep[] => {
  const steps: SubsetSumStep[] = [];
  const n = nums.length;
  const dp: boolean[][] = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));

  // Initialize first row (no items)
  for (let j = 0; j <= target; j++) {
    dp[0][j] = false;
  }
  dp[0][0] = true; // Sum 0 is always possible with no items

  steps.push({
    currentItem: -1,
    currentSum: -1,
    dp: dp.map(row => [...row]),
    description: `Initialize DP table. Can we make sum 0 with no items? Yes.`,
    currentCell: { row: 0, col: 0 },
  });

  for (let i = 1; i <= n; i++) {
    const num = nums[i - 1];

    steps.push({
      currentItem: i - 1,
      currentSum: -1,
      dp: dp.map(row => [...row]),
      description: `Considering item ${i - 1} with value ${num}`,
      currentCell: null,
    });

    for (let j = 0; j <= target; j++) {
      // Don't take current item
      dp[i][j] = dp[i - 1][j];

      steps.push({
        currentItem: i - 1,
        currentSum: j,
        dp: dp.map(row => [...row]),
        description: `For sum ${j}: Without item ${num}, dp[${i}][${j}] = dp[${i - 1}][${j}] = ${dp[i - 1][j]}`,
        currentCell: { row: i, col: j },
      });

      // Take current item if possible
      if (j >= num) {
        const withItem = dp[i - 1][j - num];
        if (withItem) {
          dp[i][j] = true;
          steps.push({
            currentItem: i - 1,
            currentSum: j,
            dp: dp.map(row => [...row]),
            description: `With item ${num}: dp[${i}][${j}] = dp[${i - 1}][${j - num}] = ${withItem}. Updated to true.`,
            currentCell: { row: i, col: j },
          });
        }
      }
    }
  }

  const result = dp[n][target];
  steps.push({
    currentItem: -1,
    currentSum: -1,
    dp: dp.map(row => [...row]),
    description: `Subset sum complete! Can we make sum ${target} with the given numbers? ${result ? 'Yes' : 'No'}`,
    currentCell: null,
  });

  return steps;
};
