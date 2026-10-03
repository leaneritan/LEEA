// All styles for the school-tests dashboard, scoped under .stx so nothing
// leaks into the rest of LEEA.

export const stxCss = `
.stx{
  --stx-bg:#f6f7fb; --stx-card:#ffffff; --stx-text:#0f172a; --stx-muted:#64748b; --stx-faint:#94a3b8;
  --stx-line:#e5e7eb; --stx-grid:#eef0f4; --stx-axis:#cbd5e1;
  --stx-accent:#4f46e5; --stx-accent-soft:#eef2ff;
  --stx-good:#059669; --stx-good-soft:#d1fae5; --stx-bad:#dc2626; --stx-bad-soft:#fee2e2;
  --stx-warn:#d97706; --stx-warn-soft:#fef3c7; --stx-info:#0284c7; --stx-info-soft:#e0f2fe;
  --stx-radius:16px; --stx-shadow:0 1px 2px rgba(15,23,42,.05),0 4px 16px rgba(15,23,42,.05);
  color:var(--stx-text); font-feature-settings:"palt"; line-height:1.55;
}
.stx *{box-sizing:border-box}
.stx button{font:inherit;cursor:pointer}
.stx-wrap{max-width:1180px;margin:0 auto;padding:4px 0 48px;display:flex;flex-direction:column;gap:18px}

/* header */
.stx-hero{background:linear-gradient(135deg,#eef2ff 0%,#f8fafc 55%,#ecfeff 100%);border:1px solid #e0e7ff;border-radius:22px;padding:22px 24px;display:flex;flex-wrap:wrap;gap:18px;align-items:flex-end;justify-content:space-between}
.stx-kicker{font-size:11px;font-weight:800;letter-spacing:.14em;color:var(--stx-accent);text-transform:uppercase}
.stx-hero h1{margin:4px 0 6px;font-size:28px;line-height:1.2;letter-spacing:-.01em}
.stx-hero p{margin:0;color:var(--stx-muted);font-size:13.5px;max-width:560px}
.stx-hero-side{display:flex;flex-direction:column;gap:10px;align-items:flex-end}
.stx-mode{display:inline-flex;background:#fff;border:1px solid var(--stx-line);border-radius:999px;padding:4px}
.stx-mode button{border:0;background:transparent;padding:7px 16px;border-radius:999px;font-weight:700;font-size:13px;color:var(--stx-muted)}
.stx-mode button.on{background:var(--stx-accent);color:#fff}
.stx-sync{font-size:11.5px;color:var(--stx-muted);display:flex;gap:6px;align-items:center}
.stx-sync i{width:8px;height:8px;border-radius:50%;display:inline-block}

/* tabs */
.stx-tabs{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 6px;scrollbar-width:thin;position:sticky;top:0;z-index:5;background:rgba(246,247,251,.92);backdrop-filter:blur(6px);padding:8px 2px;margin:-8px 0}
.stx-tabs button{flex:0 0 auto;border:1px solid var(--stx-line);background:#fff;padding:9px 14px;border-radius:12px;font-size:13.5px;font-weight:700;color:#334155;display:flex;gap:6px;align-items:center}
.stx-tabs button.on{background:#0f172a;color:#fff;border-color:#0f172a}
.stx-tabs button .stx-badge{background:var(--stx-bad);color:#fff;border-radius:999px;font-size:10.5px;padding:1px 7px}

/* test picker */
.stx-picker{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.stx-picker > span{font-size:12px;color:var(--stx-muted);font-weight:700}
.stx-pick{border:1px solid var(--stx-line);background:#fff;border-radius:12px;padding:7px 12px;font-size:13px;font-weight:700;display:flex;gap:8px;align-items:center}
.stx-pick small{color:var(--stx-muted);font-weight:600}
.stx-pick.on{border-color:var(--stx-accent);background:var(--stx-accent-soft);color:#3730a3}
.stx-type{font-size:10.5px;font-weight:800;color:#fff;border-radius:6px;padding:1px 6px}

/* cards & grid */
.stx-grid{display:grid;gap:16px}
.stx-g2{grid-template-columns:repeat(2,minmax(0,1fr))}
.stx-g3{grid-template-columns:repeat(3,minmax(0,1fr))}
.stx-g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.stx-g5{grid-template-columns:repeat(5,minmax(0,1fr))}
.stx-span2{grid-column:span 2}
@media (max-width:1000px){.stx-g4,.stx-g5{grid-template-columns:repeat(2,minmax(0,1fr))}.stx-g3{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:680px){.stx-g2,.stx-g3,.stx-g4,.stx-g5{grid-template-columns:minmax(0,1fr)}.stx-span2{grid-column:auto}.stx-hero h1{font-size:23px}}
.stx-card{background:var(--stx-card);border:1px solid var(--stx-line);border-radius:var(--stx-radius);box-shadow:var(--stx-shadow);padding:18px 20px;min-width:0}
.stx-card h2{margin:0;font-size:17px;letter-spacing:-.01em}
.stx-card h3{margin:0 0 8px;font-size:14.5px}
.stx-head{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;margin-bottom:14px}
.stx-sub{font-size:12px;color:var(--stx-muted)}
.stx-note{font-size:12px;color:var(--stx-muted);margin:10px 0 0}
.stx-empty{padding:28px;text-align:center;color:var(--stx-muted);font-size:13px;background:#f8fafc;border-radius:12px}

/* stat tiles */
.stx-stat{display:flex;flex-direction:column;gap:4px}
.stx-stat-label{font-size:11.5px;font-weight:800;color:var(--stx-muted);letter-spacing:.04em}
.stx-stat-value{font-size:34px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.stx-stat-value small{font-size:14px;font-weight:700;color:var(--stx-muted);margin-left:3px}
.stx-stat-foot{font-size:12px;color:var(--stx-muted)}
.stx-pill{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:800;border-radius:999px;padding:3px 9px;width:max-content}
.stx-pill.good{background:var(--stx-good-soft);color:#047857}
.stx-pill.bad{background:var(--stx-bad-soft);color:#b91c1c}
.stx-pill.warn{background:var(--stx-warn-soft);color:#b45309}
.stx-pill.info{background:var(--stx-info-soft);color:#0369a1}
.stx-pill.muted{background:#f1f5f9;color:#475569}
.stx-good{color:var(--stx-good)} .stx-bad{color:var(--stx-bad)} .stx-warnc{color:var(--stx-warn)} .stx-mutedc{color:var(--stx-muted)}
.stx-num{font-variant-numeric:tabular-nums;font-weight:800;font-size:12.5px;white-space:nowrap}

/* subject tile */
.stx-subj{border-radius:14px;border:1px solid var(--stx-line);padding:14px;display:flex;flex-direction:column;gap:6px;background:#fff;position:relative;overflow:hidden}
.stx-subj:before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--c)}
.stx-subj-top{display:flex;justify-content:space-between;align-items:baseline}
.stx-subj-name{font-weight:800;color:var(--c)}
.stx-subj-score{font-size:30px;font-weight:800;letter-spacing:-.02em}
.stx-subj-meta{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;font-size:12px;color:var(--stx-muted)}
.stx-subj-meta b{color:var(--stx-text);font-variant-numeric:tabular-nums}
.stx-meter{height:7px;border-radius:99px;background:#eef0f4;position:relative;overflow:visible}
.stx-meter > span{position:absolute;inset:0 auto 0 0;border-radius:99px;background:var(--c)}
.stx-meter > i{position:absolute;top:-3px;width:2px;height:13px;background:#0f172a;border-radius:2px}
.stx-meter > em{position:absolute;top:-4px;width:0;height:15px;border-left:2px dashed var(--stx-bad)}

/* insights */
.stx-insights{display:grid;gap:10px}
.stx-insight{border-radius:12px;padding:11px 14px;font-size:13.5px;display:flex;gap:10px;align-items:flex-start;border:1px solid transparent}
.stx-insight b{white-space:nowrap}
.stx-insight.good{background:#f0fdf4;border-color:#bbf7d0}
.stx-insight.warn{background:#fffbeb;border-color:#fde68a}
.stx-insight.info{background:#f0f9ff;border-color:#bae6fd}

/* tables */
.stx-table-wrap{overflow-x:auto;border:1px solid var(--stx-line);border-radius:12px}
.stx-table{width:100%;border-collapse:collapse;font-size:13px;min-width:560px}
.stx-table th,.stx-table td{padding:8px 10px;border-bottom:1px solid var(--stx-line);text-align:right;white-space:nowrap}
.stx-table th{background:#f8fafc;font-size:11.5px;color:#475569;font-weight:800;position:sticky;top:0}
.stx-table td:first-child,.stx-table th:first-child{text-align:left}
.stx-table tr:last-child td{border-bottom:0}
.stx-table td.l,.stx-table th.l{text-align:left;white-space:normal}
.stx-table tr.total td{background:#f8fafc;font-weight:800}
.stx-table tr.clickable{cursor:pointer} .stx-table tr.clickable:hover td{background:#f8fafc}
.stx-table .ok{color:var(--stx-good);font-weight:800}.stx-table .ng{color:var(--stx-bad);font-weight:800}
.stx-sheet th{background:#14532d;color:#ecfdf5}
.stx-sheet.kimatsu th{background:#831843;color:#fdf2f8}
.stx-sheet.jitsu th{background:#1e3a8a;color:#eff6ff}

/* charts */
.stx-chart{width:100%;height:auto;display:block}
.stx-radar{max-width:340px;margin:0 auto}
.stx-legend{display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:var(--stx-muted)}
.stx-legend span{display:inline-flex;gap:6px;align-items:center}
.stx-legend i{width:16px;height:3px;border-radius:2px;display:inline-block}
.stx-legend i.dash{background:none!important;border-top:2px dashed currentColor;height:0}
.stx-chips{display:flex;flex-wrap:wrap;gap:6px}
.stx-chips button{border:1px solid var(--stx-line);background:#fff;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:700;color:#334155}
.stx-chips button.on{background:#0f172a;color:#fff;border-color:#0f172a}
.stx-div{display:flex;flex-direction:column;gap:8px}
.stx-div-row{display:grid;grid-template-columns:52px 1fr 64px;gap:10px;align-items:center}
.stx-div-label{font-weight:800;font-size:13px}
.stx-div-track{position:relative;height:16px;background:#f8fafc;border-radius:6px}
.stx-div-mid{position:absolute;left:50%;top:-3px;bottom:-3px;width:1.5px;background:var(--stx-axis)}
.stx-div-bar{position:absolute;top:2px;bottom:2px;border-radius:4px}
.stx-div-note{grid-column:2 / 4;font-size:11px;color:var(--stx-muted);margin-top:-4px}
.stx-rates{display:flex;flex-direction:column;gap:9px}
.stx-rate-row{display:grid;grid-template-columns:minmax(120px,1.1fr) 2fr 42px;gap:10px;align-items:center}
.stx-rate-label{font-size:12.5px;line-height:1.25}
.stx-rate-label small{display:block;color:var(--stx-muted);font-size:11px}
.stx-rate-track{position:relative;height:12px;background:#eef0f4;border-radius:99px}
.stx-rate-bar{position:absolute;inset:0 auto 0 0;border-radius:99px;opacity:.9}
.stx-rate-mark{position:absolute;top:-4px;width:12px;height:12px;margin-left:-6px;transform:rotate(45deg) translateY(3px);background:#0f172a;border:2px solid #fff;border-radius:2px}
.stx-stack-bar{display:flex;height:14px;border-radius:99px;overflow:hidden;background:#eef0f4}
.stx-stack-bar span{height:100%}
.stx-stack-legend{display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--stx-muted);margin-top:8px}
.stx-stack-legend i{width:10px;height:10px;border-radius:3px;display:inline-block;margin-right:4px;vertical-align:-1px}
.stx-ring{position:relative;flex:0 0 auto}
.stx-ring svg{width:100%;height:100%}
.stx-ring-in{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}

/* lists */
.stx-list{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}
.stx-q{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:9px 12px;border-radius:12px;background:#f8fafc;border:1px solid #eef0f4;font-size:13px}
.stx-q-sub{font-size:11px;font-weight:800;color:#fff;border-radius:6px;padding:2px 7px}
.stx-q-main{min-width:0}
.stx-q-main b{font-variant-numeric:tabular-nums}
.stx-q-main small{display:block;color:var(--stx-muted);font-size:11.5px}
.stx-q-side{text-align:right;font-size:12px;color:var(--stx-muted);white-space:nowrap}
.stx-q-side b{display:block;color:var(--stx-text);font-size:13px}
.stx-link{color:var(--stx-accent);font-weight:700;text-decoration:none}
.stx-link:hover{text-decoration:underline}

/* form */
.stx-field{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:700;color:#475569}
.stx-field input,.stx-field select,.stx-field textarea{font:inherit;font-size:14px;font-weight:600;color:var(--stx-text);border:1px solid var(--stx-line);border-radius:10px;padding:8px 10px;background:#fff}
.stx-btn{border:1px solid var(--stx-line);background:#fff;border-radius:10px;padding:8px 14px;font-weight:800;font-size:13px;color:#0f172a;display:inline-flex;gap:6px;align-items:center}
.stx-btn.primary{background:var(--stx-accent);border-color:var(--stx-accent);color:#fff}
.stx-btn.good{background:var(--stx-good);border-color:var(--stx-good);color:#fff}
.stx-btn.small{padding:5px 10px;font-size:12px;border-radius:8px}
.stx-btn:disabled{opacity:.45;cursor:default}
.stx-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.stx-filters{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin-bottom:12px}

/* review cards */
.stx-kanban{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr) minmax(0,1fr);gap:14px}
.stx-col.todo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start}
.stx-col.todo > h3,.stx-col.todo > .stx-empty{grid-column:1 / -1}
@media (max-width:900px){.stx-kanban,.stx-col.todo{grid-template-columns:minmax(0,1fr)}}
.stx-col{background:#f8fafc;border:1px solid var(--stx-line);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
.stx-col h3{margin:0;font-size:14px;display:flex;justify-content:space-between}
.stx-rc{background:#fff;border:1px solid var(--stx-line);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;border-left:4px solid var(--c)}
.stx-rc-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}
.stx-rc-title{font-weight:800;font-size:14px}
.stx-rc-meta{font-size:11.5px;color:var(--stx-muted)}
.stx-reasons{display:flex;flex-wrap:wrap;gap:5px}
.stx-reasons button{border:1px solid var(--stx-line);background:#fff;border-radius:8px;padding:3px 8px;font-size:11.5px;font-weight:700;color:#475569}
.stx-reasons button.on{background:#0f172a;color:#fff;border-color:#0f172a}

/* plan */
.stx-plan{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
.stx-day{border:1px solid var(--stx-line);border-radius:14px;padding:10px 12px;background:#fff;display:flex;flex-direction:column;gap:6px;min-height:96px}
.stx-day.today{border-color:var(--stx-accent);box-shadow:0 0 0 3px var(--stx-accent-soft)}
.stx-day.test{background:#0f172a;color:#fff;border-color:#0f172a}
.stx-day-head{display:flex;justify-content:space-between;font-size:12px;font-weight:800}
.stx-day-item{font-size:12px;display:flex;gap:6px;align-items:center}
.stx-day-item i{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
.stx-day-item.re{color:var(--stx-muted)}

/* leo */
.stx-leo{display:flex;flex-direction:column;gap:18px}
.stx-leo-hero{border-radius:24px;padding:24px;background:linear-gradient(135deg,#4f46e5,#7c3aed 60%,#db2777);color:#fff;display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between}
.stx-leo-hero h2{margin:0;font-size:26px}
.stx-leo-hero p{margin:6px 0 0;opacity:.9}
.stx-leo-hero .stx-ring-in{color:#fff}
.stx-leo-card{background:#fff;border:2px solid var(--stx-line);border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:12px;border-top:6px solid var(--c)}
.stx-leo-q{font-size:20px;font-weight:800}
.stx-leo-help{background:#f8fafc;border-radius:12px;padding:10px 12px;font-size:13.5px}
.stx-leo-btns{display:flex;flex-wrap:wrap;gap:8px}
.stx-leo-btns button{border:2px solid var(--stx-line);background:#fff;border-radius:14px;padding:10px 14px;font-weight:800;font-size:14px}
.stx-leo-btns button.on{border-color:var(--stx-accent);background:var(--stx-accent-soft);color:#3730a3}
.stx-leo-btns button.go{background:var(--stx-good);border-color:var(--stx-good);color:#fff}
.stx-leo-btns button:disabled{opacity:.4;cursor:default}
.stx-leo-btns button.retry{background:#fff7ed;border-color:#fdba74;color:#9a3412}
.stx-badges{display:flex;flex-wrap:wrap;gap:10px}
.stx-badge-x{border-radius:16px;padding:10px 14px;background:#f8fafc;border:1px dashed var(--stx-axis);font-size:13px;font-weight:800;color:var(--stx-faint);display:flex;gap:8px;align-items:center}
.stx-badge-x.got{background:#fefce8;border:1px solid #fde047;color:#854d0e}

/* print */
.stx-print-sheet{background:#fff;border:1px solid var(--stx-line);border-radius:12px;padding:28px 32px;font-size:12.5px;color:#0f172a}
.stx-print-sheet h1{font-size:20px;margin:0}
.stx-print-sheet h2{font-size:14.5px;margin:18px 0 8px;padding-bottom:4px;border-bottom:2px solid #0f172a}
.stx-print-sheet table{width:100%;border-collapse:collapse;font-size:12px}
.stx-print-sheet th,.stx-print-sheet td{border:1px solid #cbd5e1;padding:5px 7px;text-align:center}
.stx-print-sheet th{background:#f1f5f9}
.stx-print-sheet td{white-space:nowrap}
.stx-print-sheet td.l{text-align:left;white-space:normal}
@media screen and (max-width:680px){.stx-print-sheet{overflow-x:auto;padding:16px}}
.stx-print-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}
.stx-box{display:inline-block;width:12px;height:12px;border:1.5px solid #334155;border-radius:2px;vertical-align:-2px}
.stx-lines{border-bottom:1px solid #94a3b8;height:26px}
.stx-print-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.stx-pagebreak{break-before:page;page-break-before:always}

@media print{
  body.stx-print-mode{background:#fff!important}
  body.stx-print-mode *{visibility:hidden!important}
  body.stx-print-mode .stx-print-sheet, body.stx-print-mode .stx-print-sheet *{visibility:visible!important}
  body.stx-print-mode .stx-print-sheet{position:absolute;left:0;top:0;width:100%;border:0;border-radius:0;padding:0;font-size:11.5px}
  body.stx-print-mode .stx-no-print{display:none!important}
  @page{size:A4;margin:12mm}
}
`;
