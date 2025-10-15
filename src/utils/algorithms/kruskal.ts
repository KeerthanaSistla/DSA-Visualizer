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

export interface KruskalStep {
  currentEdge: WeightedGraphEdge | null;
  mstEdges: WeightedGraphEdge[];
  description: string;
  totalWeight: number;
}

class UnionFind {
  parent: number[];
  rank: number[];

  constructor(size: number) {
    this.parent = Array.from({ length: size }, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

export const runKruskal = (
  nodes: WeightedGraphNode[],
  edges: WeightedGraphEdge[]
): KruskalStep[] => {
  const steps: KruskalStep[] = [];
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(nodes.length);
  const mstEdges: WeightedGraphEdge[] = [];
  let totalWeight = 0;

  steps.push({
    currentEdge: null,
    mstEdges: [],
    description: "Sort edges by weight and initialize Union-Find structure",
    totalWeight: 0,
  });

  for (const edge of sortedEdges) {
    steps.push({
      currentEdge: edge,
      mstEdges: [...mstEdges],
      description: `Considering edge ${nodes[edge.from].label}-${nodes[edge.to].label} with weight ${edge.weight}`,
      totalWeight,
    });

    if (uf.union(edge.from, edge.to)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
      steps.push({
        currentEdge: edge,
        mstEdges: [...mstEdges],
        description: `Added edge ${nodes[edge.from].label}-${nodes[edge.to].label} to MST. Total weight: ${totalWeight}`,
        totalWeight,
      });
    } else {
      steps.push({
        currentEdge: edge,
        mstEdges: [...mstEdges],
        description: `Edge ${nodes[edge.from].label}-${nodes[edge.to].label} creates a cycle. Skipped.`,
        totalWeight,
      });
    }
  }

  steps.push({
    currentEdge: null,
    mstEdges: [...mstEdges],
    description: `MST complete! Total weight: ${totalWeight}`,
    totalWeight,
  });

  return steps;
};
