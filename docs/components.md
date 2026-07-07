# Components — Locked Leo App Structure Per Type

Every Leo learner app is a multi-module HTML page. Teacher slideshows are crafted per lesson (see `docs/teacher-slides.md`). Leo apps follow a **locked module structure per component type** — the same shape every unit, with data swapped in.

When a new component type is built for the first time, lock its module list here. Future units copy that shape.

## Naming and pairing

- Teacher file: `public/lessons/<lesson-id>.html`
- Leo file:    `public/learn/<lesson-id>.html`
- Teacher lesson record: `content/.../lessons/<component>.teacher.json`
- Leo lesson record: `content/.../lessons/<component>.learner.json`
- Lesson IDs:  `ow-l<level>-u<unit>-<component>` e.g. `ow-l4-u8-grammar-1`
- Pairing rule: teacher `<component>` pairs with learner `<component>-app` in the same level/unit. The validator enforces this.

## Save / restore rules (apply to every Leo app)

Every module or quiz in a Leo app must obey these four rules. Same rules are in `AGENTS.md`; the design-decisions doc has the same contract.

1. Auto-save the done-key when the module finishes — do not wait for a "Mark complete" tap.
2. Persist quiz score to localStorage in the quiz finish function: `saveScore(score, total, true, { ...extras })`.
3. Restore the result view on modal/tab reopen — never restart a completed module from zero. Use a dedicated `restoreXResult()` function.
4. ↺ Redo clears saved state before re-initializing.
5. Every module still needs its own visible footer — a "Mark [Module] complete ✓" button (disabled until that module's own criteria are met) plus a two-tap-armed ↺ Redo button — even though rule 1 says completion auto-saves without a tap. Rule 1 governs the data; this rule governs the UI, and both are required. Ten of thirteen modules in `ow-l4-u8-writing.html` shipped without this and it read as a real, reported bug.
6. If a module tracks per-question answers in an object guarded by `if (ANS[qk]) return;`, its restore function must re-apply the disabled/"correct" look to those buttons, not just restore the data — see `restoreAnsweredButtons()` in `ow-l4-u8-writing.html`.

`SAVE_PREFIX` format: `leea-<level>-<unit>-<component>-`
`HOMEWORK_ID` format: `leo-<level>-<unit>-<component>`

## Component tone

Set the component CSS tone via `getComponentMeta()` in `src/components/componentMeta.ts`:

| Component | Tone | Emoji |
|---|---|---|
| opener | gold | 🚀 |
| vocab-1 / vocab-2 | green | 📚 |
| song | coral / pink #d94f7b | 🎵 |
| grammar-1 / grammar-2 | blue | 📐 |
| reading | amber | 📖 |
| writing | plum | ✍️ |

Three CSS variable surfaces use the tone: the Leo homework hero (`--hero-accent`), Home's next-card (`--next-accent`), and the Leo app card list (`--leo-component`). See `globals.css` for the variable cascade.
## Canonical NatGeo lesson phases per component

Every Our World unit follows the same component-phase pattern. The teacher slideshow has one slide (or small slide group) per phase; the Leo app has one module per phase. The phase names below are the canonical NatGeo names — match them in slide labels, Leo module IDs, and lesson HTML.

| Component | Phases (in order) |
|---|---|
| **opener** | Introduce (Activate Prior Knowledge + Build Background) + Be the Expert |
| **vocab-1** | Warm Up → Present → Practice → Apply → Extend → Wrap Up → Recap |
| **song** | Use the Song + Use It Again (recycles Vocab 1 and previews Grammar 1 only — never Grammar 2) |
| **grammar-1** | Warm Up → Present → Practice → Apply → Extend → Wrap Up → Recap + Grammar in Depth |
| **grammar-2** | Warm Up → Present → Practice → Apply → Extend → Wrap Up → Recap + Grammar in Depth |
| **vocab-2** | Warm Up → Present → Practice → Apply → Extend → Wrap Up (no Recap) |
| **reading** | Warm Up → Present → Practice → Apply → Extend → Recap → Wrap Up (Recap is before Wrap Up here; Think Aloud sits inside Present in some units, not a separate phase) |
| **writing** | Warm Up → Present → Read the Model → Plan → Write → Edit → Share |
| **review** | Mixed checkpoint review after Units 1-3, 4-6, or 7-9 |
| **extra-reading** | Extended checkpoint reading after Units 1-3, 4-6, or 7-9 |
| **mission** | Think → Pair → Share + Be the Expert (About the Photo + Meet the Explorer) |
| **project** | Prepare → Share → Modify |
| **book-reading** | Before You Read → While You Read → After You Read |

Notes:

- These phases are the **truth** — they come from the NatGeo Our World lesson planner. When the planner page for a unit shows the same phase names, the slideshow and Leo app use them verbatim. Do not rename phases (e.g. don't change "Practice" to "Try It Out").
- The Be the Expert sidebar in opener and mission becomes a final slide/module ("About the Photo" / "Meet the Explorer") — it is not a teacher-only note.
- The vocab-2 phase list deliberately ends at Wrap Up. Vocab 2 has no Recap because the unit's review work happens in Reading and Writing.
- Reading flips the usual order: Recap comes BEFORE Wrap Up.
- Song only previews Grammar 1 and recycles Vocab 1. Do not include Grammar 2 content in song slides or the song Leo app.

These phases drive what goes in each Leo app shell below. The shell adds vocab review / academic / content / formative assessment modules around the canonical phases when the content fits.

**Verification status:** all six Our World levels were checked. The opener / vocab / song / grammar / reading / writing phase sequences above are the same across L1-L6 (verified against Level 1 Unit 1 page 46, Level 2 + Level 3 Scope and Sequence pages, Level 4 Units 1/4/7/8, Level 5 + Level 6 Scope and Sequence pages). Two level-band variants below.

### Level-band variants: Value vs Mission, Let's Talk

The end-of-unit social-emotional segment and the dialogue boxes differ between lower and upper levels:

| Phase | Levels 1-3 | Levels 4-6 |
|---|---|---|
| End-of-unit social-emotional | **Value** (e.g. "Be neat", "Take care of others", "Be a good sport") | **Mission** with National Geographic Explorer (e.g. "Connect with nature", "Be prepared") |
| Functional dialogue | not in scope | **Let's Talk** (e.g. "It's my turn", "I love it!") |
| Unit 0 (preparatory unit) | present | not present |
| Project | present | present |

Source-tag impact:

- Levels 1-3 use `VL` (value) where Levels 4-6 use `MI` (mission). E.g. `OW2-U4-VL` vs `OW4-U7-MI`
- Let's Talk content in Levels 4-6 uses `LT`. E.g. `OW5-U3-LT`
- `PJ` (project) and `RDR` (unit reader) work the same across all levels
- See `docs/vocab.md` for the full source-tag code table

When scanning a Level 1-3 unit, look for the **VALUE** label on the unit opener spread and the end-of-unit Value page; when scanning Level 4-6, look for **MISSION** with a Be the Expert "About the Photo" + "Meet the Explorer" sidebar.

## Locked module structures

### opener (LOCKED)

Reference: `public/learn/ow-l4-u8-opener.html`

7 modules (m1–m7), all sequential:

| ID | Title | Purpose |
|---|---|---|
| m1 | In This Unit I Will | Introduce the unit goals |
| m2 | What Is a Hobby? / Theme Reveal | Themed reveal scenes with quick-check MCQ |
| m3 | Photo Explorer | Tap-to-reveal photo details |
| m4 | Look and Check | Caption-style MCQ from the planner |
| m5 | Write Your Caption | Free-text caption (saves to `captionKey`) |
| m6 | Hobby or Not? / Theme Sorter | Sort items into two buckets |
| m7 | Final Quiz | Multiple-choice quiz, score saved |

Source JSON shape — see `content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener.learner.json`. `moduleCount: 7`, `moduleKeyFormat: m{n}-done`, `captionKey: m5-caption`.

### vocab-1 (LOCKED)

Reference: `public/learn/ow-l4-u8-vocab-1.html`

Tab-based learner app. Each tab is a module with `tab-{i}-done` keys.

11 tabs covering: word intro, word match game, sentence completion, picture match, sorting, listening, fill-in-the-blank practice, build-the-sentence, mini quiz, write your own, and a final quiz.

When this app is rebuilt for vocab-2 or future units, copy the tab structure exactly. Data swaps via the unit's `vocab1WordIds` from `vocabulary.json`.

### vocab-2 (LOCKED via vocab-1)

Same module structure as vocab-1. Different data only (different word list, different examples).

### song (LOCKED)

Reference: `public/learn/ow-l4-u8-song.html`

7 modules with non-numeric IDs:

| ID | Title | Purpose |
|---|---|---|
| m1 | Listen & Sing | Karaoke word-tap |
| m2 | Song Words | Song vocabulary carousel |
| ma | Academic Words | Academic carousel inside the song unit |
| m3 | Word Review | Vocab game using song words |
| m4 | Use It Again | Swap-and-rewrite activity |
| m5 | Write a Line | Free-text line writing |
| m6 | Quiz | Multiple-choice quiz, score at `m6-score` |

Note the non-numeric `ma` module and the non-default `scoreKey: m6-score`. Set `moduleKeys` explicitly in the lesson JSON for this component.

### grammar-1 (TO LOCK — build first, then update this section)

Target shape (informed by the Unit 7 Grammar 2 sample upload and grammar reference):

- Related Vocabulary (flashcards + quick check)
- Academic Language
- Content Vocabulary
- Warm Up
- Present (grammar box — reads from `grammar.json` chart)
- Grammar in Depth (rules + pattern from `tab2_levelup`)
- Practice 1
- Practice 2
- Recap
- Apply
- Extend
- Wrap Up
- Formative Assessment
- Themed final game (varies per unit theme)

Module count and exact module IDs to be locked when the first grammar-1 Leo app is built. Update this section then.

### grammar-2 (TO LOCK)

Same shape as grammar-1. Different chart data and different theme. To be locked after grammar-1 is locked.

### reading (LOCKED — Unit 8 Reading)

**Locked patterns:** `public/lessons/ow-l4-u8-reading.html` (teacher · 44 slides) + `public/learn/ow-l4-u8-reading.html` (Leo app · landing → SB + WB modes · 11 modules). Skill: `.claude/commands/reading-app.md`.

**Teacher slideshow shape:**
- 1920×1080 LEEA shell (#scaler + .slide.active + nav + teacher notes). Single inline `<script>` block.
- ~44 slides. The passage from the source (Student Book TR pages) appears **verbatim** — never paraphrased.
- One throughline spine (e.g. "Leo's First Geocache Hunt") with a step-flowchart that fills as each paragraph + comprehension check completes.
- Academic Language + comprehension-blocking new words get mini-games BEFORE Leo meets them in the passage; guessable words get inline first-encounter gloss tags.
- Graphic-literacy element (compass / map / etc.) and Content Vocab unified into one interactive when applicable.
- LP beats: Warm Up → Vocab mini-games → Present/Predict → Read Together (¶-by-¶ with comp Qs and flowchart unlocks) → Think Aloud → Reading Strategy (signal words explicit) → Practice (LP Activity 2 verbatim) → Apply (label pictures) → Wrap Up (importance sort using `buildDndSorter`) → Extend (Leo's own hobby) → Recap → Payoff → Formative → Mark Done.

**Leo app shape — landing-screen mode pattern:**
- App opens to a **landing screen** with one card per source (📘 SB, 📒 WB, future 📕 Extra-Reading). Each card shows live progress for that mode.
- Each mode has a `◀ Back to menu` pill — switchable any time, progress persists per mode.
- Each mode's tab strip starts with a **Vocab tab** (flashcards Practice + Quiz modes, mirrors the Vocab 2 Academic tab pattern) covering every word in that source: academic + content + any source-only words that were pre-added to `vocabulary.json`.
- Then a **Read tab** (passage verbatim, paragraph-by-paragraph unlock — ¶2 unlocks only after Leo answers ¶1's comprehension Q).
- Then activity tabs that mirror the source's exercise types (e.g. Strategy + Order + Label for SB Hide-and-Seek; T/F + Timeline for WB Video-Games).
- Each mode has its own scored **Quiz tab** writing to `score` (SB) and `wb-score` (WB).
- All four LEEA save/restore rules apply per mode.

**Storage namespacing (locked):**
```text
SAVE_PREFIX:     leea-<l>-<u>-reading-
SB tabs:         tab-{i}-done           (i = 0..N-1)
WB tabs:         wb-tab-{i}-done
SB quiz score:   score
WB quiz score:   wb-score
Mode tracker:    last-mode              (landing | sb | wb)
Tab trackers:    last-tab, wb-last-tab
homeworkId:      leo-<l>-<u>-reading
```

**Reference rule:** if the workbook reading uses words Leo hasn't met yet, they get added to `vocabulary.json` + the global `vocabulary-index.json` BEFORE the WB tabs are built — tagged with source `OW<level>-U<unit>-RD-WB`. (See Unit 8 Reading where arcade / console / portable / virtual reality / headset were added for the Video Games WB reading.)

### writing (LOCKED — Unit 8 Writing)

Reference: `public/learn/ow-l4-u8-writing.html` (13 modules, `m1`–`m13`).

13 modules, all sequential, covering both the Student Book and Workbook writing tasks for the unit:

| ID | Title | Type | Done criteria |
|---|---|---|---|
| m1 | Academic Language | Flashcards + 10Q quiz | Quiz pass (≥7/10) |
| m2 | Related Vocab | Flashcards + 12Q quiz | Quiz pass (≥9/12) |
| m3 | What is Explanation Writing? | Warm-up + model reading + 6 comp. Qs + 4-step structure | Manual Mark Complete (ungated) |
| m4 | Key Expressions | 3 quick-check Qs | Manual Mark Complete (ungated) |
| m5 | Plan My Chart | 4-column fill chart (`buildFourColChart`, `mode:'fill'`) | All 4 columns filled |
| m6 | Write! | Free-text draft, word/sentence counter | ≥60 words and ≥4 sentences |
| m7 | Edit Checklist | 3 its/it's Qs + 4-item checklist | All 3 Qs + all 4 boxes checked |
| m8 | 6 Steps (WB Act 1) | Tap-to-reveal steps + 3 quick-check Qs | All 3 Qs answered (requires all 6 steps opened first) |
| m9 | Word Map (WB Act 2) | Hobby + 4 free-text questions | All 5 fields filled |
| m10 | Define (WB Act 3) | 4 comp. Qs + 3 apply fields | All 4 Qs + all 3 fields filled |
| m11 | Compare Intros (WB Act 4) | 3 comp. Qs + intro draft | All 3 Qs + draft >25 chars |
| m12 | Draft on a New Topic (WB Act 5) | Topic pick + mini-plan + draft + 4-item checklist | Topic + ≥60 words + all 4 boxes checked |
| m13 | Can Leo Score? | Final quiz, 10Q, 80% gate | Score ≥8/10 |

Source JSON shape — `content/subjects/english/courses/our-world/level-4/unit-8/lessons/writing.learner.json`. `moduleCount: 13`, `moduleKeyFormat: m{n}-done` (default, no custom `moduleKeys` needed), `scoreKey: score` (default — m13's final quiz is the only one using `saveScore()`).

Every module — including the ones whose completion is fully automatic (quiz pass, word count, filled-field thresholds) — has a visible footer: a "Mark [Module] complete ✓" button disabled until that module's own criteria are met, and a two-tap-armed "↺ Redo" that clears that module's saved keys and resets its DOM. m13 additionally restores its saved result (pass/fail screen) on modal reopen instead of restarting the quiz, per rule 3. When rebuilding this app for a future unit's writing lesson, copy the module list and the footer pattern exactly — data and content vocabulary/theme swap only.

### review (TO LOCK)

Checkpoint review apps appear after three-unit bands (`1-3`, `4-6`, `7-9`). They should mix vocabulary, grammar, listening/reading comprehension, and a final quiz from the previous three units. Use teacher component `review` and learner component `review-app`. Suggested IDs: `ow-l4-r7-9-review` and `ow-l4-r7-9-review-app`.

### extra-reading (TO LOCK)

Extra Reading apps appear beside checkpoint reviews after the same three-unit bands. They should focus on extended reading, comprehension checks, new glossary/support words, and a short response. Use teacher component `extra-reading` and learner component `extra-reading-app`. Suggested IDs: `ow-l4-er7-9-extra-reading` and `ow-l4-er7-9-extra-reading-app`.

## Reading vocab and grammar from the unit JSON

Every Leo app module that needs a vocab word, an academic word, or a grammar chart reads it from the unit's `vocabulary.json` / `grammar.json` — never a hardcoded copy inside the HTML.

- The unit's `vocabulary.json` is the single source of truth for the word, emoji, meaning, example, and Japanese
- A Leo app's flashcard, quiz prompt, or carousel pulls those fields by `id` from the JSON
- The same rule applies to teacher slideshows — see `docs/teacher-slides.md`
- This is why **emojis stay consistent**: change the emoji in one place, every surface updates

If a Leo app needs words a unit's JSON does not have (e.g. an end-of-unit review using vocabulary from earlier units), pull those by `id` from the global `vocabularyItems` array in `src/data/reference.ts`.

## Source field shape

The Leo lesson JSON `source` block must describe localStorage exactly so `getLearnerAppProgress` reads the right keys:

```json
{
  "storagePrefix": "leea-4-8-opener-",
  "moduleCount": 7,
  "moduleLabels": ["...", "..."],
  "moduleKeys": ["m1-done", "m2-done", "m3-done", "m4-done", "m5-done", "m6-done", "m7-done"],
  "scoreKey": "score",
  "homeworkId": "leo-4-8-opener",
  "captionKey": "m5-caption"
}
```

When `moduleKeys` is set, it overrides `moduleKeyFormat`. The song app sets `moduleKeys` because of the non-numeric `ma` module. Most apps just use `moduleKeyFormat: "m{n}-done"` and omit `moduleKeys`.

## Locking process

When a new component Leo app is built for the first time:

1. Confirm the structure works in browser
2. List its modules in this doc under that component's section, mark "LOCKED"
3. Note any special storage fields (non-numeric module IDs, non-default `scoreKey`, `captionKey`)
4. Future units of the same component copy that structure exactly

## Grammar slide patterns (locked in v4 of Unit 8 Grammar 1)

These reusable patterns came out of iterating the Unit 8 Grammar 1 teacher deck and now apply to every future grammar lesson:

1. **Grammar Box + Workbook Transform Pairs** — the chart slide pairs the rule box (left) with 3–4 source→joined transform exercises from the Grammar Workbook (right). Each pair has a `buildTxPair(n, resultHTML)` button that animates the duplicate pronoun dissolving and reveals the joined sentence. Source pill cites Student Book TR page AND Grammar Workbook page.

2. **Word Web + Live Sentence Builder** — Extend (Word Web) slides never use `buildWordWeb` alone. Always pair it with a live sentence builder (uses the `onChange(nodes)` callback to render the target-grammar sentence for every filled oval). Include a person-picker row above the web so the same component works for Dad / Mom / Leo / a player / a friend — each person gets its own `storageKey` so prior work persists per person. See `docs/chart-templates.md` for the API.

3. **Soccer carousel size + grouping** — grammar sample carousels hold 15+ tagged samples grouped by source category (Premier League / La Liga / Bundesliga / Ligue 1 / Serie A / Champions League / World Cup / Movies). Use `<span class="league">` tag inside each card. End with a count summary line.

4. **Grammar Detective — workbook-cited cases** — Detective cases pull from the Grammar Workbook's "who or X" rule AND the transform pairs (page 34 for Unit 8). Cite the workbook page in each case explanation. Aim for 7+ cases per Detective slide.

5. **Source pills on every chart slide** — every chart / rule / sample slide includes a `<span class="source-pill">` at the bottom citing both sources: `Student Book p. X / TR Y.Y · Grammar Workbook p. Z`.

When iterating an existing deck (per user feedback "don't add or delete slides"), improve interactivity and pack more content into existing slides — keep the slide count constant.
