/* Emits, for every Level 6 unit and component:
     public/learn/ow-l6-u<n>-<component>.html    Leo's app  (games)
     public/lessons/ow-l6-u<n>-<component>.html  Neritan's teaching deck
     content/.../unit-<n>/lessons/<key>.learner.json + .teacher.json

   Both HTML files are thin: the app shell reads its whole tab list from an
   inlined data blob and runs on /components/leea-app-runtime.js, so the four
   save/restore rules are implemented once instead of once per app. */
import { LEVEL, LEVEL_DIR, escapeHtml, inlineJson, readJson, writeJson, writeText } from "./lib.mjs";
import { grammarTabs, openerTabs, readingTabs, songTabs, vocabTabs, writingTabs } from "./tabs.mjs";

/* Component tone from docs/components.md's locked table. */
const COMPONENTS = [
  { component: "opener", file: "opener", label: "Opener", emoji: "🚀", accent: ["#CA8A04", "#92400E", "#FEFCE8", "#FDE68A"], keyFormat: "m{n}-done", captionKey: "m5-caption" },
  { component: "vocab-1", file: "vocab1", label: "Vocabulary 1", emoji: "📚", accent: ["#16A34A", "#15803D", "#F0FDF4", "#BBF7D0"], keyFormat: "tab-{i}-done" },
  { component: "song", file: "song", label: "Song", emoji: "🎵", accent: ["#d94f7b", "#9d2f56", "#fdeef3", "#f7c4d6"], explicitKeys: true },
  { component: "grammar-1", file: "grammar1", label: "Grammar 1", emoji: "📐", accent: ["#2563EB", "#1D4ED8", "#EFF6FF", "#BFDBFE"], keyFormat: "tab-{i}-done" },
  { component: "vocab-2", file: "vocab2", label: "Vocabulary 2", emoji: "📚", accent: ["#16A34A", "#15803D", "#F0FDF4", "#BBF7D0"], keyFormat: "tab-{i}-done" },
  { component: "grammar-2", file: "grammar2", label: "Grammar 2", emoji: "📐", accent: ["#2563EB", "#1D4ED8", "#EFF6FF", "#BFDBFE"], keyFormat: "tab-{i}-done" },
  { component: "reading", file: "reading", label: "Reading", emoji: "📖", accent: ["#D97706", "#92400E", "#FFFBEB", "#FDE68A"], keyFormat: "tab-{i}-done" },
  { component: "writing", file: "writing", label: "Writing", emoji: "✍️", accent: ["#7C3AED", "#5B21B6", "#F5F3FF", "#DDD6FE"], keyFormat: "m{n}-done" }
];

function tabsFor(component, data, academicCards) {
  switch (component) {
    case "opener": return openerTabs(data);
    case "vocab-1": return vocabTabs(data, "vocab-1", academicCards);
    case "vocab-2": return vocabTabs(data, "vocab-2", academicCards);
    case "song": return songTabs(data, academicCards);
    case "grammar-1": return grammarTabs(data, "grammar-1", academicCards);
    case "grammar-2": return grammarTabs(data, "grammar-2", academicCards);
    case "reading": return readingTabs(data, academicCards);
    case "writing": return writingTabs(data, academicCards);
    default: throw new Error(`no tab builder for ${component}`);
  }
}


/* Guard against the answer-key bug this generator shipped once already: the
   authored data lists the right answer first, tabs.mjs permutes it, and if that
   permutation is ever broken or removed every quiz in the level becomes
   solvable by tapping the top option. Checking the emitted data is cheap;
   trusting the shuffle is not. */
