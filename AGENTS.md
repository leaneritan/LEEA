# AGENTS.md - How to Work in LEEA

This repo is **LEEA**, Leo's Elite Education Academy.

LEEA is for a father teaching his son. English is the first subject, but the architecture must allow future subjects such as math and science.

Use the full name consistently:

```text
LEEA = Leo's Elite Education Academy
```

Do not shorten the product heading to "Leo's Elite Academy".

## Golden Rules

0. **Always create a PR after pushing.** Every `git push` must be followed by creating a pull request via the GitHub MCP tools. Do not skip this step. Do not update a merged/closed PR — create a new one.
1. **Do not rush into UI.** Read source material and design the data first.
2. **Source scan comes before lesson generation.** For each unit/topic, scan the lesson planner, book, or workbook before building.
3. **Reference first.** Vocabulary cards, academic cards, glossary/support cards, and grammar charts are reusable reference objects.
4. **Japanese ON/OFF is for learning content.** Main navigation stays English-only. Japanese belongs in cards, charts, instructions, and feedback when helpful.
5. **Reference data must be visible.** When adding vocabulary, academic, content, related, glossary/support, or grammar reference data, update the reference indexes and browse/source-tree wiring in the same change.
6. **Teacher lessons are specific.** Do not force every Neritan lesson into one generic template. Use the source lesson/deck style when that is the best teaching experience.
7. **Reusable blocks grow from repetition.** Build shared chart, quiz, card, sorter, save, and feedback blocks only when the same pattern appears across lessons or Leo apps.
8. **Teacher progress lives under Neritan.** Teacher lessons are opened and marked done from the teacher menu; the local progress shape should stay ready for Supabase.
9. **Do, not reveal.** Leo should choose, build, sort, fix, type, speak, answer, or complete.
10. **Keep it maintainable by one parent plus AI.** Avoid architecture that becomes another job.
11. **Validate content before delivery.** Run `npm run validate:content` after reference data changes, before typecheck/build/PR.
11a. **A schema change is not done until it is applied.** Adding a table or column to `supabase/schema.sql` changes a file, nothing else — the live project is untouched until someone runs it. Every cloud write falls back to localStorage on failure, so a missing table looks exactly like everything working. Apply and verify in the same change; see `docs/supabase.md`.
12. **Math lessons must be interactive, not digitized text.** Take as long as needed to build a math lesson correctly, but never skip the interactive widget for a シミュレーション-tagged (or otherwise hands-on) activity — a static re-typing of the textbook page has no value over the physical book. See `docs/math-interactivity.md` for the standard and the precedent widgets to match.

## Subject Structure

```text
LEEA
- English
  - Our World
  - Joyful Work
  - Training Ground
  - Reference
- Math
  - 中1数学ヘルパー (新編 新しい数学1) — see `docs/math-interactivity.md`
- Geography (社会) — interactive maps, 地理 and 歴史
- History (歴史) — chronology chart and other 歴史 material
- Science
  - 中1理科ヘルパー (新編 新しい科学1) — see `### Science` below
```

### Subjects other than English

**English is the only taught subject.** It has teacher decks, an assignment loop, a reference layer and a course spine because Neritan teaches it. Every other subject — Math, Geography, History, Science — exists to *support Leo working on his own*.

So do not mirror the English structure into them. No teacher slides, no assign/review loop, no 章/節 navigation built to match Our World's course/level/unit. Give each one the smallest shape that lets Leo get to the thing and use it. Geography learned this the hard way: it shipped with a full 11-chapter 社会 spine, chapter pages and a 分野 switch, and all of it was scaffolding around three maps.

### Science

新編 新しい科学1 (東京書籍, 中1). Leo-solo like Math and Geography: no teacher
decks, no assign/review loop.

- `content/subjects/science/curriculum.ts` — the 単元 / 章 / 節 spine, all 4 単元
  and 13 章 registered. Only ids in `AUTHORED_SECTION_IDS` have a JSON file
  behind them; everything else renders a 準備中 card. **Built so far: 単元1
  第1章 生物の観察と分類のしかた (p.10–26), complete.**
- `content/subjects/science/sections/<sectionId>.json` — one file per 節.
- `/science` is the book spine; `/science/<chapterId>/<sectionId>` opens a 節.
- Progress is `src/data/scienceProgress.ts`, local-first and Supabase-shaped in
  the `science_block_progress` table, keyed section + block.

**Page ranges outside 単元1 第1章 are unverified.** They were derived from the
publisher's QR index, anchor to anchor, not read off printed folios. Check them
against the scan when each chapter's arrives, and fix the table in
`docs/lesson-plans/science/new-science-1/README.md` at the same time.

**Its block vocabulary is smaller than math's, on purpose.** 理科 reuses the
subject-neutral shapes (intro, goal, q, recall, quickcheck, reflect) and adds
its own — `procedure` (観察/実験/実習), `technique` (基礎操作), `term` (ことば),
`field` (図鑑). It does **not** copy math's 52-member widget union: the whole
book has 16 hands-on moments, so `ScienceInteractiveWidget` grows one entry at a
time as chapters are authored.

**What must be a widget.** Golden rule 12 applies here through the publisher's
own tags: the 9 シミュレーション *and* the 7 思考ツール, all inventoried with
their pages in `docs/lesson-plans/science/new-science-1/README.md`. The 思考ツール
count because they are all sorting/classification — manipulation, not reading.
Two of the シミュレーション (世界の活火山・震源の分布, p.204 and p.212) are world
maps: build them on Geography's `public/components/world-map.js`, not from
scratch.

**Progress never downgrades**, the same rule as Geography: a solved widget stays
solved and the best score is kept, so replaying it and slipping cannot take the
tick away. A plain tick stays a free toggle — unticking a 観察 must work. The
merge lives in `saveScienceBlockProgress`, and `SectionView` applies the same
merge to its own state, or a replay would visibly lose the tick until reload.

**Publisher links.** The portal is `https://sw121.tsho.jp/07jk/r/1/` — the same
`/07jk/` scheme as math's digital companion (`sw111…/m/1/`, `m` 数学 / `r` 理科),
so `content/subjects/math/digitalCompanion.ts` is the shape to copy. No science
link has actually been opened yet: the domain is blocked by the environment's
egress proxy, so `qr-index.json` holds every `url` at `null`. **Do not
extrapolate a URL from the math pattern or from an item number** — same rule as
Geography's `sourceLabel`: set it from something real, or leave it empty.

### History

Geography's model, second subject: one page, one material, a button row to
switch. History exists because 歴史 material that is not a map has nowhere to
live in Geography — the 巻末年表 is a single wide chart, not something with
markers to click. 古代文明マップ stays in Geography for now (it *is* a map, and
its progress record is keyed there); move it only deliberately, with a redirect.

- `content/subjects/history/materials.ts` — a flat registry, the same shape as
  `geographyMaps`. Each material has an id, a `kind` (`reference` / `activity`,
  used only to label), titles, a summary and `buildStatus`.
- `/history` opens the first live material; `/history/<materialId>` opens a
  named one.
- Chrome is one thin bar (`.hist-*` in globals.css), the frame takes the rest.

