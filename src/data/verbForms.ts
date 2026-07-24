/**
 * verbForms.ts — derives infinitive / past / past participle for verb
 * WordEntry items. Forms are computed (regular suffix rules + a small
 * irregular-verb lookup), not stored in the content JSON — hand-authoring
 * three extra fields per verb across every unit isn't practical, and these
 * rules cover the vast majority of elementary-level vocabulary correctly.
 */

export type VerbForms = {
  infinitive: string;
  past: string;
  pastParticiple: string;
};

/* Common irregular verbs likely to appear in elementary ESL vocabulary.
   Extend this table as irregulars are found wrong via regular rules. */
const IRREGULAR_VERBS: Record<string, [string, string]> = {
  be: ["was/were", "been"],
  begin: ["began", "begun"],
  bend: ["bent", "bent"],
  break: ["broke", "broken"],
  bring: ["brought", "brought"],
  build: ["built", "built"],
  buy: ["bought", "bought"],
  catch: ["caught", "caught"],
  choose: ["chose", "chosen"],
  come: ["came", "come"],
  cut: ["cut", "cut"],
  do: ["did", "done"],
  draw: ["drew", "drawn"],
  drink: ["drank", "drunk"],
  drive: ["drove", "driven"],
  eat: ["ate", "eaten"],
  fall: ["fell", "fallen"],
  feel: ["felt", "felt"],
  feed: ["fed", "fed"],
  find: ["found", "found"],
  fly: ["flew", "flown"],
  forget: ["forgot", "forgotten"],
  get: ["got", "gotten"],
  give: ["gave", "given"],
  go: ["went", "gone"],
  grow: ["grew", "grown"],
  have: ["had", "had"],
  hear: ["heard", "heard"],
  hide: ["hid", "hidden"],
  hold: ["held", "held"],
  keep: ["kept", "kept"],
  know: ["knew", "known"],
  leave: ["left", "left"],
  lose: ["lost", "lost"],
  make: ["made", "made"],
  meet: ["met", "met"],
  pay: ["paid", "paid"],
  pedal: ["pedaled", "pedaled"],
  put: ["put", "put"],
  read: ["read", "read"],
  ride: ["rode", "ridden"],
  rise: ["rose", "risen"],
  run: ["ran", "run"],
  say: ["said", "said"],
  see: ["saw", "seen"],
  sell: ["sold", "sold"],
  send: ["sent", "sent"],
  sing: ["sang", "sung"],
  sit: ["sat", "sat"],
  sleep: ["slept", "slept"],
  speak: ["spoke", "spoken"],
  spend: ["spent", "spent"],
  spin: ["spun", "spun"],
  stand: ["stood", "stood"],
  swim: ["swam", "swum"],
  take: ["took", "taken"],
  teach: ["taught", "taught"],
  tell: ["told", "told"],
  think: ["thought", "thought"],
  throw: ["threw", "thrown"],
  travel: ["traveled", "traveled"],
  understand: ["understood", "understood"],
  wake: ["woke", "woken"],
  wear: ["wore", "worn"],
  win: ["won", "won"],
  write: ["wrote", "written"],
  visit: ["visited", "visited"]
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function conjugateRegularPast(verb: string): string {
  if (verb.endsWith("e")) return `${verb}d`;

  if (verb.endsWith("y") && verb.length > 1 && !VOWELS.has(verb[verb.length - 2])) {
    return `${verb.slice(0, -1)}ied`;
  }

  if (
    verb.length >= 3 &&
    !VOWELS.has(verb[verb.length - 1]) &&
    VOWELS.has(verb[verb.length - 2]) &&
    !VOWELS.has(verb[verb.length - 3]) &&
    !["w", "x", "y"].includes(verb[verb.length - 1])
  ) {
    return `${verb}${verb[verb.length - 1]}ed`;
  }

  return `${verb}ed`;
}

/* Multi-word verbs (phrasal verbs like "fall over", verb phrases like "take
   photos") only conjugate their first word — "fall over" -> "fell over",
   not "fall overred". Without this, an irregular phrasal verb's head word
   never hits IRREGULAR_VERBS (the full phrase isn't a lookup key) and falls
   through to the regular suffix rule, producing a nonsense past form. */
export function getVerbForms(word: string): VerbForms {
  const infinitive = word.trim();
  const [head, ...rest] = infinitive.toLowerCase().split(/\s+/);
  const suffix = rest.length > 0 ? ` ${rest.join(" ")}` : "";

  const irregular = IRREGULAR_VERBS[head];
  if (irregular) {
    return {
      infinitive,
      past: `${irregular[0]}${suffix}`,
      pastParticiple: `${irregular[1]}${suffix}`
    };
  }

  const past = `${conjugateRegularPast(head)}${suffix}`;
  return { infinitive, past, pastParticiple: past };
}
