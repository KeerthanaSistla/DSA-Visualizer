export interface CoinChangeStep {
  currentCoin: number;
  currentAmount: number;
  dp: number[];
  description: string;
  currentCell: number | null;
}

export const runCoinChange = (coins: number[], amount: number): CoinChangeStep[] => {
  const steps: CoinChangeStep[] = [];
  const dp: number[] = Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 0 coins needed to make amount 0

  steps.push({
    currentCoin: -1,
    currentAmount: 0,
    dp: [...dp],
    description: "Initialize dp[0] = 0. No coins needed for amount 0.",
    currentCell: 0,
  });

  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];

    steps.push({
      currentCoin: i,
      currentAmount: -1,
      dp: [...dp],
      description: `Considering coin ${coin}`,
      currentCell: null,
    });

    for (let j = coin; j <= amount; j++) {
      if (dp[j - coin] !== Infinity) {
        const newValue = dp[j - coin] + 1;
        if (newValue < dp[j]) {
          dp[j] = newValue;
          steps.push({
            currentCoin: i,
            currentAmount: j,
            dp: [...dp],
            description: `Using coin ${coin} for amount ${j}: dp[${j}] = min(dp[${j}], dp[${j - coin}] + 1) = min(${dp[j] === Infinity ? '∞' : dp[j]}, ${dp[j - coin]} + 1) = ${newValue}`,
            currentCell: j,
          });
        } else {
          steps.push({
            currentCoin: i,
            currentAmount: j,
            dp: [...dp],
            description: `Coin ${coin} for amount ${j}: dp[${j - coin}] + 1 = ${dp[j - coin]} + 1 = ${newValue}, but dp[${j}] = ${dp[j] === Infinity ? '∞' : dp[j]} is better.`,
            currentCell: j,
          });
        }
      }
    }
  }

  const result = dp[amount];
  steps.push({
    currentCoin: -1,
    currentAmount: -1,
    dp: [...dp],
    description: `Coin change complete! Minimum coins for amount ${amount}: ${result === Infinity ? 'Impossible' : result}`,
    currentCell: null,
  });

  return steps;
};
