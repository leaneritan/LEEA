/**
 * test-engine.js — the one engine every LEEA digital test runs on.
 *
 * A test used to be a single self-contained HTML file, and the third one made
 * that untenable: ~950 of each file's ~1,250 lines were this engine, copied
 * verbatim, and a fix had to be applied to every copy or they drifted. The
 * tests are all the same activities — word boxes, matches, multiple choice,
 * true/false, typed sentences, listening, writing, speaking — so the engine is
 * shared and each test is just its questions.
 *
 * A test page is a shell. It says where its data is and loads this file:
 *
 *   <script>window.LEEA_TEST = '/tests/our-world/level-4/u9/questions.json';</script>
 *   <script src="/components/test-engine.js"></script>
 *
 * Everything else — the styles, the frame, the pages, the clock, the marking,
 * the attempt record — is here. `docs/tests.md` documents the data format and
 * `scripts/validate-content.mjs` checks every test file against it.
 *
 * Deliberately NOT wrapped in an IIFE: the generated markup uses inline
 * handlers (onclick="goTo(3)"), so these have to be real globals, exactly as
 * they were when this lived inside the page.
 */

var TEST_CSS = `
/* ═══════════════════════════════════════════════════════════════════════
   This is a TEST, so it is built to look like the printed test page, not
   like the LEEA practice apps: the publisher's own instructions, wording
   and numbering, blanks and ruled lines instead of app buttons.

   One page per screen. Finish a page, tap Next — the way the paper test
   is actually taken, and the reason the layout can be a fixed split: the
   picture or the reading holds the top of the screen and the questions
   scroll in what is left, so neither can ever hide the other.
   ═══════════════════════════════════════════════════════════════════════ */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#111111;      /* printed text        */
  --ink2:#3F3F46;
  --ink3:#71717A;     /* instructions, meta  */
  --rule:#A1A1AA;     /* answer lines        */
  --hair:#D4D4D8;
  --pencil:#1D4ED8;   /* what Leo writes in  */
  --pencil-bg:#EFF6FF;
  --paper:#FDFCFA;    /* warm off-white — plain white glares */
  --card:#FFFFFF;     /* reference material stays bright so it stands out */
  --stripe:#F8F7F3;   /* every other question row — just enough to follow */
  --fn:Arial,'Helvetica Neue',Helvetica,'Segoe UI',sans-serif;
}
html,body{height:100%}
html{-webkit-text-size-adjust:100%}
body{font-family:var(--fn);background:var(--paper);color:var(--ink);font-size:16px;
     line-height:1.65;overflow:hidden}

/* ── frame ─────────────────────────────────────────────────────────── */
.app{height:100%;display:flex;flex-direction:column;max-width:1240px;margin:0 auto;
     background:var(--paper)}
/* The right end of this row is left empty on purpose: the page that embeds the
   test floats its own "Exit Fullscreen" button over that corner, and anything
   put there is covered by it and cannot be tapped. */
.bar{flex:0 0 auto;border-bottom:1px solid var(--hair);padding:7px 176px 0 14px}
.bar-row{display:flex;align-items:center;font-size:.78rem;
         font-weight:700;color:var(--ink3);padding-bottom:6px}
.bar-row b{color:var(--ink)}
.saved{color:#15803D;opacity:0;transition:opacity .3s}
.saved.on{opacity:1}
.bar-left{display:flex;align-items:center;gap:10px;min-width:0;flex-wrap:wrap}
.bar-left>b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* The host's Exit Fullscreen button already eats the right end of this row, so
   on a phone the title drops its course prefix rather than wrapping the clock
   onto a second line and spending height the questions need. */
@media(max-width:620px){.bar-course{display:none}.bar{padding-right:150px}
  .bar-prog{margin-right:-150px}}
.clock{font-family:var(--fn);font-size:.82rem;font-weight:700;color:var(--ink);background:none;
       border:1.5px solid var(--hair);border-radius:3px;padding:3px 9px;cursor:pointer;
       font-variant-numeric:tabular-nums;white-space:nowrap}
.clock.paused{color:var(--ink3);border-style:dashed}
.clock.over{color:#B91C1C;border-color:#B91C1C}
/* Stopped, because the result is open — a record of the sitting, not a timer. */
.clock.done{color:var(--ink3);border-style:solid;cursor:default}
.bar-prog{height:3px;background:#F4F4F5;margin:0 -176px 0 -14px}
.bar-prog i{display:block;height:100%;background:var(--ink);width:0;transition:width .35s}

.stage{flex:1 1 auto;min-height:0;display:flex;flex-direction:column}

/* ── one page ──────────────────────────────────────────────────────── */
.page{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;padding:13px 16px 0}
.phd{flex:0 0 auto;padding-bottom:8px}
.instr{font-size:.98rem;font-weight:700}
.instr .tr{float:right;font-weight:700;color:var(--ink3);font-size:.84rem;letter-spacing:.5px}
.sub{font-size:.81rem;color:var(--ink3);margin-top:2px}

.split{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:10px}
/* Reference material: fixed, never scrolls away, never overlaps a question. */
.ref{flex:0 0 auto;max-height:52%;min-height:0;display:flex;flex-direction:column;gap:7px}
.ref.pic{max-height:58%}
.qcol{flex:1 1 auto;min-height:0;overflow-y:auto;-webkit-overflow-scrolling:touch;
      padding-bottom:14px}
/* A question column on its own keeps a readable measure however wide the screen. */
.split.solo .qcol{width:100%;max-width:820px;margin:0 auto}
@media(min-width:900px) and (min-height:520px){
  .split{flex-direction:row;gap:26px}
  .ref{flex:0 0 46%;max-height:none}
  /* A picture is wide and short — it can only grow sideways, so it takes the
     larger share. A reading grows down and does not need it. */
  .ref.pic{flex:0 0 58%;max-height:none}
}

/* The picture sits in a box that takes the free space; the <img> itself is
   sized by the picture, so the border hugs it and there is no empty frame. */
/* Takes only the height the picture needs (and shrinks when the pane is short),
   so the zoom link and the track stay tucked under it instead of being pushed
   to the far end of a tall pane. */
.pic-box{flex:0 1 auto;min-height:0;display:flex;align-items:flex-start;justify-content:center}
.pic-box img{max-width:100%;max-height:100%;width:auto;height:auto;background:var(--card);
             border:1px solid var(--hair);cursor:zoom-in}
/* Two pictures compared side by side share the row and the height. */
.pic-box.many{gap:8px}
.pic-box.many img{max-width:calc(50% - 4px)}
.ref-table{flex:0 0 auto;width:100%;border-collapse:collapse;background:var(--card);
           border:1px solid var(--ink);font-size:.86rem}
.ref-table th,.ref-table td{border:1px solid var(--hair);padding:5px 8px;text-align:left}
.ref-table th{font-weight:700;background:var(--stripe)}
.ref-table td:first-child{font-weight:600}
.ref audio{flex:0 0 auto;width:100%;height:34px}
.zoom{flex:0 0 auto;font-size:.76rem;color:var(--pencil);background:none;border:none;
      font-family:var(--fn);font-weight:700;cursor:pointer;padding:0;text-align:left}
.passage{flex:1 1 auto;min-height:0;overflow-y:auto;border:1px solid var(--hair);padding:11px 13px;background:var(--card)}
.passage h4{font-size:.96rem;font-weight:700;text-align:center;margin-bottom:7px}
.passage p{font-size:.9rem;line-height:1.7;margin-bottom:8px;text-align:justify}
.passage p:last-child{margin-bottom:0}

/* ── word box, as it is printed ────────────────────────────────────── */
.box{flex:0 0 auto;border:1px solid var(--ink);padding:8px 11px;background:var(--card);
     display:flex;flex-wrap:wrap;gap:5px 24px;justify-content:center;font-size:.9rem;font-weight:700}
.qcol > .box{margin-bottom:10px}
.box span.used{text-decoration:line-through;text-decoration-thickness:2px;
               color:var(--ink3);opacity:.5}
.example{font-size:.88rem;font-style:italic;color:var(--ink2);margin-bottom:4px}
/* A writing part with one prompt states it instead of offering a choice. */
.wprompt{margin-bottom:9px;line-height:1.7}

/* ── one question ─────────────────────────────────────────────────── */
/* Ledger stripes: easier on the eyes than a white field, and they keep each
   blank visibly tied to its own question. */
.item{display:flex;gap:8px;align-items:flex-start;padding:9px 10px;border-bottom:1px dotted #E4E4E7}
.item:nth-child(odd){background:var(--stripe)}
.num{font-weight:700;min-width:26px;flex-shrink:0;text-align:right}
.ilabel{font-weight:700;min-width:24px;flex-shrink:0}
.body{flex:1;min-width:0;font-size:.95rem;line-height:1.85;font-weight:600;color:var(--ink)}
.blank{flex-shrink:0;min-width:46px;height:26px;border-bottom:1.5px solid var(--rule);
       text-align:center;font-weight:700;color:var(--pencil);font-size:.92rem;line-height:26px}
.blank.filled{border-bottom-color:var(--pencil)}
.inl{font-family:var(--fn);font-size:.95rem;font-weight:700;color:var(--pencil);
     background:transparent;border:none;border-bottom:1.5px solid var(--rule);border-radius:0;
     padding:1px 2px;min-width:112px;max-width:100%;-webkit-appearance:none;appearance:none;cursor:pointer}
.inl:focus{outline:none;border-bottom-color:var(--pencil);background:var(--pencil-bg)}
.inl.filled{border-bottom-color:var(--pencil)}
.inl.short{min-width:56px;text-align:center}
.opts{display:grid;grid-template-rows:repeat(2,auto);grid-auto-flow:column;gap:2px 18px;margin-top:5px}
.opts.two{grid-template-rows:auto}
.opt{text-align:left;background:none;border:1px solid transparent;border-radius:3px;
     font-family:var(--fn);font-size:.93rem;color:var(--ink);cursor:pointer;padding:4px 7px}
.opt:hover{background:#FAFAFA;border-color:var(--hair)}
.opt .k{font-weight:700;margin-right:7px}
.opt.picked{background:var(--pencil-bg);border-color:var(--pencil);color:var(--pencil);font-weight:700}
.lines{width:100%;font-family:var(--fn);font-size:.95rem;color:var(--pencil);font-weight:700;
       border:none;border-radius:0;background-image:repeating-linear-gradient(
         transparent,transparent 31px,var(--rule) 31px,var(--rule) 32px);
       line-height:32px;padding:0;resize:none;overflow:hidden}
.lines:focus{outline:none}

/* ── speaking ─────────────────────────────────────────────────────── */
/* ── marking, shown only after the result is opened ─────────────────── */
.mk{flex-shrink:0;min-width:22px;text-align:center;font-weight:700;font-size:1rem;line-height:1.6}
.mk.right{color:#15803D}
.mk.wrong{color:#B91C1C}
.mk.partial{color:#B45309;font-size:.8rem}
.mk.pending{color:var(--ink3);font-size:.72rem;font-weight:700}
.fix{font-size:.84rem;font-weight:700;color:#15803D;margin-top:5px}
.fix b{font-weight:700}
.item.wrong{background:#FEF5F5}
.item.wrong:nth-child(odd){background:#FDEFEF}
.locked-note{font-size:.8rem;color:var(--ink3);margin-top:12px;padding-top:10px;
             border-top:1px solid var(--hair)}

/* ── the review list under the score ────────────────────────────────── */
.rev{border:1px solid var(--hair);border-left:3px solid #B91C1C;background:var(--card);
     padding:11px 13px;margin-top:10px}
.rev-n{font-size:.75rem;font-weight:700;color:var(--ink3);letter-spacing:.04em;margin-bottom:3px}
.rev-q{font-size:.92rem;font-weight:700;line-height:1.5;margin-bottom:7px}
.rev-line{font-size:.88rem;line-height:1.65}
.rev-line span{display:inline-block;min-width:74px;color:var(--ink3);font-weight:700}
.rev-his{color:#B91C1C;font-weight:700}
.rev-key{color:#15803D;font-weight:700}
.rev-all{background:none;border:none;color:var(--pencil);font-family:var(--fn);font-size:.83rem;
         font-weight:700;cursor:pointer;text-decoration:underline;padding:10px 0 0}
.rev.ok{border-left-color:#15803D}
.rev.open{border-left-color:#B45309}
.rev-note{font-size:.79rem;color:var(--ink3);font-weight:700;margin-top:5px}
.retake{background:none;border:1px solid var(--hair);color:var(--ink3);font-family:var(--fn);
        font-size:.8rem;font-weight:700;padding:8px 14px;cursor:pointer;margin-top:18px}
#retake-sheet{display:block;width:100%;margin-top:0;text-align:center}

.dad-note{border-left:3px solid var(--ink);padding:5px 0 5px 11px;font-size:.85rem;
          color:var(--ink2);margin-bottom:9px}
.sp-show{background:var(--paper);border:1px solid var(--ink);padding:9px 14px;font-family:var(--fn);
         font-size:.87rem;font-weight:700;cursor:pointer;width:100%}
.sp{display:flex;gap:10px;align-items:flex-start;padding:9px 10px;border-bottom:1px dotted #E4E4E7}
.sp:nth-child(odd){background:var(--stripe)}
.sp-tick{width:26px;height:26px;flex-shrink:0;border:1.5px solid var(--rule);background:var(--paper);
         cursor:pointer;font-size:.9rem;line-height:1;color:var(--pencil);font-weight:700}
.sp.ok .sp-tick{border-color:var(--pencil);background:var(--pencil-bg)}
.sp-q{font-size:.92rem;line-height:1.6;font-weight:600}
.sp-a{font-size:.81rem;color:var(--ink3);margin-top:3px}

/* ── page foot ────────────────────────────────────────────────────── */
.pfoot{margin-top:14px;padding-top:10px;border-top:1px solid var(--hair);
       display:flex;align-items:center;gap:12px}
.clear-btn{background:none;border:1.5px solid transparent;color:var(--ink3);font-family:var(--fn);
           font-size:.79rem;font-weight:700;cursor:pointer;padding:6px 2px;text-decoration:underline}
.clear-btn.armed,.retake.armed{color:#B91C1C;border-color:#B91C1C;background:#FEF2F2;
           text-decoration:none;border-radius:4px;padding:6px 12px}

/* ── bottom navigation ────────────────────────────────────────────── */
.nav{flex:0 0 auto;border-top:1px solid var(--hair);background:var(--paper);
     display:flex;align-items:center;gap:8px;padding:9px 12px}
.nv{background:var(--paper);border:1.5px solid var(--ink);color:var(--ink);font-family:var(--fn);
    font-size:.85rem;font-weight:700;padding:10px 16px;cursor:pointer;white-space:nowrap}
.nv:disabled{border-color:var(--hair);color:#A1A1AA;cursor:not-allowed}
.nv.go{background:var(--ink);color:var(--paper)}
.pager{flex:1;background:none;border:none;font-family:var(--fn);font-size:.82rem;font-weight:700;
       color:var(--ink2);cursor:pointer;text-align:center;line-height:1.35;padding:2px}
.pager small{display:block;font-size:.72rem;font-weight:700;color:var(--ink3)}
.pager small.warn{color:#B45309}

/* ── page index ───────────────────────────────────────────────────── */
.sheet{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:70;display:none}
.sheet.open{display:block}
.sheet-in{position:absolute;inset:auto 0 0 0;max-height:82%;background:var(--paper);
          max-width:760px;margin:0 auto;padding:16px 16px 22px;
          display:flex;flex-direction:column}
#sheet-list{flex:1 1 auto;min-height:0;overflow-y:auto}
.sheet-foot{flex:0 0 auto;border-top:1px solid var(--hair);margin-top:10px;padding-top:12px}
.sheet-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.sheet-h h3{font-size:.98rem;font-weight:700}
.sheet-x{background:none;border:none;font-size:1.15rem;cursor:pointer;color:var(--ink3);padding:2px 6px}
.prow{display:flex;align-items:center;gap:10px;width:100%;background:none;border:none;
      border-bottom:1px solid var(--hair);padding:10px 2px;font-family:var(--fn);
      font-size:.88rem;color:var(--ink);cursor:pointer;text-align:left}
.prow:hover{background:#FAFAFA}
.prow.now{font-weight:700}
.prow .pn{min-width:22px;color:var(--ink3);font-weight:700}
.prow .pname{flex:1}
.prow .pst{font-size:.77rem;font-weight:700;color:#15803D;white-space:nowrap}
.prow .pst.blank{color:#B45309}
.prow .pst.none{color:var(--ink3)}
.prow[disabled]{opacity:.45;cursor:not-allowed}

/* ── answer section ───────────────────────────────────────────────── */
.answers{flex:1 1 auto;min-height:0;overflow-y:auto;padding:16px 16px 24px}
.answers h3{font-size:1.02rem;font-weight:700;border-bottom:2px solid var(--ink);padding-bottom:7px}
.locked{font-size:.88rem;color:var(--ink2);padding:14px 0;line-height:1.7}
.total{display:flex;align-items:baseline;gap:10px;margin:16px 0 4px}
.total b{font-size:2.5rem;font-weight:700;line-height:1}
.total span{font-size:.92rem;color:var(--ink2)}
.pend{font-size:.85rem;color:var(--ink2);border-left:3px solid var(--ink);padding:5px 0 5px 11px;margin:10px 0}
.taken{font-size:.85rem;color:var(--ink2);margin:10px 0}
.sec-h{font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
       color:var(--ink3);margin:22px 0 4px}
.brk{width:100%;border-collapse:collapse;margin-top:10px;font-size:.88rem}
.brk td{padding:6px 4px;border-bottom:1px solid var(--hair)}
.brk td:last-child{text-align:right;font-weight:700;white-space:nowrap}
.brk tr.open td:last-child{color:var(--pencil)}
.mark{border:1px solid var(--hair);padding:11px 13px;margin-top:11px}
.mark-h{font-size:.81rem;font-weight:700;color:var(--ink3);margin-bottom:6px}
.mark-said{font-size:.9rem;line-height:1.65;white-space:pre-wrap;border-left:2px solid var(--hair);
           padding-left:10px;margin-bottom:7px}
.mark-key{font-size:.82rem;color:var(--ink2);margin-bottom:8px;line-height:1.55}
.steps{display:flex;gap:5px;flex-wrap:wrap}
.step{background:var(--paper);border:1px solid var(--rule);font-family:var(--fn);font-size:.85rem;
      font-weight:700;padding:5px 12px;cursor:pointer;color:var(--ink2)}
.step.on{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.step.ghost{border-style:dashed;color:var(--ink3);font-size:.78rem}
.step.ghost:hover{color:var(--ink)}
.mark.is-open{border-left:3px solid var(--pencil)}
.mark-by{float:right;font-weight:400;font-style:italic;text-transform:none;letter-spacing:0}
.brk-wait{font-size:.76rem;color:var(--pencil);font-weight:700;white-space:nowrap}

/* ── zoom ─────────────────────────────────────────────────────────── */
.lb{position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:90;display:none;
    align-items:center;justify-content:center;padding:8px;cursor:zoom-out}
.lb.open{display:flex}
.lb img{max-width:100%;max-height:94vh;object-fit:contain}
`;

