import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runSubsetSum, SubsetSumStep } from "@/utils/algorithms/subsetSum";

export const SubsetSumVisualizer = () => {
  const [nums, setNums] = useState([3, 34, 4, 12, 5, 2]);
  const [target, setTarget] = useState(9);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SubsetSumStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [nums, target]);

  const resetVisualization = () => {
    if (nums.length > 0 && target >= 0) {
      const ssSteps = runSubsetSum(nums, target);
      setSteps(ssSteps);
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

  const handleNumsChange = (value: string) => {
    const numsArray = value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    if (numsArray.length > 0) {
      setNums(numsArray);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Numbers:</label>
            <Input
              value={nums.join(', ')}
              onChange={(e) => handleNumsChange(e.target.value)}
              className="w-48"
              placeholder="3, 34, 4, 12, 5, 2"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Target:</label>
            <Input
              type="number"
              value={target}
              onChange={(e) => setTarget(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20"
              min={0}
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
        <h3 className="text-lg font-semibold mb-4">DP Table</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-3 bg-muted"></th>
                {Array.from({ length: target + 1 }, (_, j) => (
                  <th key={j} className="border border-border p-3 bg-muted font-mono">
                    {j}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-3 bg-muted font-mono font-semibold">
                    {i === 0 ? "∅" : nums[i - 1]}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentCell &&
                                     currentState.currentCell.row === i &&
                                     currentState.currentCell.col === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-3 text-center transition-all duration-500 ${
                          isCurrent ? "bg-current/30 scale-110 font-bold" :
                          cell ? "bg-primary/20" : "bg-background"
                        }`}
                      >
                        {cell ? "✓" : "✗"}
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
        <h3 className="text-lg font-semibold mb-4">Numbers</h3>
        <div className="flex flex-wrap gap-2">
          {nums.map((num, idx) => (
            <div
              key={idx}
              className={`px-4 py-2 rounded-md text-sm font-mono border ${
                currentState?.currentItem === idx
                  ? "bg-current/20 border-current"
                  : "bg-primary/10 border-primary/20"
              }`}
            >
              {num}
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
        <h3 className="font-semibold mb-2">Result:</h3>
        <p className="text-lg font-mono">
          Can we make sum {target}?
          <span className={`ml-2 font-bold ${currentState?.dp[nums.length]?.[target] ? 'text-green-600' : 'text-red-600'}`}>
            {currentState?.dp[nums.length]?.[target] ? 'YES' : 'NO'}
          </span>
        </p>
      </Card>
    </div>
  );
};
