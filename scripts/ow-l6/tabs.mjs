/* Turns one unit's authored data into the tab list for each component.
   Everything a tab needs is plain data — the activity itself lives in
   public/components/leea-app-runtime.js so all nine units behave identically. */
import { normalize } from "./lib.mjs";

/* A seeded shuffle, so a rebuild produces byte-identical files. The obvious
   implementation — a plain linear congruential generator, taking `value % n`
   — is not good enough here: the low bits of an LCG modulo a power of two
   cycle, so `% 2` and `% 3` come out patterned and the "shuffled" answer lands
   in the same slot every time. (The first version of this file did exactly
   that, and shipped 1,933 quiz questions whose right answer was never option
   A.) Mixing the state with splitmix32 and consuming the high bits removes the
   pattern; the assertion in build-apps.mjs checks the result rather than
   trusting it. */
function mix32(value) {
  let x = (value + 0x9e3779b9) | 0;
  x = Math.imul(x ^ (x >>> 16), 0x21f0aaad);
  x = Math.imul(x ^ (x >>> 15), 0x735a2d97);
  return (x ^ (x >>> 15)) >>> 0;
}

function shuffleSeeded(list, seed) {
  const copy = list.slice();
  let state = mix32(seed >>> 0);
  for (let i = copy.length - 1; i > 0; i--) {
    state = mix32(state);
    const j = Math.floor((state / 4294967296) * (i + 1));
    const swap = copy[i];
    copy[i] = copy[j];
    copy[j] = swap;
  }
  return copy;
}

/* Blanking out a target word has to swallow the whole word, inflection and all.
   Matching only the dictionary form leaves the ending behind — "We eat cake on
   special occasions" became "…on special ______s.", which is both ugly and a
   free hint. Returns the surface form that was removed, so a gap-fill can ask
   for the form the sentence actually used. */