**Adding a material**

1. Drop the standalone HTML at `public/history/<id>.html`.
2. Add an entry to `historyMaterials` with `buildStatus: "live"` and `embedPath`.

Register with `buildStatus: "planned"` and no `embedPath` to show it as
upcoming; the page renders a "file needed" card instead of a broken frame.

**Nothing in History records progress yet**, on purpose: the 巻末年表 is a chart
Leo looks things up in, with no markers and no quiz, and a status pill it can
never earn would be noise. A material that *does* have something to score
reports through `public/components/geo-progress.js` — the shared bridge — rather
than growing a second one here.

**巻末年表ビューア** (`public/history/nenpyou-viewer.html`) frames the chart
帝国書院 serves from its own QR content (`ict.teikokushoin.co.jp`), the same
publisher link Leo's textbook prints. The image is fetched by the learner's
browser, not bundled: that domain is blocked by this environment's egress proxy,
so the viewer has never been loaded against the real chart here — it was
verified against a stand-in of the same 6398x1500 shape, and it renders a
Japanese "could not load" card with the publisher link when the fetch fails.

Two things the viewer had to get right:

- **Fit-height, not fit-all, is the opening view.** The chart is 4.3x wider than
  it is tall, so "everything on screen" is also "everything at 17% and
  unreadable". It opens filling the height at the oldest end, which is how a
  chronology is read — one era at a time, travelling sideways.
- **Zooming out stops at fit-all and panning clamps to the edges**, the same
  rule as Geography's `enableZoom`: the chart cannot be shrunk to a dot or
  dragged off into empty space.

The scrub slider under the bar *is* the pan, expressed as "which part of the
timeline is in the middle of the screen" — it disables itself when the whole
width already fits. It carries no era marks: where 平安 or 明治 sit in that
image has never been measured here, and guessing pixel offsets would be
inventing a reference. Same rule as `sourceLabel`.

### Geography

One page, one map, a button row to switch. That is the whole model.

- `content/subjects/geography/maps.ts` — a flat registry. Each map has an id, a `field` (`geography` / `history`, used only to label and order buttons), titles, a summary and `buildStatus`. There is no chapter spine and no placement data.
- `/geography` opens the first live map; `/geography/<mapId>` opens a named one. `/geography/map/<mapId>` permanently redirects to the short form — it only exists to carry links made while Geography briefly had chapter pages.
- The page chrome is deliberately one thin bar: current map, the switcher, progress, fullscreen. The map iframe gets everything else.

`sourceLabel` is optional and must only be set from something real — the 古代文明マップ carries 第2章 古代 ／ 第1節 because its own header says so. Do not invent a textbook reference to fill the field.

**Adding a map**

1. Drop the standalone HTML at `public/geography/<id>.html`, built on the shared components.
2. Add an entry to `geographyMaps` with `buildStatus: "live"` and `embedPath`.

Register with `buildStatus: "planned"` and no `embedPath` to show it as upcoming; the page renders a "map file needed" card instead of a broken frame.

**Map layout** — maps run inside an iframe with limited height, so each one is a full-height flex column: a single-line header (eyebrow, title and lede on one row), a one-row control bar, then the map filling the rest. A world map is wide, so its drawn size is set by available *width*, not height — reclaim space from the side panel before adding height, and expect leftover height to show as sea.

**Zoom and the collapsible panel** — `enableZoom(base)` from `world-map.js` adds wheel, pinch, drag-pan and an overlay control cluster (`+` / `−` / reset). It works by moving the svg's viewBox, so land, markers and labels scale together and stay in register; zooming out never goes past the home view, so the map cannot be lost off screen. Each map then appends its own panel-toggle button into that same `.worldmap-zoom` cluster, because the control bar is already full. Collapsing the panel is what actually makes the map bigger (roughly +39% width at 1440px).

Two traps worth keeping in mind if you touch this: pointer capture must be taken only **after** the pointer has moved past the drag threshold — capturing on `pointerdown` retargets the following `click` to the svg, and the map's own handlers on countries and markers silently stop firing. And a drag that ends over a country must not also register as a click on it, which is why a capture-phase `click` listener on the svg swallows the event when a drag just happened. Anything that writes the panel must call `showPanel()` first, or a click while collapsed looks like it did nothing.

**The shared base map** — `public/components/world-map.js` exposes `window.buildWorldMap`, following the same `window.build*` convention as `public/components/*`. Its coastline is Natural Earth 1:110m land (public domain) by way of the `world-atlas` package (ISC), converted once by `scripts/build-world-map-path.mjs` into a flat SVG path baked into the file. There is no runtime geodata dependency and `world-atlas` is not a package.json dependency. The path is baked in the projection lon0 = -20, lat1 = 62, scale = 8 — `buildWorldMap` re-projects it onto whatever window a map asks for, so the same outline serves an Afro-Eurasia crop and a whole-world view. It covers the full globe including Antarctica, New Zealand and Patagonia.

**The shared climate layer** — `public/components/world-climate.js` exposes `window.buildClimateLayer(base, options)`, plus `CLIMATE_ZONES`, `CLIMATE_CLASSES` and `climateAt(lon, lat)`. Generated by `scripts/build-climate-data.mjs` from the present-day Köppen-Geiger classification published by Universität Wien (koeppen-geiger.vu-wien.ac.at, Kottek et al. 2006 / Rubel & Kottek 2010), by way of the `koppen-climate-lookup` package (ISC) — fetched on demand, converted once, baked in, and not a package.json dependency. Cite the source if you reuse the data.

92,416 land cells on a 0.5° grid become 9,275 rectangles, because the grid is run-length encoded along each latitude row and climate comes in bands — no resolution is lost. `CLIMATE_RUNS` is flat and read four at a time: latIdx, lonIdx, length, class.

Two things this layer had to get right, and both will bite the next one:

- **Append to `base.svg`, never inside the base group.** That group carries a transform mapping the baked path's coordinate space onto the window, and anything built from `base.px` is already in window coordinates — nesting applies the transform twice and shrinks the world into a corner of itself.
- **Clamp to `base.width` / `base.height`.** The grid covers the globe, the map shows a window onto it, and an svg root does not reliably clip past its viewBox. Unclamped, the rows south of the coastline's limit (−85.61°) drew as a grey bar under Antarctica.

**気候帯マップ derives every climate from the data.** Its cities carry a name and a coordinate and nothing else; what climate each has is looked up at runtime through `climateAt`, so the map cannot disagree with its source, and no climate on that page is asserted by hand.

**The shared country layer** — `public/components/world-countries.js` exposes `window.buildCountryLayer(base, options)`, plus `WORLD_COUNTRIES`, `WORLD_COUNTRY_BY_ID` (ISO numeric), `WORLD_COUNTRY_BY_CCA3` and `countryName(cca3)`. Pass it the object `buildWorldMap` returned and it draws all 177 countries as individually clickable paths, already re-projected:

```js
const layer = buildCountryLayer(base, {
  className: "country",
  onPick: function (country) {},     // omit for a static outline layer
  fill: function (country) {}        // optional per-country colour
});
```

