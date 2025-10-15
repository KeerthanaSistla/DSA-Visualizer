export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  from: number;
  to: number;
}

export interface TopologicalSortStep {
  currentNode: number | null;
  stack: number[];
  visited: Set<number>;
  visiting: Set<number>;
  description: string;
  hasCycle: boolean;
}

export const runTopologicalSort = (nodes: GraphNode[], edges: GraphEdge[]): TopologicalSortStep[] => {
  const steps: TopologicalSortStep[] = [];
  const visited = new Set<number>();
  const visiting = new Set<number>();
  const stack: number[] = [];

  // Create adjacency list
  const adjacencyList = new Map<number, number[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => adjacencyList.get(edge.from)?.push(edge.to));

  const dfs = (nodeId: number): boolean => {
    if (visiting.has(nodeId)) {
      // Cycle detected
      steps.push({
        currentNode: nodeId,
        stack: [...stack],
        visited: new Set(visited),
        visiting: new Set(visiting),
        description: `Cycle detected at node ${nodes[nodeId].label}!`,
        hasCycle: true,
      });
      return true;
    }

    if (visited.has(nodeId)) return false;

    visiting.add(nodeId);

    steps.push({
      currentNode: nodeId,
      stack: [...stack],
      visited: new Set(visited),
      visiting: new Set(visiting),
      description: `Visiting node ${nodes[nodeId].label}`,
      hasCycle: false,
    });

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    stack.push(nodeId);

    steps.push({
      currentNode: nodeId,
      stack: [...stack],
      visited: new Set(visited),
      visiting: new Set(visiting),
      description: `Finished processing node ${nodes[nodeId].label}, added to stack`,
      hasCycle: false,
    });

    return false;
  };

  // Try to visit all nodes
  for (const node of nodes) {
    if (!visited.has(node.id) && !visiting.has(node.id)) {
      if (dfs(node.id)) {
        // Cycle detected, return early
        return steps;
      }
    }
  }

  // Reverse the stack to get topological order
  const topologicalOrder = stack.reverse();

  steps.push({
    currentNode: null,
    stack: topologicalOrder,
    visited: new Set(visited),
    visiting: new Set(),
    description: `Topological sort complete! Order: ${topologicalOrder.map(id => nodes[id].label).join(' → ')}`,
    hasCycle: false,
  });

  return steps;
};
