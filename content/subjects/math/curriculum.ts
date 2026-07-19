import type { MathChapterMeta } from "./types";

// Curriculum map for 東京書籍『新編 新しい数学1』(中1). Adding a 章/節 is a
// data change only — colors here drive every block/home component.
export const mathChapters: MathChapterMeta[] = [
  {
    id: "0",
    num: "0",
    title: "算数から数学へ",
    subtitle: "整数の性質・素数",
    color: "#a89b3c",
    tint: "#f2efd9",
    dark: "#7c7222",
    sections: [{ id: "math-0-1", chapterId: "0", number: 1, name: "整数の性質", pages: "p.11–18", status: "done" }]
  },
  {
    id: "1",
    num: "1",
    title: "正負の数",
    subtitle: "符号のついた数・加法と減法・乗法と除法",
    color: "#c9804f",
    tint: "#f8e9dc",
    dark: "#a05c30",
    sections: [
      { id: "math-1-1", chapterId: "1", number: 1, name: "1節 正負の数", pages: "p.19–28", status: "done" },
      { id: "math-1-2", chapterId: "1", number: 2, name: "2節 加法と減法", pages: "p.29–40", status: "done" },
      { id: "math-1-3", chapterId: "1", number: 3, name: "3節 乗法と除法", pages: "p.41–56", status: "done" },
      { id: "math-1-4", chapterId: "1", number: 4, name: "4節 正負の数の利用", pages: "p.57–59", status: "done" },
      { id: "math-1-5", chapterId: "1", number: 5, name: "章末問題 A・B", pages: "p.60–62", status: "done" }
    ]
  },
  {
    id: "2",
    num: "2",
    title: "文字と式",
    subtitle: "文字を使った式・文字式の計算・文字式の利用",
    color: "#d9b23a",
    tint: "#f9f0d3",
    dark: "#9c7c14",
    sections: [
      { id: "math-2-1", chapterId: "2", number: 1, name: "1節 文字を使った式", pages: "p.64–74", status: "done" },
      { id: "math-2-2", chapterId: "2", number: 2, name: "2節 文字式の計算", pages: "p.75–82", status: "done" },
      { id: "math-2-3", chapterId: "2", number: 3, name: "3節 文字式の利用", pages: "p.83–87", status: "done" },
      { id: "math-2-4", chapterId: "2", number: 4, name: "章末問題 A・B", pages: "p.88–90", status: "done" }
    ]
  },
  {
    id: "3",
    num: "3",
    title: "方程式",
    subtitle: "方程式とその解き方・活用",
    color: "#d4708c",
    tint: "#f9e6ec",
    dark: "#a84763",
    sections: [
      { id: "math-3-1", chapterId: "3", number: 1, name: "1節 方程式とその解き方", pages: "p.92–102", status: "done" },
      { id: "math-3-2", chapterId: "3", number: 2, name: "2節 1次方程式の利用", pages: "p.103–111", status: "done" },
      { id: "math-3-3", chapterId: "3", number: 3, name: "章末問題 A・B", pages: "p.114–116", status: "now" }
    ]
  },
  {
    id: "4",
    num: "4",
    title: "比例と反比例",
    subtitle: "関数・比例・反比例・活用",
    color: "#6aa564",
    tint: "#e8f1e6",
    dark: "#47793f",
    sections: [
      { id: "math-4-1", chapterId: "4", number: 1, name: "1節 関数と比例", pages: "p.114–129", status: "todo" },
      { id: "math-4-2", chapterId: "4", number: 2, name: "2節 反比例", pages: "p.130–139", status: "todo" },
      { id: "math-4-3", chapterId: "4", number: 3, name: "3節 比例と反比例の活用", pages: "p.140–148", status: "todo" }
    ]
  },
  {
    id: "5",
    num: "5",
    title: "平面図形",
    subtitle: "図形の移動・基本の作図",
    color: "#3aa6a0",
    tint: "#e2f2f1",
    dark: "#20736e",
    sections: [
      { id: "math-5-1", chapterId: "5", number: 1, name: "1節 図形の移動", pages: "p.150–163", status: "todo" },
      { id: "math-5-2", chapterId: "5", number: 2, name: "2節 基本の作図", pages: "p.164–180", status: "todo" }
    ]
  },
  {
    id: "6",
    num: "6",
    title: "空間図形",
    subtitle: "立体の見方・体積と表面積",
    color: "#4d7fc0",
    tint: "#e5edf8",
    dark: "#31578c",
    sections: [
      { id: "math-6-1", chapterId: "6", number: 1, name: "1節 いろいろな立体", pages: "p.182–199", status: "todo" },
      { id: "math-6-2", chapterId: "6", number: 2, name: "2節 立体の体積と表面積", pages: "p.200–214", status: "todo" }
    ]
  },
  {
    id: "7",
    num: "7",
    title: "データの活用",
    subtitle: "度数分布・ことがらの起こりやすさ",
    color: "#8d7fb5",
    tint: "#efecf5",
    dark: "#63558c",
    sections: [
      { id: "math-7-1", chapterId: "7", number: 1, name: "1節 度数の分布", pages: "p.216–233", status: "todo" },
      { id: "math-7-2", chapterId: "7", number: 2, name: "2節 起こりやすさ", pages: "p.234–240", status: "todo" }
    ]
  }
];

export function getMathChapter(chapterId: string) {
  return mathChapters.find((chapter) => chapter.id === chapterId);
}

export function getMathSectionMeta(chapterId: string, sectionId: string) {
  const chapter = getMathChapter(chapterId);
  return chapter?.sections.find((section) => section.id === sectionId);
}

export function getAdjacentSections(chapterId: string, sectionId: string) {
  const chapter = getMathChapter(chapterId);
  if (!chapter) return { prev: null, next: null };
  const index = chapter.sections.findIndex((section) => section.id === sectionId);
  return {
    prev: index > 0 ? chapter.sections[index - 1] : null,
    next: index >= 0 && index < chapter.sections.length - 1 ? chapter.sections[index + 1] : null
  };
}

export const mathTotalSectionCount = mathChapters.reduce((sum, chapter) => sum + chapter.sections.length, 0);
