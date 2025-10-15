import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { runTopologicalSort, GraphNode, GraphEdge, TopologicalSortStep } from "@/utils/algorithms/topologicalSort";

export const TopologicalSortVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TopologicalSortStep[]>([]);
  const [nodes] = useState<GraphNode[]>([
    { id: 0, x: 150, y: 150, label: "A" },
    { id: 1, x: 350, y: 100, label: "B" },
    { id: 2, x: 550, y: 150, label: "C" },
    { id: 3, x: 250, y: 250, label: "D" },
    { id: 4, x: 450, y: 250, label: "E" },
  ]);
  const [edges] = useState<GraphEdge[]>([
    { from: 0, to: 1 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 1, to: 4 },
    { from: 3, to: 4 },
    { from: 4, to: 2 },
  ]);

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const topoSteps = runTopologicalSort(nodes, edges);
    setSteps(topoSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1000 - speed[0] * 9);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, speed]);

  const currentState = steps[currentStep] || { currentNode: null, stack: [], visited: new Set(), visiting: new Set(), hasCycle: false, description: "" };

  const getNodeColor = (nodeId: number) => {
    if (currentState.visiting.has(nodeId)) return "hsl(var(--current))";
    if (currentState.visited.has(nodeId)) return "hsl(var(--visited))";
    return "hsl(var(--unvisited))";
  };

  const getNodeStatus = (nodeId: number) => {
    if (currentState.visiting.has(nodeId)) return "Visiting";
    if (currentState.visited.has(nodeId)) return "Visited";
    return "Unvisited";
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= steps.length - 1}
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
              <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="flex-1" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Step: {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <div className="relative w-full h-[400px] bg-background/50 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full">
            {/* Edges with arrows */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              // Calculate arrow position
              const dx = toNode.x - fromNode.x;
              const dy = toNode.y - fromNode.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const arrowLength = 25;
              const arrowX = toNode.x - (dx / length) * arrowLength;
              const arrowY = toNode.y - (dy / length) * arrowLength;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={arrowX}
                    y2={arrowY}
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                    className="transition-all duration-300"
                  />
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill="hsl(var(--border))"
                      />
                    </marker>
                  </defs>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
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
                  y={node.y - 5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground font-semibold text-lg select-none"
                >
                  {node.label}
                </text>
                <text
                  x={node.x}
                  y={node.y + 12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-foreground text-xs select-none"
                >
                  {getNodeStatus(node.id)}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      <Card className="p-4 bg-primary/10 border-primary/20">
        <h3 className="font-semibold mb-2">Topological Order:</h3>
        <div className="flex flex-wrap gap-2">
          {currentState.stack.map((nodeId, idx) => (
            <div key={idx} className="px-3 py-1 bg-primary/20 rounded-md text-sm font-mono">
              {idx + 1}. {nodes[nodeId].label}
            </div>
          ))}
        </div>
        {currentState.stack.length > 0 && (
          <p className="text-sm font-semibold mt-2">
            Order: <span className="font-mono text-primary">
              {currentState.stack.map(id => nodes[id].label).join(' → ')}
            </span>
          </p>
        )}
      </Card>

      {currentState.description && (
        <Card className={`p-4 border-secondary/20 ${currentState.hasCycle ? 'bg-destructive/10 border-destructive/20' : 'bg-secondary/10'}`}>
          <p className="text-sm">{currentState.description}</p>
          {currentState.hasCycle && (
            <p className="text-sm font-semibold text-destructive mt-1">
              ⚠️ Cycle detected! Topological sort not possible.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};
