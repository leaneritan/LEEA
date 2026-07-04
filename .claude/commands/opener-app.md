# opener-app

Build one **unit opener** end-to-end — the 21-slide Neritan teacher slideshow + the paired Leo learner app — for any Our World unit. Reads source content from the planner PDF and the unit's `vocabulary.json`. The Unit 7 opener (`public/lessons/ow-l4-u7-opener.html` + `public/learn/ow-l4-u7-opener.html`) is the locked reference implementation for structure, CSS patterns, and JS conventions.

## Usage

```
/opener-app <course-path> <unit-number>
```

Examples:

```
/opener-app english/our-world/level-4 u7
/opener-app english/our-world/level-4 u8
/opener-app english/our-world/level-5 u3
```

## What this skill does

1. **Reads sources**
   - `docs/lesson-plans/<course-path>/index.json` — get the PDF page range for the opener section and the `pdf_offset`
   - `docs/lesson-plans/<course-path>/planner.pdf` — the opener pages (anchor photo description, discussion prompts, vocabulary words, unit goals, In This Unit I Will box, Look and Check, Teaching Tip, Be the Expert)
   - `content/subjects/english/courses/<course>/level-<n>/unit-<n>/vocabulary.json` — content vocab (`vocab1WordIds` and `vocab2WordIds`) and academic vocabulary
2. **Generates the teacher slideshow**: `public/lessons/ow-l<level>-u<unit>-opener.html`
3. **Generates the Leo learner app**: `public/learn/ow-l<level>-u<unit>-opener.html`
4. **Creates lesson manifests**: `opener.teacher.json` + `opener.learner.json` under `content/.../unit-<n>/lessons/`
5. **Updates `src/data/lessons.ts`** to import and register both manifests
6. **Wires the unit into the dashboard** if not already done (see Dashboard wiring section below)
7. **Validates**: `npm run validate:content` + `npx tsc --noEmit`
8. **Commits and pushes** to the working branch. Does NOT auto-create a PR.

## Lesson ID convention

```
ow-l<level>-u<unit>-opener
```

Examples: `ow-l4-u7-opener`, `ow-l4-u8-opener`, `ow-l5-u3-opener`.

Component pairing: teacher `opener` ↔ learner `opener-app` (the validator enforces this).

## Theme colors — unit-specific

The teacher slideshow uses a `--green` / `--green-dk` / `--green-lt` / `--green-md` palette mapped to the unit theme. Academic language slides always use `--arctic: #0EA5E9` regardless of unit theme.

| Unit | Theme | `--green` | `--green-dk` | `--green-lt` | `--green-md` |
|---|---|---|---|---|---|
| 7 | Invention Amber | `#D97706` | `#92400E` | `#FEF3C7` | `#FCD34D` |
| 8 | Arctic Blue | `#0EA5E9` | `#075985` | `#F0F9FF` | `#BAE6FD` |
| 9+ | Derive from unit theme in the planner | pick a matching Tailwind palette | | | |

For units not in this table, choose a Tailwind 600/800/50/200 set that matches the unit's theme (e.g. ocean = sky, forest = emerald, city = slate).

## Locked reference implementation

**Teacher**: `public/lessons/ow-l4-u7-opener.html` (1404 lines, 21 slides)  
**Learner**: `public/learn/ow-l4-u7-opener.html`

Read both files before generating. The **outer skeleton** is non-negotiable — same `#wrap`/`#deck`/`#nav`/`#tn-drawer` shell, same nav/notes/scaling JS, same slide sequence and layout classes (`.sh`, `.sb`, `.gl`, `.wp`/`.gp`, `.def-box`, `.recap-grid`, etc.). What's explicitly *not* locked: the per-word game **mechanics** inside slides 5–8 and 10–13 (see the mini-game guidance under "Slides 5–8" below) — those must be redesigned per word, not copy-pasted from the reference unit with new emoji.

### Outer HTML structure (teacher)

