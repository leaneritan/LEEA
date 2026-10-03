import type { AcademicGoals, ReviewCardState, SchoolTest, SchoolTestSettings } from "@/data/schoolTests/types";

export type TabId = "overview" | "sheet" | "trend" | "compare" | "weak" | "questions" | "cards" | "plan" | "goals" | "print";

export type DashCtx = {
  tests: SchoolTest[];
  test: SchoolTest;
  setTestId: (id: string) => void;
  students: number;
  goals: AcademicGoals;
  settings: SchoolTestSettings;
  updateSettings: (patch: Partial<SchoolTestSettings>) => void;
  cardStates: Record<string, ReviewCardState>;
  updateCard: (base: ReviewCardState, patch: Partial<ReviewCardState>) => ReviewCardState;
  goTo: (tab: TabId) => void;
};
