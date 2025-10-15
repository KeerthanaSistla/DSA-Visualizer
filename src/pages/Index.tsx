import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { BFSVisualizer } from "@/components/BFSVisualizer";
import { FibonacciVisualizer } from "@/components/FibonacciVisualizer";
import { Network, Brain } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("graph");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            DSA Visualizer
          </h1>
          <p className="text-muted-foreground mt-1">
            Interactive algorithm visualization for learning and understanding
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card className="border-border bg-card/80 backdrop-blur-sm p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="graph" className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                Graph Algorithms
              </TabsTrigger>
              <TabsTrigger value="dp" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Dynamic Programming
              </TabsTrigger>
            </TabsList>

            <TabsContent value="graph" className="mt-0">
              <BFSVisualizer />
            </TabsContent>

            <TabsContent value="dp" className="mt-0">
              <FibonacciVisualizer />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="p-6 border-primary/20 bg-primary/5">
            <h3 className="font-semibold text-primary mb-2">Step-by-Step</h3>
            <p className="text-sm text-muted-foreground">
              Watch algorithms execute with animated visualizations
            </p>
          </Card>
          <Card className="p-6 border-secondary/20 bg-secondary/5">
            <h3 className="font-semibold text-secondary mb-2">Interactive Controls</h3>
            <p className="text-sm text-muted-foreground">
              Play, pause, and adjust speed to learn at your pace
            </p>
          </Card>
          <Card className="p-6 border-accent/20 bg-accent/5">
            <h3 className="font-semibold text-accent mb-2">Educational</h3>
            <p className="text-sm text-muted-foreground">
              Perfect for students and developers learning DSA
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
