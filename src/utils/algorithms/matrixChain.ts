export interface MatrixChainStep {
  i: number;
  j: number;
  k: number;
  dp: number[][];
  split: number[][];
  description: string;
  currentCell: { row: number; col: number } | null;
}

export const runMatrixChain = (dimensions: number[]): MatrixChainStep[] => {
  const steps: MatrixChainStep[] = [];
  const n = dimensions.length - 1; // number of matrices
  const dp: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const split: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  steps.push({
    i: -1,
    j: -1,
    k: -1,
    dp: dp.map(row => [...row]),
    split: split.map(row => [...row]),
    description: `Matrix chain with ${n} matrices. Dimensions: ${dimensions.join('×')}`,
    currentCell: null,
  });

  // Fill dp table
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      steps.push({
        i,
        j,
        k: -1,
        dp: dp.map(row => [...row]),
        split: split.map(row => [...row]),
        description: `Computing dp[${i}][${j}] for matrices ${i} to ${j}`,
        currentCell: { row: i, col: j },
      });

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];

        steps.push({
          i,
          j,
          k,
          dp: dp.map(row => [...row]),
          split: split.map(row => [...row]),
          description: `Trying split at k=${k}: cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dimensions[i]}×${dimensions[k + 1]}×${dimensions[j + 1]} = ${cost}`,
          currentCell: { row: i, col: j },
        });

        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;

          steps.push({
            i,
            j,
            k,
            dp: dp.map(row => [...row]),
            split: split.map(row => [...row]),
            description: `New minimum cost: ${cost}. Best split at k=${k}`,
            currentCell: { row: i, col: j },
          });
        }
      }

      steps.push({
        i,
        j,
        k: split[i][j],
        dp: dp.map(row => [...row]),
        split: split.map(row => [...row]),
        description: `Final cost for dp[${i}][${j}] = ${dp[i][j]}`,
        currentCell: { row: i, col: j },
      });
    }
  }

  steps.push({
    i: -1,
    j: -1,
    k: -1,
    dp: dp.map(row => [...row]),
    split: split.map(row => [...row]),
    description: `Matrix chain multiplication complete! Minimum cost: ${dp[0][n - 1]} operations`,
    currentCell: null,
  });

  return steps;
};
