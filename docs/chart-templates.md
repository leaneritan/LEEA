# Chart and Graphic Organizer Templates

These National Geographic graphic organizers should become reusable LEEA chart templates.

## Component Locations

Reusable templates live under two parallel folders, depending on which surface they're for:

- `public/teach/components/*` — used by Neritan's teacher slide decks under `public/lessons/*.html`
- `public/learn/components/*` — used by Leo's learner apps under `public/learn/*.html`

Same naming style, same self-contained vanilla JS. Each template file exposes one or two `window.build*` functions and an internal config store keyed by element id.

## Implemented Templates

### `sunshine` — Sunshine Organizer (graphic organizer)

**File:** `public/learn/components/sunshine.js`
**Surface:** Leo learner apps
**First used in:** OW L4 U8 Vocabulary 1 Leo app (`public/learn/ow-l4-u8-vocab-1.html`) Tab 9 — "Apply"
**Based on:** the classic Cengage 6-ray WHO / WHAT / WHEN / WHERE / WHY / HOW organizer, generalized to N rays (3–8)

#### API

```js
// Load once in <head>:
// <script src="/learn/components/sunshine.js"></script>

el.innerHTML = buildSunshine({
  id:          'sunshine-svg',    // unique string per page
  words:       [                  // one entry per ray (3–8)
    { word: 'collect', emoji: '🗂️' },
    { word: 'creative', emoji: '🎨' },
    // ...
  ],
  centerLabel: 'My Questions',    // text inside the center sun
  centerEmoji: '☀️',              // optional, defaults to ☀️
  centerHint:  'Tap a ray',       // optional small caption
  saved:       { 0: 'his answer' }, // truthy entries render the green-check filled state
  onSelect:    (i, word) => openEditor(i)   // ray tap / Enter / Space
  // angles:   [-90, -18, 54, 126, 198]   // optional override; defaults to evenly spaced from top
});
```

#### Behaviour

- N triangular rays around a center sun, evenly spaced by default.
- Each ray shows a curved word label (SVG `<textPath>`) along the inner arc + a large emoji along the ray.
- Center shows the optional emoji, label, and hint.
- Rays cycle through a warm sun palette (gold / amber / coral / honey / peach / butter).
- `saved[i]` truthy → ray renders with a slightly more saturated fill and a green check badge near the tip.
- Hover or keyboard-focus on a ray: subtle scale-up + brightness pop. `prefers-reduced-motion` is respected.
- Each ray is a button (tap + Enter + Space) with an `aria-label`.

#### Notes for Codex

- Single global exposed: `window.buildSunshine` (plus internal `window._sunshineSelect` click bridge).
- Configs are stored by id inside the IIFE, so re-rendering the same id (after `saved` updates) preserves the `onSelect` callback.
- SVG is responsive: `max-width: 560px; width: 100%; height: auto`. Embed inside a centered flex container.
- For 6 rays use Cengage labels (`WHO?` / `WHAT?` / …). For vocabulary, themes, or any 3–8 prompt set, just pass the right words.

---

### `dnd-sorter` — Drag-and-Drop Column Sorter

**File:** `public/teach/components/charts.js`  
**Template ID:** `two-column-chart` (and any N-column variant)  
**First used in:** OW L4 U8 Vocabulary 1 teacher deck (`public/lessons/ow-l4-u8-vocab-1.html`)

#### API

```js
// Load once in <head>:
// <script src="/teach/components/charts.js"></script>

el.innerHTML = buildDndSorter({
  id:     'dnd-vocab8',          // unique string — must be unique per page
  tiles: [
    { text: '⚽ Playing soccer', answer: 'hobby' },
    { text: '😴 Sleeping',       answer: 'not'   },
    // ...
  ],
  zones: [
    { key: 'hobby', label: '✅ Hobby',       color: '#16A34A' },
    { key: 'not',   label: '❌ Not a hobby', color: '#6b7280' },
  ],
  onComplete: function () {
    // called once every tile is in the correct zone
    document.getElementById('done-msg').style.display = 'block';
  }
});
```

