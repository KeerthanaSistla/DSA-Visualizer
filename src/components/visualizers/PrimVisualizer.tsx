import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { runPrim, WeightedGraphNode, WeightedGraphEdge, PrimStep } from "@/utils/algorithms/prim";

export const PrimVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<PrimStep[]>([]);
  const [nodes] = useState<WeightedGraphNode[]>([
    { id: 0, x: 150, y: 150, label: "A" },
    { id: 1, x: 350, y: 100, label: "B" },
    { id: 2, x: 550, y: 150, label: "C" },
    { id: 3, x: 250, y: 250, label: "D" },
    { id: 4, x: 450, y: 250, label: "E" },
  ]);
  const [edges] = useState<WeightedGraphEdge[]>([
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 3, weight: 2 },
    { from: 1, to: 2, weight: 6 },
    { from: 1, to: 3, weight: 3 },
    { from: 1, to: 4, weight: 5 },
    { from: 2, to: 4, weight: 1 },
    { from: 3, to: 4, weight: 7 },
  ]);

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const primSteps = runPrim(nodes, edges, 0);
    setSteps(primSteps);
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

  const currentState = steps[currentStep] || { currentNode: null, currentEdge: null, mstEdges: [], totalWeight: 0, visited: new Set(), description: "" };

  const isEdgeInMST = (edge: WeightedGraphEdge) => {
    return currentState.mstEdges.some(mstEdge =>
      (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
      (mstEdge.from === edge.to && mstEdge.to === edge.from)
    );
  };

  const isCurrentEdge = (edge: WeightedGraphEdge) => {
    return currentState.currentEdge &&
           ((currentState.currentEdge.from === edge.from && currentState.currentEdge.to === edge.to) ||
            (currentState.currentEdge.from === edge.to && currentState.currentEdge.to === edge.from));
  };

  const getNodeColor = (nodeId: number) => {
    if (currentState.currentNode === nodeId) return "hsl(var(--current))";
    if (currentState.visited.has(nodeId)) return "hsl(var(--visited))";
    return "hsl(var(--unvisited))";
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
            Step: {currentStep + 1} / {steps.length} | MST Weight: {currentState.totalWeight}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <div className="relative w-full h-[400px] bg-background/50 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full">
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;
              const inMST = isEdgeInMST(edge);
              const isCurrent = isCurrentEdge(edge);

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isCurrent ? "hsl(var(--current))" : inMST ? "hsl(var(--primary))" : "hsl(var(--border))"}
                    strokeWidth={isCurrent ? "4" : inMST ? "3" : "2"}
                    className="transition-all duration-500"
                  />
                  <circle
                    cx={midX}
                    cy={midY}
                    r="15"
                    fill={inMST ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`text-xs font-semibold select-none ${inMST ? "fill-primary-foreground" : "fill-foreground"}`}
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

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

      <Card className="p-4 bg-primary/10 border-primary/20">
        <h3 className="font-semibold mb-2">MST Edges:</h3>
        <div className="flex flex-wrap gap-2">
          {currentState.mstEdges.map((edge, idx) => (
            <div key={idx} className="px-3 py-1 bg-primary/20 rounded-md text-sm font-mono">
              {nodes[edge.from].label}-{nodes[edge.to].label}({edge.weight})
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold mt-2">
          Total Weight: <span className="text-primary">{currentState.totalWeight}</span>
        </p>
      </Card>

      {currentState.description && (
        <Card className="p-4 bg-secondary/10 border-secondary/20">
          <p className="text-sm">{currentState.description}</p>
        </Card>
      )}
    </div>
  );
};
