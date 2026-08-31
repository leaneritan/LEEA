import Anthropic from "@anthropic-ai/sdk";

/**
 * レオくん専属の理科の先生. Same contract as `/api/math-tutor` — an explain mode
 * and a quiz mode, both told what is on Leo's screen and how his recent quizzes
 * went — but with 理科's own block vocabulary and its own rules about what the
 * tutor may assert.
 */

const client = new Anthropic();

const MODEL = "claude-sonnet-5";

type QuizAttempt = {
  sectionId: string;
  chapterTitle: string;
  sectionTitle: string;
  correct: number;
  total: number;
  createdAt: string;
};

type ExplainRequest = {
  mode: "explain";
  chapterTitle: string;
  sectionTitle: string;
  sectionBlocks?: unknown[];
  recentQuizAttempts?: QuizAttempt[];
  history: Array<{ role: "user" | "ai"; text: string }>;
  message: string;
};

type QuizRequest = {
  mode: "quiz";
  chapterTitle: string;
  sectionTitle: string;
  sectionBlocks?: unknown[];
  recentQuizAttempts?: QuizAttempt[];
  wrongQuestions: string[];
};

type TutorRequest = ExplainRequest | QuizRequest;

const QUIZ_SCHEMA = {
  type: "object",
  properties: {
    items: {
      type: "array",
      description: "Exactly 3 quiz questions.",
      items: {
        type: "object",
        properties: {
          q: { type: "string", description: "問題文。中1理科の用語をそのまま使う。" },
          choices: { type: "array", items: { type: "string" }, description: "選択肢を必ず4つ。" },
          answer: { type: "integer", description: "正解の選択肢のindex（0〜3）。" },
          explain: { type: "string", description: "短い解説（1〜2文）。なぜそうなるかを書く。" }
        },
        required: ["q", "choices", "answer", "explain"],
        additionalProperties: false
      }
    }
  },
  required: ["items"],
  additionalProperties: false
};

export async function POST(request: Request) {
  let body: TutorRequest;
  try {
    body = (await request.json()) as TutorRequest;
  } catch {
    return Response.json({ error: "invalid request body" }, { status: 400 });
  }

  if (!body || (body.mode !== "explain" && body.mode !== "quiz")) {
    return Response.json({ error: "invalid mode" }, { status: 400 });
  }

  try {
    if (body.mode === "explain") {
      return await handleExplain(body);
    }
    return await handleQuiz(body);
  } catch (error) {
    console.error("science-tutor API error", error);
    return Response.json({ error: "tutor request failed" }, { status: 502 });
  }
}