#### Behaviour

- Tiles start in a shuffled word bank.
- Mouse drag-and-drop and touch drag (iPad) both work.
- Correct placement: tile turns green and locks in the zone.
- Wrong placement: tile flashes red and returns to original position.
- `onComplete` fires exactly once, when all tiles are correctly sorted.
- Multiple instances on the same page are fully independent.

#### Notes for Codex

- Add the `<script src="/teach/components/charts.js"></script>` tag in `<head>` of any lesson that uses it.
- `buildDndSorter` is the only global it exposes (`window.buildDndSorter`).
- Zones can be any number (2, 3, 4 …) — the zones row is a flex row.
- The `answer` string on each tile must exactly match a zone `key`.


### `four-col-chart` — 4-column writing planner chart

**File:** `public/teach/components/charts.js`
**Surface:** Teacher slide decks (Writing component primarily — Explanation / Comparison / Cause-Effect writing all use a 4-column planner)
**First used in:** OW L4 U8 Writing teacher deck (planned) — Warm Up demo + Plan phase + Write phase reference.
**Re-use:** any LP that calls for a 4-column planner chart. Column labels are configurable.

#### API

```js
window.buildFourColChart({
  id:         'fcc-leo',                              // unique per page
  mode:       'display' | 'fill' | 'reveal',          // default 'display'
  title:      'Hobby Planner',                        // optional header
  columns:    ['Hobby','What it is','How you do it','Examples'],
  rows:       [['video games','games that...','You choose...','...']],   // display & reveal
  rowCount:   1,                                      // fill mode only
  storageKey: 'leea-4-8-writing-fcc-leo',             // fill mode: auto-persists
  onCellEdit: function(rowIx, colIx, value) { ... },  // fill mode callback
  onCellFill: function(rowIx, colIx, value) { ... }   // reveal mode callback
});
```

#### Three modes

- **`display`** — read-only chart (model on the wall). Used for the LP's example planner before Leo fills his own.
- **`fill`** — Leo types into each cell (his own chart). `<textarea>` per cell, auto-saves to `storageKey` on every input event. Restored on page reload.
- **`reveal`** — cells start as "tap a chip below" slots; chips below the chart fill the matching slot when tapped. Used to teacher-reveal the model row-by-row in a presentation.

#### Notes

- Self-contained scoped CSS (no global pollution).
- Returns an HTML string; the wrapper passes it to `innerHTML`.
- Restore (fill mode) happens in `setTimeout(0)` after the DOM lands, same pattern as `buildDndSorter`.

---

### `word-web` — Editable Word Web (graphic organizer)

**File:** `public/teach/components/wordweb.js`
**Surface:** Teacher slide decks (works inside the 1920×1080 scaled deck)
**First used in:** OW L4 U8 Grammar 1 teacher deck (`public/lessons/ow-l4-u8-grammar-1.html`) — Extend phase

#### API

```js
// Load once in <head>:
// <script src="/teach/components/wordweb.js"></script>

el.innerHTML = buildWordWeb({
  id:         'web-dad',                       // unique per page
  center:     { text: 'Dad', emoji: '👨' },
  nodes: [                                     // initial outer ovals (optional)
    { text: 'watches movies', emoji: '🎬' },
    { text: 'plays soccer',  emoji: '⚽' }
  ],
  addable:    true,                            // show "+ Add oval" button
  removable:  true,                            // show "×" on filled ovals
  editable:   true,                            // click oval → prompt to edit text
  maxNodes:   8,
  minNodes:   0,
  storageKey: 'leea-4-8-grammar-1-web1',       // optional — persists to localStorage
  onChange:   (nodes) => { ... }               // optional callback after every change
  // optional colors:
  // accent:       '#3B82F6', accentDark:   '#1E3A8A',
  // filledFill:   '#DCFCE7', filledStroke: '#16A34A', filledInk: '#14532D'
});
```