It appends to the svg, so move the group if it must sit under something (`svg.insertBefore(layer.group, markers)`). An SVG `fill` **attribute** loses to any CSS rule matching the path, which is why `options.fill` and per-country colouring both set an inline style.

Each record carries `d`, `en`, `jp`, `cap` (capital, in Latin script — the source has no Japanese capitals and transliterating ~180 by hand would be guesswork), `shu` (州), `sub`, `area`, `lat`/`lon` and `nb` (neighbours as cca3 codes). Resolve neighbours with `countryName`, not the by-cca3 map: microstates like Andorra and Monaco have facts but no polygon at 110m, so they are nameable but not drawable. Three areas (N. Cyprus, Somaliland, Kosovo) have geometry but no ISO code and are flagged `noFacts` — drawn so the map has no holes, with no fact card invented for them.

Regenerate with `node scripts/build-country-data.mjs` (add `--res 50m` for finer borders, ~6x larger). **Data provenance:** borders are Natural Earth 1:110m admin-0 (public domain) via `world-atlas` (ISC); facts are the `world-countries` package, licensed **ODbL 1.0**, which is share-alike and requires attribution — the generated file carries the notice and only the fields the maps use are copied. Keep that notice on any redistribution.

**Antimeridian** — both generators share `scripts/lib/topojson-to-path.mjs`. Rings that wrap past ±180° (Russia, Fiji, Antarctica) must be split at the crossing or they draw as a straight streak across the map, and rings Natural Earth already split on ±180 must not be interpolated across or they produce NaN coordinates. `ringsToPath` asserts every point is finite and on the globe, and fails the build rather than writing a broken path — a NaN renders as nothing, so it is invisible in the generator's output.

**Progress** — Geography maps are **not** learner apps: they have no assignment record and are not in `src/data/lessons.ts` (the `Lesson` type is `subject: "english"`). Progress lives in `src/data/geographyProgress.ts`, local-first and Supabase-shaped like `mathProgress.ts`, in the `geography_map_progress` table, keyed by map id. A map is `explored` once every marker has been opened and `done` once its quiz is finished; `saveGeographyMapProgress` never downgrades what Leo has earned (best quiz score wins, `exploredCount` only grows, `done` stays done).

**Maps report, they never store.** `public/components/geo-progress.js` is the bridge every map uses — do not hand-roll another one:

```js
const GEO = leeaGeoProgress({ mapId: "sekai-no-kuniguni-map", exploredTotal: 25 });
GEO.open("BRA");                  // Leo looked at something
const pool = GEO.pickQuiz(ids, 10);  // weighted toward what he keeps missing
GEO.answered("BRA", correct);     // one answer, held until the run ends
GEO.finishQuiz(score, total);     // sends the run up
GEO.onState(() => { /* stored stats arrived */ });
GEO.weakIds();                    // for the 苦手 list
```

`GeographyMapView` is the only writer, so everything reaches Supabase by one path. Every call is a no-op when the map is opened standalone (`window.parent === window`).

**Weak-spot practice** — the bridge is two-way. A map posts `LEEA_GEO_READY` on start; the app replies with `LEEA_GEO_STATE` carrying the per-item history it already holds. Each quiz answer is recorded per item (`asked`, `correct`, `lastCorrect`) in the record's `items` map and the table's `items` jsonb column, accumulated by `applyItemResults` rather than overwritten. `pickQuiz` then weights selection: never asked outranks known, and a fresh miss outranks both — measured at roughly 1.5x the draws for weak items. Keep it visible, not just a silent weighting: every map shows a 苦手 bar, and the app bar shows a 苦手 count. This is the same idea as Reference's I Know / I Don't Know for English words.

Item ids are whatever the map already uses to identify an answer — cca3 for countries, marker ids for continents and cities, question indices where a map has no natural id. They only have to be stable within that map.

Main navigation and headings stay English. Japanese belongs inside the map and in the card's `jpTitle` / `jpShortTitle`.

Our World has six levels. First build target:

```text
Our World > Level 4 > Unit 8
```

## Views

```text
Neritan view
- open teacher lessons
- preview Leo apps
- assign learner apps
- track Leo progress
- track school test results and academic goals under `/teacher/progress`

Leo view
- see next assignment
- complete learner apps
- review completed work
- use Reference

Reference
- search and browse all English vocabulary and grammar
- open vocabulary cards and grammar charts
- show I Know / I Don't Know lists
```

Home is a high-level launcher for all subjects and modes. Keep detailed English course/level/unit browsing inside the English area, not on Home. Neritan's Teacher Menu owns teacher lesson tracking and Mark Done state, navigated with a Level 1-6 tab row and a Unit 1-9 chip row (`TeacherDashboard.tsx`) that drill down to a single unit's roster — picking a level resets the unit to 1. A unit is "live" (full roster with Teaching + Leo's App columns) the moment any teacher lesson is authored for it, regardless of level or unit number — it is not hardcoded to one flagship unit. Units with no authored lesson yet render a placeholder 2-column Lesson/Status roster over the fixed 8-lesson spine (Opener → Writing), with status derived from where that level/unit sits relative to Level 4 · Unit 8 (today's actively-taught unit): earlier levels read all Taught, later levels read all Locked, and other units within the current level read Taught if before Unit 8 or To Teach if after.

Our World also has checkpoint material after each three-unit band. Treat Review and Extra Reading after Units 1-3, 4-6, and 7-9 as first-class checkpoint lessons, not as part of Unit 3, 6, or 9. In the Neritan Teacher Menu they render as planned checkpoint rows under the roster whenever the selected unit is the last of its band (3, 6, or 9) and that unit has real content. Until their deck/app files are generated, show them as planned checkpoint cards rather than broken lesson links.

Teacher lessons are only for teaching. Learner apps are for Leo's independent homework/practice.

Learner apps live as separate `mode: "learner"` lesson records from teacher lessons, even when they cover the same component. They open from Leo mode and may embed uploaded standalone HTML apps from `public/learn/...` while keeping local progress keys ready for Supabase.

Lesson record filenames must make the mode explicit: teacher records use `<component>.teacher.json` and Leo records use `<component>.learner.json` under the unit `lessons/` folder, for example `vocab1.teacher.json` and `vocab1.learner.json`. The shared curriculum content still lives in `vocabulary.json` / `grammar.json`; these lesson records only describe the teacher route, Leo route, assignment/progress keys, and menu behavior. The validator enforces the filename suffixes.

The Neritan Teacher Menu shows only teacher slide cards — learner apps never render as separate boxes there. Each teacher card carries the controls for Leo's matching app (Assign/Assigned, Review, Unassign) inside a tinted `app-controls` group labeled "Leo's App", next to the teaching controls Open and Mark Done. The counterpart is found by component name: teacher `opener` pairs with learner `opener-app` in the same level/unit, so new learner apps must follow the `{component}-app` naming to surface their buttons on the teacher card. Open stays the primary black button; Unassign renders as a quiet ghost button. Component labels and card left edges share the same accent color per component type.

Leo mode should group learner apps by course/level/unit with collapsible sections. Learner app cards should show a clear component cue, such as emoji plus color-coded chip/edge for opener, vocabulary, grammar, reading, writing, and review.

