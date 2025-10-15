import { Card } from "@/components/ui/card";

export const EditDistanceVisualizer = () => {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50">
        <h3 className="text-lg font-semibold mb-2">Edit Distance (Levenshtein)</h3>
        <p className="text-muted-foreground">
          Visualization coming soon! Calculates the minimum number of operations (insert, delete, replace) to transform one string into another.
        </p>
      </Card>
    </div>
  );
};