#### Behaviour

- SVG layout, viewBox 900×540, scales responsively (max-width 900).
- Center oval + N outer ovals around it (1 to `maxNodes`), connector lines beneath.
- Tap an oval → `prompt()` for text (pre-filled if it already has text).
- Tap "**+ Add oval**" → adds an empty oval. Outer ovals auto-redistribute.
- Tap the red "×" on a filled oval → removes it (respects `minNodes`).
- Tap "↺ Reset" → confirms then clears all nodes.
- `storageKey` persists `nodes[]` to localStorage and reloads on next render.
- `onChange(nodes)` fires after every save (edit/add/remove/reset).

#### Notes for Codex

- Single global exposed: `window.buildWordWeb` (plus `window._leeaWeb*` click bridges).
- Re-rendering replaces the parent element's innerHTML, so wrap the call in its own container.
- The `prompt()` UX is intentionally simple — swap for a custom modal when needed.
- Custom `accent` / `filledFill` colors let any component-toned deck use the web.
- Text > 22 chars is truncated with an ellipsis in the SVG; the full text stays in state.
- Defaults: 0 min, 8 max nodes. Pass `addable:false, removable:false` for a fixed-size web that's only editable in place.

#### Live sentence-builder pairing (Grammar lessons)

When a `buildWordWeb` lives on a **grammar** slide, pair it with a **live sentence builder** that uses the `onChange(nodes)` callback to render one full grammar-pattern sentence per filled oval. Example for who-clauses (`public/lessons/ow-l4-u8-grammar-1.html` s42):

```js
host.innerHTML = window.buildWordWeb({
  id: 'web-dad',
  center: window._wwCenter,       // mutable via picker chips
  nodes:  window._wwNodes,
  storageKey: 'leea-4-8-grammar-1-web-' + slug(window._wwCenter.text),
  onChange: function (nodes) {
    window._wwNodes = nodes;
    wwRenderSentences();          // renders: "<name> is a person who <oval text>."
  }
});
```

The sentence builder is the bridge that turns "tap and type" into "Leo says a full target-grammar sentence aloud." Without it the web is just decoration; with it, every oval becomes a who-sentence Leo can speak. Add a person-picker row above the web so the same web works for Dad / Mom / Leo / a player / a friend — each person gets its own `storageKey` so prior work is preserved.

### `flashcard-shell` — Flashcards with Practice + Quiz modes (Leo-app pattern)

