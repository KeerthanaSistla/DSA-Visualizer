// Visualization color and style constants for consistent theming across all algorithm visualizers

export const VISUALIZATION_COLORS = {
  // Node states
  NODE_DEFAULT: "hsl(var(--background))",
  NODE_ACTIVE: "hsl(var(--primary))",
  NODE_INTERMEDIATE: "hsl(var(--destructive))",
  NODE_VISITED: "hsl(var(--secondary))",
  NODE_CURRENT: "hsl(var(--accent))",

  // Edge states
  EDGE_DEFAULT: "hsl(var(--border))",
  EDGE_ACTIVE: "hsl(var(--primary))",
  EDGE_CONSIDERED: "hsl(var(--destructive))",
  EDGE_INCLUDED: "hsl(var(--primary))",
  EDGE_EXCLUDED: "hsl(var(--muted-foreground))",

  // Cell/Table states
  CELL_DEFAULT: "bg-background",
  CELL_ACTIVE: "bg-current/30",
  CELL_HIGHLIGHT: "bg-primary/20",
  CELL_VISITED: "bg-secondary/20",

  // Text colors
  TEXT_DEFAULT: "fill-foreground",
  TEXT_ACTIVE: "fill-primary",
  TEXT_HIGHLIGHT: "fill-destructive",
} as const;

export const VISUALIZATION_STYLES = {
  // Line styles
  LINE_SOLID: "strokeWidth='3'",
  LINE_DASHED: "strokeWidth='4' strokeDasharray='5,5'",
  LINE_DOTTED: "strokeWidth='2' strokeDasharray='2,2'",

  // Node styles
  NODE_DEFAULT_RADIUS: 25,
  NODE_ACTIVE_RADIUS: 28,
  NODE_HIGHLIGHT_STROKE: "strokeWidth='3'",
  NODE_DEFAULT_STROKE: "strokeWidth='2'",

  // Animation
  TRANSITION_DURATION: "transition-all duration-500",
  SCALE_ACTIVE: "scale-110",
  SCALE_HIGHLIGHT: "scale-105",

  // Common classes
  CARD_STYLE: "p-6 bg-card/50",
  CONTROL_CARD_STYLE: "p-4 bg-muted/50",
  DESCRIPTION_CARD_STYLE: "p-4 bg-secondary/10 border-secondary/20",
} as const;

export const ALGORITHM_SPECIFIC_COLORS = {
  // Graph algorithms
  MST_INCLUDED: "hsl(var(--primary))",
  MST_CONSIDERED: "hsl(var(--destructive))",
  MST_EXCLUDED: "hsl(var(--muted-foreground))",

  // Path finding
  PATH_CURRENT: "hsl(var(--primary))",
  PATH_VISITED: "hsl(var(--secondary))",
  PATH_SHORTEST: "hsl(var(--accent))",

  // DP algorithms
  DP_CURRENT: "bg-current/30",
  DP_IMPROVED: "bg-primary/20",
  DP_NO_CHANGE: "bg-background",

  // Sorting
  SORT_COMPARE: "hsl(var(--destructive))",
  SORT_SWAP: "hsl(var(--primary))",
  SORT_SORTED: "hsl(var(--secondary))",
} as const;
