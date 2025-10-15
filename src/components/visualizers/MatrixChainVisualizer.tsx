import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runMatrixChain, MatrixChainStep } from "@/utils/algorithms/matrixChain";

export const MatrixChainVisualizer = () => {
  const [dimensions, setDimensions] = useState([10, 20, 30, 40, 30]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<MatrixChainStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [dimensions]);

  const resetVisualization = () => {
    if (dimensions.length >= 2) {
      const mcSteps = runMatrixChain(dimensions);
      setSteps(mcSteps);
      setCurrentStep(0);
      setIsPlaying(false);
    }
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

  const currentState = steps[currentStep];

  const handleDimensionsChange = (value: string) => {
    const nums = value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
    if (nums.length >= 2) {
      setDimensions(nums);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Dimensions:</label>
            <Input
              value={dimensions.join(', ')}
              onChange={(e) => handleDimensionsChange(e.target.value)}
              className="w-48"
              placeholder="10, 20, 30, 40, 30"
            />
          </div>

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
            Step: {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-4">DP Cost Table</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted"></th>
                {Array.from({ length: dimensions.length - 1 }, (_, i) => (
                  <th key={i} className="border border-border p-3 bg-muted font-mono">
                    M{i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 bg-muted font-mono font-semibold">
                    M{i}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentCell &&
                                     currentState.currentCell.row === i &&
                                     currentState.currentCell.col === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-3 text-center transition-all duration-500 ${
                          isCurrent ? "bg-current/30 scale-110 font-bold" : "bg-background"
                        }`}
                      >
                        {cell || ""}
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
        <h3 className="text-lg font-semibold mb-4">Matrix Chain</h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {dimensions.slice(0, -1).map((dim, i) => (
            <div key={i} className="flex items-center">
              <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-md text-sm font-mono">
                {dim}×{dimensions[i + 1]}
              </div>
              {i < dimensions.length - 2 && <span className="mx-2 text-muted-foreground">×</span>}
            </div>
          ))}
        </div>
      </Card>

      {currentState?.description && (
        <Card className="p-4 bg-secondary/10 border-secondary/20">
          <p className="text-sm">{currentState.description}</p>
        </Card>
      )}

      <Card className="p-4 bg-primary/10 border-primary/20">
        <h3 className="font-semibold mb-2">Minimum Operations:</h3>
        <p className="text-lg font-mono text-primary">
          {currentState?.dp[0]?.[dimensions.length - 2] || 0} operations
        </p>
      </Card>
    </div>
  );
};