var TEST_CHROME = `
<div class="app">
  <div class="bar">
    <div class="bar-row">
      <span class="bar-left"><b><span class="bar-course">{{COURSE}} · </span>{{TITLE}}</b>
        <button class="clock" id="clock" onclick="toggleClock()"></button>
        <span class="saved" id="saved">saved ✓</span></span>
    </div>
    <div class="bar-prog"><i id="progFill"></i></div>
  </div>

  <div class="stage" id="stage"></div>

  <div class="nav">
    <button class="nv" id="prev" onclick="goRel(-1)">← Back</button>
    <button class="pager" id="pager" onclick="openIndex()"></button>
    <button class="nv go" id="next" onclick="goRel(1)">Next →</button>
  </div>
</div>

<div class="sheet" id="sheet" onclick="if(event.target===this)closeIndex()">
  <div class="sheet-in">
    <div class="sheet-h"><h3>Pages</h3><button class="sheet-x" onclick="closeIndex()">✕</button></div>
    <div id="sheet-list"></div>
    <div class="sheet-foot">
      <button class="retake" id="retake-sheet" onclick="retake('retake-sheet')">Take the test again</button>
    </div>
  </div>
</div>

<div class="lb" id="lb" onclick="closeLb()"><img id="lb-img" alt=""></div>
`;

