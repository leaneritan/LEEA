# Components — Locked Leo App Structure Per Type

Every Leo learner app is a multi-module HTML page. Teacher slideshows are crafted per lesson (see `docs/teacher-slides.md`). Leo apps follow a **locked module structure per component type** — the same shape every unit, with data swapped in.

When a new component type is built for the first time, lock its module list here. Future units copy that shape.

## Naming and pairing

- Teacher file: `public/lessons/<lesson-id>.html`
- Leo file:    `public/learn/<lesson-id>.html`
- Lesson IDs:  `ow-l<level>-u<unit>-<component>` e.g. `ow-l4-u8-grammar-1`
- Pairing rule: teacher `<component>` pairs with learner `<component>-app` in the same level/unit. The validator enforces this.

## Save / restore rules (apply to every Leo app)

Every module or quiz in a Leo app must obey these four rules. Same rules are in `AGENTS.md`; the design-decisions doc has the same contract.

1. Auto-save the done-key when the module finishes — do not wait for a "Mark complete" tap.
2. Persist quiz score to localStorage in the quiz finish function: `saveScore(score, total, true, { ...extras })`.
3. Restore the result view on modal/tab reopen — never restart a completed module from zero. Use a dedicated `restoreXResult()` function.
4. ↺ Redo clears saved state before re-initializing.

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

**Verification status:** the phase list was verified against Our World Level 4, Units 1, 4, 7, and 8 (planner.pdf pages 38–39, 134–135, 230–251, 260–282). Cross-level checks (Levels 1, 2, 3, 5, 6) are pending — those planner PDFs have not been pushed yet. The Level 4 pattern is expected to hold across levels because NatGeo Our World uses one consistent lesson architecture; re-verify when each level's PDF arrives and update this section if any level deviates.

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

Source JSON shape — see `content/subjects/english/courses/our-world/level-4/unit-8/lessons/opener-learner.json`. `moduleCount: 7`, `moduleKeyFormat: m{n}-done`, `captionKey: m5-caption`.

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

### reading (TO LOCK)

Target shape (informed by NatGeo reading components):

- Listen and Read (full text with paragraph reveals)
- Comprehension (sequence-order OR fill-chart, depending on the reading strategy)
- Graphic Organizer (flow chart / interview grid / three-column chart — type from `grammar.json`-style reading data)
- Vocabulary check from content words
- Quiz

To be locked when the first reading Leo app is built.

### writing (TO LOCK)

Target shape:

- Read Model
- Plan (editable column chart)
- Write (free-text with word count)
- Edit Checklist
- Share / Peer Feedback frames

To be locked when the first writing Leo app is built.

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
