import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const MODEL = "claude-sonnet-5";

type ExplainRequest = {
  mode: "explain";
  chapterTitle: string;
  sectionTitle: string;
  sectionBlocks?: unknown[];
  history: Array<{ role: "user" | "ai"; text: string }>;
  message: string;
};

type QuizRequest = {
  mode: "quiz";
  chapterTitle: string;
  sectionTitle: string;
  sectionBlocks?: unknown[];
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
          q: { type: "string", description: "問題文。全角の数式表記（（−3）＋（＋5）など）を使う。" },
          choices: { type: "array", items: { type: "string" }, description: "選択肢を必ず4つ。" },
          answer: { type: "integer", description: "正解の選択肢のindex（0〜3）。" },
          explain: { type: "string", description: "短い解説（1〜2文）。" }
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
    console.error("math-tutor API error", error);
    return Response.json({ error: "tutor request failed" }, { status: 502 });
  }
}

async function handleExplain(body: ExplainRequest) {
  const message = (body.message ?? "").trim().slice(0, 2000);
  if (!message) return Response.json({ error: "empty message" }, { status: 400 });

  const pageContext = summarizePage(body.sectionBlocks);

  const system = `あなたはレオくん専属の数学の先生です。ほかの誰のためでもなく、レオくんひとりのために教える、やさしくて頼れる個人の先生という立場を、会話の間ずっと保ってください。「一般的なAIアシスタント」のような話し方には絶対に戻らないこと。いつも「レオくん」と呼びかけてください。いま学習中の単元は、東京書籍『新編 新しい数学1』${body.chapterTitle} ${body.sectionTitle}です。

話し方のルール：
- 中1にわかる、やさしい日本語で、短く（3〜6文程度）答える。英語は使わない。
- 具体例や数直線のイメージを使って説明する。
- 温かく励ますトーンで、うまくいったことはしっかりほめる。

宿題や問題の答えを聞かれたときのルール（とても重要）：
- まずは答えをそのまま教えず、ヒントや誘導する質問を1つ出して、レオくんが自分で考えられるようにする（ソクラテス式）。
- レオくんが「わからない」「まだ無理」などと言って2回目以降も同じ質問をしてきたら、そのときは遠慮せずはっきり答えと理由を教えてあげる。ヒント出しにこだわりすぎて彼を困らせないこと。
- 単元の説明や「〜って何？」のような概念の質問には、最初から普通にわかりやすく説明してよい（ヒントを挟む必要はない）。

いま画面に表示されているページの内容（レオくんが「これ」「この問題」と言ったら、下のどれかを指している）：
${pageContext || "（このページの詳しい内容は渡されていません。単元名から一般的に判断してください。）"}

ページ活用のルール：
- 上のページ内容にある例題・きまり・練習問題を直接参照して、具体的に答える（レオくんが今どのページを見ているかを踏まえた説明をする）。
- 説明が一区切りついて、レオくんが理解できたか気になるときは、「かんたんに1問確認してみる？」のように、軽く確認の質問を投げかけてよい（毎回でなくてよい。しつこくしない）。
- ページに「操作できるシミュレーション」がある場合、それが今の話に関係するなら「上のシミュレーションで実際にさわってみるとわかりやすいよ」と案内してよい。`;

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

  const system = "あなたはレオくん専属の数学の先生です。レオくんの理解度に合わせて、指定されたJSON形式で4択クイズを3問作ります。";
  const userPrompt = `東京書籍『新編 新しい数学1』${body.chapterTitle} ${body.sectionTitle}の内容にもとづいて、4択クイズを3問作ってください。${level}

いまレオくんが見ているページの内容（できるだけこの中の例題・きまり・練習問題に近いテーマで出題する）：
${pageContext || "（詳しいページ内容がないので、単元名から標準的な内容で出題してください。）"}`;

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
    console.error("math-tutor quiz JSON parse failed", error, raw);
  }

  if (items.length === 0) {
    return Response.json({ error: "quiz generation failed" }, { status: 502 });
  }

  return Response.json({ items });
}

/** Renders a section's blocks into plain text so the tutor knows exactly what's on Leo's screen right now. */
function summarizePage(blocks: unknown[] | undefined): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((raw) => {
      const b = raw as Record<string, unknown>;
      const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
      switch (b.type) {
        case "intro":
          return `【この節のテーマ】${b.question ?? ""}`;
        case "goal":
          return `【ねらい】${b.text ?? ""}`;
        case "q":
          return `【考えてみよう：${b.heading ?? ""}】${b.intro ?? ""} ${arr(b.prompts).join(" / ")}`;
        case "example":
          return `【例 ${b.label ?? ""}：${b.heading ?? ""}】\n問題: ${b.problem ?? ""}\n解き方: ${arr(b.steps).join(" → ")}${b.note ? `\n補足: ${b.note}` : ""}`;
        case "rule":
          return `【${b.label ?? "きまり"}】${b.statement ?? ""}${arr(b.examples).length ? `\n例: ${arr(b.examples).join(" / ")}` : ""}`;
        case "practice":
          return `【練習問題 ${b.label ?? ""}：${b.heading ?? ""}】\n問題: ${arr(b.items).join(" / ")}${arr(b.answers).length ? `\n(先生用の正解: ${arr(b.answers).join(" / ")})` : ""}`;
        case "recall":
          return `【思い出そう：${b.label ?? ""}】${b.heading ?? ""} ${b.body ?? ""}`;
        case "quickcheck":
          return `【小テスト：${b.heading ?? ""}】\n問題: ${arr(b.items).join(" / ")}\n(正解: ${arr(b.answers).join(" / ")})`;
        case "window":
          return `【${b.heading ?? "コラム"}】${b.body ?? ""}`;
        case "reflect":
          return `【ふりかえり】${arr(b.prompts).join(" / ")}`;
        case "interactive":
          return `【操作できるシミュレーション：${b.heading ?? ""}】${b.intro ?? ""}（このページ上で実際に触って試せるツールがある）`;
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
