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

export interface FloydWarshallStep {
  k: number;
  i: number;
  j: number;
  dist: number[][];
  description: string;
  currentCell: { row: number; col: number } | null;
}

export const runFloydWarshall = (
  nodes: WeightedGraphNode[],
  edges: WeightedGraphEdge[]
): FloydWarshallStep[] => {
  const steps: FloydWarshallStep[] = [];
  const n = nodes.length;
  const INF = Infinity;

  // Initialize distance matrix
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF));

  // Set diagonal to 0
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  // Set known distances from edges
  edges.forEach(edge => {
    dist[edge.from][edge.to] = edge.weight;
    // Assuming undirected graph for simplicity, but FW works for directed too
    dist[edge.to][edge.from] = edge.weight;
  });

  steps.push({
    k: -1,
    i: -1,
    j: -1,
    dist: dist.map(row => [...row]),
    description: "Initialize distance matrix with direct edge weights",
    currentCell: null,
  });

  // Floyd-Warshall algorithm
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          const newDist = dist[i][k] + dist[k][j];
          if (newDist < dist[i][j]) {
            steps.push({
              k,
              i,
              j,
              dist: dist.map(row => [...row]),
              description: `Considering path ${nodes[i].label} → ${nodes[k].label} → ${nodes[j].label}. New distance: ${newDist} < ${dist[i][j]}`,
              currentCell: { row: i, col: j },
            });

            dist[i][j] = newDist;

            steps.push({
              k,
              i,
              j,
              dist: dist.map(row => [...row]),
              description: `Updated dist[${nodes[i].label}][${nodes[j].label}] = ${newDist}`,
              currentCell: { row: i, col: j },
            });
          } else {
            steps.push({
              k,
              i,
              j,
              dist: dist.map(row => [...row]),
              description: `Path ${nodes[i].label} → ${nodes[k].label} → ${nodes[j].label} (${newDist}) not better than direct path (${dist[i][j]})`,
              currentCell: { row: i, col: j },
            });
          }
        }
      }
    }

    steps.push({
      k,
      i: -1,
      j: -1,
      dist: dist.map(row => [...row]),
      description: `Completed iteration with intermediate node ${nodes[k].label}`,
      currentCell: null,
    });
  }

  steps.push({
    k: n,
    i: -1,
    j: -1,
    dist: dist.map(row => [...row]),
    description: "Floyd-Warshall algorithm complete! All-pairs shortest paths computed.",
    currentCell: null,
  });

  return steps;
};