**Locked in:** Vocab 2 Academic tab (Tab 0), Vocab 2 Flashcards tab (Tab 3, PR #77), Reading SB Vocab tab (Tab 5), Reading WB Vocab tab (Tab 0). **Currently inline in each app — extractable into `flashcard-shell.js` once a third Leo app needs it.**

**Required pieces:**
- `.fc-controls` strip with two `.mode-btn` buttons: 📖 **Practice** + 🧠 **Quiz**
- `#fcN-practice` div: tap-to-flip flashcard with front (emoji + word + part of speech + "tap to flip 👆") and back (emoji + definition + Japanese toggle + sample sentence with target word **bold-highlighted in the matching sample colour**)
- `#fcN-quizmode` div: emoji + definition shown, Leo types the word into `<input>`, ✓ check button validates; "Starts with X" clue; live progress "N / N done"
- **Tab completes only when BOTH modes are done** (`visited >= N` AND `quizSolved >= N`)
- Save/restore extended: state stores `{ visited, solved, mode }` so Leo returns to the same mode with progress intact

**Sample sentences rule:** match the source's transcript (TR audio) so practice mirrors what Leo heard. The Reading SB Vocab tab pulls samples from how the words appear in the passage. The Reading WB Vocab tab pulls from the workbook reading. The Vocab 2 app pulls from TR 8.5.

**Storage shape:**
```js
{ visited: [0,1,2,...], solved: [0,1,2,...], mode: "practice"|"quiz" }
// saved under tab-N-state, or wb-tab-N-state in multi-mode apps
```

### `recap-table` — Pronunciation / sequence recap table (after Match completion)

**Locked in:** Vocab 2 Match tab (PR #79) on completion → shows a 3-column table (Word · TR sentence · Pronunciation). **Currently inline; extractable into a helper once a second component needs it.**

**Shape:**
```text
┌─────────────┬──────────────────────────────────┬───────────────┐
│ Word        │ TR sentence (verbatim transcript) │ Pronunciation │
├─────────────┼──────────────────────────────────┼───────────────┤
│ 🐞 a bug    │ "Look at the bug on the leaf!"   │ /bʌɡ/         │
│ 📚 a comic  │ "He reads a comic book."          │ /ˈkɑː.mɪk/   │
│ ... etc.    │                                  │               │
└─────────────┴──────────────────────────────────┴───────────────┘
```

**Required pieces:**
- `.match-recap` outer card (green border, white background)
- `.recap-title` + `.recap-sub` (recap-title is e.g. "📋 TR 8.5 Pronunciation Recap"; sub is e.g. "Practice saying each sentence aloud — match the audio!")
- `.recap-table` with `<thead>` (green-tinted header row) + `<tbody>` rows
- Appears on match-completion AND on RESTORE if the tab was already completed
- IPA snippets live in the `MATCH_PAIRS` data alongside the word + sentence so the table can render from the same source

**Reuse target:** every vocab + reading + grammar Leo app should drop this in after any match-the-words activity. Same shape, consistent for Leo across components.

### `landing-screen-modes` — Multi-mode landing for Leo apps with more than one source

**Locked in:** Reading Leo app (PR #82) — landing screen with 📘 Student Book + 📒 Workbook cards. Each card opens its own mode pane with its own tabs.

**Required pieces:**
- `.landing-screen` outer container shown on first load (and on `backToLanding()` calls)
- One `.mode-card` per source — minimum 2, room for more (e.g. Extra-Reading as a future 3rd card)
- Each card has: `.mc-icon` (📘 / 📒) · `.mc-title` (Student Book / Workbook) · `.mc-sub` (one-line content description) · `.mc-prog` pill (live progress count from `lLoad("tab-N-done")` + `lLoad("wb-tab-N-done")`)
- Each mode pane has a `.mode-back-bar` at the top with a "◀ Back to menu" pill + a `.mode-label` (📘 / 📒 + source title)
- `enterMode(m)` and `backToLanding()` functions swap visibility + save `last-mode` to localStorage so the app restores Leo's last view on reload

**Storage namespacing (per mode):**
```text
SAVE_PREFIX:   leea-<l>-<u>-<component>-
SB tabs:       tab-{i}-done           (mode 1)
WB tabs:       wb-tab-{i}-done        (mode 2)
SB quiz score: score                  (mode 1)
WB quiz score: wb-score               (mode 2)
Mode tracker:  last-mode              (landing | sb | wb | ...)
Tab trackers:  last-tab, wb-last-tab
```

**Code structure:** keep parallel function sets (`showTab` + `markComplete` + `doRedo` for SB; `wbShowTab` + `wbMarkComplete` + `wbDoRedo` for WB) instead of one parameterized function. Each mode gets its own `TAB_INIT` / `TAB_RESET` / `TAB_RESTORE` registry (`TAB_INIT` + `WB_INIT`). Simpler to read; keeps the locked mode's code untouched when a new mode is added.

**When to use this template:** any Leo app where the LP has more than one reading/practice source (Student Book + Workbook is the most common). Don't use for single-source apps like vocab — they stay flat.

They are not just PDFs to display. They should become interactive/block templates that can render in teacher lessons and learner apps.

## Source Folder

```text
C:\Users\kneri\OneDrive\Documents\Leo\English\NationalGeographic\GraphicOrg
```

## Template List

Matrix templates:

- 4 by 4 matrix
- 5 by 5 matrix
- 6 by 6 matrix

Flow templates:

- flow chart left to right
- flow chart up and down
- timeline

Question / note templates:

- interview
- KWL chart
- note-taking chart

Pie templates:

- pie chart blank
- pie chart 3 slices
- pie chart 4 slices
- pie chart 5 slices

Map / web templates:

- spider map
- sunshine organizer ✓ built — `public/learn/components/sunshine.js`
- word web ✓ built — `public/teach/components/wordweb.js` (`buildWordWeb`)

Story / sequence templates:

- storyboard

Compare / classify templates:

- T-chart
- two-column chart ✓ built — `public/teach/components/charts.js` (`buildDndSorter`)
- three-column chart
- Venn diagram 2 circles
- Venn diagram 3 circles

Tree templates:

- tree 1
- tree 2
- tree 3

Vocabulary templates:

- vocabulary log
- homemade vocabulary log DOCX

Guide:

- using graphic organizers

## Design Rule

Each chart template should be a reusable block type.

Example:

```json
{
  "type": "graphicOrganizer",
  "template": "kwl-chart",
  "title": "What do you know about polar bears?",
  "fields": {
    "know": [],
    "wantToKnow": [],
    "learned": []
  }
}
```

The same block should be able to render:

```text
teacher deck version
Leo learner app version
reference/review version when needed
```

## Interaction Rule

Charts should be active when possible.

Examples:

- type into boxes
- drag items into columns
- sort cards
- add/remove rows
- add/remove columns when the template allows it
- add/remove word web nodes
- add/remove spider map branches
- add/remove Venn labels/items
- add/remove flow chart steps
- add/remove timeline events
- add/remove tree branches/leaves
- add/remove pie slices when the template allows it
- reorder sequence steps
- mark complete
- save to Supabase
- reopen in review mode

Avoid using a chart as a passive image unless the activity only needs viewing.

## Editable Structure Rule

Because these organizers are digital, many templates should support editable structure.

The app should not force every organizer to stay exactly like the PDF when the lesson needs flexibility.

Examples:

```text
word web
- add node
- delete node
- edit node text
- move node

Venn diagram
- add item
- delete item
- move item between regions
- edit item text

two-column / three-column / T-chart
- add row
- delete row
- edit labels
- move item between columns

matrix
- add row if allowed
- delete row if allowed
- edit cells

flow chart / timeline
- add step/event
- delete step/event
- reorder steps/events

tree
- add branch
- delete branch
- add leaf
- delete leaf
```

Some templates can remain fixed when the task requires a fixed format, but the block system should support editable variants.

## Template IDs

Use stable template ids:

```text
matrix-4x4
matrix-5x5
matrix-6x6
flow-left-right
flow-up-down
interview
kwl-chart
note-taking-chart
pie-blank
pie-3
pie-4
pie-5
spider-map
storyboard
sunshine-organizer
t-chart
three-column-chart
timeline
tree-1
tree-2
tree-3
two-column-chart
venn-2
venn-3
vocab-log
word-web
```

## Likely Uses

Unit Opener:

- KWL chart
- word web
- spider map
- note-taking chart

Vocabulary:

- vocabulary log
- word web
- two-column chart
- T-chart

Grammar:

- T-chart
- two-column chart
- three-column chart
- matrix

Reading:

- story board
- timeline
- flow chart
- note-taking chart
- KWL chart

Writing:

- flow chart
- tree
- note-taking chart
- storyboard

Mission / Project:

- interview
- matrix
- pie chart
- word web

Training Ground:

- T-chart
- two-column chart
- matrix
- flow chart

## Build Priority

Start with the chart templates that are most likely to repeat:

1. T-chart
2. two-column chart ✓ built — `public/teach/components/charts.js` (`buildDndSorter`)
3. three-column chart
4. word web
5. KWL chart
6. flow chart
7. timeline
8. Venn diagram 2 circles
9. vocabulary log
10. matrix

Then add the more specialized templates.
