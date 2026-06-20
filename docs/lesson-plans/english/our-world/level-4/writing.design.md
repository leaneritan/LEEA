# Unit 8 · Writing — Design Doc (Leo's Hobby Planner Chart spine)

> Companion to `public/lessons/ow-l4-u8-writing.html`. Built via the future `/writing-app` skill (planned — will be extracted from this deck once shipped, same pattern as `/reading-app` extracted from Unit 8 Reading).

## The lesson

- **Course / Level / Unit:** Our World 2e · Level 4 · Unit 8 · Writing
- **Spread:** Student Book p. 142 · LP pp. 280-282
- **Writing Type:** **Explanation Writing** — *"When you write an explanation, you describe something in general. You explain what it is and how you do it. You can explain difficult words and give examples. Use words and expressions like for example and such as."*
- **Topic:** Describe a hobby. Explain it and how to do it.
- **Model passage:** *"Fun with Paper"* — origami.
- **Objectives:** analyze a writing model · explain a hobby in writing · evaluate classmates' writing.
- **Academic Language:** definition · description · details (3)
- **Content Vocabulary:** origami · folding · design · dragon · crane (5)
- **Graphic Organizer:** **4-column chart** — Hobby · What it is · How you do it · Examples
- **Writing Support:** its vs it's (commonly confused)
- **Rubric:** Organization · Grammar · Vocabulary · Writing type · Usage

## The spine — Leo's Hobby Planner Chart

A **4-column chart** sits on the deck from slide 3, empty. It's the same `buildFourColChart` helper Leo (and any future Writing learner) will see in every Explanation-Writing lesson. The chart fills across the deck:

1. **Warm Up (s5)** — Dad's "musical group" hobby fills the row first (REVEAL mode — chips below the chart drop into the slots when tapped) → demonstrates how an Explanation hobby maps into 4 columns.
2. **Read the Model (s17-21)** — as we read *"Fun with Paper"* paragraph by paragraph, the origami row is built in the chart from the passage text. Each paragraph contributes a chunk to one column.
3. **Plan model (s24)** — a 2nd model row gets filled (video games) so Leo sees one more example before his turn.
4. **Plan (s25)** — **Leo's own row** (FILL mode — Leo types into each cell, auto-persists to `leea-4-8-writing-fcc-leo`) for the hobby HE picks.
5. **Write (s32)** — Leo's filled chart sits beside the writing area as his reference while he drafts 2 paragraphs.
6. **PAYOFF (s42)** — Leo's filled chart + his draft paragraph are shown together as the "before & after" of planning → writing.

**Why this clears the two bars:**

- *Load-bearing:* the chart is the only tool that organises Leo's facts and details before he writes. Without filling it, he has no plan; without a plan, the writing has no structure. The LP itself names this — "First, decide what hobby... Write it in the first column..."
- *Accumulates:* the chart visibly grows across the whole deck (s5 → s17 → s21 → s24 → s25 → s32 → s42). Not reset per slide.
- *Earned payoff:* Leo's draft only exists because the chart was filled first. The s42 reveal pairs them.
- *Threads LP beats verbatim:* every LP phase (Warm Up · Present · Read the Model · Plan · Write · Edit · Share) has its slide(s) in the deck.

## Universal rule applied — 8 mini-games (NO bundling)

Per Leaneritan's locked rule *"every academic + content word gets a mini-game, every lesson, going forward"*: each of the 8 words gets its own embodied mini-game. No bundling (unlike Reading where I bundled hiders+seekers etc.). The rule applies even when the word count is high.