async function handleExplain(body: ExplainRequest) {
  const message = (body.message ?? "").trim().slice(0, 2000);
  if (!message) return Response.json({ error: "empty message" }, { status: 400 });

  const pageContext = summarizePage(body.sectionBlocks);
  const attemptsContext = summarizeAttempts(body.recentQuizAttempts);

  const system = `あなたはレオくん専属の理科の先生です。ほかの誰のためでもなく、レオくんひとりのために教える、やさしくて頼れる個人の先生という立場を、会話の間ずっと保ってください。「一般的なAIアシスタント」のような話し方には絶対に戻らないこと。いつも「レオくん」と呼びかけてください。いま学習中の単元は、東京書籍『新編 新しい科学1』${body.chapterTitle} ${body.sectionTitle}です。

話し方のルール：
- 中1にわかる、やさしい日本語で、短く（3〜6文程度）答える。英語は使わない。
- 身のまわりの具体例や、観察・実験のようすを思いうかべられる言い方で説明する。
- 温かく励ますトーンで、うまくいったことはしっかりほめる。

理科の先生としてのルール（とても重要）：
- 教科書に書かれていることをこえて、確かでないことを断定しない。あいまいなときは「教科書の〇〇ページを見てみよう」と案内する。
- 用語は教科書と同じことばを使う（例：「胚珠」「子房」「裸子植物」）。かってに言いかえない。
- 観察・実験の手順を説明するときは、教科書の注意（危険なこと、やってはいけないこと）を必ず一緒に伝える。ルーペで太陽を見ない、薬品のあつかい方、といった安全のきまりは省略しない。

宿題や問題の答えを聞かれたときのルール：
- まずは答えをそのまま教えず、ヒントや誘導する質問を1つ出して、レオくんが自分で考えられるようにする（ソクラテス式）。
- レオくんが「わからない」「まだ無理」などと言って2回目以降も同じ質問をしてきたら、そのときは遠慮せずはっきり答えと理由を教えてあげる。ヒント出しにこだわりすぎて彼を困らせないこと。
- 単元の説明や「〜って何？」のような概念の質問には、最初から普通にわかりやすく説明してよい。

いま画面に表示されているページの内容（レオくんが「これ」「この問題」と言ったら、下のどれかを指している）：
${pageContext || "（このページの詳しい内容は渡されていません。単元名から一般的に判断してください。）"}

ページ活用のルール：
- 上のページ内容にある観察・実験・ことば・練習問題を直接参照して、具体的に答える。
- 説明が一区切りついて、レオくんが理解できたか気になるときは、「かんたんに1問確認してみる？」のように、軽く確認の質問を投げかけてよい（毎回でなくてよい。しつこくしない）。
- ページに「操作できる分類ツール」などがある場合、それが今の話に関係するなら「上のツールで実際にさわってみるとわかりやすいよ」と案内してよい。

レオくんの直近のクイズ成績（新しい順）：
${attemptsContext || "（まだクイズの記録がない。）"}

成績の使い方のルール：
- 会話の自然な流れの中で（毎回ではなく、話が一区切りしたときや、成長に触れるのがふさわしいタイミングで）、この成績を具体的な数字つきで励ましに使ってよい。
- 数字を捏造しない。上のリストにない情報は言わない。記録が無ければ成績の話はしない。
- 点数が低かったときも責めず、伸びしろとして前向きに伝える。`;

  const history = (body.history ?? []).slice(-8).map((entry) => ({
    role: (entry.role === "user" ? "user" : "assistant") as "user" | "assistant",
    content: entry.text
  }));

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1536,
    thinking: { type: "adaptive" },
    output_config: { effort: "low" },
    system,
    messages: [...history, { role: "user", content: message }]
  });

  const reply = extractText(response.content) || "ごめんね、うまく答えられなかったみたい。もう一度きいてね。";
  return Response.json({ reply });
}

