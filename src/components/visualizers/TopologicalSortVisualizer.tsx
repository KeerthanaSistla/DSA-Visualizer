import { Card } from "@/components/ui/card";

export const TopologicalSortVisualizer = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-2">Topological Sort</h3>
        <p className="text-muted-foreground">
          Visualization coming soon! Topological sort orders vertices in a directed acyclic graph such that for every edge u→v, u comes before v.
        </p>
      </Card>
    </div>
  );
};