| # | Word | Type | Emoji | Mini-game (embodied — the word performs its meaning) |
|---|---|---|---|---|
| 1 | **definition** | Academic | 🏷️ | Drag word + means + meaning into a sentence frame. The frame closes when complete. |
| 2 | **description** | Academic | 📝 | Pile 4-5 descriptor chips onto a single noun (a dragon: scary, green, big, with wings, fire-breathing). The pile of details becomes the *description*. |
| 3 | **details** | Academic | 🔍 | Zoom-in on a single photo: a magnifier reveals 3 small details Leo would otherwise miss. |
| 4 | **origami** | Content | 📜 | Square paper folds across 3 click-steps → reveals a shape. The act of folding IS the vocab. |
| 5 | **folding** | Content | 🌀 | Tap dashed fold lines on a flat square in the right order. Each correct tap creases the paper. |
| 6 | **design** | Content | 🎨 | Pick which of 3 fold patterns matches the description (e.g. "a simple bug" → 2-fold pattern). |
| 7 | **dragon** | Content | 🐲 | Tap which of 3 silhouettes is the dragon. Reveals the finished origami dragon. |
| 8 | **crane** | Content | 🕊️ | Tap which of 3 silhouettes is the famous Japanese paper crane. Reveals fact about Sadako and the 1000 cranes (cultural tie). |

All 8 words appear in the *Fun with Paper* passage. Mini-games run s6-s13 (immediately before the Read-the-Model phase) so Leo has NO unknown-word ambush.

## The 4-column chart (locked spec — built via `buildFourColChart`)

Columns (per LP p.280): **Hobby** · **What it is** · **How you do it** · **Examples**

Three model rows the deck uses:
| Hobby | What it is | How you do it | Examples |
|---|---|---|---|
| being part of a musical group | people who make music together | choose songs to play · practice together · play music for other people | creating original songs · making new arrangements · playing in school concerts |
| video games | games that you play on TV, a computer, or a cell phone | choose an avatar · use a controller · move your avatar to score points | types of games: puzzles, action, sports, car games · avatars: ladybug, tiger, superhero |
| (Leo's own row) | (Leo types) | (Leo types) | (Leo types) |

The first row appears in **reveal mode** on s5 (Warm Up). The second row appears in **reveal mode** on s24 (Plan model). Leo's row uses **fill mode** on s25 with `storageKey: 'leea-4-8-writing-fcc-leo'` for auto-save.

## 44-slide table

| # | Slide | LP beat | Spine / vocab role |
|---|---|---|---|
| 1 | Title — Writing: Explanation about a hobby | — | Green-primary, blue-accent (Unit 8). |
| 2 | Today's Goal — 3 objectives + writing-type definition | LP Objectives | One-line objective set. |
| 3 | Spine launch — empty 4-col chart | — | `buildFourColChart` display mode with empty rows. Promise: fills as we go. |
| 4 | Warm Up — Guess Dad's hobby (musical group) | LP Warm Up | Clues card: "I'm a singer. My friends play music. We practice together." |
| 5 | Warm Up chart fill — musical group row | LP Warm Up (verbatim) | `buildFourColChart` reveal mode. Chips below drop into slots when tapped. First row of the chart unlocks. |
| 6 | 🏷️ definition mini-game | LP Academic Language | Drag *word + means + meaning* into a frame. |
| 7 | 📝 description mini-game | LP Academic Language | Pile descriptor chips onto a dragon. |
| 8 | 🔍 details mini-game | LP Academic Language | Magnifier zoom-in on photo → 3 details revealed. |
| 9 | 📜 origami mini-game | LP Content Vocab | 3-step paper-fold animation. |
| 10 | 🌀 folding mini-game | LP Content Vocab | Tap fold lines on a flat square in order. |
| 11 | 🎨 design mini-game | LP Content Vocab | Match design to its description. |
| 12 | 🐲 dragon mini-game | LP Content Vocab | Tap the dragon silhouette. |
| 13 | 🕊️ crane mini-game | LP Content Vocab | Tap the paper-crane silhouette. Cultural tie: Sadako + 1000 cranes. |
| 14 | Present — 4-col chart explained | LP Present (verbatim) | Headers explained. |
| 15 | Present model — musical group recap | LP Present | Chart from s5 redisplayed. |
| 16 | Read the Model — open to p.142 | LP Read the Model | Photo of origami crane / frog / dragon. |
| 17 | ¶1 passage — "The Japanese invented origami..." | LP Read | Display verbatim. |
| 18 | ¶2 passage — find the DEFINITION | LP Read + Academic | The word "origami" comes from two Japanese words... → the definition is in the text. |
| 19 | ¶2 examples — *for example* + *such as* | LP Read + Academic | Tap each phrase to highlight it in the passage. |
| 20 | ¶3 passage — "Origami is very creative..." | LP Read | Display verbatim. More examples here. |
| 21 | Origami chart fill — built from the passage | LP Plan (Origami model) | `buildFourColChart` reveal mode. Each chip drops into its slot. |
| 22 | 4 steps of explanation writing — recap | LP Read the Model recap | Define · describe · explain how · give examples. |
| 23 | Plan intro — "Now you'll make YOUR chart" | LP Plan | Bridge to Leo's own chart. |
| 24 | Plan model — video games row | LP Plan (verbatim model) | `buildFourColChart` reveal mode with the LP's video-games example. |
| 25 | Plan — Leo's own chart | LP Plan (Leo's turn) | `buildFourColChart` FILL mode + `storageKey`. Hobby chips offered (soccer cards, Marvel, video games, drawing, fossils). |
| 26 | Phrase bank — *for example* / *such as* | LP Expand (verbatim) | Tap each phrase to see a model sentence using it. |
| 27 | Expand — add another row to Leo's chart | LP Expand | Optional second hobby. |
| 28 | Be the Expert — its vs it's | LP Writing Support | The word *its* belongs to it · *it's* = *it is*. |
| 29 | its / it's tap exercise | LP Writing Support | 5 sentences, tap the correct word. |
| 30 | Write intro — "Now use your chart" | LP Write | Use Leo's filled chart as reference. |
| 31 | Sentence starters | LP Write | Phrase bank reminder. |
| 32 | Writing area | LP Write | Big text area + Leo's chart on the side. |
| 33 | Edit checklist (4 LP items) | LP Edit (verbatim) | Tap to check each item. |
| 34 | Edit its/it's check | LP Edit + Writing Support | Re-check the draft for its/it's. |
| 35 | Share intro | LP Share | "Read your writing to Dad. He'll give feedback." |
| 36 | 4 feedback frames | LP Share (verbatim) | One thing I like / A question I have / An interesting example / One thing I don't understand. |
| 37 | Writing Rubric | LP Rubric (verbatim) | 5-criteria table. |
| 38 | Formative Q1 — definition vs description? | LP Formative | MCQ. |
| 39 | Formative Q2 — find the example using *for example* | LP Formative | Tap-the-phrase. |
| 40 | Formative Q3 — its or it's? | LP Formative | MCQ. |
| 41 | Formative Q4 — match the writing-step to its phase | LP Formative | 4 phases matched. |
| 42 | PAYOFF — Leo's filled chart + draft paragraph | — | Spine resolution. Chart + draft side-by-side. |
| 43 | What we learned — 3 rule cards | — | Final consolidation. |
| 44 | Mark Done | — | Writes to `leea.lessonProgress.v1`. |