/* ═══════════════════════════════════════════════════════════════════════
   THE ENGINE — generic. Nothing in this file knows which test it is running.
   One page per section, plus a final Answer Section page.
   ═══════════════════════════════════════════════════════════════════════ */
var TEST;                       /* the test's own data, loaded by boot() */
var SP;                         /* its localStorage prefix                */
var HW_ID;                      /* its cloud namespace                    */
var PARTS;
var MC;
var ANSWERS_PAGE;               /* the page after the last section */
var page = 0;
/* Marks stay hidden until he has finished every page and opened the result.
   Before that the test shows him nothing about right or wrong. */
var revealed = false;

function lSave(k,v){try{localStorage.setItem(SP+k,JSON.stringify(v));}catch(e){}}
function lLoad(k,fb){try{var v=localStorage.getItem(SP+k);return v!==null?JSON.parse(v):(fb===undefined?null:fb);}catch(e){return fb===undefined?null:fb;}}
function lDrop(k){try{localStorage.removeItem(SP+k);}catch(e){}}
/**
 * Drop several keys as one operation.
 *
 * Clearing a page or retaking the test wipes a dozen to thirty keys. Each
 * removeItem is mirrored to the cloud on its own, and those writes are all
 * read-modify-writes of the same row — so they put each other's deletions back
 * and the cleared answers (and the old clock) returned on the next sync.
 * `clearProgress` is the app frame's one-shot version; standalone, there is no
 * bridge and the plain removes are all there is to do.
 */
function lDropAll(keys,extraFullKeys,wholeSitting){
  var full=[];
  for(var i=0;i<keys.length;i++)full.push(SP+keys[i]);
  if(extraFullKeys)for(var e=0;e<extraFullKeys.length;e++)full.push(extraFullKeys[e]);
  try{
    if(window.LEEA_CLOUD && window.LEEA_CLOUD.clearProgress){
      window.LEEA_CLOUD.clearProgress(full,wholeSitting);return;
    }
  }catch(e){}
  for(var j=0;j<full.length;j++){try{localStorage.removeItem(full[j]);}catch(e){}}
}

/**
 * The keys a sitting owns that are NOT under this test's prefix.
 *
 * `saveScore` writes the homework flags straight to `<homeworkId>-score` and
 * `-done`, and the cloud bridge mirrors every write to a `leea-` spelling —
 * `leea-<homeworkId>-done` being the one the app reads as "this homework is
 * finished". A retake used to wipe only the prefix, so the done flag stood and
 * the test still read as finished afterwards, on every surface. That only
 * showed up where Supabase is configured, because the mirrored spelling is
 * written by the parent and the parent does nothing without it.
 */
function homeworkKeys(){
  return [HW_ID+'-done', HW_ID+'-score', 'leea-'+HW_ID+'-done', 'leea-'+HW_ID+'-score'];
}

function saveScore(score,total,done,extra){
  var data={score:score,total:total,pct:total?Math.round(score/total*100):0,done:done,timestamp:new Date().toISOString()};
  if(extra)for(var x in extra)data[x]=extra[x];
  lSave('score',data);
  try{
    localStorage.setItem(HW_ID+'-score',JSON.stringify(data));
    if(done)localStorage.setItem(HW_ID+'-done',JSON.stringify(true));
  }catch(e){}
}

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function partById(id){for(var i=0;i<PARTS.length;i++)if(PARTS[i].id===id)return PARTS[i];return null;}
function getAns(p){return lLoad(p.id+'-ans',{})||{};}
function setAns(p,key,val){var a=getAns(p);a[key]=val;lSave(p.id+'-ans',a);flashSaved();}

/* ── marking ────────────────────────────────────────────────────────── */
function norm(s){
  return String(s||'').toLowerCase()
    .replace(/[‘’ʼ]/g,"'").replace(/[“”]/g,'"')
    .replace(/[.,!?;:]+$/g,'').replace(/\s+/g,' ').trim();
}

/**
 * The accepted answers for a question, always as a list.
 *
 * The publisher prints alternatives for some transformations — "the more he
 * feels dizzy / the more dizzy he feels / the dizzier he feels" are all the
 * key for one question — and any of them is simply right. A single string is
 * the ordinary case and stays a string in the data.
 */
function keyList(q){
  if(q.ans===undefined||q.ans===null)return [];
  return Array.isArray(q.ans)?q.ans:[q.ans];
}
function matchesKey(q,given){
  var keys=keyList(q), g=norm(given);
  for(var i=0;i<keys.length;i++)if(g===norm(keys[i]))return true;
  return false;
}

/**
 * One question's marks. The score and the review both go through this, so a
 * tick on the page and the total at the end can never tell different stories.
 * state: right | partial | wrong | pending (an open answer Dad has not marked).
 */
