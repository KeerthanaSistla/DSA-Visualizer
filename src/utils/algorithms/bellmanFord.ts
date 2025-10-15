export interface WeightedGraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface WeightedGraphEdge {
  from: number;
  to: number;
  weight: number;
}

export interface BellmanFordStep {
  currentEdge: { from: number; to: number } | null;
  distances: Map<number, number>;
  iteration: number;
}

export const runBellmanFord = (
  nodes: WeightedGraphNode[],
  edges: WeightedGraphEdge[],
  startNode: number
): BellmanFordStep[] => {
  const steps: BellmanFordStep[] = [];
  const distances = new Map<number, number>();

  nodes.forEach((node) => {
    distances.set(node.id, node.id === startNode ? 0 : Infinity);
  });

  steps.push({
    currentEdge: null,
    distances: new Map(distances),
    iteration: 0,
  });

  for (let i = 0; i < nodes.length - 1; i++) {
    for (const edge of edges) {
      const distFrom = distances.get(edge.from)!;
      const distTo = distances.get(edge.to)!;

      steps.push({
        currentEdge: { from: edge.from, to: edge.to },
        distances: new Map(distances),
        iteration: i + 1,
      });

      if (distFrom !== Infinity && distFrom + edge.weight < distTo) {
        distances.set(edge.to, distFrom + edge.weight);
      }

      steps.push({
        currentEdge: { from: edge.from, to: edge.to },
        distances: new Map(distances),
        iteration: i + 1,
      });
    }
  }

  steps.push({
    currentEdge: null,
    distances: new Map(distances),
    iteration: nodes.length,
  });

  return steps;
};
