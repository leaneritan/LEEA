# Teacher Slide Decks — Agent Rules

Every teacher slide deck lives in THIS folder (`public/lessons/`). Do not create decks anywhere else (no `teach/`, no `slides/`, no nested folders).

## Required steps when adding a new deck

1. **HTML file here**: `public/lessons/ow-l<level>-u<unit>-<component>.html`
2. **Metadata JSON**: `content/subjects/english/courses/our-world/level-<level>/unit-<unit>/lessons/<component>.teacher.json`
3. **Register in lessons.ts**: import the JSON and add it to the array in `src/data/lessons.ts`
4. **Run the validator**: `npm run validate:content` — it will fail if step 2 or 3 is missing

Skip any step and the deck will not appear on the teacher dashboard.

## File naming

- Deck: `ow-l4-u8-opener.html` (course-level-unit-component)
- Metadata: `opener.teacher.json` (component.teacher.json)
- Learner apps go in `public/learn/`, not here

## teacher.json shape

```json
{
  "id": "ow-l4-u8-<component>",
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "component": "<component>",
  "mode": "teacher",
  "status": "draft",
  "title": "Unit 8 <Component> — <Title>",
  "subtitle": "v1 · <slide count> slides",
  "source": {
    "type": "html-slides",
    "file": "ow-l4-u8-<component>.html",
    "embedPath": "/lessons/ow-l4-u8-<component>.html",
    "slideCount": 19
  },
  "objectives": {
    "content": [],
    "language": []
  },
  "referenceLinks": []
}
```

## lessons.ts registration

```ts
import unit8Component from "../../content/subjects/english/courses/our-world/level-4/unit-8/lessons/<component>.teacher.json";

// Add to the lessons array:
unit8Component as Lesson,
```

## Deck HTML conventions

- Same shell as `ow-l4-u8-opener.html` (fonts, nav, Mark Done wiring)
- Outfit font (not Syne, not system)
- One `<script>` block
- Mark Done writes to `leea.lessonProgress.v1`
- Use `pickChart()` from `public/components/chart-picker.js` for charts, not direct builder calls
- See `docs/teacher-slides.md` for full slide content conventions per component type