function markOne(p,q){
  var given=getAns(p)[String(q.n)], max=p.pts, got=0, state='wrong';
  if(p.kind==='multi'){
    var picked=given||[], right=0, wrong=0;
    for(var j=0;j<picked.length;j++){(q.ans.indexOf(picked[j])>=0?right++:wrong++);}
    if(wrong===0)got=(right>=2?p.pts:right>=1?1:0);
    state=got===max?'right':got>0?'partial':'wrong';
  } else if(p.kind==='text'){
    /* Dad's mark comes first, and overrules the key. A written answer is his to
       judge: the key is a wording the publisher predicted, not the only one that
       is right, and it can be matched by an answer he would not accept. Every
       written question offers him the buttons, not just the ones the app could
       not place. */
    var dm=lLoad(p.id+'-dad-'+String(q.n),null);
    if(dm!==null){got=dm;state=got>=max?'right':got>0?'partial':'wrong';}
    else if(keyList(q).length && matchesKey(q,given)){got=p.pts;state='right';}
    /* Otherwise a typed sentence goes to Dad, because a rewrite can be right in
       words the key did not predict. A number heard on a track cannot: 265 is
       265, so a section flagged `exact` marks itself either way. */
    else if(p.exact){got=0;state='wrong';}
    else state='pending';
  } else {
    if(given!==undefined&&given!==null&&String(given)===String(q.ans)){got=p.pts;state='right';}
  }
  return {got:got,max:max,state:state,given:given};
}

/** What a page is worth, what Leo earned automatically, what Dad still owes. */
/**
 * One section's marks, plus the two lists the score screen needs.
 *
 * `pending` is what nobody has decided yet — it is **not** a wrong answer, and
 * the screen must never present it as one. `marks` is every question Dad is
 * allowed to mark, decided or not, so a written answer the app called right is
 * still his to change.
 */
function markPart(p){
  var a=getAns(p), got=0, max=0, pending=[], marks=[];
  if(p.kind==='speaking'){
    var ticks=lLoad(p.id+'-ticks',[])||[];
    max=p.pts;
    for(var t=0;t<p.prompts.length;t++)if(ticks[t])got++;
    /* Speaking is already marked prompt by prompt inside its own page. */
    return {got:got,max:max,pending:pending,marks:marks,dadOnly:true};
  }
  if(p.kind==='writing'){
    max=p.pts;
    var dm=lLoad(p.id+'-dad',null);
    if(dm!==null)got=dm;
    else pending.push({key:p.id+':'+p.n,part:p,n:p.n,max:p.pts,said:a.text||'',
                      sample:'Rubric: '+p.rubric.join(' · ')});
    marks.push({key:p.id+':'+p.n,part:p,n:p.n,max:p.pts,said:a.text||'',
                sample:'Rubric: '+p.rubric.join(' · '),
                value:dm,auto:null,pending:dm===null});
    return {got:got,max:max,pending:pending,marks:marks,dadOnly:true};
  }
  for(var i=0;i<p.questions.length;i++){
    var q=p.questions[i], key=String(q.n), given=a[key];
    var m=markOne(p,q);
    max+=m.max;got+=m.got;
    if(p.kind==='text'){
      var dq=lLoad(p.id+'-dad-'+key,null);
      var matched=keyList(q).length && matchesKey(q,given);
      marks.push({key:p.id+':'+key,part:p,n:q.n,max:p.pts,said:given||'',
                  sample:correctText(p,q),
                  value:dq,
                  /* What the app would say if Dad stood back. null means it
                     cannot say, so his mark is the only one there will be. */
                  auto:matched?p.pts:(p.exact?0:null),
                  pending:m.state==='pending'});
    }
    if(m.state==='pending' && (String(given||'').trim()!=='' || q.ans))
      pending.push({key:p.id+':'+key,part:p,n:q.n,max:p.pts,said:given||'',
                    sample:q.ans||q.sample||''});
  }
  return {got:got,max:max,pending:pending,marks:marks,dadOnly:!!p.dadMarks};
}

function totals(){
  var got=0,max=0,pending=[],marks=[];
  for(var i=0;i<PARTS.length;i++){
    var m=markPart(PARTS[i]);
    got+=m.got;max+=m.max;
    pending=pending.concat(m.pending);
    marks=marks.concat(m.marks||[]);
  }
  return {got:got,max:max,pending:pending,marks:marks};
}

/** How many answers on a page are still blank — what "3 still blank" counts. */
function blanksOn(p){
  var a=getAns(p), n=0;
  if(p.kind==='speaking')return lLoad(p.id+'-seen',false)?0:1;
  if(p.kind==='writing'){
    /* Only a part that offers a choice has a choice to be missing. */
    var picking = p.prompts && p.prompts.length>1;
    return (picking && !a.choice ? 1 : 0) + (String(a.text||'').trim()?0:1);
  }
  for(var i=0;i<p.questions.length;i++){
    var v=a[String(p.questions[i].n)];
    if(p.kind==='multi'){if(!v||v.length<2)n++;}
    else if(p.kind==='text'){if(String(v||'').trim()==='')n++;}
    else if(v===undefined||v===null||v==='')n++;
  }
  return n;
}
function partComplete(p){return blanksOn(p)===0;}
function isDone(p){return !!lLoad(p.id+'-done',false);}
function doneCount(){var n=0;for(var i=0;i<MC;i++)if(isDone(PARTS[i]))n++;return n;}
function allDone(){return doneCount()===MC;}

/* ── putting a question and an answer into words ────────────────────── */
function optionLabel(q,k){
  if(!q.options)return String(k);
  for(var i=0;i<q.options.length;i++)if(q.options[i].k===k)return k+'. '+q.options[i].t;
  return String(k);
}
/** The paper's own number for a question — sections numbered 1)…6) sit under one. */
function paperNumber(p,q){
  return q.label ? p.paperN+' · '+q.label.replace(')','') : String(q.n);
}
function questionText(p,q){
  if(p.kind==='select'){
    if(q.label)return p.instr;
    return (q.before||'')+' ______ '+(q.after||'');
  }
  return q.stem||p.instr;
}
function answerText(p,q,value){
  if(value===undefined||value===null||value===''||(Array.isArray(value)&&!value.length))
    return '(nothing)';
  if(p.kind==='multi')return value.map(function(k){return optionLabel(q,k);}).join(' + ');
  if(p.kind==='buttons')return optionLabel(q,value);
  return String(value);
}
function correctText(p,q){
  if(p.kind==='multi')return q.ans.map(function(k){return optionLabel(q,k);}).join(' + ');
  if(p.kind==='buttons')return optionLabel(q,q.ans);
  var keys=keyList(q), seen={}, shown=[];
  /* Every accepted wording, so the review shows Leo what else would have done —
     but only the ones that actually read differently. Several keys exist purely
     to accept a capital letter, and printing "The more you practice  /  the more
     you practice" makes the slash look like part of the answer. */
  for(var i=0;i<keys.length;i++){
    var k=norm(keys[i]);
    if(seen[k])continue;
    seen[k]=1;shown.push(keys[i]);
  }
  return shown.length?shown.join('  /  '):(q.sample||'');
}

/* ── page pieces ────────────────────────────────────────────────────── */
function hasRef(p){return !!(pictures(p).length||p.passage||p.table||p.audio||boxHtml(p));}

function boxHtml(p){
  if(!p.bank||p.kind==='buttons'||p.kind==='multi')return '';
  /* A bank of letters that are printed on the picture is not a word box. */
  if(p.labelsOnPicture)return '';
  var h='<div class="box">';
  for(var i=0;i<p.bank.length;i++)
    h+='<span data-w="'+esc(p.bank[i])+'">'+esc(p.bank[i])+'</span>';
  return h+'</div>';
}

/**
 * Cross a word off the box once it has been used, the way a pencil would.
 * Every box on this test is one-to-one — a word answers one blank — so a
 * struck word is genuinely spent, and what is left is the field still to
 * choose from. The example's word is left alone: he did not use it.
 */
function paintBox(p){
  var chips=document.querySelectorAll('.box span');
  if(!chips.length)return;
  var used={}, a=getAns(p);
  if(p.questions)for(var i=0;i<p.questions.length;i++){
    var v=a[String(p.questions[i].n)];
    if(v)used[v]=true;
  }
  for(var c=0;c<chips.length;c++)
    chips[c].classList.toggle('used',!!used[chips[c].dataset.w]);
}

/** `image`/`imageAlt` is the one-picture shorthand for `images`. */
function pictures(p){
  if(p.images)return p.images;
  return p.image?[{src:p.image,alt:p.imageAlt||''}]:[];
}

/** A table the paper prints beside its questions, reproduced as one. */
function tableHtml(p){
  if(!p.table)return '';
  var h='<table class="ref-table"><thead><tr>';
  for(var c=0;c<p.table.head.length;c++)h+='<th>'+esc(p.table.head[c])+'</th>';
  h+='</tr></thead><tbody>';
  for(var r=0;r<p.table.rows.length;r++){
    h+='<tr>';
    for(var c2=0;c2<p.table.rows[r].length;c2++)h+='<td>'+esc(p.table.rows[r][c2])+'</td>';
    h+='</tr>';
  }
  return h+'</tbody></table>';
}