function assertAnswersAreSpread(tabs, id) {
  const spread = new Map();
  for (const tab of tabs) {
    const data = tab.data || {};
    const items = data.items || data.checks || data.paras || [];
    for (const item of items) {
      if (!item || typeof item.correct !== "number" || !Array.isArray(item.opts)) continue;
      spread.set(item.correct, (spread.get(item.correct) ?? 0) + 1);
    }
  }
  const total = [...spread.values()].reduce((sum, n) => sum + n, 0);
  if (total >= 12 && spread.size < 2) {
    throw new Error(`${id}: all ${total} multiple-choice answers share index ${[...spread.keys()][0]} — the option shuffle in tabs.mjs is not running`);
  }
  const biggest = Math.max(0, ...spread.values());
  if (total >= 20 && biggest / total > 0.8) {
    throw new Error(`${id}: ${Math.round((biggest / total) * 100)}% of multiple-choice answers sit at one index — the option shuffle is biased`);
  }
}

function lessonId(unit, component) {
  return `ow-l${LEVEL}-u${unit}-${component}`;
}

/* ── Leo's app ───────────────────────────────────────────────────────── */
function renderApp({ id, unit, data, spec, tabs, prefix, homeworkId, scoreTab }) {
  const [accent, accentDark, accentLight, accentBorder] = spec.accent;
  const app = {
    prefix,
    homeworkId,
    keys: tabs.map((tab) => tab.key),
    scoreKey: "score",
    scoreTab,
    tabs: tabs.map((tab) => ({ icon: tab.icon, name: tab.name, sub: tab.sub, hint: tab.hint, type: tab.type, data: tab.data, doneText: tab.doneText }))
  };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Leo · Unit ${unit} · ${escapeHtml(spec.label)} — ${escapeHtml(data.title)}</title>
<link rel="stylesheet" href="/components/leea-app.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&display=swap"></noscript>
<script src="/components/charts.js"></script>
<script src="/components/sunshine.js"></script>
<script src="/components/wordweb.js"></script>
<script src="/components/chart-picker.js"></script>
<script src="/components/leea-app-runtime.js"></script>
<style>
:root{--accent:${accent};--accent-d:${accentDark};--accent-l:${accentLight};--accent-b:${accentBorder}}
</style>
</head>
<body>
<header class="app-header">
  <div class="logo">${spec.emoji}</div>
  <div>
    <div class="title">Unit ${unit} · ${escapeHtml(spec.label)}</div>
    <div class="subtitle">Our World Level ${LEVEL} — ${escapeHtml(data.title)}</div>
  </div>
  <div class="badge-row"><div class="prog-pill" id="prog-pill">0 / ${tabs.length} done</div></div>
</header>
<nav class="tab-nav" id="tab-nav"></nav>
<main class="tab-stack" id="tab-stack"></main>
<script>
/* ${id}
   SAVE_PREFIX: ${prefix}
   HOMEWORK_ID: ${homeworkId}
   moduleCount: ${tabs.length} · done keys: ${tabs.map((tab) => tab.key).join(", ")} · scoreKey: score */
LEEA.boot(${inlineJson(app)});
</script>
</body>
</html>
`;
}

/* ── Neritan's deck ──────────────────────────────────────────────────── */
function slide(kind, title, bodyHtml, notes) {
  return { kind, title, bodyHtml, notes: notes || "" };
}

function bullets(items) {
  return `<ul class="s-list">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function deckSlides(component, data, spec) {
  const unit = data.unit;
  const slides = [
    slide("title", `Unit ${unit} · ${spec.label}`,
      `<div class="s-hero">${spec.emoji}</div><div class="s-sub">Our World Level ${LEVEL} — ${escapeHtml(data.title)}</div>`,
      `Open with the unit theme. Ask Leo what he already knows about ${data.title}.`)
  ];

  const phases = {
    opener: ["Introduce", "Activate Prior Knowledge", "Build Background", "Be the Expert"],
    "vocab-1": ["Warm Up", "Present", "Practice", "Apply", "Extend", "Wrap Up", "Recap"],
    "vocab-2": ["Warm Up", "Present", "Practice", "Apply", "Extend", "Wrap Up"],
    song: ["Use the Song", "Use It Again"],
    "grammar-1": ["Warm Up", "Present", "Practice", "Apply", "Extend", "Wrap Up", "Recap", "Grammar in Depth"],
    "grammar-2": ["Warm Up", "Present", "Practice", "Apply", "Extend", "Wrap Up", "Recap", "Grammar in Depth"],
    reading: ["Warm Up", "Present", "Practice", "Apply", "Extend", "Recap", "Wrap Up"],
    writing: ["Warm Up", "Present", "Read the Model", "Plan", "Write", "Edit", "Share"]
  }[component];

  slides.push(slide("goal", "Lesson phases",
    bullets(phases.map((phase) => `<b>${phase}</b>`)),
    "These are the NatGeo planner phases. Keep the names as they are."));

  if (component === "opener") {
    slides.push(slide("read", "In this unit I will…", bullets(data.opener.goals.map((goal) => `${goal.en}<span class="s-jp">${goal.jp}</span>`)), "Read each goal aloud. Leo repeats."));
    slides.push(slide("read", `Listen and read · TR ${data.opener.tr}`, `<p class="s-para">${escapeHtml(data.opener.intro)}</p>`, "The one allowed reveal: play the audio and read together."));
    data.opener.photoCards.forEach((card) => {
      slides.push(slide("do", card.title, `<div class="s-hero">${card.emoji}</div><p class="s-para">${escapeHtml(card.text)}</p><p class="s-jp">${escapeHtml(card.jp)}</p>`, "Cover the text first. Leo describes the photo before you reveal."));
    });
    data.opener.lookAndCheck.forEach((item) => {
      slides.push(slide("do", "Look and check", askHtml(item), "Leo answers before you show the options."));
    });
    slides.push(slide("do", data.opener.sort.title, bullets(data.opener.sort.zones.map((zone) => zone.label)), "Sort the cards together on the table, then Leo does it again in his app."));
  }

  if (component === "vocab-1" || component === "vocab-2") {
    const block = component === "vocab-1" ? data.v1 : data.v2;
    slides.push(slide("read", `Listen and repeat · TR ${block.tr}`, bullets(block.words.map((word) => `${word.emoji} <b>${word.w}</b> — ${escapeHtml(word.mean)}`)), "The one allowed reveal. Play TR " + block.tr + " and repeat each line."));
    block.words.forEach((word) => {
      slides.push(slide("do", word.w,
        `<div class="s-hero">${word.emoji}</div>
         <p class="s-para">${escapeHtml(word.mean)}</p>
         <p class="s-quote">“${escapeHtml(word.tr || word.ex[0][0])}”</p>
         <p class="s-jp">${escapeHtml(word.jw)}（${escapeHtml(word.jr)}）— ${escapeHtml(word.jm)}</p>
         <div class="s-game"><b>Mini-game:</b> ${gameFor(word)}</div>`,
        `Play the mini-game before showing the meaning. Source: Student Book TR ${block.tr}.`));
    });
    slides.push(slide("do", "Word class sort", bullets([...new Set(block.words.map((word) => word.pos))].map((pos) => `<b>${pos}</b>: ${block.words.filter((word) => word.pos === pos).map((word) => word.w).join(", ")}`)), "Sort out loud, then Leo repeats it in the app's Sort tab."));
  }

  if (component === "song") {
    slides.push(slide("read", `“${data.song.title}” · TR ${data.song.tr}`, `<div class="s-lyrics">${data.song.lyrics.map((line) => `<div class="${line.chorus ? "s-chorus" : ""}">${escapeHtml(line.t)}</div>`).join("")}</div>`, "The one allowed reveal. Sing it through twice."));
    slides.push(slide("do", "Tap the unit words", bullets(data.song.tapWords.map((word) => `<b>${word}</b>`)), "Leo claps or taps every time one of these words is sung."));
    data.song.quiz.forEach((item) => slides.push(slide("do", "Song check", askHtml(item), "Leo answers before the options are shown.")));
  }

  if (component === "grammar-1" || component === "grammar-2") {
    const point = component === "grammar-1" ? data.g1 : data.g2;
    slides.push(slide("read", `Grammar box · TR ${point.tr}`, bullets(point.intro.map((item) => `${escapeHtml(item.t)}<span class="s-jp">${escapeHtml(item.jp)}</span>`)), `The one allowed reveal, marked TR ${point.tr}. Everything else is Leo doing, not you telling.`));
    slides.push(slide("read", point.title, `<p class="s-para">${escapeHtml(point.rule)}</p><p class="s-jp">${escapeHtml(point.jpRule)}</p><p class="s-quote">${escapeHtml(point.pattern)}</p>`, "Read the rule once, then close it and work from examples."));
    point.rows.forEach((row) => slides.push(slide("do", row.form, `<p class="s-quote">${escapeHtml(row.pattern)}</p><p class="s-para">${escapeHtml(row.example)}</p><p class="s-jp">${escapeHtml(row.jp)}</p>`, "Leo builds one more sentence in the same shape before you move on.")));
    point.levelup.rules.forEach((rule) => slides.push(slide("do", rule.title, bullets(rule.transforms.map(([from, to]) => `${escapeHtml(from)} → <b>${escapeHtml(to)}</b>`)), rule.sub)));
    point.quiz.slice(0, 6).forEach((item) => slides.push(slide("do", "Practice", askHtml({ q: item.stem.join(" ______ ").trim(), opts: item.answers, correct: item.correct, jp: item.jp }), item.explBody)));
  }

  if (component === "reading") {
    slides.push(slide("read", `${data.reading.title} · TR ${data.reading.tr}`, `<p class="s-para">${escapeHtml(data.reading.intro)}</p>`, "Predict from the title before reading."));
    data.reading.paras.forEach((para, i) => {
      slides.push(slide("read", `Paragraph ${i + 1}`, `<p class="s-para">${escapeHtml(para.t)}</p>`, "Read it aloud together, then ask the question on the next slide."));
      slides.push(slide("do", `Check ¶${i + 1}`, askHtml(para), "Leo answers before you show the options."));
    });
    slides.push(slide("read", data.reading.strategy.title, `<p class="s-para">${escapeHtml(data.reading.strategy.body)}</p><p class="s-jp">${escapeHtml(data.reading.strategy.jp)}</p>`, "Name the strategy explicitly — that is what makes it transfer."));
    slides.push(slide("do", data.reading.order.title, bullets(data.reading.order.items.map((item) => escapeHtml(item))), "Cut these into strips and let Leo order them on the table."));
  }

  if (component === "writing") {
    slides.push(slide("read", data.writing.modelTitle, `<div class="s-lyrics">${data.writing.model.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>`, "Read the model. Ask what Leo notices about how it is built."));
    data.writing.steps.forEach((step, i) => slides.push(slide("do", `Step ${i + 1}`, `<p class="s-para">${escapeHtml(step.t)}</p><p class="s-jp">${escapeHtml(step.jp)}</p>`, "Leo says his own version of this step out loud before writing it.")));
    slides.push(slide("read", "Key expressions", bullets(data.writing.expressions.map((item) => `${escapeHtml(item.t)}<span class="s-jp">${escapeHtml(item.jp)}</span>`)), "Leave this slide up while Leo drafts."));
    slides.push(slide("do", "Edit checklist", bullets(data.writing.checklist.map((item) => escapeHtml(item))), "Leo ticks each one against his own draft, out loud."));
  }

  slides.push(slide("do", "Leo's app", `<p class="s-para">Hand over to <b>${lessonId(unit, spec.component)}</b> in Leo's app list.</p>`, "Leo's app repeats today's work as games. Assign it as homework."));
  slides.push(slide("done", "Mark Done", `<button class="s-done" onclick="markLessonDone()">✅ Mark this lesson done</button><div id="done-note" class="s-para"></div>`, "Marks the teacher lesson complete in leea.lessonProgress.v1."));
  return slides;
}

function askHtml(item) {
  return `<p class="s-para">${escapeHtml(item.q)}</p>${bullets(item.opts.map((option, i) => `${i === item.correct ? "<b>" : ""}${escapeHtml(option)}${i === item.correct ? "</b> ✅" : ""}`))}${item.jp ? `<p class="s-jp">${escapeHtml(item.jp)}</p>` : ""}`;
}

/* One embodied prompt per word — the word does its own meaning. */
function gameFor(word) {
  const byPos = {
    verb: `Act it out. Leo does “${word.w}” three times while you count, then uses it in a sentence about soccer.`,
    noun: `Hunt it. Name three real places or moments where you would meet a ${word.w.replace(/^(a|an|the)\s+/, "")}. One has to come from a match or a movie.`,
    adjective: `Rate it. Leo scores five things from the unit 1–5 for “${word.w}” and has to justify the highest one.`,
    adverb: `Say it that way. Leo repeats the same sentence three times, each time more “${word.w}”.`
  };
  return byPos[word.pos] || `Use it. Leo makes one sentence with “${word.w}” about something that happened this week.`;
}

function renderDeck({ id, unit, data, spec, slides }) {
  const [accent, accentDark, accentLight] = spec.accent;
  const slideHtml = slides
    .map((item, i) => `<section class="slide${i === 0 ? " active" : ""}" data-kind="${item.kind}">
  <div class="s-inner">
    <div class="s-kind">${item.kind}</div>
    <h2 class="s-title">${escapeHtml(item.title)}</h2>
    <div class="s-body">${item.bodyHtml}</div>
    <div class="s-source">Our World Level ${LEVEL} · Unit ${unit} · Student Book audio script</div>
  </div>
</section>`)
    .join("\n");
  const notes = slides.map((item) => item.notes);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Neritan · Unit ${unit} · ${escapeHtml(spec.label)} — ${escapeHtml(data.title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&display=swap"></noscript>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--accent:${accent};--accent-d:${accentDark};--accent-l:${accentLight};--ink:#111;--ink-3:#6B7280;--border:#E5E7EB}
html,body{height:100%;font-family:Outfit,'Noto Sans JP',system-ui,sans-serif;background:#0f172a;color:#111}
#stage{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
.slide{display:none;width:min(1180px,94vw);max-height:82vh;overflow-y:auto;background:#fffdf5;border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.45)}
.slide.active{display:block}
.s-inner{padding:38px 44px;display:flex;flex-direction:column;gap:16px}
.s-kind{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--accent-d)}
.s-title{font-size:38px;font-weight:900;color:#0f172a;line-height:1.15}
.s-body{font-size:20px;line-height:1.65;color:#1f2937;display:flex;flex-direction:column;gap:12px}
.s-hero{font-size:76px;line-height:1}
.s-sub{font-size:22px;font-weight:700;color:var(--accent-d)}
.s-para{font-size:20px;line-height:1.7}
.s-quote{background:var(--accent-l);border-left:6px solid var(--accent);border-radius:10px;padding:12px 16px;font-weight:800}
.s-jp{display:block;font-size:16px;color:var(--ink-3);font-weight:600}
.s-list{padding-left:26px;display:flex;flex-direction:column;gap:8px}
.s-lyrics{background:#fff;border:2px solid var(--border);border-radius:12px;padding:16px 20px;font-size:18px;line-height:1.9}
.s-chorus{color:var(--accent-d);font-weight:900}
.s-game{background:#F0FDF4;border:2px solid #BBF7D0;border-radius:12px;padding:12px 16px;font-size:18px}
.s-source{font-size:13px;color:var(--ink-3);font-weight:700;border-top:1px solid var(--border);padding-top:10px}
.s-done{background:#16A34A;color:#fff;border:none;border-radius:14px;padding:16px 28px;font-size:20px;font-weight:800;font-family:inherit;cursor:pointer}
#navbar{position:fixed;left:0;right:0;bottom:0;display:flex;gap:10px;align-items:center;padding:10px 18px;background:rgba(15,23,42,.92);color:#fff}
#navbar button{background:#fff;color:#0f172a;border:none;border-radius:10px;padding:9px 16px;font-weight:800;font-family:inherit;cursor:pointer}
#counter{font-weight:800}
#bar{flex:1;height:8px;background:rgba(255,255,255,.2);border-radius:6px;overflow:hidden}
#bar>div{height:100%;background:var(--accent);width:0}
#notes{position:fixed;top:0;right:0;bottom:52px;width:340px;background:#111827;color:#e5e7eb;padding:22px;font-size:16px;line-height:1.7;display:none;overflow-y:auto}
#notes.open{display:block}
</style>
</head>
<body>
<div id="stage">
${slideHtml}
</div>
<div id="notes"><div style="font-weight:800;letter-spacing:.12em;font-size:12px;text-transform:uppercase;margin-bottom:10px">Teacher notes</div><div id="notes-body"></div></div>
<div id="navbar">
  <button onclick="go(-1)">◀ Back</button>
  <button onclick="go(1)">Next ▶</button>
  <span id="counter"></span>
  <div id="bar"><div id="bar-fill"></div></div>
  <button onclick="toggleNotes()">Notes (N)</button>
</div>
<script>
var SLIDES = ${inlineJson(notes)};
var LESSON_ID = ${inlineJson(id)};
var index = 0;
function render(){
  var slides = document.querySelectorAll('.slide');
  for (var i = 0; i < slides.length; i++) slides[i].classList.toggle('active', i === index);
  document.getElementById('counter').textContent = (index + 1) + ' / ' + slides.length;
  document.getElementById('bar-fill').style.width = ((index + 1) / slides.length * 100) + '%';
  document.getElementById('notes-body').textContent = SLIDES[index] || 'No notes for this slide.';
}
function go(step){
  var slides = document.querySelectorAll('.slide');
  index = Math.max(0, Math.min(slides.length - 1, index + step));
  render();
}
function toggleNotes(){ document.getElementById('notes').classList.toggle('open'); }
document.addEventListener('keydown', function(event){
  if (event.key === 'ArrowRight' || event.key === ' ') go(1);
  if (event.key === 'ArrowLeft') go(-1);
  if (event.key === 'n' || event.key === 'N') toggleNotes();
});
/* Teacher decks have no per-slide save state — the only thing they write is the
   parent's Mark Done record, shaped for the future Supabase row. */
function markLessonDone(){
  try {
    var store = JSON.parse(localStorage.getItem('leea.lessonProgress.v1') || '{}');
    store[LESSON_ID] = { lessonId: LESSON_ID, teacherId: 'neritan', studentId: 'leo', status: 'done', completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    localStorage.setItem('leea.lessonProgress.v1', JSON.stringify(store));
    document.getElementById('done-note').textContent = '✅ Saved. It shows as done on the teacher dashboard.';
  } catch (error) {
    document.getElementById('done-note').textContent = 'Could not save — check browser storage settings.';
  }
}
render();
</script>
</body>
</html>
`;
}

/* ── lesson records ──────────────────────────────────────────────────── */
function referenceLinks(data, component) {
  const list = component === "vocab-2" ? data.v2.words : data.v1.words;
  return list.map((word) => ({
    label: word.w,
    kind: "vocabulary",
    id: word.id ?? `global_${(word.norm || word.w).toLowerCase().replace(/^(a|an|the)\s+/, "").replace(/[^a-z0-9]+/g, "_")}`,
    status: "linked"
  }));
}

function objectivesFor(component, data, spec, tabs) {
  const words = (component === "vocab-2" ? data.v2.words : data.v1.words).map((word) => word.w).join(", ");
  return {
    content: [
      `Work through the Unit ${data.unit} ${spec.label} lesson for “${data.title}”.`,
      `Cover every phase of the lesson in ${tabs.length} modules.`,
      `Connect the lesson to the unit theme: ${data.title}.`
    ],
    language: [
      `Use the unit's target language: ${words}.`,
      `Use ${data.g1.title.toLowerCase()} and ${data.g2.title.toLowerCase()} where the lesson calls for them.`,
      "Read and answer in full sentences."
    ]
  };
}

export function buildAllApps(units) {
  let learner = 0;
  let teacher = 0;
  let lessons = 0;

  for (const data of units) {
    const unitVocabulary = readJson(`${LEVEL_DIR}/unit-${data.unit}/vocabulary.json`);
    const academicCards = unitVocabulary.words.filter((word) => unitVocabulary.academicWordIds.includes(word.id));
    const wordsById = new Map(unitVocabulary.words.map((word) => [word.word, word.id]));
    for (const block of [data.v1.words, data.v2.words, data.content || []]) {
      for (const word of block) if (!word.id && wordsById.has(word.w)) word.id = wordsById.get(word.w);
    }

    for (const spec of COMPONENTS) {
      const id = lessonId(data.unit, spec.component);
      const tabs = tabsFor(spec.component, data, academicCards);
      const prefix = `leea-${LEVEL}-${data.unit}-${spec.component}-`;
      const homeworkId = `leo-${LEVEL}-${data.unit}-${spec.component}`;
      const scoreTab = tabs.findIndex((tab) => tab.type === "quiz");
      assertAnswersAreSpread(tabs, id);

      writeText(`public/learn/${id}.html`, renderApp({ id, unit: data.unit, data, spec, tabs, prefix, homeworkId, scoreTab }));
      learner++;

      const slides = deckSlides(spec.component, data, spec);
      writeText(`public/lessons/${id}.html`, renderDeck({ id, unit: data.unit, data, spec, slides }));
      teacher++;

      const lessonsDir = `${LEVEL_DIR}/unit-${data.unit}/lessons`;
      writeJson(`${lessonsDir}/${spec.file}.teacher.json`, {
        id,
        subject: "english",
        course: "our-world",
        level: LEVEL,
        unit: data.unit,
        component: spec.component,
        mode: "teacher",
        /* These decks are built and verified, so "live" rather than "draft".
           Level 4 is mixed on this (25 draft / 12 live / 2 ready) and nothing
           currently gates on it, but the README says a lesson goes live by
           status data — so the status should say what is true. */
        status: "live",
        title: spec.label,
        subtitle: `${data.title} — ${slides.length} slides for Neritan to teach from.`,
        source: { type: "html-slides", file: `${id}.html`, embedPath: `/lessons/${id}.html`, slideCount: slides.length },
        objectives: objectivesFor(spec.component, data, spec, tabs),
        referenceLinks: referenceLinks(data, spec.component)
      });

      const learnerSource = {
        type: "html-app",
        file: `${id}.html`,
        embedPath: `/learn/${id}.html`,
        moduleCount: tabs.length,
        storagePrefix: prefix,
        homeworkId,
        moduleLabels: tabs.map((tab) => tab.name),
        scoreKey: "score"
      };
      if (spec.explicitKeys) learnerSource.moduleKeys = tabs.map((tab) => tab.key);
      else learnerSource.moduleKeyFormat = spec.keyFormat;
      if (spec.captionKey) learnerSource.captionKey = spec.captionKey;

      writeJson(`${lessonsDir}/${spec.file}.learner.json`, {
        id: `${id}-leo`,
        subject: "english",
        course: "our-world",
        level: LEVEL,
        unit: data.unit,
        component: `${spec.component}-app`,
        mode: "learner",
        /* "live" means Neritan can assign it — the state 36 of the 39 existing
           learner records use. Not "assigned": that is what seedAssignments
           auto-assigns, and it would drop all 72 apps into Leo's homework at
           once. Not "draft" either, which is what these shipped as and is why
           every Level 6 lesson read "Not assigned" with nothing to open. */
        status: "live",
        title: `Unit ${data.unit} ${spec.label} App`,
        subtitle: `Leo works through ${tabs.length} modules: ${tabs.map((tab) => tab.name).join(", ")}.`,
        source: learnerSource,
        objectives: objectivesFor(spec.component, data, spec, tabs),
        referenceLinks: referenceLinks(data, spec.component)
      });
      lessons += 2;
    }
  }
  return { learner, teacher, lessons };
}

export { COMPONENTS, lessonId };
