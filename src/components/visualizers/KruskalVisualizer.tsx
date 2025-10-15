import { Card } from "@/components/ui/card";

export const KruskalVisualizer = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-2">Kruskal's MST Algorithm</h3>
        <p className="text-muted-foreground">
          Visualization coming soon! Kruskal's algorithm finds the minimum spanning tree by sorting edges by weight and adding them if they don't create a cycle.
        </p>
      </Card>
    </div>
  );
};