function blankOut(sentence, word) {
  const stem = normalize(word.w, word.norm);
  const pattern = stem.split(/[_\s]+/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[-\\s]");
  const match = sentence.match(new RegExp(`${pattern}\\w*`, "i"));
  if (!match) return { text: sentence, form: stem };
  return { text: sentence.replace(match[0], "______"), form: match[0].toLowerCase() };
}

/** Three wrong answers drawn from the same word list — a real distractor set. */
function distractors(words, correctIndex, count = 2) {
  const others = words.filter((_, i) => i !== correctIndex).map((word) => word.w);
  return shuffleSeeded(others, correctIndex + 7).slice(0, count);
}

function optionSet(correct, wrong, seed) {
  const options = shuffleSeeded([correct, ...wrong], seed);
  return { opts: options, correct: options.indexOf(correct) };
}


/* Authored quiz data lists the right answer first, because that is the readable
   way to write it. Shipping it that way would make every Level 6 quiz solvable
   by always tapping the top option, so the option order is permuted here —
   deterministically, so a rebuild produces the same file. */
/* An authored stem is a two-part array with the gap between the parts. Joining
   it blindly with " ______ " puts a stray blank after questions whose second
   half is empty ("Choose the correct sentence. ______") and doubles the spaces
   around the gap. */
function stemText(stem) {
  const [before = "", after = ""] = stem;
  const head = before.trim();
  const tail = after.trim();
  if (head && tail) return `${head} ______ ${tail}`;
  if (!head && tail) return after.startsWith(" ") ? `______ ${tail}` : tail;
  return head;
}

function hashText(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function varyItem(item, seed) {
  if (!Array.isArray(item.opts) || item.opts.length < 2 || typeof item.correct !== "number") return item;
  /* Seed from the question's own text, not just its position. Position alone
     reuses the same handful of seeds in every unit, which put all four Strategy
     questions on the same answer index in all nine reading apps. */
  const order = shuffleSeeded(item.opts.map((_, i) => i), hashText(String(item.q)) + seed);
  return {
    ...item,
    opts: order.map((i) => item.opts[i]),
    correct: order.indexOf(item.correct)
  };
}

/** Permute a whole list of MCQ items. `salt` keeps two tabs built over the same
    source questions from landing on the same answer key. */
function varied(items, salt = 0) {
  return (items || []).map((item, i) => varyItem(item, i + salt * 97 + 1));
}

/** A grammar point's quiz/master entries, converted to app MCQ items. */
function fromGrammarItems(items, salt) {
  return varied(
    items.map((item) => ({
      q: stemText(item.stem),
      opts: item.answers,
      correct: item.correct,
      jp: item.jp
    })),
    salt
  );
}

function flashcardWords(words) {
  return words.map((word) => ({
    word: word.w,
    emoji: word.emoji,
    ipa: word.ipa,
    def: word.mean,
    jp: `${word.jw}（${word.jr}）— ${word.jm}`,
    sample: word.tr || word.ex[0][0]
  }));
}

function academicFlashcards(data, academicCards) {
  return academicCards.map((card) => ({
    word: card.word,
    emoji: card.displayEmoji,
    ipa: card.ipa,
    def: card.meaning,
    jp: `${card.japanese.reading} — ${card.japanese.meaning}`,
    sample: card.example
  }));
}

/** "Which word means …?" — the meaning is the prompt, the word list the options. */
function meaningItems(words, limit) {
  return words.slice(0, limit).map((word, i) => {
    const set = optionSet(word.w, distractors(words, i), i * 3 + 1);
    return { q: `Which word means “${word.mean}”`, opts: set.opts, correct: set.correct, jp: `${word.jw}（${word.jr}）` };
  });
}

/** The book's own sentence with the target word blanked out. */
function gapItems(words, limit, seed = 0) {
  return words.slice(0, limit).map((word, i) => {
    const blanked = blankOut(word.tr || word.ex[0][0], word);
    const set = optionSet(word.w, distractors(words, i), i * 5 + seed + 2);
    return { q: blanked.text, opts: set.opts, correct: set.correct, jp: `${word.jw}（${word.jr}）` };
  });
}

/* Exactly half the statements are true, and which half is decided by hashing
   each word rather than by its position. Alternating by index taught "the even
   ones are true" faster than it taught the vocabulary; hashing alone left one
   list 2-true / 6-false, which is its own giveaway. */
function trueFalseItems(words, limit) {
  const chosen = words.slice(0, limit);
  const ranked = chosen
    .map((word, i) => ({ i, key: hashText(word.w + word.mean) }))
    .sort((a, b) => a.key - b.key);
  const truthful = new Set(ranked.slice(0, Math.ceil(chosen.length / 2)).map((entry) => entry.i));
  return chosen.map((word, i) => {
    const useTruth = truthful.has(i);
    const other = chosen[(i + 3) % chosen.length];
    return {
      t: `“${word.w}” means: ${(useTruth ? word : other).mean}`,
      answer: useTruth,
      jp: `${word.w} = ${word.jw}（${word.jr}）`
    };
  });
}

const SOCCER_FRAMES = [
  "Champions League final ⚽ ",
  "Premier League derby ⚽ ",
  "La Liga clásico ⚽ ",
  "Bundesliga night ⚽ ",
  "Ligue 1 away day ⚽ ",
  "Serie A matchday ⚽ ",
  "World Cup quarter-final ⚽ ",
  "Copa del Rey night ⚽ "
];

/** Dribble! — the same recall, dressed as a match. Leo's reward tab. */
function dribbleItems(words) {
  return words.slice(0, 8).map((word, i) => {
    const set = optionSet(word.w, distractors(words, i), i * 11 + 4);
    return {
      q: `${SOCCER_FRAMES[i % SOCCER_FRAMES.length]}Beat the defender: which word means “${word.mean}”`,
      opts: set.opts,
      correct: set.correct,
      jp: `${word.jw}（${word.jr}）`
    };
  });
}

function clozeFrom(words, count) {
  const chosen = words.slice(0, count);
  const answers = [];
  const text = chosen
    .map((word, i) => {
      const blanked = blankOut(word.tr || word.ex[0][0], word);
      answers.push(blanked.form);
      return blanked.text.replace("______", `{{${i}}}`);
    })
    .join(" ");
  return { text, answers };
}

function posZones(words) {
  const present = [...new Set(words.map((word) => word.pos))];
  const labels = { noun: "🧱 Nouns", verb: "🏃 Verbs", adjective: "🎨 Adjectives", adverb: "⚡ Adverbs" };
  return {
    zones: present.map((pos) => ({ id: pos, label: labels[pos] || pos })),
    tiles: words.map((word) => ({ text: `${word.emoji} ${word.w}`, zone: word.pos }))
  };
}

function matchPairs(words) {
  /* Array order is the audio-script order — never alphabetical, never sorted. */
  return words.map((word) => ({ word: word.w, emoji: word.emoji, sent: word.tr || word.ex[0][0] }));
}

/** "Rewrite this prompt" items, built from a grammar point's Level Up
    transforms. The right answer is the transform's own `to`; the distractors
    are other transforms' answers, which are the same pattern applied to
    different words — so a wrong pick is a real mistake, not a spelling trap. */
function transformItems(point) {
  const all = point.levelup.rules.flatMap((rule) => rule.transforms);
  return all.map(([from, to], i) => {
    const wrong = all.filter((_, j) => j !== i).map(([, other]) => other);
    const set = optionSet(to, shuffleSeeded(wrong, i + 3).slice(0, 2), i * 13 + 5);
    return { q: `Rewrite it: <b>${from}</b>`, opts: set.opts, correct: set.correct, jp: point.jpPattern };
  });
}

/* ── opener ─────────────────────────────────────────────────────────── */
export function openerTabs(data) {
  const opener = data.opener;
  const half = Math.ceil(opener.photoCards.length / 2);
  return [
    { key: "m1-done", icon: "🎯", name: "In This Unit", type: "list",
      sub: `Unit ${data.unit} · ${data.title}`,
      hint: "Read what you will be able to do by the end of this unit.",
      data: { items: opener.goals.map((goal) => ({ t: goal.en, jp: goal.jp, emoji: "✅" })) } },
    { key: "m2-done", icon: "🌍", name: "Theme Reveal", type: "reveal",
      sub: opener.intro,
      hint: "Tap each card to open it, then answer the checks.",
      data: { cards: opener.photoCards.slice(0, half), checks: varied(opener.lookAndCheck.slice(0, 2), 1) } },
    { key: "m3-done", icon: "📷", name: "Photo Explorer", type: "reveal",
      hint: "Open the rest of the photos and check what you found.",
      data: { cards: opener.photoCards.slice(half), checks: varied(opener.lookAndCheck.slice(2), 2) } },
    { key: "m4-done", icon: "🔎", name: "Look and Check", type: "mcq",
      hint: "Four quick questions about the unit opener.",
      data: { items: varied(opener.quiz.slice(0, 4), 3), label: "checks answered" } },
    { key: "m5-done", icon: "✍️", name: "Write Your Caption", type: "write",
      hint: `Write your own caption for the ${data.title} photo. Two sentences is enough.`,
      data: { minWords: 20, minSentences: 2, captionKey: "m5-caption",
        placeholder: `A caption for the ${data.title} opener photo…`,
        checklist: ["My caption says what is happening in the photo.", "I used one word from this unit."] } },
    { key: "m6-done", icon: "🗂️", name: "Theme Sorter", type: "sort",
      hint: "Drag each card into the right column.",
      data: opener.sort },
    { key: "m7-done", icon: "🏁", name: "Final Quiz", type: "quiz",
      hint: "Eight questions. Six or more to pass.",
      data: { items: varied(opener.quiz, 4), pass: Math.ceil(opener.quiz.length * 0.75) } }
  ];
}

/* ── vocab-1 / vocab-2 ──────────────────────────────────────────────── */
export function vocabTabs(data, which, academicCards) {
  const block = which === "vocab-1" ? data.v1 : data.v2;
  const words = block.words;
  const cloze = clozeFrom(words, Math.min(6, words.length));
  const sort = posZones(words);
  return [
    { key: "tab-0-done", icon: "📚", name: "Academic", type: "flashcards",
      sub: "The study words this unit uses", hint: "Finish BOTH modes — Practice and Quiz — to complete this tab.",
      data: { words: academicFlashcards(data, academicCards) } },
    { key: "tab-1-done", icon: "🔥", name: "Warm Up", type: "mcq",
      sub: `${data.title} · TR ${block.tr}`, hint: "Which word matches each meaning?",
      data: { items: meaningItems(words, Math.min(6, words.length)), label: "warmed up" } },
    { key: "tab-2-done", icon: "🎯", name: "Present", type: "reveal",
      hint: "Open every word card, then answer the checks below.",
      data: {
        cards: words.map((word) => ({ emoji: word.emoji, title: word.w, text: `${word.mean}  —  “${word.tr || word.ex[0][0]}”`, jp: `${word.jw}（${word.jr}）` })),
        checks: gapItems(words, 3, 40)
      } },
    { key: "tab-3-done", icon: "🃏", name: "Flashcards", type: "flashcards",
      hint: "Practice mode flips the cards. Quiz mode makes you type them. Both must be done.",
      data: { words: flashcardWords(words) } },
    { key: "tab-4-done", icon: "🧠", name: "Sort", type: "sort",
      hint: "Drag each word into its word class.",
      data: { title: "Sort the words by word class", zones: sort.zones, tiles: sort.tiles } },
    { key: "tab-5-done", icon: "📖", name: "Reading", type: "cloze",
      hint: "Tap a blank, then tap the word that fills it. The sentences come straight from the audio script.",
      data: cloze },
    { key: "tab-6-done", icon: "📝", name: "Practice", type: "mcq",
      hint: "Choose the missing word in each book sentence.",
      data: { items: gapItems(words, Math.min(8, words.length)), label: "practised" } },
    { key: "tab-7-done", icon: "🔤", name: "Unscramble", type: "unscramble",
      hint: "Type the word the letters spell.",
      data: { words: words.map((word) => ({ word: normalize(word.w, word.norm), emoji: word.emoji, hint: word.mean })) } },
    { key: "tab-8-done", icon: "🔗", name: "Match", type: "match",
      sub: `TR ${block.tr} — Listen and repeat`,
      hint: "Match each word to the sentence the audio actually says, so you know how to use it out loud.",
      data: { pairs: matchPairs(words) } },
    { key: "tab-9-done", icon: "☀️", name: "Apply", type: "sunshine",
      hint: "Write your own sentence on every ray.",
      data: { center: data.title, hint: "Tap a ray", words: words.slice(0, Math.min(8, words.length)).map((word) => ({ word: word.w, emoji: word.emoji })) } },
    { key: "tab-10-done", icon: "🎭", name: "Wrap Up", type: "truefalse",
      hint: "True or false? Read each meaning carefully.",
      data: { items: trueFalseItems(words, Math.min(8, words.length)), label: "checked" } },
    { key: "tab-11-done", icon: "✅", name: "Quiz", type: "quiz",
      hint: "Ten questions. Eight or more to pass.",
      data: { items: [...meaningItems(words, Math.min(5, words.length)), ...gapItems(words.slice().reverse(), Math.min(5, words.length), 90)], pass: 8 } },
    { key: "tab-12-done", icon: "⚽", name: "Dribble!", type: "dribble",
      hint: "Every right answer beats a defender.",
      data: { items: dribbleItems(words) } }
  ];
}

/* ── song ───────────────────────────────────────────────────────────── */
export function songTabs(data, academicCards) {
  const song = data.song;
  const songWords = data.v1.words.filter((word) =>
    song.tapWords.some((tap) => tap.toLowerCase().indexOf(normalize(word.w, word.norm)) >= 0 || normalize(word.w, word.norm).indexOf(tap.toLowerCase()) >= 0)
  );
  const pool = songWords.length >= 4 ? songWords : data.v1.words.slice(0, 6);
  const buildLines = song.lyrics.filter((line) => !line.chorus && line.t.split(/\s+/).length >= 4 && line.t.split(/\s+/).length <= 9).slice(0, 6);
  return [
    { key: "m1-complete", icon: "🎤", name: "Listen & Sing", type: "karaoke",
      sub: `“${song.title}” · TR ${song.tr}`,
      hint: "Sing along and tap every highlighted word as you sing it.",
      data: { lines: song.lyrics, tapWords: song.tapWords } },
    { key: "m2-complete", icon: "🎵", name: "Song Words", type: "flashcards",
      hint: "The unit words the song recycles. Finish Practice and Quiz.",
      data: { words: flashcardWords(pool) } },
    { key: "ma-complete", icon: "🎓", name: "Academic Words", type: "flashcards",
      hint: "The study words for this unit.",
      data: { words: academicFlashcards(data, academicCards) } },
    { key: "m3-complete", icon: "🧠", name: "Word Review", type: "mcq",
      hint: "Which word means what?",
      data: { items: meaningItems(pool, Math.min(6, pool.length)), label: "reviewed" } },
    { key: "m4-complete", icon: "🔁", name: "Use It Again", type: "build",
      hint: "Rebuild the song lines, word by word.",
      data: { items: buildLines.map((line) => ({ words: line.t.replace(/[.!?,]$/, "").split(/\s+/), jp: line.jp })) } },
    { key: "m5-complete", icon: "✍️", name: "Write a Line", type: "write",
      hint: "Write your own two lines for this song using unit words.",
      data: { minWords: 15, minSentences: 2, placeholder: "My own verse…",
        checklist: ["I used at least two words from this unit.", "My lines fit the song's topic."] } },
    { key: "m6-complete", icon: "🏁", name: "Quiz", type: "quiz",
      hint: "Six questions about the song.",
      data: { items: varied(song.quiz, 5), pass: Math.ceil(song.quiz.length * 0.75) } }
  ];
}

/* ── grammar-1 / grammar-2 ──────────────────────────────────────────── */
export function grammarTabs(data, which, academicCards) {
  const point = which === "grammar-1" ? data.g1 : data.g2;
  const detectiveItems = point.master.filter((item) => /correct|Fix|NOT/i.test(item.stem[0])).slice(0, 6);
  const buildItems = point.samples.slice(0, 6).map((sample) => ({
    words: sample.t.replace(/[.?!]$/, "").split(/\s+/),
    jp: sample.jp
  }));
  /* Broken tiles are built by dropping a wrong answer into a real gap stem.
     Only stems that actually have a gap work — "Choose the correct sentence."
     has nothing to fill, and splicing a wrong answer onto it produces a tile
     that is not a sentence at all. */
  const gapStems = point.quiz.filter((item) => item.stem[0].trim() && item.stem[1].trim());
  const brokenTiles = gapStems.slice(0, 5).map((item) => ({
    text: `${item.stem[0].trim()} ${item.answers[(item.correct + 1) % item.answers.length]} ${item.stem[1].trim()}`.replace(/\s+/g, " "),
    zone: "wrong"
  }));
  const sortTiles = [
    ...point.samples.slice(0, Math.max(3, brokenTiles.length)).map((sample) => ({ text: sample.t, zone: "right" })),
    ...brokenTiles
  ];

  const guessItems = point.levelup.mixed.map((sample, i) => {
    const words = sample.t.split(/\s+/);
    const tail = words.slice(-2).join(" ");
    const stem = words.slice(0, -2).join(" ");
    const wrong = point.levelup.mixed.filter((_, j) => j !== i).slice(0, 2).map((other) => other.t.split(/\s+/).slice(-2).join(" "));
    const options = [tail, ...wrong];
    return { q: `${stem} ______`, opts: options, correct: 0, jp: sample.jp };
  });

  return [
    { key: "tab-0-done", icon: "🧪", name: "Word Lab", type: "flashcards",
      sub: point.title, hint: "The study words this grammar lesson uses. Practice AND Quiz.",
      data: { words: academicFlashcards(data, academicCards) } },
    { key: "tab-1-done", icon: "🔥", name: "Warm Up", type: "mcq",
      sub: `TR ${point.tr} — ${point.title}`,
      hint: "Eight quick questions on the pattern.",
      data: { items: fromGrammarItems(point.quiz.slice(0, 8), 1), label: "warmed up" } },
    { key: "tab-2-done", icon: "📐", name: "The Rule", type: "reveal",
      sub: point.pattern,
      hint: "Open every row of the grammar box, then answer the checks.",
      data: {
        cards: point.rows.map((row) => ({ emoji: "📐", title: row.form, text: `${row.pattern}  —  ${row.example}`, jp: row.jp })),
        checks: fromGrammarItems(point.quiz.slice(0, 3), 2)
      } },
    { key: "tab-3-done", icon: "🕵️", name: "Detective", type: "mcq",
      hint: "Find the sentence that is written correctly.",
      data: { items: fromGrammarItems(detectiveItems.length ? detectiveItems : point.master.slice(0, 6), 3), label: "solved" } },
    { key: "tab-4-done", icon: "🔧", name: "Build It", type: "build",
      hint: "Tap the chips in order to rebuild each sentence.",
      data: { items: buildItems } },
    { key: "tab-5-done", icon: "🗂️", name: "Sort", type: "sort",
      hint: "Which sentences use the pattern correctly?",
      data: { title: "Correct or broken?", zones: [{ id: "right", label: "✅ Correct" }, { id: "wrong", label: "❌ Broken" }], tiles: sortTiles } },
    /* Practice deliberately does NOT reuse the Warm Up questions. Warm Up runs
       the first eight gap items; Practice rewrites the Level Up transforms, so
       Leo meets the pattern a second time in a different shape. */
    { key: "tab-6-done", icon: "✏️", name: "Practice", type: "mcq",
      hint: "Choose the correct rewrite of each prompt.",
      data: { items: varied(transformItems(point), 4), label: "practised" } },
    { key: "tab-7-done", icon: "📋", name: "Survey", type: "survey",
      hint: "Finish each sentence about yourself.",
      data: { stems: point.levelup.rules.flatMap((rule) => rule.transforms.map(([from]) => ({ t: `Use the pattern: <b>${from}</b>`, jp: rule.jpTitle, placeholder: "Write the full sentence" }))) } },
    { key: "tab-8-done", icon: "🕸️", name: "Word Web", type: "wordweb",
      hint: "Write your own example for each rule.",
      data: { words: point.levelup.rules.map((rule) => ({ word: rule.title, emoji: "🕸️", jp: rule.jpTitle })) } },
    { key: "tab-9-done", icon: "🎯", name: "Guess End", type: "mcq",
      hint: "How does each sentence end?",
      data: { items: varied(guessItems, 6), label: "guessed" } },
    { key: "tab-10-done", icon: "📝", name: "Quiz", type: "quiz",
      hint: "Ten questions. Eight or more to pass.",
      data: { items: fromGrammarItems(point.master, 5), pass: 8 } },
    { key: "tab-11-done", icon: "⚽", name: "Dribble!", type: "dribble",
      hint: "Every right answer beats a defender.",
      data: { items: fromGrammarItems(point.quiz.slice(0, 8), 7).map((item, i) => ({ ...item, q: `${SOCCER_FRAMES[i % SOCCER_FRAMES.length]}${item.q}` })) } }
  ];
}

/* ── reading ────────────────────────────────────────────────────────── */
export function readingTabs(data, academicCards, contentCards) {
  const reading = data.reading;
  return [
    { key: "tab-0-done", icon: "📚", name: "Vocab", type: "flashcards",
      sub: `“${reading.title}” · TR ${reading.tr}`,
      hint: "The words you need before you read. Practice AND Quiz.",
      data: { words: [...academicFlashcards(data, academicCards), ...flashcardWords(data.content || [])] } },
    { key: "tab-1-done", icon: "📖", name: "Read", type: "read",
      sub: reading.title,
      hint: "Answer the question under each paragraph to unlock the next one.",
      data: { intro: reading.intro, paras: varied(reading.paras.map((para) => ({ ...para, q: para.q, opts: para.opts, correct: para.correct })), 10) } },
    { key: "tab-2-done", icon: "🧭", name: "Strategy", type: "mcq",
      sub: reading.strategy.title,
      hint: reading.strategy.body,
      data: { items: varied(reading.quiz.slice(0, 4), 8), label: "strategy checks" } },
    { key: "tab-3-done", icon: "🔢", name: "Order", type: "order",
      sub: reading.order.title,
      hint: "Tap the events in the order they happened.",
      data: { items: reading.order.items } },
    { key: "tab-4-done", icon: "🔍", name: "Practice", type: "truefalse",
      hint: "True or false? These are the content words from the passage.",
      data: { items: trueFalseItems(data.content || [], 6), label: "checked" } },
    { key: "tab-5-done", icon: "📝", name: "Quiz", type: "quiz",
      hint: "Eight questions on the passage.",
      data: { items: varied(reading.quiz, 9), pass: Math.ceil(reading.quiz.length * 0.75) } }
  ];
}

/* ── writing ────────────────────────────────────────────────────────── */
export function writingTabs(data, academicCards) {
  const writing = data.writing;
  return [
    { key: "m1-done", icon: "🎓", name: "Academic Language", type: "flashcards",
      sub: writing.genre, hint: "The study words for this writing lesson. Practice AND Quiz.",
      data: { words: academicFlashcards(data, academicCards) } },
    { key: "m2-done", icon: "📄", name: "Read the Model", type: "list",
      sub: writing.modelTitle,
      hint: "Read the model text and notice how it is built.",
      data: { items: [
        ...writing.model.map((line) => ({ t: line, emoji: "📄" })),
        { t: writing.modelJp, emoji: "🇯🇵" }
      ] } },
    { key: "m3-done", icon: "🧩", name: "How It Works", type: "list",
      sub: `What makes a good ${writing.genre.toLowerCase()}`,
      hint: "Four steps. You will follow them in the Plan and Write modules.",
      data: { items: writing.steps.map((step, i) => ({ emoji: `${i + 1}️⃣`, t: step.t, jp: step.jp })) } },
    { key: "m4-done", icon: "🔑", name: "Key Expressions", type: "list",
      hint: "Copy these frames into your own draft.",
      data: { items: writing.expressions.map((item) => ({ emoji: "🔑", t: item.t, jp: item.jp })) } },
    { key: "m5-done", icon: "🗒️", name: "Plan", type: "survey",
      hint: "Plan before you write. One line per box is enough.",
      data: { stems: writing.steps.map((step) => ({ t: step.t, jp: step.jp, placeholder: "My plan…" })) } },
    { key: "m6-done", icon: "✍️", name: "Write!", type: "write",
      hint: "Now write the whole thing. Aim for 60 words and 4 sentences.",
      data: { minWords: 60, minSentences: 4, modelTitle: writing.modelTitle, model: writing.model, expressions: writing.expressions,
        placeholder: "My draft…", checklist: writing.checklist } },
    { key: "m7-done", icon: "🔧", name: "Edit", type: "checklist",
      hint: "Read your draft again and tick every box you can honestly tick.",
      data: { items: writing.checklist } },
    { key: "m8-done", icon: "⚽", name: "Can Leo Score?", type: "quiz",
      hint: "Eight questions. Six or more to pass.",
      data: { items: varied(writing.quiz, 11), pass: Math.ceil(writing.quiz.length * 0.75) } }
  ];
}
