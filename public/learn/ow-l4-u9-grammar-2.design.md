# Unit 9 Grammar 2 — Leo App Design

**Lesson:** Our World · Level 4 · Unit 9 (*The Science of Fun*) · Grammar 2
**Planner:** LP pp.304–305 (pdf_offset 289 + sections 15–16)
**Student Book:** p.155 · **TR:** 9.7 · **Workbook:** p.111 · **Grammar WB:** pp.40–41
**Teacher deck:** `ow-l4-u9-grammar-2.html` (42 slides) · **This app:** `public/learn/ow-l4-u9-grammar-2.html` (12 modules)

> This build locks the **grammar Leo-app pattern** for future units, in the same way vocab-2 locked the vocab side.

## Objective (LP verbatim)

> Students will **write and say definitions that include *which*.**

- **Grammar:** Definitions with *which*
- **Academic Language:** definitions, instructions
- **Content Vocabulary:** tetherball
- **Recycled (LP Warm Up):** connect, rub, skater, spin

## Hard scope line

*which* for things; *who* for people; *that* as an allowed substitute for *which*.

The LP itself puts all three in scope: the Be The Expert box teaches the *who → which* progression from Unit 8, its model definition for **skater** is *"A skater is a person **who** skates"*, and it states plainly that *"it is possible to substitute the relative pronoun **that** for **which**"*. Nothing beyond those three appears anywhere in the app — not in a distractor, not in a sort tile, not in an error-spotter case. **No *whose*, no *where* as a relative pronoun, no passive voice.** The app and the deck agree on scope.

## The spine

**Rebuild the scrambled Lab Dictionary.** Same spine as the deck, so the app is a continuation rather than a parallel world. Each module powers one station; the payoff is Leo writing the five real dictionary entries the book asks for.

It is **load-bearing**: every station either produces or repairs a *which*-definition, and none of them can be solved without the structure. It **accumulates**: the module ribbon fills station by station and the closing Dictionary requires the pattern learned in all the earlier ones.

## LP → module mapping (verbatim items)

| LP beat | Source | Module |
|---|---|---|
| Warm Up · Recycle — connect, rub, skater, spin | LP p.304 | **1 Warm Up** — the LP's four words with its own model definitions |
| Present · Grammar Box (TR 9.7) | SB p.155 | **2 The Rule** — both grammar-box sentences verbatim |
| Grammar in Depth · *which* replaces *it* / *them* | LP p.305 | **2 The Rule** — fusion round |
| Grammar in Depth · the echo trap | LP p.305 | **3 Detective** — the LP's two warnings verbatim |
| Grammar in Depth · Unit 8 *who* → Unit 9 *which* | LP p.305 | **5 Sort** |
| Grammar in Depth · *that* substitutes for *which* | LP p.305 | **9 Guess It** |
| **Practice · Activity 1 (5 items)** | **SB p.155** | **6 Practice** — all five verbatim with the book's own frames |
| Apply · Activity 2 game (read and guess) | SB p.155 | **9 Guess It** |
| Wrap Up · lettuce / video games / horses | LP p.305 | **6 Practice** — Challenge set |
| Extend · basketball, tennis, taking photos | LP p.305 | **6 Practice** — Challenge set |
| Formative · *skater* and *swing* | LP p.305 | **6 Practice** — Challenge set |

The five Practice items keep the book's exact frames — *This is a machine \_\_\_ / It is a hobby \_\_\_ / This is a force \_\_\_ / It is a game \_\_\_ / This is a sport \_\_\_* — and are the module's completion condition. The Challenge set unlocks only once all five are written, so the LP's own activity is never skipped for the bonus.

## Module spine — matches Unit 8

The three sibling grammar apps (`ow-l4-u8-grammar-1`, `ow-l4-u8-grammar-2`,
`ow-l4-u9-grammar-1`) all share one 12-module spine. This app uses it too, so the
deck's stations live *inside* the spine rather than replacing it.

| # | Module | Mechanic | Source of content |
|---|---|---|---|
| 0 | Word Lab | **flip flashcard + 🇯🇵 toggle + Practice/Quiz** (U8 standard) | definitions, instructions, tetherball |
| 1 | Warm Up | one-try MCQ | LP p.304 Recycle: connect, rub, skater, spin |
| 2 | The Rule | flip cards + fusion MCQ | SB p.155 grammar box + LP joins |
| 3 | Detective | ghost hunt + fix-the-entry MCQ | LP p.305 echo-trap warnings |
| 4 | Build It | tap words in order | `grammar.json` `tab4_master`, unchanged |
| 5 | Sort | **shared `pickChart('classification sort')`** | who/which, people vs things |
| 6 | Practice | multi-slot writer | **SB p.155 Act 1 verbatim** + Wrap Up / Extend / Formative |
| 7 | Survey | writer ×3 | ask-and-define |
| 8 | Word Web | **shared `pickChart('word web')`** | things Leo can define |
| 9 | Guess It | one-try MCQ | SB p.155 Act 2 guessing game + LP's *that* note |
| 10 | Quiz | one-try MCQ | `grammar.json` `tab3_quiz`, all 10, unchanged |
| 11 | Dribble! | one-try MCQ speed round | mixed |

**Vocabulary presentation.** Word Lab follows the Unit 8 grammar standard: a
two-sided flip card (front = emoji + word + IPA, back = meaning + `🇯🇵 日本語`
toggle + sample) with a Practice/Quiz mode switch, where Quiz asks Leo to *type*
the word from its meaning. Flat reveal cards are not the pattern — Unit 9
Grammar 1 still has that regression and should be brought in line.

**Shared components.** Loads `charts.js`, `chart-picker.js` and `wordweb.js` like
its siblings, so Sort and Word Web use the shared builders rather than
hand-rolled copies.

## Leo personalization

Samples only — never the LP's verbatim items, the authored quiz, or the build items.

| League / source | Player used |
|---|---|
| Premier League | Haaland (Man City), Salah (Liverpool) |
| La Liga | Bellingham (Real Madrid), Lamine Yamal (Barcelona), Mbappé (Real Madrid) |
| Bundesliga | Kane (Bayern Munich) |
| Ligue 1 | Dembélé (PSG) |
| World Cup 2026 | Spain champions; Yamal's Ballon d'Or |
| Movies | Batman |

Clubs web-searched at build time (2025-26 season) rather than recalled.

## Save/restore contract

- Auto-save on every action — no save button gates progress except the Dictionary, where saving *is* the action.
- Quiz score persists to `score` as `{score,total,percent,done}`.
- Restore on reopen — every module rebuilds its finished state, including the written definitions.
- Redo clears the tab's keys, then re-initializes with a fresh shuffle.
- Keys: `leea-4-9-grammar-2-tab-{i}-*` · homework `leo-4-9-grammar-2` · `captionKey` = `tab-6-caption` (joined definitions, for review).

## JS safety

Single `<script>` block · no `confirm()` (two-tap armed Redo) · no escaped apostrophes inside `onclick` (handlers attached in JS, `data-*` reads) · DOM reads null-checked · `node --check` on the extracted script is mandatory before commit.