/* Everything the questions on this page need to keep looking at. */
function refHtml(p){
  var h='', pics=pictures(p);
  if(pics.length){
    h+='<div class="pic-box'+(pics.length>1?' many':'')+'">';
    for(var i=0;i<pics.length;i++)
      h+='<img src="'+esc(pics[i].src)+'" alt="'+esc(pics[i].alt||'')
        +'" onclick="openLb(\''+esc(pics[i].src)+'\')">';
    h+='</div><button class="zoom" onclick="openLb(\''+esc(pics[0].src)+'\')">'
      +(pics.length>1?'See the pictures bigger':'See the picture bigger')+'</button>';
  }
  h+=tableHtml(p);
  if(p.passage){
    h+='<div class="passage"><h4>'+esc(p.passage.title)+'</h4>';
    for(var i=0;i<p.passage.paragraphs.length;i++)h+='<p>'+esc(p.passage.paragraphs[i])+'</p>';
    h+='</div>';
  }
  if(p.audio){
    h+='<audio controls preload="none" src="'+esc(p.audio)+'"></audio>';
  }
  return h + boxHtml(p);
}

function selectHtml(p,key,given,extraClass){
  var h='<select class="inl '+(extraClass||'')+(given?' filled':'')+'"'+(revealed?' disabled':'')
    +' onchange="onSelect(\''+p.id+'\',\''+esc(key)+'\',this)">'
    +'<option value=""></option>';
  for(var b=0;b<p.bank.length;b++){
    var v=p.bank[b];
    h+='<option value="'+esc(v)+'"'+(given===v?' selected':'')+'>'+esc(v)+'</option>';
  }
  return h+'</select>';
}

var MARK_GLYPH = {right:'✔',wrong:'✘',partial:'◑',pending:'·'};
function markHtml(p,q){
  if(!revealed)return '';
  var m=markOne(p,q);
  var glyph = m.state==='partial' ? m.got+'/'+m.max
            : m.state==='pending' ? 'Dad'
            : MARK_GLYPH[m.state];
  return '<span class="mk '+m.state+'" title="'+m.got+' of '+m.max+'">'+glyph+'</span>';
}
/** Under a question he did not get full marks for: what it should have been. */
function fixHtml(p,q){
  if(!revealed)return '';
  var m=markOne(p,q);
  if(m.state==='right')return '';
  var right=correctText(p,q);
  if(!right)return '';
  return '<div class="fix">Answer: <b>'+esc(right)+'</b></div>';
}
function itemClass(p,q){
  if(!revealed)return '';
  var st=markOne(p,q).state;
  return (st==='wrong')?' wrong':'';
}

function questionsHtml(p){
  var a=getAns(p), h='', lock=revealed?' disabled':'';

  if(p.kind==='speaking'){
    var ticks=lLoad(p.id+'-ticks',[])||[], seen=!!lLoad(p.id+'-seen',false);
    h+='<div class="dad-note">Dad asks each question out loud. Leo answers from the picture. 1 point each.</div>';
    if(!seen)h+='<button class="sp-show" id="'+p.id+'-show" onclick="showPrompts(\''+p.id+'\')">Dad: show the 10 questions</button>';
    h+='<div id="'+p.id+'-prompts"'+(seen?'':' hidden')+'>';
    for(var s=0;s<p.prompts.length;s++){
      var pr=p.prompts[s];
      h+='<div class="sp'+(ticks[s]?' ok':'')+'" id="'+p.id+'-sp-'+s+'">'
        +(revealed?'<span class="mk '+(ticks[s]?'right':'wrong')+'">'+(ticks[s]?'✔':'✘')+'</span>':'')
        +'<button class="sp-tick" onclick="tickSp(\''+p.id+'\','+s+')">'+(ticks[s]?'✓':'')+'</button>'
        +'<div><div class="sp-q"><b>'+(s+1)+'. '+esc(pr.say)+'</b> '+esc(pr.q)+'</div>'
        +'<div class="sp-a">Expected: '+esc(pr.a)+'</div></div></div>';
    }
    return h+'</div>';
  }

  if(p.kind==='writing'){
    h+='<div class="item"><span class="num">'+p.n+'.</span><div class="body">';
    /* Two prompts are a choice to make; one is just the question. */
    if(p.prompts && p.prompts.length===1){
      h+='<div class="wprompt">'+p.prompts[0].t+'</div>';
    } else for(var w=0;w<(p.prompts||[]).length;w++){
      var pw=p.prompts[w];
      h+='<button class="opt'+(a.choice===pw.k?' picked':'')+'" style="display:block;width:100%;margin-bottom:5px;line-height:1.6"'+lock+' '
        +'onclick="pickWriting(\''+p.id+'\',\''+pw.k+'\')"><span class="k">'+pw.k+'.</span>'+pw.t+'</button>';
    }
    h+='<textarea class="lines" rows="6"'+lock+' oninput="typeWriting(\''+p.id+'\',this)">'+esc(a.text||'')+'</textarea>';
    return h+'</div></div>';
  }

  for(var i=0;i<p.questions.length;i++){
    var q=p.questions[i], key=String(q.n), given=a[key];
    h+='<div class="item'+itemClass(p,q)+'">'+markHtml(p,q);
    if(p.kind==='select'){
      if(q.label){
        h+='<span class="ilabel">'+esc(q.label)+'</span><div class="body">'+selectHtml(p,key,given,'short')+fixHtml(p,q)+'</div>';
      } else if(p.blankFirst){
        h+=selectHtml(p,key,given)+'<span class="num">'+esc(q.n)+'.</span>'
          +'<div class="body">'+esc(q.before)+fixHtml(p,q)+'</div>';
      } else {
        h+='<span class="num">'+esc(q.n)+'.</span><div class="body">'
          +(q.before?esc(q.before)+' ':'')+selectHtml(p,key,given)+(q.after?' '+esc(q.after):'')
          +fixHtml(p,q)+'</div>';
      }
    } else if(p.kind==='buttons'||p.kind==='multi'){
      var shown=p.kind==='multi'?(given||[]).join(', '):(given||'');
      h+='<span class="blank'+(shown?' filled':'')+'" id="'+p.id+'-bl-'+i+'">'+esc(shown)+'</span>'
        +'<span class="num">'+esc(q.n)+'.</span><div class="body">'+esc(q.stem)
        +'<div class="opts'+(q.options.length<=2?' two':'')+'" id="'+p.id+'-op-'+i+'">';
      for(var o=0;o<q.options.length;o++){
        var op=q.options[o];
        var on=(p.kind==='multi')?((given||[]).indexOf(op.k)>=0):(given===op.k);
        h+='<button class="opt'+(on?' picked':'')+'" data-k="'+esc(op.k)+'"'+lock+' onclick="'
          +(p.kind==='multi'?'toggleMulti':'pickOne')+'(\''+p.id+'\',\''+esc(key)+'\',\''+esc(op.k)+'\','+i+')">'
          +'<span class="k">'+esc(op.k)+'.</span>'+esc(op.t)+'</button>';
      }
      h+='</div>'+fixHtml(p,q)+'</div>';
    } else if(p.kind==='text'){
      /* A section whose answers are one token gets one ruled line, not two. */
      h+='<span class="num">'+esc(q.n)+'.</span><div class="body">'+esc(q.stem)
        +'<textarea class="lines" rows="'+(p.exact?1:2)+'"'+lock+' oninput="typeText(\''+p.id+'\',\''+esc(key)+'\',this)">'+esc(given||'')+'</textarea>'
        +fixHtml(p,q)+'</div>';
    }
    h+='</div>';
  }
  return h;
}

function pageHtml(p){
  var qs = (hasRef(p)?'':boxHtml(p))
         + (p.example?'<div class="example">'+esc(p.example)+'</div>':'')
         + '<div id="'+p.id+'-qs">'+questionsHtml(p)+'</div>'
         + (revealed
              ? '<div class="locked-note">The result is open, so this page is now a record — '
                + 'answers can no longer be changed.</div>'
              : '<div class="pfoot"><button class="clear-btn" id="'+p.id+'-clear" onclick="clearPage(\''+p.id+'\')">Clear this page</button></div>');
  var split = hasRef(p)
    ? '<div class="split"><div class="ref'+(pictures(p).length?' pic':'')+'">'+refHtml(p)+'</div>'
      +'<div class="qcol" id="qcol">'+qs+'</div></div>'
    : '<div class="split solo"><div class="qcol" id="qcol">'+qs+'</div></div>';
  return '<div class="page">'
    +'<div class="phd"><div class="instr">'+(p.track?'<span class="tr">TR: '+esc(p.track)+'</span>':'')+esc(p.instr)+'</div>'
    +(p.sub?'<div class="sub">'+esc(p.sub)+'</div>':'')+'</div>'
    + split + '</div>';
}

