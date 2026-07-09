# Design notes — Unit 9 Grammar 1 (`ow-l4-u9-grammar-1.html`)

Companion doc for the 42-slide rebuild. Named per-lesson (not a bare `design.md`) since `public/lessons/` holds dozens of other decks and a generic filename would collide on the next rebuild.

## Deviations from the build spec, and why

The build spec this rebuild was based on assumed a different repo layout than the one that actually exists here. Rather than build to paths the app doesn't serve, this rebuild kept the spec's *content and interaction design* intact and mapped everything onto the real LEEA structure:

| Spec assumed | Actual repo | What I did |
|---|---|---|
| `teach/our-world/level-4/unit-9/grammar-1.html`, registered in an `index.html` LIVE-entry list | `public/lessons/ow-l4-u9-grammar-1.html`, registered via `content/subjects/english/courses/our-world/level-4/unit-9/lessons/grammar1.teacher.json` (`embedPath`) | Built at the real path, updated the real registration file |
| `teach/components/charts.js` via a relative path counted back from the unit folder | `public/components/charts.js`, referenced by every other lesson deck in this repo as the absolute path `/components/charts.js` (Next.js serves `public/` at root) | Used `/components/charts.js`, matching every sibling file |
| Unit 9 Opener shell described as `#scaler`/`#deck`/`#nav-bar`/`#tn-panel`/`.pbar` | The real `ow-l4-u9-opener.html` actually uses `#wrap`/`#deck`/`#nav`/`#tn-drawer` (bottom drawer, not a side panel)/`#pgbar`+`#pgfill`, with teacher notes stored in a `NOTES` JS object keyed by slide number (not `data-notes` attributes), plus fullscreen toggle (F key) | Lifted the **real** Opener shell verbatim — this is what "single source of truth for Unit 9's look" actually requires |
| Fallback palette (energy red + electric yellow) "if the Opener isn't in the repo yet" | The Opener **is** in the repo, with real tokens: `--green:#7C3AED` (violet, historically named), `--arctic:#0EA5E9`, `--yellow:#FFCC00`, `--red:#DC2626`, plus the paper/ink/border neutrals | Lifted the Opener's exact tokens (not the fallback hex values) and used `--red` as this deck's *primary* (headers/buttons), `--arctic` for academic-language slides, `--yellow` for highlights — giving Grammar 1 its own identity within the same Unit 9 family, per the spec's explicit ask for a red-primary look |
| Mark Done writes `{status:'done', ts: Date.now()}` (matching the real Opener) | `src/data/lessonProgress.ts` — the code the dashboard actually reads — expects `LessonProgressRecord: {lessonId, teacherId:"neritan", studentId:"leo", status:"done", completedAt, updatedAt}` | Wrote the canonical shape. **This is a real fix**, not just a style choice: the Opener's own shape and the previous (pre-rebuild) grammar-1 file's shape (`{mode:'teacher', completedAt}`) would BOTH fail `getDoneLessonCount()`'s check (`progress[lessonId]?.status === "done"`) — the Opener's happens to pass by accident (it does set `status:'done'`), the old grammar-1 file did not. This rebuild is the first Unit 9 teacher deck to match the type the app's own code defines. |
| Validation via jsdom | Playwright (headless Chromium) | Same guarantee (real DOM, real event handlers, 0 runtime errors), stronger tool (real layout/CSS, real drag events for the charts.js sorter) — jsdom isn't a project dependency here |

## Palette

Lifted verbatim from `public/lessons/ow-l4-u9-opener.html`'s `:root` block. `--red` (`#DC2626`) is this deck's primary — header bars, primary buttons, `.slide-header` equivalents (`.sh.red`). `--arctic` (`#0EA5E9`) marks academic-language and "Be the Expert" content, matching the Opener's own convention (`.sh.arc`, `.sh.gld`). `--yellow` (`#FFCC00`) is the secondary highlight (comma callouts, grammar-box card, confetti). `--green` (the Opener's violet `#7C3AED`) is intentionally underused here so Grammar 1 reads as a distinct deck within the same Unit 9 family, not a re-skin of the Opener.

## Spine — Leo's Force Lab

Six experiment stations, each powered by a genuine sentence-building moment (not a decorative reward):

1. 🌀 **Spin Station** — slide 19, Pattern A build (two skaters)
2. 🌊 **Swing Station** — slide 20, Pattern B build (swing)
3. ⛓️ **Chain Reaction Station** — slide 24, Build-It Pattern A (chip assembly)
4. 🛹 **Skate Ramp Station** — slide 25, Build-It Pattern B (chip assembly; spec explicitly flags this as a station-powering moment)
5. ⚽ **Soccer Power Station** — slide 34, La Liga/Yamal build (spec explicitly flags this one too)
6. ⚖️ **Lever Station** — slide 38, Be the Expert (seesaw-as-lever paragraph, tapped to power)

All 6 are powered by slide 38, well before the slide 42 payoff — payoff slide 42 is a celebration/confetti/Mark Done moment, not itself a station-unlock.

## The 42-slide map (as built)

