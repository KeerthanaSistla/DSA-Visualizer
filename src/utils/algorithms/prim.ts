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

export interface PrimStep {
  currentNode: number | null;
  currentEdge: WeightedGraphEdge | null;
  mstEdges: WeightedGraphEdge[];
  description: string;
  totalWeight: number;
  visited: Set<number>;
}

export const runPrim = (
  nodes: WeightedGraphNode[],
  edges: WeightedGraphEdge[],
  startNode: number = 0
): PrimStep[] => {
  const steps: PrimStep[] = [];
  const visited = new Set<number>();
  const mstEdges: WeightedGraphEdge[] = [];
  let totalWeight = 0;

  // Create adjacency list
  const adjacencyList = new Map<number, Array<{ node: number; weight: number; edge: WeightedGraphEdge }>>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    adjacencyList.get(edge.from)?.push({ node: edge.to, weight: edge.weight, edge });
    adjacencyList.get(edge.to)?.push({ node: edge.from, weight: edge.weight, edge });
  });

  visited.add(startNode);
  steps.push({
    currentNode: startNode,
    currentEdge: null,
    mstEdges: [],
    description: `Start with node ${nodes[startNode].label}`,
    totalWeight: 0,
    visited: new Set(visited),
  });

  while (visited.size < nodes.length) {
    let minWeight = Infinity;
    let minEdge: WeightedGraphEdge | null = null;
    let nextNode: number | null = null;

    // Find minimum weight edge from visited to unvisited nodes
    for (const visitedNode of visited) {
      const neighbors = adjacencyList.get(visitedNode) || [];
      for (const { node, weight, edge } of neighbors) {
        if (!visited.has(node) && weight < minWeight) {
          minWeight = weight;
          minEdge = edge;
          nextNode = node;
        }
      }
    }

    if (minEdge && nextNode !== null) {
      steps.push({
        currentNode: nextNode,
        currentEdge: minEdge,
        mstEdges: [...mstEdges],
        description: `Considering edge ${nodes[minEdge.from].label}-${nodes[minEdge.to].label} with weight ${minEdge.weight}`,
        totalWeight,
        visited: new Set(visited),
      });

      visited.add(nextNode);
      mstEdges.push(minEdge);
      totalWeight += minEdge.weight;

      steps.push({
        currentNode: nextNode,
        currentEdge: minEdge,
        mstEdges: [...mstEdges],
        description: `Added edge ${nodes[minEdge.from].label}-${nodes[minEdge.to].label} to MST. Total weight: ${totalWeight}`,
        totalWeight,
        visited: new Set(visited),
      });
    } else {
      break; // No more edges available
    }
  }

  steps.push({
    currentNode: null,
    currentEdge: null,
    mstEdges: [...mstEdges],
    description: `MST complete! Total weight: ${totalWeight}`,
    totalWeight,
    visited: new Set(visited),
  });

  return steps;
};
