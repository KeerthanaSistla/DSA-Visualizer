export interface LCSStep {
  dp: number[][];
  currentRow: number;
  currentCol: number;
  description: string;
  lcs?: string;
}

export const runLCS = (text1: string, text2: string): LCSStep[] => {
  const steps: LCSStep[] = [];
  const m = text1.length;
  const n = text2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: 0,
    currentCol: 0,
    description: "Initialize DP table with zeros",
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `Characters match: '${text1[i - 1]}' = '${text2[j - 1]}'. Add 1 to diagonal: ${dp[i][j]}`,
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        steps.push({
          dp: dp.map((row) => [...row]),
          currentRow: i,
          currentCol: j,
          description: `Characters differ: '${text1[i - 1]}' ≠ '${text2[j - 1]}'. Take max(top, left): ${dp[i][j]}`,
        });
      }
    }
  }

  // Backtrack to find LCS
  let lcs = "";
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs = text1[i - 1] + lcs;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  steps.push({
    dp: dp.map((row) => [...row]),
    currentRow: m,
    currentCol: n,
    description: `Complete! LCS length: ${dp[m][n]}`,
    lcs,
  });

  return steps;
};