Checkpoint learner apps use the same assignment/review loop as unit apps. Use teacher components `review` and `extra-reading`, with learner counterparts `review-app` and `extra-reading-app`. Source tags use band notation such as `OW4-R7-9` and `OW4-ER7-9`.

Leo's page must feel like Leo's, not a smaller copy of the teacher dashboard. The top of `/leo` is always a `LeoHomeworkHero` card with "Hi Leo 👋" greeting, a single big Start/Keep Going button, and three states: one assignment, multiple assignments ("and X more"), and a celebratory caught-up state. The grouped browser below the hero is the **full Leo library** — it shows every `mode: "learner"` lesson grouped by course/level/unit, not only the currently assigned ones. Cards without an active assignment get the `leo-app-card-available` modifier (softer styling) and a "Not assigned" status. Cards Leo has finished get a `leo-app-card-done` quiet green accent.

Use `getComponentMeta(component)` from `src/components/componentMeta.ts` as the single source of truth for emoji/label/tone. The Leo hero, Home's `NextCard`, and any future surface that names a lesson must read from it — do not duplicate the emoji/label/tone map. Home's `.next-card` carries the same per-component tone as the Leo hero through `--next-accent` and `--next-accent-deep` so the path from Home → Leo's view stays visually unbroken.

**A tab keeps the JavaScript it loaded, so it will happily serve old code after a deploy.** Navigating inside the app never fetches a new bundle, and nothing said so — which is how a shipped fix can look like it never landed, and how you can spend a while testing a build that is no longer deployed. `src/components/NewVersionPrompt.tsx` mounts in the root layout (so it reaches the Math and Geography scopes too, which render outside `AppShell`) and offers a reload when the tab is behind.

The build id is inlined into both bundles at build time by `next.config.mjs` — the Vercel commit sha in production, `local-<timestamp>` otherwise. `/api/build` is `force-dynamic` and `no-store`, so it answers with the id of whichever deployment the alias points at *now*; a mismatch means the tab is behind and nothing else. Checks run on mount, on focus and on visibility, throttled to one a minute and backed by a 15-minute interval; a dismissal is remembered per build id, so it stays gone until the next deploy. A `local-` id never checks at all, since it changes on every restart and would nag for nothing.

**Home shows one thing per subject.** `src/components/AcrossSubjects.tsx` renders the "Across subjects" row: the most useful next step in English, Math and Geography, each linking straight to it. Every subject already tracked what Leo was struggling with and kept it behind its own front door, so answering "what should I do now?" meant opening three of them.

The ranking within each subject is the same idea everywhere: **something he got wrong beats something unfinished, which beats something untouched.** English leads on weak words from `getWeakWordIds`, Math on a 節 already started over one never opened, Geography on a map with 苦手 items over one merely unfinished. When a subject has nothing outstanding the row says so and is styled as a win (`.is-clear`), never as another task.

Math's share needs the section JSON, which is server-only, so `loadMathPracticeCounts()` passes down how many tickable problems each section holds and the client counts done records by their `<sectionId>::<blockId>` keys. Add a subject here whenever one starts tracking weak spots.

**Every standalone math lesson needs a way back.** The lessons under `public/math-lessons/` open in a new tab from a section page or the curriculum home, and for a long time not one of them linked back into LEEA — thirteen files, zero exits, so the only way out was the browser's own controls. `public/components/math-lesson-home.js` is the shared fix: it self-installs a fixed `← 3章1節へ` button and needs one `<script src="/components/math-lesson-home.js" defer></script>` in the lesson's `<head>` and no call. Add that line to every new lesson.

Where it points is read from the lesson's own filename, so name new lessons `<topic>-ch<N>-sec<M>-p<pages>.html` and the button routes back to that section for free; a name without `-chN-secM` falls back to `/math`. It hides itself inside an iframe, because the app's own viewer already has a back link in its topbar and a second one pointing out of the frame would be worse than none.

