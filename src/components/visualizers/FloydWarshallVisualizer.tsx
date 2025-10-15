import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { runFloydWarshall, WeightedGraphNode, WeightedGraphEdge, FloydWarshallStep } from "@/utils/algorithms/floydWarshall";
import { VISUALIZATION_COLORS, VISUALIZATION_STYLES, ALGORITHM_SPECIFIC_COLORS } from "@/utils/visualizationConstants";

export const FloydWarshallVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<FloydWarshallStep[]>([]);
  const [nodes] = useState<WeightedGraphNode[]>([
    { id: 0, x: 150, y: 150, label: "A" },
    { id: 1, x: 350, y: 100, label: "B" },
    { id: 2, x: 550, y: 150, label: "C" },
    { id: 3, x: 250, y: 250, label: "D" },
  ]);
  const [edges] = useState<WeightedGraphEdge[]>([
    { from: 0, to: 1, weight: 3 },
    { from: 0, to: 3, weight: 7 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 2 },
    { from: 2, to: 3, weight: 5 },
  ]);

  useEffect(() => {
    resetVisualization();
  }, []);

  const resetVisualization = () => {
    const fwSteps = runFloydWarshall(nodes, edges);
    setSteps(fwSteps);
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

  const currentState = steps[currentStep] || { k: -1, i: -1, j: -1, dist: [], description: "", currentCell: null };

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
            {currentState.k >= 0 && currentState.k < nodes.length && (
              <span> | Using {nodes[currentState.k].label} as intermediate</span>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-4">Distance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted"></th>
                {nodes.map((node) => (
                  <th key={node.id} className="border border-border p-3 bg-muted font-mono">
                    {node.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState.dist.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 bg-muted font-mono font-semibold">
                    {nodes[i].label}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentCell &&
                                     currentState.currentCell.row === i &&
                                     currentState.currentCell.col === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-3 text-center transition-all duration-500 ${
                          isCurrent ? VISUALIZATION_COLORS.CELL_ACTIVE + " " + VISUALIZATION_STYLES.SCALE_ACTIVE + " font-bold" : VISUALIZATION_COLORS.CELL_DEFAULT
                        }`}
                      >
                        {cell === Infinity ? "∞" : cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <div className="relative w-full h-[300px] bg-background/50 rounded-lg border border-border overflow-hidden">
          <svg className="w-full h-full">
            {/* Draw all edges first */}
            {edges.map((edge, idx) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={VISUALIZATION_COLORS.EDGE_DEFAULT}
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <circle cx={midX} cy={midY} r="15" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-xs font-semibold select-none"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Draw highlighted path if considering i -> k -> j */}
            {currentState.i >= 0 && currentState.j >= 0 && currentState.k >= 0 && (
              <>
                {/* Path i -> k */}
                {(() => {
                  const iNode = nodes.find(n => n.id === currentState.i);
                  const kNode = nodes.find(n => n.id === currentState.k);
                  if (iNode && kNode) {
                    return (
                      <line
                        x1={iNode.x}
                        y1={iNode.y}
                        x2={kNode.x}
                        y2={kNode.y}
                        stroke={VISUALIZATION_COLORS.EDGE_CONSIDERED}
                        strokeWidth="4"
                        strokeDasharray="5,5"
                        className="transition-all duration-500"
                      />
                    );
                  }
                  return null;
                })()}

                {/* Path k -> j */}
                {(() => {
                  const kNode = nodes.find(n => n.id === currentState.k);
                  const jNode = nodes.find(n => n.id === currentState.j);
                  if (kNode && jNode) {
                    return (
                      <line
                        x1={kNode.x}
                        y1={kNode.y}
                        x2={jNode.x}
                        y2={jNode.y}
                        stroke={VISUALIZATION_COLORS.EDGE_CONSIDERED}
                        strokeWidth="4"
                        strokeDasharray="5,5"
                        className="transition-all duration-500"
                      />
                    );
                  }
                  return null;
                })()}

                {/* Direct path i -> j */}
                {(() => {
                  const iNode = nodes.find(n => n.id === currentState.i);
                  const jNode = nodes.find(n => n.id === currentState.j);
                  if (iNode && jNode) {
                    return (
                      <line
                        x1={iNode.x}
                        y1={iNode.y}
                        x2={jNode.x}
                        y2={jNode.y}
                        stroke={VISUALIZATION_COLORS.EDGE_ACTIVE}
                        strokeWidth="3"
                        className="transition-all duration-500"
                      />
                    );
                  }
                  return null;
                })()}
              </>
            )}

            {nodes.map((node) => {
              const isIntermediate = currentState.k >= 0 && node.id === currentState.k;
              const isCurrentI = currentState.i >= 0 && node.id === currentState.i;
              const isCurrentJ = currentState.j >= 0 && node.id === currentState.j;

              let fillColor: string = VISUALIZATION_COLORS.NODE_DEFAULT;
              if (isIntermediate) fillColor = VISUALIZATION_COLORS.NODE_INTERMEDIATE;
              else if (isCurrentI || isCurrentJ) fillColor = VISUALIZATION_COLORS.NODE_ACTIVE;

              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={fillColor}
                    stroke="hsl(var(--foreground))"
                    strokeWidth={isIntermediate || isCurrentI || isCurrentJ ? "3" : "2"}
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
                  {(isIntermediate || isCurrentI || isCurrentJ) && (
                    <text
                      x={node.x}
                      y={node.y + 35}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-xs select-none"
                    >
                      {isIntermediate ? "Intermediate" : isCurrentI ? "Start" : "End"}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </Card>

      {currentState.description && (
        <Card className="p-4 bg-secondary/10 border-secondary/20">
          <p className="text-sm">{currentState.description}</p>
        </Card>
      )}
    </div>
  );
};
