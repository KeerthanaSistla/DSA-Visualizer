import { useState } from "react";
import { AlgorithmSelector, GraphAlgorithm } from "./AlgorithmSelector";
import { BFSVisualizer } from "./visualizers/BFSVisualizer";
import { DFSVisualizer } from "./visualizers/DFSVisualizer";
import { DijkstraVisualizer } from "./visualizers/DijkstraVisualizer";
import { BellmanFordVisualizer } from "./visualizers/BellmanFordVisualizer";
import { KruskalVisualizer } from "./visualizers/KruskalVisualizer";
import { PrimVisualizer } from "./visualizers/PrimVisualizer";
import { TopologicalSortVisualizer } from "./visualizers/TopologicalSortVisualizer";
import { FloydWarshallVisualizer } from "./visualizers/FloydWarshallVisualizer";

export const GraphVisualizerContainer = () => {
  const [algorithm, setAlgorithm] = useState<GraphAlgorithm>("bfs");

  const renderVisualizer = () => {
    switch (algorithm) {
      case "bfs":
        return <BFSVisualizer />;
      case "dfs":
        return <DFSVisualizer />;
      case "dijkstra":
        return <DijkstraVisualizer />;
      case "bellman-ford":
        return <BellmanFordVisualizer />;
      case "kruskal":
        return <KruskalVisualizer />;
      case "prim":
        return <PrimVisualizer />;
      case "topological-sort":
        return <TopologicalSortVisualizer />;
      case "floyd-warshall":
        return <FloydWarshallVisualizer />;
      default:
        return <BFSVisualizer />;
    }
  };

  return (
    <div className="space-y-6">
      <AlgorithmSelector type="graph" value={algorithm} onChange={(v) => setAlgorithm(v as GraphAlgorithm)} />
      {renderVisualizer()}
    </div>
  );
};