```
<head>
  <title>Unit {N} Opener — Teach · Leo's English League</title>
  Outfit font (Google Fonts)
  <style> :root { --green / --green-dk / --green-lt / --green-md / --arctic / ... } ... </style>
</head>
<body>
  <div id="wrap">         ← fixed, height:calc(100vh - 52px), shrinks when notes open
    <div id="deck">       ← 1920×1080, transform-origin top left, scaled by scaleSlides()
      <div class="slide" id="s1">...</div>
      ...
      <div class="slide" id="s21">...</div>
    </div>
  </div>

  <div id="tn-drawer">   ← fixed bottom:52px, height:0 → 200px on open
    <div class="tn-head">TEACHER NOTES <span class="tn-close">✕</span></div>
    <div id="tn-body"></div>
  </div>

  <div id="nav">         ← fixed bottom:0, height:52px
    ← Prev  →  Progress counter  [====bar====]  Unit N · Opener label  [Notes] [⛶]
  </div>

  <script>
    const TOTAL = 21;
    const NOTES = { s1: "...", s2: "...", ... };   ← per-slide teacher notes
    function scaleSlides() { ... }                  ← scale deck to viewport
    function goTo(n) { ... }                        ← show slide n
    function toggleNotes() { ... }                  ← open/close tn-drawer
    ... game widget JS ...
    window.addEventListener('resize', scaleSlides);
    document.addEventListener('DOMContentLoaded', () => { scaleSlides(); goTo(1); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { ... }
      if (e.key === 'n' || e.key === 'N') toggleNotes();
    });
  </script>
</body>
```

### Outer HTML structure (learner)

Same as teacher except:
- No `#tn-drawer` CSS, HTML, or JS
- No `NOTES` object
- No `toggleNotes()` / `showNotes()` functions
- No Notes button in nav
- `scaleSlides()` is simplified (no notes height offset logic)
- Title: `Unit {N} Opener — Leo's Learner App · Leo's English League`
- Includes the LEEA learner save/restore rules (see below)

## 21-Slide structure

### Slides 1–4 — Unit intro & discussion

| Slide | Content |
|---|---|
| s1 | **Title card** — gradient background (unit theme), unit number, title, 3 theme chips, "LEVEL 4 · UNIT N" badge |
| s2 | **Anchor photo + unit theme** — 2-col layout, large emoji / placeholder photo left, unit topic right, discussion prompt 1 |
| s3 | **Discussion prompts** — 3 numbered discussion questions from the planner (What do you see? What do you think? What do you wonder?) |
| s4 | **Caption writing** — learner writes a caption for the anchor photo; teacher notes include model caption |

### Slides 5–8 — Content vocabulary (4 words from `vocab1WordIds`)

One slide per word. Use the first 4 words from `vocab1WordIds` in `vocabulary.json`.

Each slide: 2-col layout. Left: big emoji, word, pronunciation, definition, example. Right: **bespoke mini-game** widget, designed fresh per word (Invention Spinner, Lab Reveal, Mountain Trail, Lightbulb Tap were built specifically for Unit 7's words — they are examples of the *pattern*, not a template of shells to relabel for a different unit's different words).

Game widget rules:
- Has a clear goal (find, match, reveal, sort)
- Running score counter or visual progress
- Win / success state
- Theme matches the unit (invent gadgets for Unit 7, arctic animals for Unit 8, etc.)

**The mechanic must embody the word — don't reuse a shape with new emoji.** It's tempting to take last unit's game shells (a spinner, a dark-room reveal, a waypoint trail, a tap counter) and just relabel the emoji for this unit's words. Don't. A generic "tap 5 times" counter doesn't teach "pull" any better than it taught "solution" — the interaction itself has to demonstrate what the word means. Before building each vocab slide, ask: *if a learner only watched the interaction and never read the word, could they guess its meaning from the motion/goal alone?* If not, redesign it — a new mechanic that has never been built before (real drag physics, hold-to-charge-and-launch, a chain reaction, tap-to-order) is expected and fine. The prior unit's shells are a starting inventory of techniques, not a checklist to fill in.

Concrete example — Unit 9 (`ow-l4-u9-opener.html`) rebuilt six games after the first pass reused Unit 7/8 shells with swapped emoji:
- **force** — two buttons, PUSH and PULL; pressing one visibly sends a ball away from the learner, the other pulls it back toward them
- **push** — press-and-hold to charge a meter, release to launch something — the longer the hold, the farther it travels
- **pull** — real pointer drag: grab an object and drag it away (an elastic rope stretches), release to watch it swing back
- **happen** — knock over the first domino and watch a chain reaction cascade to a result (cause → effect, in sequence)
- **match** (academic) — tap a word chip, then tap the picture that matches it; wrong picks shake, no static list-building
- **instructions** (academic) — tap scrambled steps into the correct order; wrong order shakes and offers a reset

