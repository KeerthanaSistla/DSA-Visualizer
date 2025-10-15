import { useState } from "react";
import { AlgorithmSelector, DPAlgorithm } from "./AlgorithmSelector";
import { FibonacciVisualizer } from "./visualizers/FibonacciVisualizer";
import { KnapsackVisualizer } from "./visualizers/KnapsackVisualizer";
import { LCSVisualizer } from "./visualizers/LCSVisualizer";
import { MatrixChainVisualizer } from "./visualizers/MatrixChainVisualizer";
import { SubsetSumVisualizer } from "./visualizers/SubsetSumVisualizer";
import { CoinChangeVisualizer } from "./visualizers/CoinChangeVisualizer";
import { EditDistanceVisualizer } from "./visualizers/EditDistanceVisualizer";

export const DPVisualizerContainer = () => {
  const [algorithm, setAlgorithm] = useState<DPAlgorithm>("fibonacci");

  const renderVisualizer = () => {
    switch (algorithm) {
      case "fibonacci":
        return <FibonacciVisualizer />;
      case "knapsack":
        return <KnapsackVisualizer />;
      case "lcs":
        return <LCSVisualizer />;
      case "matrix-chain":
        return <MatrixChainVisualizer />;
      case "subset-sum":
        return <SubsetSumVisualizer />;
      case "coin-change":
        return <CoinChangeVisualizer />;
      case "edit-distance":
        return <EditDistanceVisualizer />;
      default:
        return <FibonacciVisualizer />;
    }
  };

  return (
    <div className="space-y-6">
      <AlgorithmSelector type="dp" value={algorithm} onChange={(v) => setAlgorithm(v as DPAlgorithm)} />
      {renderVisualizer()}
    </div>
  );
};
