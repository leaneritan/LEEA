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
  unit-1/                      ← tracks 1.1, 1.2 — the Unit 1 test
  unit-2/                      ← tracks 2.1, 2.2
  unit-3/                      ← tracks 3.1, 3.2
  checkpoint-1-3/              ← tracks 3.3, 3.4 — the Units 1–3 review
  unit-4/ … unit-6/
  checkpoint-4-6/              ← tracks 6.3, 6.4
  unit-7/ … unit-9/
  checkpoint-7-9/              ← tracks 9.3, 9.4, 9.4a
  checkpoint-1-9/              ← track 9.5 — the whole-level review
```

Files keep the publisher's names (`ow2e_ev<level>_ame_<track>_0.mp3`) so a
track can always be traced back to the disc it came from. The folder supplies
the organisation; the filename supplies the provenance.

## Why review tracks sit in `checkpoint-N-M`

ExamView numbers a review under the band's **last** unit — the Units 1–3
review is tracks 3.3 and 3.4, not 1.x. LEEA already does the same thing for
checkpoint lessons, which carry the band's last unit number so the teacher
menu can find them (see `CHECKPOINT_COMPONENTS` in `src/data/lessons.ts`).
Filing the review tracks under `checkpoint-1-3/` rather than `unit-3/` keeps
the two conventions in step: Unit 3's page shows the Unit 3 test *and* the
1–3 review, clearly labelled as different things.

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