/* ── navigation ─────────────────────────────────────────────────────── */
function render(){
  var stage=document.getElementById('stage');
  if(page===ANSWERS_PAGE){
    /* Opening the result is the moment the marks appear — on this page and,
       from now on, on all thirteen pages behind it. */
    if(allDone() && !revealed){ revealed=true; lSave('revealed',true); persistTime(); paintClock(); }
    stage.innerHTML=answersHtml();
  }
  else{
    var p=PARTS[page];
    stage.innerHTML=pageHtml(p);
    sizeLines(p.id);
    paintBox(p);
    var q=document.getElementById('qcol');
    if(q)q.scrollTop=0;
  }
  lSave('page',page);
  paintNav();
}

function paintNav(){
  var prev=document.getElementById('prev'), next=document.getElementById('next'),
      pager=document.getElementById('pager');
  prev.disabled = page===0;
  if(page===ANSWERS_PAGE){
    next.style.visibility='hidden';
    pager.innerHTML='Answer Section';
  } else {
    next.style.visibility='visible';
    next.textContent = page===MC-1 ? 'See the result →' : 'Next →';
    var p=PARTS[page], blanks=blanksOn(p);
    /* Never block the way forward — just say quietly what is still open. */
    pager.innerHTML='Page '+(page+1)+' of '+MC
      +'<small'+(blanks?' class="warn"':'')+'>'
      +(blanks? blanks+' still blank' : 'all answered')+'</small>';
  }
  document.getElementById('progFill').style.width=(doneCount()/MC*100)+'%';
  recordScore();
}

function goTo(i){
  if(i<0)i=0;
  if(i>ANSWERS_PAGE)i=ANSWERS_PAGE;
  page=i;render();closeIndex();
}
function goRel(d){goTo(page+d);}

function openIndex(){
  var h='';
  for(var i=0;i<MC;i++){
    var p=PARTS[i], b=blanksOn(p), started=Object.keys(getAns(p)).length>0||!!lLoad(p.id+'-seen',false);
    var cls = b===0?'':(started?'blank':'none');
    var txt = b===0?'done':(started? b+' blank' : 'not started');
    h+='<button class="prow'+(i===page?' now':'')+'" onclick="goTo('+i+')">'
      +'<span class="pn">'+(i+1)+'</span><span class="pname">'+esc(p.name)+'</span>'
      +'<span class="pst '+cls+'">'+txt+'</span></button>';
  }
  var ok=allDone();
  h+='<button class="prow'+(page===ANSWERS_PAGE?' now':'')+'"'+(ok?'':' disabled')
    +' onclick="'+(ok?'goTo('+ANSWERS_PAGE+')':'')+'">'
    +'<span class="pn">★</span><span class="pname">Answer Section</span>'
    +'<span class="pst '+(ok?'':'none')+'">'+(ok?'ready':'locked')+'</span></button>';
  /* The retake is a pinned footer of this sheet rather than the last row of
     the list: the result page's copy is only reachable once every page is
     finished, and wanting to start over is most likely mid-test. */
  document.getElementById('sheet-list').innerHTML=h;
  var r=document.getElementById('retake-sheet');
  r.classList.remove('armed');delete r.dataset.armed;r.textContent='Take the test again';
  document.getElementById('sheet').classList.add('open');
}
function closeIndex(){document.getElementById('sheet').classList.remove('open');}

/* ── answering ──────────────────────────────────────────────────────── */
/* Ruled textareas grow with what is written, so nothing is ever hidden. */
function grow(el){el.style.height='auto';el.style.height=(Math.ceil(el.scrollHeight/32)*32)+'px';}
function sizeLines(pid){
  var els=document.querySelectorAll('#'+pid+'-qs .lines');
  for(var i=0;i<els.length;i++)grow(els[i]);
}
/* ── the clock ───────────────────────────────────────────────────────
   Counts down the publisher's allowance. It starts on his first answer
   rather than on open, so Dad can look at the paper without draining it,
   and it pauses when the test is closed — this is a test taken at the
   kitchen table, not an invigilated hall. At zero it says so and keeps
   counting, but nothing locks: a half-written sentence is never thrown
   away, and whether to stop is Dad's call. The overtime is recorded. */
var ALLOWED = 0;                /* set by boot() from the test's minutes */
var elapsed = 0;
var started = false;
var paused  = false;
var tickN = 0;

function mmss(sec){
  sec=Math.max(0,Math.round(sec));
  var m=Math.floor(sec/60), ss=sec%60;
  return m+':'+(ss<10?'0':'')+ss;
}
function paintClock(){
  var el=document.getElementById('clock');
  if(!el)return;
  var left=ALLOWED-elapsed;
  el.classList.toggle('paused',started&&paused&&!revealed);
  el.classList.toggle('over',left<0&&!revealed);
  el.classList.toggle('done',revealed);
  if(revealed){
    el.textContent='⏱ '+mmss(elapsed)+' taken';
    el.title='The test is finished — this is how long it took';
    return;
  }
  if(!started)el.textContent='⏱ '+mmss(ALLOWED);
  else if(left<0)el.textContent="Time's up · +"+mmss(-left);
  else el.textContent=(paused?'▶ ':'⏱ ')+mmss(left)+(paused?' paused':' left');
  el.title=started?(paused?'Tap to start the clock again':'Tap to pause the clock')
                  :'Starts on the first answer';
}
function startClock(){
  if(started||revealed)return;
  runId();
  started=true;paused=false;lSave('time-started',true);lSave('time-paused',false);paintClock();
}
function toggleClock(){
  if(revealed)return;          /* the sitting is over; the time is a record now */
  if(!started){startClock();return;}
  paused=!paused;lSave('time-paused',paused);paintClock();
}
function persistTime(){lSave('time-elapsed',elapsed);}
setInterval(function(){
  /* Opening the result ends the sitting, so the clock stops there. It used to
     keep counting while Dad marked, which both read as a running test and
     inflated the time this sitting recorded — the attempt is rewritten on every
     mark, so twenty minutes of marking became twenty minutes of test. */
  if(!started||paused||revealed)return;
  elapsed++;
  if(++tickN%5===0)persistTime();
  paintClock();
},1000);
window.addEventListener('pagehide',persistTime);
document.addEventListener('visibilitychange',function(){if(document.hidden)persistTime();});

var savedTimer;
function flashSaved(){
  var el=document.getElementById('saved');
  el.classList.add('on');clearTimeout(savedTimer);
  savedTimer=setTimeout(function(){el.classList.remove('on');},1200);
}

/* A page's done-key saves itself the moment its last blank is filled —
   there is no Finished button to press; Next just moves on. */
function afterAnswer(pid){
  startClock();
  var p=partById(pid);
  if(partComplete(p))lSave(pid+'-done',true);
  paintNav();
}
function onSelect(pid,key,el){
  var p=partById(pid);
  setAns(p,key,el.value);
  el.classList.toggle('filled',el.value!=='');
  paintBox(p);
  afterAnswer(pid);
}
function pickOne(pid,key,k,i){
  setAns(partById(pid),key,k);
  var opts=document.querySelectorAll('#'+pid+'-op-'+i+' .opt');
  for(var b=0;b<opts.length;b++)opts[b].classList.toggle('picked',opts[b].dataset.k===k);
  var bl=document.getElementById(pid+'-bl-'+i);
  bl.textContent=k;bl.classList.add('filled');
  afterAnswer(pid);
}
function toggleMulti(pid,key,k,i){
  var p=partById(pid),a=getAns(p),cur=(a[key]||[]).slice(),at=cur.indexOf(k);
  if(at>=0)cur.splice(at,1);else cur.push(k);
  setAns(p,key,cur);
  var opts=document.querySelectorAll('#'+pid+'-op-'+i+' .opt');
  for(var b=0;b<opts.length;b++)opts[b].classList.toggle('picked',cur.indexOf(opts[b].dataset.k)>=0);
  var bl=document.getElementById(pid+'-bl-'+i);
  bl.textContent=cur.join(', ');bl.classList.toggle('filled',cur.length>0);
  afterAnswer(pid);
}
function typeText(pid,key,el){setAns(partById(pid),key,el.value);grow(el);afterAnswer(pid);}
function pickWriting(pid,k){
  var p=partById(pid);setAns(p,'choice',k);
  var opts=document.querySelectorAll('#'+pid+'-qs .opt');
  for(var b=0;b<opts.length;b++)opts[b].classList.toggle('picked',opts[b].querySelector('.k').textContent===k+'.');
  afterAnswer(pid);
}
function typeWriting(pid,el){setAns(partById(pid),'text',el.value);grow(el);afterAnswer(pid);}
function showPrompts(pid){
  document.getElementById(pid+'-prompts').hidden=false;
  var b=document.getElementById(pid+'-show');if(b)b.remove();
  lSave(pid+'-seen',true);afterAnswer(pid);
}
function tickSp(pid,i){
  var t=(lLoad(pid+'-ticks',[])||[]).slice();
  t[i]=!t[i];lSave(pid+'-ticks',t);flashSaved();
  var row=document.getElementById(pid+'-sp-'+i);
  row.classList.toggle('ok',!!t[i]);
  row.querySelector('.sp-tick').textContent=t[i]?'✓':'';
  afterAnswer(pid);
}