async function handleQuiz(body: QuizRequest) {
  const wrong = (body.wrongQuestions ?? []).filter(Boolean).slice(-3);
  const level = wrong.length
    ? `前回まちがえた問題に似たタイプを中心に出題してください: ${wrong.join(" / ")}`
    : "基本レベルで出題してください。";

  const pageContext = summarizePage(body.sectionBlocks);
  const attemptsContext = summarizeAttempts(body.recentQuizAttempts);

  const system =
    "あなたはレオくん専属の理科の先生です。レオくんの理解度に合わせて、指定されたJSON形式で4択クイズを3問作ります。教科書に書かれている範囲から出題し、用語は教科書と同じことばを使ってください。";
  const userPrompt = `東京書籍『新編 新しい科学1』${body.chapterTitle} ${body.sectionTitle}の内容にもとづいて、4択クイズを3問作ってください。${level}

いまレオくんが見ているページの内容（できるだけこの中の観察・実験・ことば・練習問題に近いテーマで出題する）：
${pageContext || "（詳しいページ内容がないので、単元名から標準的な内容で出題してください。）"}

レオくんの直近のクイズ成績（新しい順。難易度の目安にする。正解率が高ければ少しだけ難しくしてよい。低ければ基本に寄せる）：
${attemptsContext || "（まだクイズの記録がない。標準的な難易度で出題してください。）"}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1536,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: QUIZ_SCHEMA }
    },
    system,
    messages: [{ role: "user", content: userPrompt }]
  });

  const raw = extractText(response.content);
  let items: Array<{ q: string; choices: string[]; answer: number; explain: string }> = [];
  try {
    const parsed = JSON.parse(raw) as { items?: typeof items };
    items = (parsed.items ?? []).filter((item) => Array.isArray(item.choices) && item.choices.length >= 2).slice(0, 3);
  } catch (error) {
    console.error("science-tutor quiz JSON parse failed", error, raw);
  }

  if (items.length === 0) {
    return Response.json({ error: "quiz generation failed" }, { status: 502 });
  }

  return Response.json({ items });
}

/** Renders Leo's recent quiz history into plain text, so encouragement can be concrete. */
function summarizeAttempts(attempts: QuizAttempt[] | undefined): string {
  if (!Array.isArray(attempts) || attempts.length === 0) return "";

  return attempts
    .slice(0, 5)
    .map((a) => {
      const percent = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
      const date = Number.isNaN(Date.parse(a.createdAt)) ? "" : new Date(a.createdAt).toLocaleDateString("ja-JP");
      return `- ${a.chapterTitle} ${a.sectionTitle}：${a.correct}/${a.total}問正解（${percent}%）${date ? `（${date}）` : ""}`;
    })
    .join("\n");
}

/**
 * Renders a 理科 section's blocks into plain text, so the tutor knows exactly
 * what is on Leo's screen. The block vocabulary is 理科's own — 観察・実験, 基礎
 * 操作, ことば, 図鑑 — not math's, so this cannot be shared with the math route.
 */
function summarizePage(blocks: unknown[] | undefined): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((raw) => {
      const b = raw as Record<string, unknown>;
      const arr = (v: unknown) => (Array.isArray(v) ? v : []);
      const str = (v: unknown) => (typeof v === "string" ? v : "");

      switch (b.type) {
        case "intro":
          return `【この節のテーマ】${str(b.question)}`;
        case "goal":
          return `【ねらい】${str(b.text)}`;
        case "q":
          return `【考えてみよう：${str(b.heading)}】${str(b.intro)} ${arr(b.prompts).join(" / ")}`;
        case "procedure": {
          const steps = arr(b.steps)
            .map((s) => {
              const step = s as Record<string, unknown>;
              return `${str(step.title)}: ${arr(step.items).join(" → ")}`;
            })
            .join("\n");
          const cautions = arr(b.cautions);
          const points = arr(b.observationPoints);
          return `【${str(b.label)}：${str(b.heading)}】\n目的: ${str(b.purpose)}\n${steps}${
            cautions.length ? `\n注意: ${cautions.join(" / ")}` : ""
          }${points.length ? `\n考察のポイント: ${points.join(" / ")}` : ""}`;
        }
        case "technique":
          return `【基礎操作：${str(b.heading)}】手順: ${arr(b.steps).join(" → ")}${
            arr(b.cautions).length ? `\n注意: ${arr(b.cautions).join(" / ")}` : ""
          }`;
        case "term":
          return `【ことば：${str(b.term)}（${str(b.reading)}）】${str(b.statement)}`;
        case "field": {
          const names = arr(b.entries)
            .map((e) => {
              const entry = e as Record<string, unknown>;
              return `${str(entry.name)}（${str(entry.family)}）`;
            })
            .join("、");
          return `【図鑑：${str(b.heading)}】${names}`;
        }
        case "recall":
          return `【思い出そう：${str(b.label)}】${str(b.heading)} ${str(b.body)}`;
        case "quickcheck":
          return `【章末チェック：${str(b.heading)}】\n問題: ${arr(b.items).join(" / ")}\n(正解: ${arr(b.answers).join(" / ")})`;
        case "practice": {
          // From the ワーク. Its answers carry the textbook page they were
          // checked against, which is worth passing through so the tutor can
          // point Leo at the same page rather than asserting on its own.
          const items = arr(b.items)
            .map((i) => {
              const item = i as Record<string, unknown>;
              return `Q: ${str(item.prompt)}${item.answer ? `\n  A: ${str(item.answer)}${item.source ? `（${str(item.source)}）` : ""}` : "\n  (ノートでやる問題。決まった答えはない)"}`;
            })
            .join("\n");
          return `【ワーク p.${str(b.workbookPage)} 練習：${str(b.heading)}】\n${items}`;
        }
        case "reflect":
          return `【ふりかえり】${arr(b.prompts).join(" / ")}${
            arr(b.keywords).length ? `（キーワード: ${arr(b.keywords).join("、")}）` : ""
          }`;
        case "interactive":
          return `【操作できる分類ツール：${str(b.heading)}】${str(b.intro)}（このページ上で実際に触って試せるツールがある）`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 8000);
}

function extractText(content: Anthropic.Messages.ContentBlock[]) {
  return content
    .filter((block): block is Anthropic.Messages.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}
