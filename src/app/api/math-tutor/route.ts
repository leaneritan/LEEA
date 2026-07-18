import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const MODEL = "claude-sonnet-5";

type ExplainRequest = {
  mode: "explain";
  chapterTitle: string;
  sectionTitle: string;
  history: Array<{ role: "user" | "ai"; text: string }>;
  message: string;
};

type QuizRequest = {
  mode: "quiz";
  chapterTitle: string;
  sectionTitle: string;
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

  const system = `あなたは日本の中学1年生のやさしい数学の先生です。いま学習中の単元は、東京書籍『新編 新しい数学1』${body.chapterTitle} ${body.sectionTitle}です。中1にわかる、やさしい日本語で、短く（3〜6文程度）、具体例や数直線のイメージを使って説明してください。英語は使わない。励ましの一言を添えてください。`;

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

  const system = "あなたは中学1年数学の問題作成AIです。指定されたJSON形式で4択クイズを3問作ります。";
  const userPrompt = `東京書籍『新編 新しい数学1』${body.chapterTitle} ${body.sectionTitle}の内容にもとづいて、4択クイズを3問作ってください。${level}`;

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

function extractText(content: Anthropic.Messages.ContentBlock[]) {
  return content
    .filter((block): block is Anthropic.Messages.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}
