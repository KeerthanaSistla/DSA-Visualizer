import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runKnapsack, KnapsackStep, Item } from "@/utils/algorithms/knapsack";

export const KnapsackVisualizer = () => {
  const [capacity, setCapacity] = useState(10);
  const [items, setItems] = useState<Item[]>([
    { weight: 2, value: 12, name: "Item 1" },
    { weight: 1, value: 10, name: "Item 2" },
    { weight: 3, value: 20, name: "Item 3" },
    { weight: 2, value: 15, name: "Item 4" },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<KnapsackStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [capacity, items]);

  const resetVisualization = () => {
    const knapsackSteps = runKnapsack(items, capacity);
    setSteps(knapsackSteps);
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

  const currentState = steps[currentStep];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Capacity:</label>
            <Input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
              min={1}
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
              <Slider value={speed} onValueChange={setSpeed} max={100} min={10} step={10} className="flex-1" />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Step: {currentStep + 1} / {steps.length}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {items.map((item, idx) => (
            <div key={idx} className="p-3 bg-muted rounded-lg border border-border">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-muted-foreground">
                W: {item.weight}, V: {item.value}
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">DP Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-border p-2 bg-muted text-xs">Item / Cap</th>
                {Array.from({ length: capacity + 1 }, (_, i) => (
                  <th key={i} className="border border-border p-2 bg-muted text-xs">
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentState?.dp.map((row, i) => (
                <tr key={i}>
                  <td className="border border-border p-2 bg-muted text-xs font-semibold">
                    {i === 0 ? "0" : items[i - 1]?.name}
                  </td>
                  {row.map((cell, j) => {
                    const isCurrent = currentState.currentRow === i && currentState.currentCol === j;
                    return (
                      <td
                        key={j}
                        className={`border border-border p-2 text-center transition-all duration-500 ${
                          isCurrent ? "bg-current/30 scale-110 font-bold" : "bg-background"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {currentState?.description && (
        <Card className="p-4 bg-primary/10 border-primary/20">
          <p className="text-sm">{currentState.description}</p>
        </Card>
      )}
    </div>
  );
};