1 Title · 2 Today's Goal (LP p.298 objective, verbatim) · 3 Force Lab launch · 4 Song recall (TR 9.3 line, LP p.296) · 5 Book demo (LP p.298 Warm Up) · 6 Formalize · 7 Swing predict · 8 describe (full mini-game) · 9 match (full mini-game) · 10–11 Vocab-1 light refresh (push/pull/spin, force/swing/skater/balance) · 12 skateboarder (new word, full word-card) · 13 Force Lab experiment dialogue (LP Present/Contextualize) · 14 Present check · 15 Grammar Box TR 9.4 (the one full reveal) · 16 Cause/effect check · 17 Cause→effect arrow · 18 Sort It (charts.js `buildDndSorter`) · 19 Pattern A build → Spin Station · 20 Pattern B build → Swing Station · 21 Comma rule · 22 Irregular good→better · 23 Grammar Detective (4 fixes) · 24 Build It Pattern A → Chain Reaction · 25 Build It Pattern B → Skate Ramp · 26–27 SB Activity 1 (match picture → match ending) · 28 SB Activity 2 (read & write, reciprocal pairs) · 29 SB Activity 3 (word-pair completions) · 30 SB Activity 4 (Talk to a Partner, 60s timer) · 31 Mixed stretch · 32 Soccer: Bundesliga/Kane · 33 Soccer: Premier League/Haaland · 34 Soccer: La Liga/Yamal → Soccer Power · 35 Compare chart (charts.js `buildThreeColChart`) · 36 Word web · 37 Be the Expert: exercise equipment/friction · 38 Be the Expert: seesaw lever → Lever Station · 39 Recap · 40 Formative speak (LP p.301, verbatim) · 41 Formative write · 42 Payoff + Mark Done.

## LP page references

- Objective, patterns, academic language, content vocabulary, materials, resources: LP p.298 (left column)
- Grammar box (TR 9.4), three model sentences: SB p.152 / LP p.298 right column
- Grammar in Depth (cause→effect, comma rule): LP p.298
- Warm Up script (book push, swing push): LP p.298
- SB Activity 1 (match): p.152 — answer key `they spin → the faster they go`, `she pushes → the higher she goes`, `he pushes down → the higher he goes`
- SB Activity 2 (read & write, reciprocal): p.152 — 4 items, spinning-ride picture
- SB Activity 3 (read & write, word pairs): p.153 — 5 items
- SB Activity 4 (Talk to a Partner): p.153 — word box + 2 model sentences
- Be the Expert / Our World in Context (exercise equipment; seesaw lever): SB p.153
- Formative assessment: LP p.301, verbatim

## Verified soccer stats (checked via web search, 2026-07-09)

- **Harry Kane** won the 2025-26 European Golden Shoe with 36 Bundesliga goals (61 across all competitions) for Bayern Munich — his third straight Bundesliga top-scorer title. [Bundesliga.com](https://www.bundesliga.com/en/bundesliga/news/harry-kane-wins-golden-shoe-2025-26-bayern-munich-england-37552) · [FC Bayern](https://fcbayern.com/en/news/2026/05/harry-kane-crowned-bundesliga-top-scorer-for-third-year-running)
- **Erling Haaland** won his third Premier League Golden Boot in 2025-26, scoring 27 goals for Manchester City. [PremierLeague.com](https://www.premierleague.com/en/news/4591856/haaland-wins-202526-premier-league-golden-boot-award)
- **Lamine Yamal** was named 2025-26 LaLiga Player of the Season as FC Barcelona retained the league title (back-to-back). [FC Barcelona](https://www.fcbarcelona.com/en/football/first-team/news/4514485/lamine-yamal-202526-laliga-player-of-the-season/featured) · [ESPN](https://www.espn.com/soccer/story/_/id/48872015/laliga-2025-26-awards-lamine-yamal-barcelona-reign-spain-again-graham-hunter)

The original spec's draft sentence for Kane also claimed he "ended the season on a hat-trick" — that detail wasn't confirmed in search results, so it was dropped rather than included unverified. If this deck is rebuilt after the 2026-27 season starts, re-check all three before reusing.

## Validation performed

- Extracted the inline `<script>` and ran `node --check` — passes.
- Asserted 42 `.slide` elements with sequential ids `s1`…`s42`, and 42 keys in the `NOTES` object, `1`…`42` — both pass.
- Playwright (headless Chromium) walk through all 42 slides, clicking every interactive element (join-step buttons, chips, match pairs, quiz options, build chips, detective words, comma gaps, reveal cards) twice each (to exercise two-tap-armed and re-click-guard logic), filling textareas: **0 `pageerror` events**.
- Re-verified over a real HTTP server (not `file://`) that `/components/charts.js`-dependent slides (18 Sort It, 35 Compare Chart) render and are actually interactive — including a real mouse drag-and-drop on the Sort It sorter, which correctly categorized a tile and turned it green.
- `pgfill` (progress bar) reaches exactly `100%` on slide 42, computed dynamically as `(current-1)/(TOTAL-1)*100` (not per-slide inline widths), so it's correct by construction rather than by manual arithmetic.
- Mark Done writes the canonical `LessonProgressRecord` shape from `src/data/lessonProgress.ts` and was confirmed via `localStorage` inspection after a real click.
- `npm run validate:content` passes (347 vocabulary cards, 12 grammar cards, 33 lessons, 4890 Sanseido links checked).

## Do-not compliance

- No Grammar 2 (`which`) content introduced.
- Soccer examples are Kane/Haaland/Yamal, not Ronaldo/Messi.
- `seesaw`, `merry-go-round`, and `skateboarder` are not given a "Content Vocabulary" badge in this deck. Note: the planner PDF's own Grammar 1 metadata box *does* list `merry-go-round, seesaw, skateboarder` under "Content Vocabulary," and all three are already registered in `content/.../unit-9/vocabulary.json` — so the spec's claim that "merry-go-round isn't in Unit 9 at all" doesn't hold against the primary sources. Given that, and given the spec's own slide 12 instruction to teach `skateboarder` as a full word-card (directly contradicting its own "don't label as vocabulary" rule), this build resolved the conflict by teaching `skateboarder` on slide 12 as instructed, using a "New Word" tag instead of "Content Vocabulary," and keeping `seesaw`/`merry-go-round` as station imagery/practice-sentence props only, without a dedicated vocab slide.
