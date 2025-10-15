import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runFibonacci, FibStep } from "@/utils/algorithms/fibonacci";

export const FibonacciVisualizer = () => {
  const [n, setN] = useState(8);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<FibStep[]>([]);
  const [memo, setMemo] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    resetVisualization();
  }, [n]);

  const resetVisualization = () => {
    const fibSteps = runFibonacci(n);
    setSteps(fibSteps);
    setCurrentStep(0);
    setMemo(new Map());
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        setMemo(new Map(step.memo));
        setCurrentStep((prev) => prev + 1);
      }, 1000 - speed[0] * 9);
      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps, speed]);

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">N:</label>
            <Input
              type="number"
              value={n}
              onChange={(e) => setN(Math.max(1, Math.min(15, parseInt(e.target.value) || 1)))}
              className="w-20"
              min={1}
              max={15}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= steps.length}
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
            Step: {currentStep} / {steps.length}
          </div>
        </div>
      </Card>

      {/* Visualization */}
      <Card className="p-6 bg-card/50">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Memoization Table</h3>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: n + 1 }, (_, i) => i).map((i) => {
                const value = memo.get(i);
                const isCurrent = currentStepData?.computing === i;
                
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border-2 transition-all duration-500 ${
                      isCurrent
                        ? "border-current bg-current/20 scale-110"
                        : value !== undefined
                        ? "border-visited bg-visited/20"
                        : "border-unvisited bg-unvisited/20"
                    }`}
                  >
                    <div className="text-xs text-muted-foreground text-center">
                      fib({i})
                    </div>
                    <div className="text-center font-bold text-lg">
                      {value !== undefined ? value : "?"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {currentStepData && (
            <Card className="p-4 bg-primary/10 border-primary/20">
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-primary font-semibold">Computing:</span> fib(
                  {currentStepData.computing})
                </div>
                <div className="text-muted-foreground">{currentStepData.description}</div>
              </div>
            </Card>
          )}

          {currentStep >= steps.length && steps.length > 0 && (
            <Card className="p-4 bg-secondary/10 border-secondary/20">
              <div className="text-center">
                <span className="text-secondary font-semibold text-lg">
                  Result: fib({n}) = {memo.get(n)}
                </span>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Code Display */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Algorithm Code</h3>
        <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto">
          <code>{`function fibonacci(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  
  memo[n] = fibonacci(n - 1, memo) + 
            fibonacci(n - 2, memo);
  return memo[n];
}`}</code>
        </pre>
      </Card>
    </div>
  );
};
