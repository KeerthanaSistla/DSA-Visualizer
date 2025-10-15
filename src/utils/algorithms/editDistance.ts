export interface EditDistanceStep {
  dp: number[][];
  currentRow: number;
  currentCol: number;
  description: string;
  operations?: string[];
}

export const runEditDistance = (word1: string, word2: string): EditDistanceStep[] => {
  const steps: EditDistanceStep[] = [];
  const m = word1.length;
  const n = word2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  // Initialize first row and column
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: 0,
    currentCol: 0,
    description: "Initialize DP table: first row and column represent deletions/insertions",
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `Characters match: '${word1[i - 1]}' = '${word2[j - 1]}'. No operation needed: ${dp[i][j]}`,
        });
      } else {
        const replace = dp[i - 1][j - 1] + 1;
        const deleteOp = dp[i - 1][j] + 1;
        const insert = dp[i][j - 1] + 1;
        dp[i][j] = Math.min(replace, deleteOp, insert);

        let operation = "";
        if (dp[i][j] === replace) {
          operation = `Replace '${word1[i - 1]}' with '${word2[j - 1]}'`;
        } else if (dp[i][j] === deleteOp) {
          operation = `Delete '${word1[i - 1]}'`;
        } else {
          operation = `Insert '${word2[j - 1]}'`;
        }

        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `Characters differ: '${word1[i - 1]}' ≠ '${word2[j - 1]}'. ${operation}. Cost: ${dp[i][j]}`,
        });
      }
    }
  }

  // Backtrack to find operations
  const operations: string[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
      i--;
      j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      operations.unshift(`Replace '${word1[i - 1]}' with '${word2[j - 1]}' at position ${i}`);
      i--;
      j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      operations.unshift(`Delete '${word1[i - 1]}' at position ${i}`);
      i--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      operations.unshift(`Insert '${word2[j - 1]}' at position ${j}`);
      j--;
    }
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: m,
    currentCol: n,
    description: `Complete! Edit distance: ${dp[m][n]}`,
    operations,
  });

  return steps;
};
