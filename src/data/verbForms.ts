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
  beat: ["beat", "beaten"],
  become: ["became", "become"],
  begin: ["began", "begun"],
  bend: ["bent", "bent"],
  bite: ["bit", "bitten"],
  bleed: ["bled", "bled"],
  blow: ["blew", "blown"],
  break: ["broke", "broken"],
  bring: ["brought", "brought"],
  build: ["built", "built"],
  buy: ["bought", "bought"],
  catch: ["caught", "caught"],
  choose: ["chose", "chosen"],
  come: ["came", "come"],
  cost: ["cost", "cost"],
  cut: ["cut", "cut"],
  dig: ["dug", "dug"],
  do: ["did", "done"],
  draw: ["drew", "drawn"],
  drink: ["drank", "drunk"],
  drive: ["drove", "driven"],
  eat: ["ate", "eaten"],
  fall: ["fell", "fallen"],
  feel: ["felt", "felt"],
  feed: ["fed", "fed"],
  fight: ["fought", "fought"],
  find: ["found", "found"],
  fly: ["flew", "flown"],
  forget: ["forgot", "forgotten"],
  forgive: ["forgave", "forgiven"],
  freeze: ["froze", "frozen"],
  get: ["got", "gotten"],
  give: ["gave", "given"],
  go: ["went", "gone"],
  grow: ["grew", "grown"],
  hang: ["hung", "hung"],
  have: ["had", "had"],
  hear: ["heard", "heard"],
  hide: ["hid", "hidden"],
  hit: ["hit", "hit"],
  hold: ["held", "held"],
  hurt: ["hurt", "hurt"],
  keep: ["kept", "kept"],
  know: ["knew", "known"],
  leave: ["left", "left"],
  lend: ["lent", "lent"],
  let: ["let", "let"],
  lie: ["lay", "lain"],
  light: ["lit", "lit"],
  lose: ["lost", "lost"],
  make: ["made", "made"],
  meet: ["met", "met"],
  pay: ["paid", "paid"],
  pedal: ["pedaled", "pedaled"],
  put: ["put", "put"],
  read: ["read", "read"],
  ride: ["rode", "ridden"],
  ring: ["rang", "rung"],
  rise: ["rose", "risen"],
  run: ["ran", "run"],
  say: ["said", "said"],
  see: ["saw", "seen"],
  sell: ["sold", "sold"],
  send: ["sent", "sent"],
  set: ["set", "set"],
  sew: ["sewed", "sewn"],
  shake: ["shook", "shaken"],
  shine: ["shone", "shone"],
  show: ["showed", "shown"],
  shut: ["shut", "shut"],
  sing: ["sang", "sung"],
  sink: ["sank", "sunk"],
  sit: ["sat", "sat"],
  sleep: ["slept", "slept"],
  slide: ["slid", "slid"],
  speak: ["spoke", "spoken"],
  spend: ["spent", "spent"],
  spin: ["spun", "spun"],
  stand: ["stood", "stood"],
  steal: ["stole", "stolen"],
  stick: ["stuck", "stuck"],
  sting: ["stung", "stung"],
  stink: ["stank", "stunk"],
  sweep: ["swept", "swept"],
  swim: ["swam", "swum"],
  swing: ["swung", "swung"],
  take: ["took", "taken"],
  teach: ["taught", "taught"],
  tear: ["tore", "torn"],
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
