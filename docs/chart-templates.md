# Chart and Graphic Organizer Templates

These National Geographic graphic organizers should become reusable LEEA chart templates.

## Implemented Templates

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
- sunshine organizer
- word web

Story / sequence templates:

- storyboard

Compare / classify templates:

- T-chart
- two-column chart
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
2. two-column chart
3. three-column chart
4. word web
5. KWL chart
6. flow chart
7. timeline
8. Venn diagram 2 circles
9. vocabulary log
10. matrix

Then add the more specialized templates.