## JS safety contract (locked)

- ONE inline `<script>` block (+ external `src` for charts.js)
- All passage + sample sentences in backtick template strings OR HTML entities (`&apos;`)
- Never escape apostrophes inside `onclick` — use `data-text` + helper
- No `confirm()` — two-tap "armed" pattern for destructive actions
- DOM access wrapped in `try/catch` with null check
- `node -e` script-parse-check passes before commit

## Soccer / Leo personalization

Light touch — passage is fixed (Fun with Paper / origami). Soccer appears in:
- Hobby chips on s25 (Leo's own row): "collect soccer cards" · "read Marvel comics" · "play video games" · "draw pictures" · "collect fossils" · "play soccer"
- Sentence starter examples on s31 use soccer/Marvel scenarios.
- s27 second-row example offers "play soccer" as a model.

No current-stat web-search needed — this deck doesn't depend on current player data.

## Locks the future `/writing-app` skill inherits

Once this deck ships, extract these patterns:
1. **The 4-column chart spine** — Warm Up reveal → Read-the-Model reveal → Plan demo (reveal) → Plan Leo's row (fill) → Write reference → Payoff. Same arc for any Writing component.
2. **Mini-game per academic + content word (8 here, no bundling)** — universal rule, applied.
3. **its/it's Be-the-Expert mini-game** — pattern for Writing Support sections (each unit has one commonly-confused pair).
4. **5-criteria Writing Rubric slide** — Organization · Grammar · Vocabulary · Writing type · Usage. Same shape for every Writing component.
