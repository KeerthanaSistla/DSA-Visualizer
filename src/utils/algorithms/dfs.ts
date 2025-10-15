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

export interface DFSStep {
  current: number | null;
  stack: number[];
  visited: Set<number>;
}

export const runDFS = (nodes: GraphNode[], edges: GraphEdge[]): DFSStep[] => {
  const steps: DFSStep[] = [];
  const visited = new Set<number>();
  const stack: number[] = [0];
  
  const adjacencyList = new Map<number, number[]>();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    adjacencyList.get(edge.from)?.push(edge.to);
    adjacencyList.get(edge.to)?.push(edge.from);
  });

  steps.push({
    current: null,
    stack: [...stack],
    visited: new Set(visited),
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    
    if (visited.has(current)) continue;
    
    visited.add(current);
    
    steps.push({
      current,
      stack: [...stack],
      visited: new Set(visited),
    });

    const neighbors = adjacencyList.get(current) || [];
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      if (!visited.has(neighbor) && !stack.includes(neighbor)) {
        stack.push(neighbor);
      }
    }

    steps.push({
      current,
      stack: [...stack],
      visited: new Set(visited),
    });
  }

  steps.push({
    current: null,
    stack: [],
    visited: new Set(visited),
  });

  return steps;
};