`describe` (photo hotspot detective) and `definitions` (zoom from vague to specific) were kept from the first pass because they already matched their words — reuse is fine when the mechanic genuinely fits, just don't default to it.

### Slide 9 — Content vocab recap

Flip-card recap: 4 cards face-down showing word emoji; tap to reveal word + meaning. CSS `.rc-card` with `.flipped` state. Use `.sh.gr` header in unit color.

### Slides 10–13 — Academic vocabulary (4 words from `academicWordIds`)

Same 2-col structure as slides 5–8 but:
- Header uses `.sh.arc` (arctic blue)
- `.vtag.ac` tag on word card
- `.def-box.ac` definition box
- Game widgets are academic-themed (Opinion Detective, Fact Notebook, Zoom Chain, Reason Match — adapt names to fit the unit's academic words)

### Slide 14 — Academic vocab recap

Same flip-card pattern as slide 9 but using `.rc-card.ac` / `.sh.arc` header. Arctic color scheme.

### Slide 15 — Unit goals ("In This Unit I Will…")

List the 4 goals from the planner's "In This Unit I Will" box. Use `.step-item` cards. Header `.sh.gld` (dark amber `#92400E` for Unit 7; adjust to unit theme dk color).

### Slide 16 — Look and Check / Teaching Tip

Render the Teaching Tip or Look and Check box from the planner as a highlighted teacher-facing note card. `.sh.dk` header.

### Slide 17 — Be the Expert

Content facts from the "Be the Expert" sidebar in the planner. 3–4 bullet facts with icons. Tappable reveal — click each fact card to flip it.

### Slide 18 — Discussion wrap-up

3 "What did we learn?" question cards in `.why-c` style; tap each to reveal the answer.

### Slides 19–20 — Unit preview / Coming up

Two-col layout: list the 8 lesson components (opener, vocab-1, song, grammar-1, vocab-2, grammar-2, reading, writing) as numbered `.step-item` cards. Preview what each one covers for this unit.

### Slide 21 — Mark Done

Full-screen centered layout. "Great lesson, Neritan!" heading. Subtitle referencing the unit. Large **Mark Done ✓** button that writes to `leea.lessonProgress.v1`. JS:

```js
document.getElementById('done-btn').addEventListener('click', function() {
  try {
    const p = JSON.parse(localStorage.getItem('leea.lessonProgress.v1') || '{}');
    p['ow-l{level}-u{unit}-opener'] = { status: 'done', ts: Date.now() };
    localStorage.setItem('leea.lessonProgress.v1', JSON.stringify(p));
    this.textContent = '✓ Marked Done';
    this.disabled = true;
    this.style.background = '#16A34A';
  } catch(e) {}
});
```

## Learner app — FOUR UNIVERSAL LEEA APP RULES

**Rule A — Vocab Foundations at the top of every app.**
EVERY learner app opens with vocabulary modules:
1. 🎓 Academic Language — flashcards (3D-flip, Practice + Quiz dual mode), 70% pass
2. 🌟 Lesson Words — flashcards + quiz for the content words in this lesson, ≥2 Q per word, 75% pass
Both sit in a 🎴 VOCAB FOUNDATIONS section with the purple ALWAYS corner tag.

**Rule B — Save + Redo buttons on every module.** Every module footer: ↺ Redo (two-tap armed) left, ✅ Mark Complete right.

**Rule C — Lesson words as flashcard + quiz set (always).**

**Rule D — Every module must be interactive.** Drag, sort, match, tap-to-choose, chip builders, mini-games. Reading text alone is not interactive.

### Learner save/restore rules

- **Rule 1** — Auto-save done-key when a module finishes
- **Rule 2** — `saveScore(score, total, true, { ...extras })` when quiz ends
- **Rule 3** — Restore result view on reopen — `restoreXResult()` per module
- **Rule 4** — ↺ Redo clears saved state before re-initializing

```
SAVE_PREFIX: {level}-{unit}-opener-
HOMEWORK_ID: leo-{level}-{unit}-opener
```

### Learner app module list

| # | Module | Type |
|---|---|---|
| 1 | 🎓 Academic Language | Flashcard + quiz (Rule A) |
| 2 | 🌟 Lesson Words | Flashcard + quiz (Rule A) |
| 3 | 🖼️ Anchor Photo | Tap-to-label / caption-builder chip activity |
| 4 | 💬 Discussion | Opinion scale + sentence-starter chip builders |
| 5 | 🎯 Unit Goals | Drag-to-match goal → skill area |
| 6 | 🧠 Be the Expert | Tap-to-reveal fact cards + 4-question quiz |
| 7 | 🏁 Final Quiz | 6-question mixed MCQ (vocab + unit content) |

## Manifest files

**`opener.teacher.json`**:
```json
{
  "id": "ow-l{level}-u{unit}-opener",
  "course": "our-world",
  "level": {level},
  "unit": {unit},
  "mode": "teacher",
  "component": "opener",
  "status": "live",
  "title": "Unit {unit} Opener",
  "subtitle": "{unit theme description}"
}
```

**`opener.learner.json`**:
```json
{
  "id": "ow-l{level}-u{unit}-opener-app",
  "course": "our-world",
  "level": {level},
  "unit": {unit},
  "mode": "learner",
  "component": "opener-app",
  "status": "live",
  "title": "Unit {unit} Opener",
  "subtitle": "{unit theme description}",
  "moduleCount": 7,
  "source": "ow-l{level}-u{unit}-opener-app"
}
```

## Dashboard wiring (if not already done)

After generating the lesson files, check if the unit is already wired into:

1. **`src/components/OurWorldPage.tsx`** — `levelFourSequence`: The unit's entry should have `state: "active"` and a link in `unitHrefs`. Update if still `"planned"` or `"reference"`.

2. **`src/components/OurWorldUnitPage.tsx`** — `unitMeta`: Add the unit's title, subtitle, and chips array if not present.

3. **`src/components/TeacherDashboard.tsx`** — The teacher dashboard reads from `getLessonGroups()` dynamically; no manual wiring needed as long as the manifests are registered in `src/data/lessons.ts`.

## Validation checklist

Before committing, run:

```sh
npm run validate:content
npx tsc --noEmit
```

Fix any errors. The validator will catch:
- Missing teacher↔learner pairing (teacher `opener` must have a learner `opener-app`)
- Malformed JSON manifests
- Missing `moduleCount` on learner manifest

## Output checklist

Report what was generated:

- [ ] Teacher slideshow created: `public/lessons/ow-l{level}-u{unit}-opener.html` (21 slides)
- [ ] Learner app created: `public/learn/ow-l{level}-u{unit}-opener.html` (7 modules)
- [ ] **Each vocab mini-game's mechanic embodies its word** (not a reused shell with relabeled emoji) — sanity-check against the "if a learner only watched the interaction, could they guess the word's meaning?" test
- [ ] **Vocab Foundations** at top of learner app (Academic + Lesson Words flashcards + quiz)
- [ ] **Save + Redo footer** on every learner module (Rule B)
- [ ] **Every module is interactive** — no passive text-only screens (Rule D)
- [ ] `opener.teacher.json` created
- [ ] `opener.learner.json` created (with `moduleCount: 7`)
- [ ] `src/data/lessons.ts` updated
- [ ] `OurWorldPage.tsx` — unit state is `"active"` with link
- [ ] `OurWorldUnitPage.tsx` — `unitMeta` has entry for this unit
- [ ] `npm run validate:content` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Committed and pushed (no PR created — Leaneritan reviews + merges)

## Important constraints

- Never modify `src/lib/supabase.ts`
- The teacher slideshow shell (CSS vars, nav, drawer, scaleSlides) must match the locked reference — only slide content and theme colors change
- Academic language slides (s10–s14) always use `--arctic` regardless of unit theme
- SAVE_PREFIX must be unique — never reuse another lesson's prefix
- The learner app must work fully offline (no external API calls)
- Do not skip Vocab Foundations or save/restore rules
- Read `docs/supabase.md` before wiring progress — `learner_progress` and `teacher_lesson_progress` are separate tables
