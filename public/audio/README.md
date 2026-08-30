# Assessment audio

The ExamView listening tracks for the test Leo takes after each unit. This
folder holds the audio itself; what each track *is* — its number, title and
which unit or review band it belongs to — lives in the level's manifest:

```
content/subjects/english/courses/our-world/level-4/assessment-audio.json
```

The manifest is the source of truth. Nothing here is discovered by scanning
the folder, so a file that is not in the manifest is not played, and a
manifest entry whose file has not been added yet shows as "Not added yet"
on the unit page rather than a dead player. That check happens at build time
(`scripts/generate-assessment-audio-map.mjs`), so after adding audio you need a
rebuild — `npm run dev` and `npm run build` both regenerate it.

## Layout

```
public/audio/our-world/level-4/
  ow2e_ev4_ame_0.0_0.mp3      ← copyright notice, level-wide, not shown to Leo
  unit-1/                      ← 1.1, 1.2
  unit-2/                      ← 2.1, 2.2
  unit-3/                      ← 3.1, 3.2, 3.3, 3.4
  unit-4/ … unit-5/
  unit-6/                      ← 6.1, 6.2, 6.3, 6.4
  unit-7/ … unit-8/
  unit-9/                      ← 9.1, 9.2, 9.3, 9.4, 9.4a, 9.5
```

**The number before the dot is the unit, and that alone decides the folder.**
Review tracks are no exception: 9.3 reviews Units 7–9 but still lives in
`unit-9/`, because that is how the publisher numbers it and where Leo would
look for it.

Files keep the publisher's names (`ow2e_ev<level>_ame_<track>_0.mp3`) so a
track can always be traced back to the disc it came from. The folder supplies
the organisation; the filename supplies the provenance.

## Why some units have more tracks

A band-closing unit ships **two tests**, so it has more tracks than the rest:
the unit's own test, plus the review covering the band. Unit 3 has 3.1/3.2 for
itself and 3.3/3.4 for the Units 1–3 review; Unit 6 the same; Unit 9 carries
9.1/9.2 for itself, 9.3/9.4/9.4a for the Units 7–9 review, and 9.5 for the
whole-level review.

Nothing in the filename says which is which — only the publisher's title does.
That is why the manifest records a `kind` (`unit` or `checkpoint`) and, for a
review, the band it covers. Those fields **label the row** on the unit page so
the two tests read as different things; they never move the file.

## Adding a disc

Copy the `.mp3` files somewhere local, then:

```bash
npm run audio:assessment -- --from ~/Downloads/ExamViewAudio
```

The script reads the manifest, copies each track to the path the manifest
gives it, and reports anything missing from the disc or unexpected in it. It
is safe to re-run — files already in place are left alone. Add `--dry-run` to
see the plan without touching anything, or `--check` to ask what is currently
in place.

For a level that has no manifest yet:

```bash
npm run audio:assessment -- --scaffold --level 5 --from ~/Downloads/L5Audio
```

That drafts a manifest from the filenames using the Level 4 numbering rules.
**Read the draft before committing it** — the rules were derived from Level 4
and another level may not follow them.

## Size

These are committed as ordinary files, not Git LFS (LFS uploads are blocked
from cloud sessions). Keep each track under 25MB. A test track encoded at
64 kbps mono runs about 0.5MB per minute, which is plenty for spoken audio —
re-encode before committing if the disc ships something much heavier. If the
library ever grows past a couple of levels, move the files to Supabase Storage
and point `basePath` at the bucket; nothing else has to change, because every
player reads its URL from the manifest.