var clearTimers={};
function clearPage(id){
  var btn=document.getElementById(id+'-clear');
  if(btn.dataset.armed){
    clearTimeout(clearTimers[id]);delete btn.dataset.armed;btn.classList.remove('armed');
    var p=partById(id);
    var keys=[id+'-ans',id+'-done',id+'-ticks',id+'-seen',id+'-dad'];
    if(p.questions)for(var i=0;i<p.questions.length;i++)keys.push(id+'-dad-'+p.questions[i].n);
    lDropAll(keys);
    render();
    return;
  }
  btn.dataset.armed='1';btn.classList.add('armed');
  btn.textContent='Tap again to clear this page';
  clearTimers[id]=setTimeout(function(){
    delete btn.dataset.armed;btn.classList.remove('armed');btn.textContent='Clear this page';
  },5000);
}

/* ── one dated attempt per sitting ───────────────────────────────────
   The score keys above are "where this sitting is up to", and a retake clears
   them. An attempt is the sitting itself: written once the result is opened,
   kept under its own id, and never touched again by a later run — so taking
   this test in March and again in June leaves two records rather than one
   overwritten one. src/data/testAttempts.ts owns everything read back out. */
var ATTEMPTS_KEY = 'leea.testAttempts.v1';

/** Created on the first answer and cleared by a retake, so each run files once. */
function runId(){
  var r = lLoad('run-id', null);
  if(!r){ r = TEST.id + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
          lSave('run-id', r); }
  return r;
}

function attemptQuestions(){
  var out=[];
  for(var i=0;i<PARTS.length;i++){
    var p=PARTS[i];
    if(!p.questions)continue;
    for(var j=0;j<p.questions.length;j++){
      var q=p.questions[j], m=markOne(p,q);
      /* `pending` is carried through as itself: an open response Neritan has
         not marked is not a wrong answer, and must not land in his mistakes. */
      var row={n:paperNumber(p,q),part:p.name,state:m.state,
               got:m.got,max:m.max,question:questionText(p,q),
               given:answerText(p,q,m.given),answer:correctText(p,q)};
      /* Carry the choices, so the drill can offer them again later without
         needing this file to still exist. */
      if(q.options)row.options=q.options.map(function(o){return o.k+'. '+o.t;});
      else if(p.bank&&p.kind==='select')row.options=p.bank.slice();
      out.push(row);
    }
  }
  return out;
}

function writeAttempt(){
  if(!revealed)return;            /* a sitting exists once its result is opened */
  var t=totals(), now=new Date().toISOString(), id=runId();
  try{
    var all=JSON.parse(localStorage.getItem(ATTEMPTS_KEY)||'{}');
    var prev=all[id];
    all[id]={
      id:id, studentId:'leo',
      testId:TEST.lessonId, testTitle:TEST.title, medium:'app',
      takenAt:(prev&&prev.takenAt)||now,
      score:t.got, total:t.max,
      percent:t.max?Math.round(t.got/t.max*100):0,
      durationSec:elapsed,
      questions:attemptQuestions(),
      note:'',
      createdAt:(prev&&prev.createdAt)||now,
      updatedAt:now
    };
    localStorage.setItem(ATTEMPTS_KEY,JSON.stringify(all));
    sendAttempt(all[id]);
  }catch(e){}
}

/**
 * Hand the sitting to the app so it reaches the `test_attempts` table.
 *
 * The attempts store is not under this test's storage prefix, so the cloud
 * bridge does not mirror it — and waiting for someone to open /tests on THIS
 * device would mean a test Leo sat on his own never reaching the parent at all.
 * Debounced, because this runs on every render while the result is open and
 * again on every answer Neritan marks.
 */
var attemptTimer;
function sendAttempt(attempt){
  if(window.parent===window)return;             /* opened standalone */
  clearTimeout(attemptTimer);
  attemptTimer=setTimeout(function(){
    try{ parent.postMessage({type:'LEEA_TEST_ATTEMPT',attempt:attempt},'*'); }catch(e){}
  },500);
}

/* ── the answer section ─────────────────────────────────────────────── */
function recordScore(){
  var t=totals();
  saveScore(t.got,t.max,allDone(),{pending:t.pending.length,
    timeTakenSec:elapsed,timeAllowedSec:ALLOWED});
  /* Keeps the attempt current as Neritan marks the open responses. */
  writeAttempt();
}
function answersHtml(){
  if(!allDone()){
    var h='<div class="answers"><h3>Answer Section</h3><div class="locked">'
      +'It opens when all '+MC+' pages are finished — '+doneCount()+' so far. '
      +'These still have blanks:</div>';
    for(var i=0;i<MC;i++){
      var p=PARTS[i],b=blanksOn(p);
      if(!b)continue;
      h+='<button class="prow" onclick="goTo('+i+')"><span class="pn">'+(i+1)+'</span>'
        +'<span class="pname">'+esc(p.name)+'</span><span class="pst blank">'+b+' blank</span></button>';
    }
    return h+'</div>';
  }
  var t=totals();
  var h='<div class="answers"><h3>Answer Section</h3>'
    +'<div class="total"><b>'+t.got+'</b><span>out of '+t.max+' points · '
    +(t.max?Math.round(t.got/t.max*100):0)+'%</span></div>';
  h+= t.pending.length
    ? '<div class="pend">'+t.pending.length+' answer'+(t.pending.length>1?'s are':' is')
      +' still waiting for Dad. They are under <b>Your marking</b> below, with everything'
      +' else Leo wrote — the score changes as he marks them.</div>'
    : '<div class="pend">Everything is marked. This is the final score.</div>';
  h+='<div class="taken">Time taken <b>'+mmss(elapsed)+'</b> of the '
    +Math.round(ALLOWED/60)+' minutes allowed'
    +(elapsed>ALLOWED?' — <b>'+mmss(elapsed-ALLOWED)+'</b> over':'')+'.</div>';
  h+='<table class="brk">';
  for(var i=0;i<PARTS.length;i++){
    var p=PARTS[i],m=markPart(p);
    h+='<tr'+(m.pending.length?' class="open"':'')+'><td>'+(i+1)+'. '+esc(p.name)
      +(m.pending.length?' <span class="brk-wait">'+m.pending.length+' to mark</span>':'')
      +'</td><td>'+m.got+' / '+m.max+'</td></tr>';
  }
  h+='</table>';
  h+=reviewHtml();

  /* Every written question, not only the undecided ones. A sentence Leo wrote
     is Dad's to judge even when the app matched it to the key — the key is one
     wording the publisher predicted, not the only right answer. The buttons
     show what stands now, and "let the app decide" hands it back. */
  if(t.marks.length){
    var waits=0;
    for(var w=0;w<t.marks.length;w++)if(t.marks[w].pending)waits++;
    h+='<div class="sec-h">Your marking &middot; '+t.marks.length+' written answer'
      +(t.marks.length>1?'s':'')+(waits?' &middot; '+waits+' waiting':'')+'</div>';
    h+='<div class="pend">Every written answer is yours to mark, including the ones the app '
      +'already placed. Tap a number to set it; the score changes as you do.</div>';
  }
  for(var k=0;k<t.marks.length;k++){
    var pn=t.marks[k], cur=(pn.value!==null&&pn.value!==undefined)?pn.value:pn.auto;
    var by=(pn.value!==null&&pn.value!==undefined) ? 'you marked this'
         : pn.auto!==null ? 'the app placed this' : 'waiting for you';
    h+='<div class="mark'+(pn.pending?' is-open':'')+'">'
      +'<div class="mark-h">Question '+esc(String(pn.n))+' &middot; out of '+pn.max
      +' <span class="mark-by">'+by+'</span></div>'
      +'<div class="mark-said">'+(esc(pn.said)||'(nothing written)')+'</div>'
      +(pn.sample?'<div class="mark-key">Accepted: '+esc(pn.sample)+'</div>':'')
      +'<div class="steps">';
    for(var s=0;s<=pn.max;s++)
      h+='<button class="step'+(cur===s?' on':'')+'" onclick="dadMark(\''+pn.key+'\','+s+')">'+s+'</button>';
    if(pn.value!==null&&pn.value!==undefined&&pn.auto!==null)
      h+='<button class="step ghost" onclick="dadClear(\''+pn.key+'\')">&#8635; let the app decide</button>';
    h+='</div></div>';
  }
  h+='<button class="retake" id="retake" onclick="retake()">Take the test again</button>';
  return h+'</div>';
}

