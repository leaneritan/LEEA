import type { CoreSubject } from "./types";

// Where to go to fix a missed question: the textbook section and, when LEEA
// has it, the page that teaches it. Rules are matched against
// "<領域名> <問題内容>" — first match wins — so they keep working for new
// tests as long as the score reports use the same words.

export type StudyLink = {
  /** Short label, e.g. "1章3節 乗法と除法". */
  label: string;
  /** Book and pages, when known. */
  book?: string;
  /** LEEA route that teaches it. */
  href?: string;
};

type Rule = { match: RegExp; link: StudyLink };

const MATH_BOOK = "新しい数学1";
const SCIENCE_BOOK = "新しい科学1";

const rules: Record<CoreSubject, Rule[]> = {
  math: [
    { match: /素数|逆数|乗法|除法|四則/, link: { label: "1章3節 乗法と除法", book: `${MATH_BOOK} p.41–56`, href: "/math/1/math-1-3" } },
    { match: /加法|減法/, link: { label: "1章2節 加法と減法", book: `${MATH_BOOK} p.29–40`, href: "/math/1/math-1-2" } },
    { match: /大小|絶対値|反対の性質|数の範囲|正の数・負の数\s/, link: { label: "1章1節 正負の数", book: `${MATH_BOOK} p.19–28`, href: "/math/1/math-1-1" } },
    { match: /利用|平均|記録|合計点|得点の比較|個数/, link: { label: "1章4節 正負の数の利用", book: `${MATH_BOOK} p.57–59`, href: "/math/1/math-1-4" } },
    { match: /文字式の計算/, link: { label: "2章2節 文字式の計算", book: `${MATH_BOOK} p.75–82`, href: "/math/2/math-2-2" } },
    { match: /文字|表し方|式の値/, link: { label: "2章1節 文字を使った式", book: `${MATH_BOOK} p.64–74`, href: "/math/2/math-2-1" } }
  ],
  science: [
    { match: /身近な生物/, link: { label: "単元1 1章 生物の観察と分類のしかた", book: `${SCIENCE_BOOK} p.14–21`, href: "/science/u1-c1/sci-u1-c1-1" } },
    { match: /花|イヌワラビ|植物|シダ|コケ|種子/, link: { label: "単元1 2章 植物の分類", book: `${SCIENCE_BOOK} p.27–44`, href: "/science" } },
    { match: /動物|脊椎|骨格|昆虫|魚類|胎生|羽毛/, link: { label: "単元1 3章 動物の分類", book: `${SCIENCE_BOOK} p.45–62`, href: "/science" } }
  ],
  social: [
    { match: /時差|日付変更線/, link: { label: "地理：時差", href: "/geography/jisa-map" } },
    { match: /日本の姿|日本の範囲|日本の位置|領空|排他的|沖ノ鳥島|北方領土/, link: { label: "地理：日本の姿（地図帳で確認）" } },
    { match: /世界の姿|地球|陸地|海洋|州|内陸国|国々|地図|子午線|方位/, link: { label: "地理：世界の姿", href: "/geography/sekai-no-sugata-map" } },
    { match: /猿人|原人|氷河|石器/, link: { label: "歴史：人類の出現（年表）", href: "/history/nenpyou-viewer" } },
    { match: /文明|宗教|仏教|キリスト|儒|黄河|甲骨|万里|シルクロード|ポリス|アテネ|ローマ|ハンムラビ/, link: { label: "歴史：古代文明と宗教", href: "/geography/kodai-bunmei-map" } }
  ],
  japanese: [
    { match: /書き取り/, link: { label: "漢字：書き取り練習（3回書く→テスト）" } },
    { match: /読み取り/, link: { label: "漢字：読みの確認（音読み・訓読み）" } },
    { match: /漢字の知識|総画数|部首/, link: { label: "漢字：知識（部首・画数・熟語）" } },
    { match: /作文/, link: { label: "作文：条件（字数・段落・内容）を確認して書き直す" } },
    { match: /記述/, link: { label: "読解：記述（本文の言葉を使って書く）" } },
    { match: /詩/, link: { label: "読解：詩の表現技法" } },
    { match: /内容|適語|接続語|真偽/, link: { label: "読解：本文に線を引いて根拠を探す" } }
  ],
  english: [
    { match: /単語|数を表す|書き取り/, link: { label: "英語：単語のつづり練習", href: "/reference" } },
    { match: /和文英訳|整序|補じゅう|適語/, link: { label: "英語：文法・英作文", href: "/reference" } },
    { match: /聞き取り|イラスト|適文/, link: { label: "英語：リスニング" } }
  ]
};

export function studyLinkFor(subject: CoreSubject, domainName: string, topic: string): StudyLink | null {
  const text = `${domainName} ${topic}`;
  for (const rule of rules[subject]) {
    if (rule.match.test(text)) return rule.link;
  }
  return null;
}
