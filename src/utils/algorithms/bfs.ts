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

export interface BFSStep {
  current: number | null;
  queue: number[];
  visited: number[];
}

export const runBFS = (nodes: GraphNode[], edges: GraphEdge[]): BFSStep[] => {
  const steps: BFSStep[] = [];
  const visited = new Set<number>();
  const queue: number[] = [0]; // Start from node 0
  
  // Create adjacency list
  const adjacencyList = new Map<number, number[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    adjacencyList.get(edge.from)?.push(edge.to);
    adjacencyList.get(edge.to)?.push(edge.from);
  });

  steps.push({
    current: null,
    queue: [...queue],
    visited: Array.from(visited),
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    
    steps.push({
      current,
      queue: [...queue],
      visited: Array.from(visited),
    });

    const neighbors = adjacencyList.get(current) || [];
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
      }
    });

    steps.push({
      current,
      queue: [...queue],
      visited: Array.from(visited),
    });
  }

  steps.push({
    current: null,
    queue: [],
    visited: Array.from(visited),
  });

  return steps;
};
