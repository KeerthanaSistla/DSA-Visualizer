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

export interface DijkstraStep {
  current: number | null;
  distances: Map<number, number>;
  visited: Set<number>;
}

export const runDijkstra = (
  nodes: WeightedGraphNode[],
  edges: WeightedGraphEdge[],
  startNode: number
): DijkstraStep[] => {
  const steps: DijkstraStep[] = [];
  const distances = new Map<number, number>();
  const visited = new Set<number>();
  const unvisited = new Set<number>();

  nodes.forEach((node) => {
    distances.set(node.id, node.id === startNode ? 0 : Infinity);
    unvisited.add(node.id);
  });

  const adjacencyList = new Map<number, Array<{ node: number; weight: number }>>();
  nodes.forEach((node) => adjacencyList.set(node.id, []));
  edges.forEach((edge) => {
    adjacencyList.get(edge.from)?.push({ node: edge.to, weight: edge.weight });
  });

  steps.push({
    current: null,
    distances: new Map(distances),
    visited: new Set(visited),
  });

  while (unvisited.size > 0) {
    let current: number | null = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      const dist = distances.get(node)!;
      if (dist < minDistance) {
        minDistance = dist;
        current = node;
      }
    }

    if (current === null || minDistance === Infinity) break;

    unvisited.delete(current);
    visited.add(current);

    steps.push({
      current,
      distances: new Map(distances),
      visited: new Set(visited),
    });

    const neighbors = adjacencyList.get(current) || [];
    for (const { node: neighbor, weight } of neighbors) {
      if (!visited.has(neighbor)) {
        const newDistance = distances.get(current)! + weight;
        if (newDistance < distances.get(neighbor)!) {
          distances.set(neighbor, newDistance);
        }
      }
    }

    steps.push({
      current,
      distances: new Map(distances),
      visited: new Set(visited),
    });
  }

  steps.push({
    current: null,
    distances: new Map(distances),
    visited: new Set(visited),
  });

  return steps;
};
