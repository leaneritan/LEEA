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
| Warm Up · Recycle — connect, rub, skater, spin | LP p.304 | **0 Warm Up** — the LP's four words with its own model definitions |
| Present · Grammar Box (TR 9.7) | SB p.155 | **2 The Rule** — both grammar-box sentences verbatim |
| Grammar in Depth · *which* replaces *it* / *them* | LP p.305 | **3 Fusion** |
| Grammar in Depth · the echo trap | LP p.305 | **4 Ghost Hunt** — the LP's two warnings verbatim |
| Grammar in Depth · Unit 8 *who* → Unit 9 *which* | LP p.305 | **5 The Gate** |
| Grammar in Depth · *that* substitutes for *which* | LP p.305 | **6 Substitute** |
| **Practice · Activity 1 (5 items)** | **SB p.155** | **9 Dictionary** — all five verbatim with the book's own frames |
| Wrap Up · lettuce / video games / horses | LP p.305 | **9 Dictionary** — Challenge set |
| Extend · basketball, tennis, taking photos | LP p.305 | **9 Dictionary** — Challenge set |
| Formative · *skater* and *swing* | LP p.305 | **9 Dictionary** — Challenge set |

The five Practice items keep the book's exact frames — *This is a machine \_\_\_ / It is a hobby \_\_\_ / This is a force \_\_\_ / It is a game \_\_\_ / This is a sport \_\_\_* — and are the module's completion condition. The Challenge set unlocks only once all five are written, so the LP's own activity is never skipped for the bonus.

## Module table

| # | Module | Mechanic | Source of content |
|---|---|---|---|
| 0 | Warm Up | one-try MCQ | LP Recycle words + LP model definitions |
| 1 | Word Lab | flip cards | Academic + content vocab cards |
| 2 | The Rule | flip cards | SB p.155 grammar box + `grammar.json` chart rows |
| 3 | Fusion | one-try MCQ | LP joins + 2 personalized |
| 4 | Ghost Hunt | tap the echoing pronoun | LP's two warnings + 2 parallel |
| 5 | The Gate | tap-word → tap-bin sorter | who/which, people vs things |
| 6 | Substitute | one-try MCQ | LP's *that* note + the person trap |
| 7 | Detective | one-try MCQ | broken entries |
| 8 | Build It | tap words in order | `grammar.json` `tab4_master` build items, unchanged |
| 9 | Dictionary | multi-slot writer | **SB p.155 Act 1 verbatim** + Wrap Up / Extend / Formative |
| 10 | Quiz | one-try MCQ | `grammar.json` `tab3_quiz`, all 10, unchanged |
| 11 | Dribble! | one-try MCQ speed round | mixed |

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
- Keys: `leea-4-9-grammar-2-tab-{i}-*` · homework `leo-4-9-grammar-2` · `captionKey` = `tab-9-caption` (joined definitions, for review).

## JS safety

Single `<script>` block · no `confirm()` (two-tap armed Redo) · no escaped apostrophes inside `onclick` (handlers attached in JS, `data-*` reads) · DOM reads null-checked · `node --check` on the extracted script is mandatory before commit.
