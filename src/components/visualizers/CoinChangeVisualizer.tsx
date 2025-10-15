import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { runCoinChange, CoinChangeStep } from "@/utils/algorithms/coinChange";

export const CoinChangeVisualizer = () => {
  const [coins, setCoins] = useState([1, 2, 5]);
  const [amount, setAmount] = useState(11);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([50]);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<CoinChangeStep[]>([]);

  useEffect(() => {
    resetVisualization();
  }, [coins, amount]);

  const resetVisualization = () => {
    if (coins.length > 0 && amount >= 0) {
      const ccSteps = runCoinChange(coins, amount);
      setSteps(ccSteps);
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

  const handleCoinsChange = (value: string) => {
    const coinsArray = value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
    if (coinsArray.length > 0) {
      setCoins(coinsArray);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-muted/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Coins:</label>
            <Input
              value={coins.join(', ')}
              onChange={(e) => handleCoinsChange(e.target.value)}
              className="w-32"
              placeholder="1, 2, 5"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Amount:</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
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
        <h3 className="text-lg font-semibold mb-4">DP Array</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-1">
            {currentState?.dp.map((value, idx) => {
              const isCurrent = currentState.currentCell === idx;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center p-3 border rounded-md transition-all duration-500 min-w-[60px] ${
                    isCurrent ? "bg-current/30 scale-110 border-current" : "bg-background border-border"
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">{idx}</div>
                  <div className="font-mono font-semibold">
                    {value === Infinity ? "∞" : value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-4">Coins</h3>
        <div className="flex flex-wrap gap-2">
          {coins.map((coin, idx) => (
            <div
              key={idx}
              className={`px-4 py-2 rounded-md text-sm font-mono border ${
                currentState?.currentCoin === idx
                  ? "bg-current/20 border-current"
                  : "bg-primary/10 border-primary/20"
              }`}
            >
              {coin}
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
        <h3 className="font-semibold mb-2">Minimum Coins:</h3>
        <p className="text-lg font-mono">
          For amount {amount}:
          <span className={`ml-2 font-bold ${currentState?.dp[amount] !== Infinity ? 'text-green-600' : 'text-red-600'}`}>
            {currentState?.dp[amount] === Infinity ? 'Impossible' : currentState?.dp[amount]}
          </span>
        </p>
      </Card>
    </div>
  );
};
