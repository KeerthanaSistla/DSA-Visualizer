import { Card } from "@/components/ui/card";

export const PrimVisualizer = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-2">Prim's MST Algorithm</h3>
        <p className="text-muted-foreground">
          Visualization coming soon! Prim's algorithm builds a minimum spanning tree by greedily selecting the minimum weight edge from the current tree.
        </p>
      </Card>
    </div>
  );
};