/**
 * Every question he did not get right, in the paper's order: what was asked,
 * what he wrote, and what it should have been. "Show every question" turns the
 * same list into the whole paper, for walking through it together.
 */
var showAllReview = false;
function keepScroll(fn){
  var el=document.querySelector('.answers'), top=el?el.scrollTop:0;
  fn();
  el=document.querySelector('.answers');if(el)el.scrollTop=top;
}
function toggleReview(){ showAllReview=!showAllReview; keepScroll(render); }
function reviewHtml(){
  var rows='', wrong=0, waiting=0, total=0;
  for(var i=0;i<PARTS.length;i++){
    var p=PARTS[i];
    if(!p.questions)continue;
    for(var j=0;j<p.questions.length;j++){
      var q=p.questions[j], m=markOne(p,q);
      total++;
      var ok=m.state==='right', open=m.state==='pending';
      /* An answer nobody has marked yet says nothing about whether it is right,
         so it is never counted among the mistakes. It used to be, which made a
         written answer waiting for Dad read as one Leo had got wrong. */
      if(open)waiting++; else if(!ok)wrong++;   /* waiting is reported by the marking section */
      if(ok && !showAllReview)continue;
      rows+='<div class="rev'+(ok?' ok':open?' open':'')+'">'
        +'<div class="rev-n">'+(ok?'✔':open?'◑':'✘')+' Question '+esc(paperNumber(p,q))
        +' · '+esc(p.name)+' · '+(open?'Dad marks this':m.got+' / '+m.max)+'</div>'
        +'<div class="rev-q">'+esc(questionText(p,q))+'</div>'
        +'<div class="rev-line"><span>He wrote</span><em class="'+(ok?'rev-key':'rev-his')+'">'
        +esc(answerText(p,q,m.given))+'</em></div>'
        +(ok?'':'<div class="rev-line"><span>Answer</span><em class="rev-key">'
              +esc(correctText(p,q))+'</em></div>')
        +(open?'<div class="rev-note">Wording can differ — mark it below.</div>':'')
        +'</div>';
    }
  }
  /* The count of what is still unmarked belongs beside the buttons that set it,
     not here — two counts of the same thing on one screen disagree the moment
     one of them covers the writing question and the other does not. */
  var head = wrong===0
      ? (waiting ? 'Nothing marked wrong so far' : 'Every question was right — nothing to go over')
      : wrong+' to go over';
  return '<div class="sec-h">'+head+'</div>'
    + rows
    + '<button class="rev-all" onclick="toggleReview()">'
    + (showAllReview?'Show only the ones he missed':'Show every question ('+total+')')
    + '</button>';
}

/* A real retake: everything goes, the clock and the marks included. Two taps,
   because there is no undo. */
var retakeTimer;
function retake(btnId){
  var btn=document.getElementById(btnId||'retake');
  if(btn.dataset.armed){
    clearTimeout(retakeTimer);btn.classList.remove('armed');
    try{
      var mine=Object.keys(localStorage).filter(function(k){ return k.indexOf(SP)===0; })
                     .map(function(k){ return k.slice(SP.length); });
      /* `true`: wipe the whole stored sitting, not just the keys this browser
         happens to hold — otherwise a device that holds a fuller copy uploads
         it again and the reset undoes itself. */
      lDropAll(mine, homeworkKeys(), true);
    }catch(e){}
    revealed=false;elapsed=0;started=false;paused=false;showAllReview=false;
    page=0;closeIndex();render();paintClock();
    return;
  }
  btn.dataset.armed='1';btn.classList.add('armed');
  btn.textContent='Tap again — this erases everything';
  retakeTimer=setTimeout(function(){
    delete btn.dataset.armed;btn.classList.remove('armed');btn.textContent='Take the test again';
  },5000);
}

/** Drop Dad's mark so the app's own reading stands again. */
function dadClear(key){
  var bits=key.split(':'), pid=bits[0], qn=bits[1], p=partById(pid);
  if(p.kind==='writing')lSave(pid+'-dad',null);
  else lSave(pid+'-dad-'+qn,null);
  keepScroll(render);
}
function dadMark(key,val){
  var bits=key.split(':'), pid=bits[0], qn=bits[1], p=partById(pid);
  if(p.kind==='writing')lSave(pid+'-dad',val);
  else lSave(pid+'-dad-'+qn,val);
  var el=document.querySelector('.answers'), top=el?el.scrollTop:0;
  render();
  el=document.querySelector('.answers');if(el)el.scrollTop=top;
}

/* ── zoom ───────────────────────────────────────────────────────────── */
function openLb(src){
  document.getElementById('lb-img').src=src;
  document.getElementById('lb').classList.add('open');
}
function closeLb(){document.getElementById('lb').classList.remove('open');}

/* A sitting can be cleared from /tests while this test is still open in
   another tab. That other document goes on ticking and writes the clock
   straight back, so the reset looks like it did nothing — which is exactly
   what was reported. The storage event fires in every OTHER document of this
   origin (never the one that made the change), so an open test hears the wipe
   and resets itself instead of fighting it. */
window.addEventListener('storage', function(e){
  if(!TEST)return;
  var wiped = e.key === null || (e.key.indexOf(SP) === 0 && e.newValue === null);
  if(!wiped)return;
  if(lLoad('run-id',null) !== null)return;      /* still a live sitting */
  revealed=false;elapsed=0;started=false;paused=false;showAllReview=false;
  page=0;render();paintClock();
});

/* ── starting up ─────────────────────────────────────────────────────
   The page is a shell: it names its data file and loads this script. The
   styles, the frame and the questions all arrive here, so a new test is a
   new data file and nothing else. */
function boot(test){
  TEST = test;
  SP = test.storagePrefix;
  HW_ID = new URLSearchParams(location.search).get('hw') || test.homeworkId;
  PARTS = test.parts;
  MC = PARTS.length;
  ANSWERS_PAGE = MC;
  ALLOWED = (test.minutes||30)*60;

  revealed = !!lLoad('revealed',false);
  elapsed  = lLoad('time-elapsed',0)|0;
  started  = !!lLoad('time-started',false);
  paused   = !!lLoad('time-paused',false);

  var style=document.createElement('style');
  style.textContent=TEST_CSS;
  document.head.appendChild(style);
  document.title = test.title;
  document.body.insertAdjacentHTML('afterbegin',
    TEST_CHROME.replace('{{COURSE}}', esc(test.course||''))
               .replace('{{TITLE}}', esc(test.shortTitle||test.title)));

  /* Come back to the page he left off on. */
  page = Math.max(0, Math.min(ANSWERS_PAGE, lLoad('page',0)|0));
  if(page===ANSWERS_PAGE && !allDone())page=MC-1;
  render();
  paintClock();
}

function fail(message){
  document.body.innerHTML =
    '<div style="font:16px/1.6 Arial,sans-serif;color:#111;padding:28px;max-width:640px">'
    + '<h1 style="font-size:1.1rem;margin-bottom:8px">This test could not be loaded</h1>'
    + '<p style="color:#52525B">' + esc(message) + '</p></div>';
}

(function start(){
  var src = window.LEEA_TEST;
  if(!src){ fail('The page did not say which test to load (window.LEEA_TEST).'); return; }
  fetch(src)
    .then(function(r){ if(!r.ok) throw new Error('the questions file answered ' + r.status); return r.json(); })
    .then(function(test){
      if(!test || !Array.isArray(test.parts) || !test.parts.length) throw new Error('the questions file has no parts');
      if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot(test); });
      else boot(test);
    })
    .catch(function(error){ fail(String(error && error.message || error) + ' (' + src + ')'); });
})();
