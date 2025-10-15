import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type GraphAlgorithm = 
  | "bfs" 
  | "dfs" 
  | "dijkstra" 
  | "bellman-ford" 
  | "kruskal" 
  | "prim" 
  | "topological-sort" 
  | "floyd-warshall";

export type DPAlgorithm = 
  | "fibonacci" 
  | "knapsack" 
  | "lcs" 
  | "matrix-chain" 
  | "subset-sum" 
  | "coin-change" 
  | "edit-distance";

interface AlgorithmSelectorProps {
  type: "graph" | "dp";
  value: string;
  onChange: (value: string) => void;
}

const graphAlgorithms = [
  { value: "bfs", label: "BFS - Breadth First Search" },
  { value: "dfs", label: "DFS - Depth First Search" },
  { value: "dijkstra", label: "Dijkstra's Shortest Path" },
  { value: "bellman-ford", label: "Bellman-Ford Algorithm" },
  { value: "kruskal", label: "Kruskal's MST" },
  { value: "prim", label: "Prim's MST" },
  { value: "topological-sort", label: "Topological Sort" },
  { value: "floyd-warshall", label: "Floyd-Warshall (All Pairs)" },
];

const dpAlgorithms = [
  { value: "fibonacci", label: "Fibonacci Sequence" },
  { value: "knapsack", label: "0/1 Knapsack Problem" },
  { value: "lcs", label: "Longest Common Subsequence" },
  { value: "matrix-chain", label: "Matrix Chain Multiplication" },
  { value: "subset-sum", label: "Subset Sum Problem" },
  { value: "coin-change", label: "Coin Change Problem" },
  { value: "edit-distance", label: "Edit Distance (Levenshtein)" },
];

export const AlgorithmSelector = ({ type, value, onChange }: AlgorithmSelectorProps) => {
  const algorithms = type === "graph" ? graphAlgorithms : dpAlgorithms;

  return (
    <div className="space-y-2">
      <Label htmlFor="algorithm-select" className="text-sm font-medium">
        Select Algorithm
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="algorithm-select" className="w-full max-w-md">
          <SelectValue placeholder="Choose an algorithm..." />
        </SelectTrigger>
        <SelectContent>
          {algorithms.map((algo) => (
            <SelectItem key={algo.value} value={algo.value}>
              {algo.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
