# Learner Apps — Agent Rules

Every learner app lives in THIS folder (`public/learn/`). Do not create learner apps anywhere else.

## Required steps when adding a new learner app

1. **HTML file here**: `public/learn/ow-l<level>-u<unit>-<component>.html`
2. **Metadata JSON**: `content/subjects/english/courses/our-world/level-<level>/unit-<unit>/lessons/<component>-app.learner.json`
3. **Register in lessons.ts**: import the JSON and add it to the array in `src/data/lessons.ts`
4. **Matching teacher lesson must exist**: learner component `opener-app` requires teacher component `opener` in the same level/unit
5. **Run the validator**: `npm run validate:content` — it will fail if any step is missing

## File naming

- App: `ow-l4-u8-vocab-1.html` (course-level-unit-component)
- Metadata: `vocab1.learner.json` (component-app.learner.json)
- Teacher decks go in `public/lessons/`, not here

## learner.json shape

```json
{
  "id": "ow-l4-u8-<component>-app",
  "subject": "english",
  "course": "our-world",
  "level": 4,
  "unit": 8,
  "component": "<component>-app",
  "mode": "learner",
  "status": "live",
  "title": "Unit 8 <Component>",
  "subtitle": "",
  "source": {
    "type": "html-app",
    "file": "ow-l4-u8-<component>.html",
    "embedPath": "/learn/ow-l4-u8-<component>.html",
    "storagePrefix": "leea-4-8-<component>-",
    "moduleCount": 4,
    "moduleLabels": ["Tab 1", "Tab 2", "Tab 3", "Tab 4"],
    "homeworkId": "leo-4-8-<component>"
  },
  "objectives": {
    "content": [],
    "language": []
  },
  "referenceLinks": []
}
```

## Save/restore contract

- Auto-save done-key when module finishes (don't rely on a button)
- Persist quiz scores to localStorage
- Restore result view on reopen — never restart a completed module from zero
- Redo clears saved state before re-initializing

See `AGENTS.md` (root) for the full save/restore contract with code examples.
