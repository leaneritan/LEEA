# Design notes — Unit 9 Grammar 1 (`ow-l4-u9-grammar-1.html`)

Companion doc for the 40-slide **v3 rebuild**. Named per-lesson (not a bare `design.md`) since `public/lessons/` holds dozens of other decks and a generic filename would collide on the next rebuild.

## v3 rebuild — what changed and why

This version replaces the v2 rebuild (42 slides, violet/arctic/yellow palette lifted from the Opener, `/components/charts.js` sort/compare slides) with a deck supplied directly by Leaneritan: same grammar point, same "Leo's Force Lab" 6-station conceit, different slide content and a self-contained red/yellow/navy palette (no longer matching the Opener's tokens).

Two pieces of site integration from the v2 deck were **ported forward** into the replacement so it keeps working with the rest of the app:

1. **Mark Done wiring** — the final slide's `#done-btn` writes the canonical `LessonProgressRecord` shape (`{lessonId, teacherId:"neritan", studentId:"leo", status:"done", completedAt, updatedAt}`) to `localStorage['leea.lessonProgress.v1']`, matching `src/data/lessonProgress.ts` — the code the teacher dashboard actually reads.
2. **try/catch safety** around every DOM-touching function in the inline script, per the repo's locked JS-safety contract for these decks (no unguarded `getElementById` chains that could throw and silently break the whole deck).

One thing was **dropped**: `/components/charts.js` (the shared drag-and-drop sort / three-column compare-chart component). The replacement deck has no slides that need it — its own build/match/sort mini-games (chip builders, matching pairs, comma-gap taps) are all hand-rolled in the inline script instead.

## Palette

Self-contained: `--red:#DC2626` (headers, primary tags), `--yellow:#FACC15` (secondary/comparative tag, highlights), `--amber:#F59E0B` (rule boxes), `--navy:#0f172a` (dark "lab" slides — title, celebration), `--green:#16A34A` and `--blue:#2563EB` (feedback/info-box tints). Does not reuse the Opener's `--arctic`/violet tokens from the v2 build.

## Spine — Leo's Force Lab

Six experiment stations, powered by lesson-phase milestones rather than individual sentence-build slides:

1. 🧪 **Word Lab** — slide 12, Flash Round (5/5 vocabulary words correctly matched to their emoji)
2. 📦 **Grammar Box** — slide 13, all 3 Grammar Box sentences split into cause/effect
3. 🔧 **Pattern A** — slide 17, chip-build "The more you practice, the more you learn"
4. 🚀 **Pattern B** — slide 18, chip-build "The more you push the swing, the faster it goes"
5. ⚙️ **Word Machine** — slide 29, Word Machine items 3-5 all built
6. ⚽ **World Cup** — slide 31, all 4 World Cup cards flipped and answered

All 6 stations are checked off by slide 31; slides 32-39 (Extend/Be the Expert/Wrap Up/Quiz/Formative) run after the Lab is fully powered, and slide 40 is the celebration + Mark Done payoff (not itself a station-unlock).

## The 40-slide map (as built)

1 Title · 2 Today's Goal (LP p.298, verbatim) · 3 Warm Up — Dad's Jump Experiment (Force Meter) · 4 Warm Up — Swing Question · 5 Song callback (TR 9.3) · 6 Word Lab intro · 7 describe (mini-game) · 8 match (mini-game) · 9 merry-go-round (mini-game) · 10 seesaw (mini-game) · 11 skateboarder (Word Builder chip game) · 12 Word Lab check → Station ① · 13 Grammar Box (TR 9.4, SB p.152) → Station ② · 14 Ball Throw demo (LP p.299) · 15 Make it about skaters (remix) · 16 Cause vs Effect sort · 17 Pattern A build → Station ③ · 18 Pattern B build → Station ④ · 19 The Comma Law (Comma Inspector) · 20 good→better trap · 21 Grammar Detective (3 fixes) · 22 Pattern summary board · 23 Practice 1 intro (SB p.152 Act 1) · 24 Practice 1 matching · 25 Practice 2 — Spinning Seesaw (SB p.152 Act 2) · 26 Recap — Ruler Seesaw sim (LP p.300) · 27 Word Machine intro (SB p.153 Act 3) · 28 Word Machine items 1-2 · 29 Word Machine items 3-5 → Station ⑤ · 30 Talk Time roulette (SB p.153 Act 4) · 31 World Cup round → Station ⑥ · 32 Extend — My Life Lab (LP p.301) · 33 Be the Expert — Energy Gyms · 34 Be the Expert — Seesaw Secret (lever) · 35 Wrap Up — Open Mic (LP p.301) · 36 Quick Review Quiz (6 items) · 37 Formative — Speak (LP p.301, verbatim) · 38 Formative — Write · 39 Lab Report (recap board) · 40 Celebration + Mark Done.

## LP page references

- Objective, patterns, academic language, content vocabulary: LP p.298
- Grammar Box (TR 9.4): SB p.152
- Warm Up scripts (jump, swing push): LP p.298
- SB Activity 1 (match): p.152
- SB Activity 2 (Spinning Seesaw): p.152
- SB Activity 3 (Word Machine, 5 items): p.153
- SB Activity 4 (Talk to a Partner): p.153
- Be the Expert / Our World in Context (energy gyms, seesaw lever): LP p.300-301
- Wrap Up, Formative assessment: LP p.301

## World Cup content note

Slide 31 uses July 2026 World Cup scenario results (France 2-0 Morocco, Norway/Haaland over Brazil, England 3-2 Mexico, Argentina comeback over Egypt) as double-comparative practice prompts, dated to the 2026-07-09 build. These are illustrative match scenarios for the grammar practice, not sourced from a soccer-stats verification pass — re-check before reusing after the 2026 tournament concludes.

## JS safety contract

- Single inline `<script>` block (no external includes after dropping `/components/charts.js`).
- Sentence content in single-quoted strings / template literals with HTML entities for punctuation — no unescaped apostrophes inside `onclick`.
- `data-text` + `dataset` pattern used for chip-driven text insertion (e.g. `startFill`, slide 32).
- No `confirm()` anywhere.
- Every DOM-touching function wrapped in `try/catch` (added in the v3 port — see "what changed" above).

## Validation performed

- Extracted the inline `<script>` and ran `node --check`-equivalent (`node -e` on the extracted block) — passes, only the expected `document is not defined` runtime signal.
- `npm run validate:content` and `npx tsc --noEmit` run as part of this rebuild's commit.
- Mark Done confirmed to write the canonical `LessonProgressRecord` shape from `src/data/lessonProgress.ts`.

## Do-not compliance

- No Grammar 2 (`which`) content introduced.
- Soccer/World Cup examples only in slide 31 (station 6) and slide 30 (Talk Time roulette) — the rest of the deck stays on-pattern with the LP's playground/lab scenarios.
