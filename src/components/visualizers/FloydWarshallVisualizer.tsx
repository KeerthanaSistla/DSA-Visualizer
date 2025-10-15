import { Card } from "@/components/ui/card";

export const FloydWarshallVisualizer = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-2">Floyd-Warshall Algorithm</h3>
        <p className="text-muted-foreground">
          Visualization coming soon! Floyd-Warshall finds shortest paths between all pairs of vertices using dynamic programming.
        </p>
      </Card>
    </div>
  );
};
