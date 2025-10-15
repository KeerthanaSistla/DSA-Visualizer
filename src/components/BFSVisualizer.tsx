import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { runBFS, GraphNode, GraphEdge } from "@/utils/algorithms/bfs";

interface VisualizationState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode: number | null;
  queue: number[];
  visited: Set<number>;
  step: number;
  isComplete: boolean;
}

export const BFSVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [state, setState] = useState<VisualizationState>({
    nodes: [],
    edges: [],
    currentNode: null,
    queue: [],
    visited: new Set(),
    step: 0,
    isComplete: false,
  });

  // Initialize graph
  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const initialNodes: GraphNode[] = [
      { id: 0, x: 300, y: 100, label: "0" },
      { id: 1, x: 200, y: 200, label: "1" },
      { id: 2, x: 400, y: 200, label: "2" },
      { id: 3, x: 150, y: 300, label: "3" },
      { id: 4, x: 250, y: 300, label: "4" },
      { id: 5, x: 350, y: 300, label: "5" },
      { id: 6, x: 450, y: 300, label: "6" },
    ];

    const initialEdges: GraphEdge[] = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ];

    setState({
      nodes: initialNodes,
      edges: initialEdges,
      currentNode: null,
      queue: [],
      visited: new Set(),
      step: 0,
      isComplete: false,
    });
    setIsPlaying(false);
  };

  const stepForward = useCallback(() => {
    if (state.isComplete) return;

    const steps = runBFS(state.nodes, state.edges);
    if (state.step < steps.length) {
      const nextStep = steps[state.step];
      setState((prev) => ({
        ...prev,
        currentNode: nextStep.current,
        queue: nextStep.queue,
        visited: new Set(nextStep.visited),
        step: prev.step + 1,
        isComplete: prev.step + 1 >= steps.length,
      }));
    }
  }, [state]);

  useEffect(() => {
    if (isPlaying && !state.isComplete) {
      const timer = setTimeout(() => {
        stepForward();
      }, 1000 - speed[0] * 9);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, state.isComplete, speed, stepForward]);

  const getNodeColor = (nodeId: number) => {
    if (state.currentNode === nodeId) return "hsl(var(--current))";
    if (state.visited.has(nodeId)) return "hsl(var(--visited))";
    return "hsl(var(--unvisited))";
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={state.isComplete}
              size="sm"
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button onClick={resetVisualization} size="sm" variant="outline">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 min-w-[200px] max-w-xs">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Speed:</span>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={100}
                min={10}
                step={10}
                className="flex-1"
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Step: {state.step} | Queue: [{state.queue.join(", ")}]
          </div>
        </div>
      </Card>

      {/* Visualization Canvas */}
      <Card className="p-6 bg-card/50">
        <div className="relative w-full h-[400px] bg-background/50 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full">
            {/* Edges */}
            {state.edges.map((edge, idx) => {
              const fromNode = state.nodes.find((n) => n.id === edge.from);
              const toNode = state.nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {state.nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  fill={getNodeColor(node.id)}
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-semibold text-lg select-none"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-unvisited border-2 border-foreground" />
          <span className="text-muted-foreground">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-current border-2 border-foreground" />
          <span className="text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-visited border-2 border-foreground" />
          <span className="text-muted-foreground">Visited</span>
        </div>
      </div>
    </div>
  );
};