Reusable activity templates live under `public/components/*` (single library shared by teacher decks and Leo learner apps — consolidated in PR #105). Each template is self-contained vanilla JS exposing a `window.build*` global (`buildDndSorter`, `buildFourColChart`, `buildThreeColChart`, `buildNColChart`, `buildSunshine`, `buildWordWeb`, `buildStepFlowchart`). **Call sites should invoke `pickChart('<lp-cue>', config)` from `public/components/chart-picker.js` — the picker maps LP cue words ("3-column chart", "sunshine organizer", "step flowchart", etc.) to the matching builder so skills don't hardcode builder names.** Direct `buildXxx(...)` calls are now an anti-pattern; the only place they appear is inside the picker itself. Load order in any lesson's `<head>`: `charts.js` + the specific component files + `chart-picker.js` last. Content validation does not yet catch dangling references; if a global is undefined the picker throws a helpful error message at runtime. The reusable templates are documented in `docs/chart-templates.md` with API, behaviour, and the full cue table; add a new section there whenever a new template is built. Do not duplicate template logic inline in a lesson HTML when a shared helper exists. The hero is color-coded by lesson component (opener gold, vocab green, grammar blue, reading amber, writing plum, song coral/pink `#d94f7b`, review green) through a single `--hero-accent` CSS variable that drives the left edge, background tint, greeting, meter, and "more" link. Adding a new component type: add a `.leo-hero-card-<tone>` block in `globals.css` and add an entry in `getComponentMeta` in `src/components/componentMeta.ts` (the single source of truth — not inside `LeoHomeworkHero.tsx`). Do not add competing primary buttons to the hero or restyle Leo's view in the muted Neritan palette.

A learner lesson can be auto-assigned by setting its `status` to `assigned` in the lesson JSON — `seedAssignments` picks this up on load. Use `status: "live"` when Neritan should assign it manually from the teacher card instead. Home should show assigned learner homework first; when multiple homework records are open, show the most recently updated `assigned` or `needs-redo` record first. When no homework is waiting, it should show Coming Up Next based on unfinished current-unit work. Home must use `getLearnerAppProgress(source)` to decide whether a learner app is done so apps with custom `moduleKeys` or `scoreKey` stay accurate.

Use `public/brand/leea_brand_mark.png` for small square LEEA brand marks in the app shell and Home hero. Keep `public/brand/leea_brand_logo.png` as the full transparent logo asset. Do not recreate the mark in CSS or inline SVG.

Learner app progress is read through `getLearnerAppProgress(source)`. The lesson JSON `source` describes the app's localStorage shape:

- `storagePrefix` — the full `leea-…-` prefix the app writes under.
- `moduleCount` — how many completable activities the app has.
- `moduleLabels` — display labels per module, in order.
- `moduleKeyFormat` (default `m{n}-done`, `{n}` 1-based / `{i}` 0-based) — for apps with regular numeric module IDs (opener style).
- `moduleKeys` — explicit per-module done-key suffixes. **Takes precedence over `moduleKeyFormat`.** Use when module IDs are non-numeric (`"ma"`) or the suffix is not `-done` (e.g. song uses `m1-complete`, `ma-complete`, …).
- `scoreKey` (default `score`) — the quiz score key suffix when the app stores its score elsewhere (e.g. song stores the quiz at `m6-score`).
- `homeworkId` — the cloud namespace; also enables the `leea-{homeworkId}-done` "homework finished" flag.
- `captionKey` — key holding Leo's written caption, if the app has one.

`getLearnerAppProgress` accepts either boolean or `{done, timestamp}` values at module keys (both are truthy when complete). It returns `score` as a **percent**: it prefers `scoreData.percent`, falls back to `Math.round(score/total * 100)` if both are present, and only treats `score` as a percent for legacy apps that store no `total`. Do not hardcode app-specific keys or labels in TypeScript — they belong in the lesson JSON.

### Learner app save/restore contract

Every module or quiz in a learner HTML app must follow this contract:

**1. Auto-save the done-key when the module finishes.**
The completion function (e.g. `finishQuiz()`, `finish()`) must save the module's done-key immediately — do not rely on the student clicking a "Mark complete" button to write that key. `getLearnerAppProgress` reads the done-key to count `completedModules`; if the key is missing, the teacher card shows the wrong count.

```js
// At the end of the quiz finish function:
lSave(SAVE_PREFIX + 'm7-done', true);       // opener pattern
lSave(SAVE_PREFIX + 'm6-complete', {...});   // song/vocab pattern
```

**2. Persist quiz score to localStorage when the quiz finishes.**
Call `saveScore(score, total, true, { ...extra })` inside the quiz finish function so the result can be restored. Do not only display the result — always write it.

**3. Restore result view on modal/tab reopen — never restart a completed module from zero.**
When a modal opens or a tab switches to a completed module, check for saved state first. If `score.done === true` (or `moduleId-complete` exists), show the result view using a dedicated `restoreXResult()` function. Only call `initX()` (which resets everything) when there is no saved state or the user explicitly taps ↺ Redo.

```js
// Modal pattern (opener style):
function openModal(id) {
  if (id === 'm7' && !m7Started) {
    const saved = lLoad(SAVE_PREFIX + 'score');
    if (saved && saved.done) restoreM7Result(saved);
    else initM7();
  }
  ...
}

// Tab pattern (vocab style):
window.showTab = function(n) {
  origShowTab(n);
  if (n === 11) { if (!restoreQuizResult()) initQuiz(); }
  ...
};
```

**4. ↺ Redo clears saved state before re-initializing.**
The redo path must remove the saved score and done-key before calling `initX()`, otherwise the restore check will immediately show the old result again.

```js
// "Try again" inline button:
onclick="lSave('score', null); initQuiz()"
// or doRedo / resetModule clears: localStorage.removeItem('leea-' + prefix + 'score')
```

**5. Every module needs a visible footer with both a Mark Complete button and a ↺ Redo button.** Rule 1 says the done-key must auto-save without waiting for a tap — that governs the *data*, not the UI. A module that only auto-detects completion with no visible button is still non-compliant: the learner has no explicit way to confirm they're finished, and (this happened for real, in `ow-l4-u8-writing.html`, where 10 of 13 modules shipped with no button at all) there is no way to intentionally reset one module's work without clearing the whole app's storage. Every module's footer needs: a "Mark [Module] complete ✓" button, disabled until that module's own completion criteria are met, enabled by the same check that would have auto-saved the done-key; and a two-tap-armed "↺ Redo" button that clears that module's saved keys and resets its DOM back to a fresh state (see `m5Redo`/`m1Redo`/etc. in `ow-l4-u8-writing.html` for the two-tap pattern).

**6. Restoring per-question answered state means restoring the DOM, not just the data object.** A module that tracks per-question answers in a JS object (e.g. `const M3_ANS = {}`, saved/loaded via `lSave`/`lLoad`) and guards its answer handler with `if (M3_ANS[qk]) return;` must also re-apply the disabled/"correct" look to those buttons in its `restore_mX()` function. Restoring only the data object leaves the buttons rendered fresh and clickable; tapping one then silently does nothing (the guard blocks it) with zero feedback, which reads as broken. `restoreAnsweredButtons(groupPrefix, answeredObj, btnClass)` in `ow-l4-u8-writing.html` is the reusable pattern — re-disables every button in an answered question's group and marks the objectively-correct one, regardless of which option the learner originally picked.

Home current-focus progress counts unit components, not every route. If a teacher lesson and Leo learner app cover the same component, such as `opener` and `opener-app`, they count as one lesson/component in the Home progress total.

Before Supabase is connected, Neritan assignment/review uses local storage with Supabase-shaped records. The assignment loop is: Neritan assigns a learner app, Leo completes it, Neritan reviews saved module/score/caption progress, then marks it reviewed or needs redo.

Assignment state is read through the shared helpers `readAssignments(learnerLessons)` and `getOpenAssignmentCount(...)` in `src/data/assignments.ts`. Mutate state only through `assignLesson(lessonId, current)` and `unassignLesson(lessonId, current)` from the same module — they keep an `leea.assignments.unassigned.v1` set so `seedAssignments` does not resurrect an auto-assigned lesson after Neritan explicitly unassigns it. Do not duplicate localStorage read/seed logic inside components. Sidebar and dashboard numbers must come from real records, never hardcoded values. UI typography rule: at most one uppercase letter-spaced label per card region — component labels and group labels are uppercase, meta text and pills are sentence case.

Teacher lesson "Mark Done" state is tracked separately in `src/data/lessonProgress.ts`. It uses `leea.lessonProgress.v1` in localStorage and stores `LessonProgressRecord` objects shaped to match a future Supabase row (`lessonId`, `teacherId`, `studentId`, `status`, `completedAt`, `updatedAt`).

Academic test tracking lives under Neritan at `/teacher/progress`, implemented entirely inside `src/components/AcademicProgressPage.tsx` (types, storage, and UI all in one file — there is no separate `src/data/academicProgress.ts` module; one existed briefly with a different Supabase-shaped schema but was never wired to the actual page, so it was deleted rather than left as dead code that looked authoritative). Storage keys actually in use: `leeaTestsJPDashboardV2` and `leeaGoalsJPDashboardV2`, local-only for now. Keep this multi-subject from the start: Japanese, Social Studies, Math, Science, and English. Average-score fields default to `0` when left blank rather than being nullable — never treat `avgTotalScore(t) === 0` as "no data entered" without also checking `hasAvgData(t)`, or the UI will show a fabricated "school average is 0点" (this happened once already).

`src/data/learnerProgress.ts` (Leo's own auto-tracked app completion, table `learner_progress`) and `src/data/lessonProgress.ts` (the parent's manual "Mark Done" checklist, table `teacher_lesson_progress`) are two separate tracking systems. `upsertLearnerProgressSummary()` now auto-propagates a learner app finishing into the matching teacher lesson's done state, but only when the learner `component` matches the teacher `component` with `-app` stripped — see `docs/supabase.md` before registering a new lesson pair. Any UI that picks "the most recently relevant lesson" (e.g. a review callout) must sort by an actual timestamp (`fetchLearnerCompletionTimestamps()`), never by array position in `learnerLessons` — array order silently went stale once already and showed a lesson Leo finished weeks ago instead of the one he'd just completed.

`src/data/registry.ts` holds named stat variables (`totalWords`, `grammarPoints`, `knownWords`, `wordsToReview`) plus `academyStats`. The `liveLessons` and `assignedLessons` fields in `academyStats` are currently hardcoded stub values — they must be replaced with real computed counts before the stats section can be trusted. Do not add new hardcoded numbers here; wire to real lesson and assignment data instead.

Leo's app card list uses a third CSS variable layer: `.leo-app-card-{tone}` classes set `--leo-component`, `--leo-component-soft`, and `--leo-component-ink` on each card. The tone comes from `getComponentMeta(lesson.component).tone`. All three surfaces (Leo hero `--hero-accent`, Home next-card `--next-accent`/`--next-accent-deep`, Leo app card `--leo-component`) are driven by `getComponentMeta` — do not add per-surface hardcoded color maps.

## Current Build Status — Our World Level 4

Unit 8 is fully built: opener, vocab-1, song, grammar-1, grammar-2, vocab-2, reading, writing, mission, project, and reader/book-reading all have registered teacher + learner lesson pairs in `src/data/lessons.ts`.

Unit 9 ("The Science of Fun") is complete as a unit — opener, vocab-1, song, grammar-1, vocab-2, grammar-2, reading, writing, mission, project, and book-reading all have teacher + learner pairs. The Units 7-9 checkpoint band is complete too — Review 7-9 and Extra Reading 7-9 (Leonardo da Vinci) both have a teacher deck and a Leo app. Level 4 Unit 7 ("Good Idea!") is complete. Its vocabulary and grammar scans (`unit-7/vocabulary.json`, `unit-7/grammar.json`) and all ten component pairs are registered in `src/data/lessons.ts`: opener, vocab-1, song, grammar-1, vocab-2, grammar-2, reading, writing, mission, and project. See the Unit 7 build status table in `docs/design-decisions.md` for the file map and each Leo app's module shape.

The Mission and Project words are reference cards now, tagged `OW4-U9-MI` (share, evaluate, unexpected, curious, thermal image, think creatively, think critically, physicist — LP p.159) and `OW4-U9-PJ` (research, upside down, attach, combine, thaumatrope, optical illusion, predict — LP p.160). Three of them already existed as global cards and gained a Unit 9 source rather than a duplicate: `research` and `predict` were already rich academic cards, and `share` was a light Unit 1 card that the Mission page lists under Academic Language, so it was upgraded to one academic card carrying both senses.

Checkpoint lesson records live in their own folder beside the units — `content/subjects/english/courses/our-world/level-<n>/checkpoint-<start>-<end>/lessons/` — and carry `unit: <band end>` only so the teacher menu can find them from the last unit of the band. Every surface must treat them as checkpoint material, not as a lesson of that unit; use `isCheckpointComponent()` from `src/data/lessons.ts` rather than re-listing the component names. A new checkpoint folder must also be added to `lessonsDirs` in `scripts/validate-content.mjs`.

Target file paths follow the standard naming convention: `public/lessons/ow-l<level>-u<unit>-<component>.html` (teacher) and `public/learn/ow-l<level>-u<unit>-<component>.html` (learner) — see `docs/components.md` for each component's locked module structure.

### Grammar lesson HTML structure (locked — Unit 8 Grammar 1/2)

Reference: `public/lessons/ow-l4-u8-grammar-1.html` + `public/learn/ow-l4-u8-grammar-1.html`.

**Teacher lesson** (`public/lessons/ow-l4-u8-grammar-1.html`):
- Slide-based deck, same HTML/CSS shell as `public/lessons/ow-l4-u8-opener.html`
- Slides: intro (grammar rule name + unit context) → grammar box (verbatim examples from PDF) → Notice activity → Build activity → Fix activity → Use activity → wrap-up
- Grammar box appears on every slide as a collapsible sticky reference panel
- Mark Done button saves to `leea.lessonProgress.v1`

**Learner app** (`public/learn/ow-l4-u8-grammar-1.html`):
- Four-tab layout: **Chart & Samples** | **Level Up** | **Quiz** | **Master Quiz**
- `SAVE_PREFIX = 'leea-4-8-grammar-1-'`
- `HOMEWORK_ID = 'leo-4-8-grammar-1'`
- Tab 1 (Chart & Samples): rule table + 6–10 source-backed sample sentences. No save needed — it is reference only.
- Tab 2 (Level Up): deeper rules, transforms, mixed samples. No save needed.
- Tab 3 (Quiz): multiple choice, 10 questions, follows global Japanese ON/OFF. Save score with `saveScore(score, 10, true, { trophy, text, sub, wrongQuestions })`. Restore result on re-open (Rule 3). ↺ Redo clears saved state (Rule 4). Done-key: `m3-done`.
- Tab 4 (Master Quiz): mix of multiple-choice and build-order questions, 10 items. Japanese shown automatically after each answer regardless of toggle. Save score to `m4-score`. Done-key: `m4-done`. Restore on re-open.
- `moduleCount: 4`, `moduleKeys: ["t1-done", "t2-done", "m3-done", "m4-done"]` in the registry lesson JSON.

Tabs 1 and 2 auto-save their done-key when the user opens the tab (they are reference tabs — opening counts as done). Tabs 3 and 4 save only when the quiz finishes.

## Main Layers

```text
1. Subject layer
2. Course layer
3. Reference layer
4. Activity block layer
5. Lesson layer
6. Registry/assignment layer
7. Progress layer
```

## Reference Rules

Reference opens in source-tree mode by default:

```text
Reference
- Our World
  - Level 1
  - Level 2
  - Level 3
  - Level 4
  - Level 5
  - Level 6
- Joyful Work
  - Year 1
  - Year 2
  - Year 3
- Training Ground
```

Reference also has pages/tabs:

```text
Vocabulary
Grammar
I Know
I Don't Know
Search
```

Search is its own sidebar route at `/reference/search`. Keep `/reference` focused on browse/source-tree, vocabulary, grammar, I Know, and I Don't Know. Do not put the full search box back at the top of the default Reference page.

Clicking vocabulary opens the vocabulary card. Clicking grammar opens the grammar chart/card.

Reference search must search everything together when the search box has a query:

- LEEA vocabulary, academic, content, related, and glossary cards
- LEEA grammar points
- Junior High search-only dictionary links from `content/subjects/english/junior-high/sanseido-index.json`

Search results must show clear type/source tags such as Vocabulary, Academic, Grammar, Junior High, Sanseido, and source tags like `OW4-U8-G1`. Clicking an internal vocabulary or grammar result opens the LEEA card. Clicking a Sanseido junior-high result opens its `u` link from the JSON. Sanseido entries are search-only; do not create LEEA cards for all of them.

Reference browse/search controls should show useful counts, and mixed search results should use subtle type-aware color cues such as card edges and badges for Vocabulary, Academic, Content, Related, Glossary, Grammar, and Junior High.

Reference level colors must stay consistent and visually distinct everywhere levels are listed: Level 1 green, Level 2 teal, Level 3 blue, Level 4 purple, Level 5 orange, Level 6 red. The source tree, Vocabulary, Grammar, I Know, and I Don't Know views all nest as `Course -> Level -> Unit -> Vocabulary/Grammar`; Vocabulary nests Vocabulary 1, Vocabulary 2, Academic, and Glossary, while Grammar nests grammar-point cards. Keep the hierarchy visually obvious with different styling for level, unit, category, and subgroup rows.

For checkpoint content, the Reference source tree nests it under the level band after the unit entries, for example `Level 4 -> Units 7-9 -> Review 7-9` and `Extra Reading 7-9`. New checkpoint vocabulary, glossary, academic, reading, and grammar-support items should keep their `OW<level>-R<start>-<end>` or `OW<level>-ER<start>-<end>` source tags.

Leo's Reference `I Know` / `I Don't Know` state is local-first but Supabase-shaped. Use `src/components/useKnownWordIds.ts` and its `leea.referenceConfidence.v1` records (`id`, `studentId`, `wordId`, `knows`, `confidence`, `sourceContext`, `markedKnownAt`, `asked`, `correct`, `lastCorrect`, `lastPracticedAt`, `createdAt`, `updatedAt`). Do not store new confidence state as a bare array of word IDs; that shape was temporary and is only supported for migration.

The reads and writes themselves live in `src/data/referenceConfidence.ts`, which is the only module that talks to the `reference_confidence` table — `useKnownWordIds` is the React wrapper around it. The table existed in `supabase/schema.sql` from the first Supabase PR but nothing in `src/` ever wrote to it, so every word Leo marked lived in one browser's localStorage. If you add another surface that records word-level state, put the write in `referenceConfidence.ts` rather than reaching for Supabase from a component.

**Vocabulary practice** (`/reference/practice`) is the English counterpart of the Geography weak-spot quiz, and works the same way. Each answer accumulates `asked` / `correct` / `lastCorrect` on the word's confidence record; `practiceWeight` then turns that history into a draw weight (a fresh miss 6, never asked 3, shaky 4/2, solid 1) and `pickPracticeWords` samples without replacement, so missed words come back sooner without ever locking out the rest. A wrong answer also drops the word to `needs-review` and clears `knows` — the drill is allowed to overrule an earlier "I know this". Keep the weak list visible on the intro screen; a weighting Leo cannot see is not feedback.

**Save progress as it is made, never only at the end.** Practice first shipped saving the whole session on the final "See result" click, so a round left half-finished recorded nothing at all — not to Supabase, not even to localStorage. Leo abandons rounds; that is normal, and the app should not punish it by erasing nine right answers. Any drill, quiz or multi-step app records each answer as it is given. The same applies to the Geography maps and every learner app: if a learner can walk away mid-way, the work up to that point must already be saved.

Reference search should rank direct word/title matches above meaning/rule matches. Broad lesson/topic tags such as `collecting` must not make every card in that section appear for a shorter query such as `collect`; source tags such as `OW4-U8-G1` can match by exact code or code prefix.

If a source tree label exists, it should list real cards or clearly say the section is empty. Do not leave placeholder links such as Academic or Glossary pointing back to `/reference`.

Academic words are thinking/study terms from Lesson Planner "Academic Language" sections. They are global cards reused across units and subjects, so duplicate academic words must merge into one `type: "academic"` item with multiple `sources[]`. Academic cards always render the rich academic card by `type`, never by tags and never as light vocabulary cards.

Academic rich cards require the light-card base fields plus `meaning`, `jp_meaning`, exactly three `when_to_use` contexts, `jp_when_to_use`, `how_to_use`, `jp_how_to_use`, `examples`, `collocations`, `jp_note`, `practice_prompt`, and `jp_practice_prompt`. Also include `nonExamples` and `miniQuiz` when building new academic cards. `examples[]` use `{ en, jp, context }`, with context set to `test`, `school`, or `real-world`. `miniQuiz[]` uses `{ prompt, options[], correct, explanation, jp }`; options stay English-only, and the renderer must show the explanation only after the learner taps an option. Add the source tag, such as `OW4-U8-G1`, and the course-level `OW4-AC` tag.

All cards need Japanese. Vocabulary, academic, content, related, glossary, and grammar reference items should not ship with blank Japanese display fields. If the Japanese is not parent-confirmed, add a careful draft and mark it with `needsReview: true` / `jp_tags: ["needs-review"]`. Confirmed examples: analyze = `分析（ぶんせき）する`; clause = `節（せつ）`.

Academic Japanese uses junior-high school grammar terms such as 主語, 動詞（どうし）, 節（せつ）, and 関係代名詞（かんけいだいめいし） when relevant. Use furigana only for harder kanji, inline with parentheses. Codex may draft Japanese for review, but the parent does the final pass.

Academic card layout should be compact and type-aware: source chips such as `OW4-U8-OP` sit beside the word title, syllables and part of speech render as pill chips, and part-of-speech chips use distinct colors by grammar role. Academic emoji should be large enough to use the visual panel space.

## Content Validation

Run this whenever reference content changes:

```text
npm run validate:content
```

The validator checks that vocabulary IDs and indexes line up, every card has Japanese display fields, academic cards have the full rich schema and mini-quiz shape, grammar cards have Japanese support, Sanseido junior-high entries are valid search-only links, every lesson JSON under the unit `lessons/` folder is imported by `src/data/lessons.ts`, and every `mode: "learner"` lesson's component ends with `-app` AND has a matching teacher-mode lesson with the base component in the same course/level/unit. Do not weaken the validator to make bad content pass; fix the content or update the documented rule in the same PR.

Every lesson HTML under `public/lessons/` and `public/learn/` is embedded inside an `<iframe>` in the real app (`src/components/LessonPage.tsx`) — teacher decks via `src=`, learner apps via `srcdoc=` with a cloud-sync bridge script injected before the lesson's own script. A render-blocking cross-origin `<link rel="stylesheet">` (Google Fonts) can stall that iframe's entire document parser indefinitely if the request never resolves (blocked network, slow DNS, an ad/privacy blocker on the domain) — every script on the page silently does nothing, with no console error, while the lesson still opens and renders fine when tested directly/fullscreen. Always load the Google Fonts stylesheet non-blocking: `<link rel="stylesheet" href="..." media="print" onload="this.media='all'">` with a `<noscript>` fallback. The validator enforces this on every lesson HTML file.

Vocabulary cards need:

- Previous
- Next
- position in current list, such as 3 / 14
- I Know
- related lesson button, disabled until the lesson is live
- one global Japanese ON/OFF control from the shell, not a second card-level Japanese button
- Japanese content hidden when Japanese is OFF and visible when Japanese is ON

Grammar cards need:

- source-backed chart data
- chart tabs: Chart & Samples / Level Up / Quiz / Master Quiz
- when a grammar workbook answer key is available, use the unit grammar chart as the chart source
- each grammar reference should target 10 Tab 1 sample sentences, 10 Tab 2 mixed/level-up sample sentences, 10 Tab 3 quiz questions, and 10 Master Quiz questions
- one global Japanese ON/OFF control from the shell
- Tabs 1-3 use the global Japanese ON/OFF
- Tab 4 reveals Japanese automatically after each answer, regardless of toggle state
- related lesson button, disabled until the lesson is live

## Assessment Audio

The ExamView listening tracks for the test Leo takes after each unit live in
`public/audio/`, filed one folder per unit. What each track is comes from the
level's manifest, not from scanning the folder:

```
content/subjects/english/courses/our-world/level-4/assessment-audio.json
```

Each entry carries the publisher's track number (`1.1`), its ID3 title, the
file name, the URL the player uses, and a `kind` of `unit`, `checkpoint` or
`level`. `scripts/validate-content.mjs` checks that every path sits under the
manifest's `basePath` in the folder its `kind` implies, so a misfiled track
fails the build rather than producing a player pointed at a URL nothing will
be filed to. A track whose `.mp3` is not in the repo yet is **not** an error —
the audio is added separately, and `UnitAssessmentAudio` renders those rows as
"Not added yet". Which tracks have a file is decided at build time by
`scripts/generate-assessment-audio-map.mjs` (chained into predev/prebuild,
output gitignored under `src/generated/`), not by an `onError` handler on the
player: with `preload="none"` the browser never requests the file, so a missing
track fires no error and would otherwise render as a player that silently does
nothing when pressed.

Filing is by unit alone — the number before the dot. Review tracks are no
exception: 9.3 reviews Units 7–9 but lives in `unit-9/`, because that is how
the publisher numbers it. A band-closing unit (3, 6, 9) therefore has more
tracks than the rest, since it ships two tests: its own, and the band review
(Unit 9 also carries 9.5, the whole-level review). Nothing in the filename
says which is which — only the title does, which is why `kind` and
`checkpoint` are recorded in the manifest. They label the row on the unit
page so the two tests read as different things; they never move the file.

To file a disc into place, or to see what is still missing:

```bash
npm run audio:assessment -- --from ~/Downloads/ExamViewAudio
npm run audio:assessment -- --check
```

The level comes from the filenames (`ow2e_ev4_ame_…`), and a level with no
manifest gets one drafted from them, summarised per unit for checking. Levels
are found by scanning `content/subjects/english/courses`, by both the validator
and the generator, so a new level's manifest needs no registering anywhere.

Audio is committed as ordinary files, not Git LFS. Keep each track under 25MB
(64 kbps mono is about 0.5MB/minute and is plenty for speech). If the library
outgrows the repo, move the files to Supabase Storage and repoint `basePath` —
every player reads its URL from the manifest, so nothing else changes.

## Navigation Rules

Navigation must stay consistent across every route.

- The left sidebar can collapse.
- Collapsed/open state can be local at first, then Supabase later.
- Breadcrumbs should be clickable minimalist buttons.
- Main/sidebar/breadcrumb labels stay English-only.

## Lesson Generation from Planner PDFs

The lesson-building workflow is documented in six focused docs under `docs/`:

- `docs/build-order.md` — master per-unit pipeline (read this first)
- `docs/pdf-mapping.md` — `index.json`, `pdf_offset`, page math
- `docs/vocab.md` — scan + build + wire vocabulary
- `docs/grammar.md` — scan + build + wire grammar
- `docs/components.md` — locked Leo app structure per component type
- `docs/teacher-slides.md` — teacher slideshow conventions

NatGeo lesson planner PDFs live in `docs/lesson-plans/` organised by subject → course → level (or year). Each level folder holds:

```
docs/lesson-plans/
  english/
    our-world/
      level-4/
        planner.pdf       ← added by the user (Git LFS, ~70 MB)
        index.json        ← maps unit → component → PDF page range
        supporting/       ← audio scripts, worksheets, etc.
    joyful-work/
      year-1/ ...
    training-ground/ ...
```

PDFs are tracked with Git LFS via `.gitattributes` (`docs/lesson-plans/**/*.pdf`). The user must add PDFs locally via `git clone` + `git add` + `git push` — they cannot be uploaded through the web UI at 70 MB.

`index.json` format (page numbers are PDF page numbers, 1-indexed from the start of the file):

```json
{
  "course": "Our World",
  "level": 4,
  "pdf": "planner.pdf",
  "units": {
    "u8": {
      "theme": "That's Really Interesting!",
      "pdf_offset": 0,
      "sections": {
        "opener":    "1-2",
        "vocab-1":   "3-6",
        "song":      "7-8",
        "grammar-1": "9-12",
        "vocab-2":   "13-14",
        "grammar-2": "15-16",
        "reading":   "17-20",
        "writing":   "21-23"
      }
    }
  }
}
```

`pdf_offset` is 0 when the page numbers above are already relative to the full level PDF. If the unit was measured from an excerpt, set `pdf_offset = (unit start page in full PDF) - 1`.

To generate a lesson pair from the planner, run the `/generate-lesson` skill:

```
/generate-lesson english/our-world/level-4 u8 grammar-1
```

The skill reads the index, reads the correct PDF pages, extracts content, and generates both the teacher HTML and learner app HTML following all LEEA conventions. Full instructions are in `.claude/commands/generate-lesson.md`.

**Planner PDF availability:** Our World Levels 1-6 have `planner.pdf` files and supporting files checked in through Git LFS:

| Level | Planner path | Supporting path |
|---|---|---|
| 1 | `docs/lesson-plans/english/our-world/level-1/planner.pdf` | `docs/lesson-plans/english/our-world/level-1/supporting/` |
| 2 | `docs/lesson-plans/english/our-world/level-2/planner.pdf` | `docs/lesson-plans/english/our-world/level-2/supporting/` |
| 3 | `docs/lesson-plans/english/our-world/level-3/planner.pdf` | `docs/lesson-plans/english/our-world/level-3/supporting/` |
| 4 | `docs/lesson-plans/english/our-world/level-4/planner.pdf` | `docs/lesson-plans/english/our-world/level-4/supporting/` |
| 5 | `docs/lesson-plans/english/our-world/level-5/planner.pdf` | `docs/lesson-plans/english/our-world/level-5/supporting/` |
| 6 | `docs/lesson-plans/english/our-world/level-6/planner.pdf` | `docs/lesson-plans/english/our-world/level-6/supporting/` |

If a cloud session sees only a tiny pointer file instead of a real PDF, run:

```bash
git lfs pull
```

**Updating pdf_offset:** Some `index.json` files still have placeholder or excerpt-based page ranges. When building a lesson, verify the unit start page in the full `planner.pdf` and set `pdf_offset = (unit start page in full PDF) - 1` when section page numbers are unit-relative. The skill adds this offset to every section page number automatically.

## Source Tags

Use exact source tags so duplicate words can appear once in search but retain every source.

```text
OW4-U8-V1        Our World Level 4 Unit 8 Vocabulary 1
OW4-U8-G1        Our World Level 4 Unit 8 Grammar 1
OW4-U8-G2        Our World Level 4 Unit 8 Grammar 2
OW4-U8-OP        Our World Level 4 Unit 8 Opener
JF1-L1-U2-V1     Joyful Work Year 1 Lesson 1 Unit 2 Vocabulary 1
TG-PUNCT-COMMA   Training Ground punctuation comma lesson
```
