export type MathGrade = "g1" | "g2" | "g3";

export type MathGradeMeta = {
  key: MathGrade;
  label: string;
  book: string;
};

// 学年ごとの教科書名。中2・中3は章データが揃うまで空の教科書として扱う。
export const mathGrades: MathGradeMeta[] = [
  { key: "g1", label: "中1", book: "新しい数学1" },
  { key: "g2", label: "中2", book: "新しい数学2" },
  { key: "g3", label: "中3", book: "新しい数学3" }
];
