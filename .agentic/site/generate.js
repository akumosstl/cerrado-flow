const fs = require('fs');
const path = require('path');

const SITE = __dirname;
const SCHEMAS = path.resolve(SITE, '..', 'schemas');
const MEMORY = path.resolve(SITE, '..', 'memory');
const OUT = path.join(SITE, 'index.html');

const schemaNames = fs.readdirSync(SCHEMAS)
  .filter(f => f.endsWith('.json'))
  .map(f => path.basename(f, '.json'));

const entries = fs.readdirSync(MEMORY)
  .filter(f => f.endsWith('.json') && f !== '.gitkeep')
  .sort()
  .map(f => {
    const raw = fs.readFileSync(path.join(MEMORY, f), 'utf-8');
    let data, err;
    try { data = JSON.parse(raw); } catch (e) { data = raw; err = e.message; }

    const stem = path.basename(f, '.json');
    const prefix = stem.split(/[_\d]/)[0];
    let template = schemaNames.find(s => prefix === s);
    if (!template && data && typeof data === 'object' && data.phase) {
      const pm = { analyzer:'analysis', implementer:'implementation', planner:'planning', verifier:'verification', 'milestone-implementer':'milestone_implementation', 'milestone-verifier':'milestone_verification', orchestrator:'orchestration' };
      template = pm[data.phase] || null;
    }
    if (!template) template = schemaNames.find(s => s.startsWith(prefix) || prefix.startsWith(s));
    const label = template ? template.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Generic';

    return { filename: f, template: template || 'generic', label, error: err, data };
  });

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function sev(s) { return '<span class="sev sev-' + s + '">' + esc(s) + '</span>'; }
function status(s) { return '<span class="sts sts-' + s + '">' + esc(s) + '</span>'; }

function kvTable(obj) {
  let h = '<table class="kv">';
  for (const [k, v] of Object.entries(obj)) {
    h += '<tr><td class="k">' + esc(k) + '</td><td>';
    if (v !== null && typeof v === 'object') h += renderGeneric(v);
    else h += esc(String(v));
    h += '</td></tr>';
  }
  return h + '</table>';
}

function renderGeneric(d) {
  if (typeof d === 'string') return '<pre>' + esc(d) + '</pre>';
  if (d === null || d === undefined) return '<em>null</em>';
  if (Array.isArray(d)) {
    if (!d.length) return '<em>empty</em>';
    let h = '<table class="dt"><thead><tr><th>#</th><th>Value</th></tr></thead><tbody>';
    d.forEach((item, i) => {
      h += '<tr><td>' + i + '</td><td>';
      h += (item !== null && typeof item === 'object') ? renderGeneric(item) : esc(String(item));
      h += '</td></tr>';
    });
    return h + '</tbody></table>';
  }
  return kvTable(d);
}

function renderAnalysis(d) {
  let h = '';
  h += '<div class="obj-box">' + esc(d.objective || '') + '</div>';
  if (d.summary) h += '<div class="summary-box">' + esc(d.summary) + '</div>';
  if (d.current_state) { h += '<h3>Current State</h3>' + renderGeneric(d.current_state); }
  if (d.target_state) { h += '<h3>Target State</h3>' + renderGeneric(d.target_state); }
  if (d.findings && d.findings.length) {
    h += '<h3>Findings (' + d.findings.length + ')</h3><table class="dt"><thead><tr><th>ID</th><th>Category</th><th>Severity</th><th>Description</th></tr></thead><tbody>';
    for (const f of d.findings) {
      h += '<tr><td>' + esc(f.id) + '</td><td><span class="tag">' + esc(f.category) + '</span></td><td>' + sev(f.severity) + '</td><td>' + esc(f.description) + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.risks && d.risks.length) {
    h += '<h3>Risks</h3><ul>'; for (const r of d.risks) h += '<li>' + esc(r) + '</li>'; h += '</ul>';
  }
  if (d.dependencies && d.dependencies.length) {
    h += '<h3>Dependencies</h3><table class="dt"><thead><tr><th>Name</th><th>Version</th><th>Status</th></tr></thead><tbody>';
    for (const dep of d.dependencies) {
      h += '<tr><td>' + esc(dep.name) + '</td><td>' + esc(dep.version || '') + '</td><td>' + esc(dep.status || '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.complexity) h += '<div class="cx cx-' + d.complexity + '">Complexity: ' + esc(d.complexity) + '</div>';
  if (d.recommendation) h += '<div class="rec-box">' + esc(d.recommendation) + '</div>';
  return h;
}

function renderImplementation(d) {
  let h = '';
  if (d.plan_reference) h += '<div class="info-line"><strong>Plan:</strong> ' + esc(d.plan_reference) + '</div>';
  if (d.milestone) h += '<div class="info-line"><strong>Milestone:</strong> ' + esc(d.milestone) + '</div>';
  if (d.result) h += '<div class="result-box result-' + d.result + '">Result: ' + esc(d.result) + '</div>';
  if (d.status) h += '<div>Status: ' + status(d.status) + '</div>';
  if (d.steps && d.steps.length) {
    h += '<h3>Steps (' + d.steps.length + ')</h3><table class="dt"><thead><tr><th>Task</th><th>Action</th><th>Status</th><th>Output</th></tr></thead><tbody>';
    for (const s of d.steps) {
      h += '<tr><td>' + esc(s.task_id || '') + '</td><td>' + esc(s.action || '') + '</td><td>' + status(s.status) + '</td><td>' + esc(s.output || s.error || '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.changes && d.changes.length) {
    h += '<h3>Changes</h3><ul>'; for (const c of d.changes) h += '<li>' + esc(c) + '</li>'; h += '</ul>';
  }
  if (d.files_modified && d.files_modified.length) {
    h += '<h3>Files Modified</h3><table class="dt"><thead><tr><th>Path</th><th>Type</th><th>Description</th></tr></thead><tbody>';
    for (const fm of d.files_modified) {
      const fp = typeof fm === 'string' ? fm : fm.path;
      const ft = typeof fm === 'string' ? '' : fm.change_type || '';
      const fd = typeof fm === 'string' ? '' : fm.description || '';
      h += '<tr><td>' + esc(fp) + '</td><td>' + esc(ft) + '</td><td>' + esc(fd) + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.files_created && d.files_created.length) {
    h += '<h3>Files Created</h3><ul>'; for (const fc of d.files_created) { h += '<li>' + esc(typeof fc === 'string' ? fc : fc.path || '') + '</li>'; } h += '</ul>';
  }
  if (d.commands_executed && d.commands_executed.length) {
    h += '<h3>Commands Executed</h3><table class="dt"><thead><tr><th>Command</th><th>Exit Code</th><th>Output</th></tr></thead><tbody>';
    for (const cmd of d.commands_executed) {
      h += '<tr><td><code>' + esc(cmd.command || '') + '</code></td><td>' + esc(String(cmd.exit_code ?? '')) + '</td><td>' + esc(cmd.output_summary || '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.errors && d.errors.length) {
    h += '<h3>Errors</h3>'; for (const e of d.errors) { h += '<div class="err-card"><strong>' + esc(e.task_id || '') + ':</strong> ' + esc(e.message || '') + (e.recovery ? '<br><em>Recovery: ' + esc(e.recovery) + '</em>' : '') + '</div>'; }
  }
  return h;
}

function renderPlanning(d) {
  let h = '';
  h += '<div class="summary-box">' + esc(d.strategy || '') + '</div>';
  if (d.input_analysis) h += '<div class="info-line"><strong>Input:</strong> ' + esc(d.input_analysis) + '</div>';
  if (d.milestones && d.milestones.length) {
    h += '<h3>Milestones</h3><table class="dt"><thead><tr><th>#</th><th>Name</th><th>Criteria</th></tr></thead><tbody>';
    for (const m of d.milestones) {
      h += '<tr><td>' + esc(m.order) + '</td><td>' + esc(m.name) + '</td><td>' + esc(m.criteria || '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.tasks && d.tasks.length) {
    h += '<h3>Tasks (' + d.tasks.length + ')</h3><table class="dt"><thead><tr><th>ID</th><th>Title</th><th>Priority</th><th>Owner</th><th>Depends On</th><th>Effort</th></tr></thead><tbody>';
    for (const t of d.tasks) {
      h += '<tr><td>' + esc(t.id) + '</td><td>' + esc(t.title) + '</td><td>' + esc(t.priority) + '</td><td>' + esc(t.owner) + '</td><td>' + esc((t.depends_on || []).join(', ')) + '</td><td>' + esc(t.estimated_effort || '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.rollback_plan && d.rollback_plan.length) {
    h += '<h3>Rollback Plan</h3><ol>'; for (const r of d.rollback_plan) h += '<li>' + esc(r) + '</li>'; h += '</ol>';
  }
  if (d.success_criteria && d.success_criteria.length) {
    h += '<h3>Success Criteria</h3><ul>'; for (const s of d.success_criteria) h += '<li>' + esc(s) + '</li>'; h += '</ul>';
  }
  return h;
}

function renderVerification(d) {
  let h = '';
  h += '<div class="verdict verdict-' + (d.verdict || 'unknown') + '">Verdict: ' + esc(d.verdict || 'unknown') + '</div>';
  if (d.plan_reference) h += '<div class="info-line"><strong>Plan:</strong> ' + esc(d.plan_reference) + '</div>';
  if (d.implementation_reference) h += '<div class="info-line"><strong>Implementation:</strong> ' + esc(d.implementation_reference) + '</div>';
  if (d.milestone) h += '<div class="info-line"><strong>Milestone:</strong> ' + esc(d.milestone) + '</div>';
  if (d.milestone_criteria_checked) h += '<div class="info-line"><strong>Criteria:</strong> ' + esc(d.milestone_criteria_checked) + '</div>';
  if (d.checks && d.checks.length) {
    h += '<h3>Checks (' + d.checks.length + ')</h3><table class="dt"><thead><tr><th>Criterion</th><th>Type</th><th>Status</th><th>Evidence</th></tr></thead><tbody>';
    for (const c of d.checks) {
      h += '<tr><td>' + esc(c.criterion) + '</td><td><span class="tag">' + esc(c.type) + '</span></td><td>' + status(c.status) + '</td><td>' + esc(c.evidence || '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.test_results) {
    h += '<h3>Test Results</h3><div class="test-results">';
    if (d.test_results.total !== undefined) h += 'Total: ' + d.test_results.total + ' | ';
    if (d.test_results.passed !== undefined) h += '<span class="sts sts-pass">Passed: ' + d.test_results.passed + '</span> | ';
    if (d.test_results.failed !== undefined) h += '<span class="sts sts-fail">Failed: ' + d.test_results.failed + '</span> | ';
    if (d.test_results.skipped !== undefined) h += 'Skipped: ' + d.test_results.skipped;
    if (d.test_results.command) h += '<br><code>' + esc(d.test_results.command) + '</code>';
    h += '</div>';
  }
  if (d.failures && d.failures.length) {
    h += '<h3>Failures</h3>';
    for (const f of d.failures) {
      h += '<div class="fail-card"><strong>' + esc(f.check || '') + '</strong><br>' + esc(f.reason || '') + (f.suggested_fix ? '<div class="fix">Fix: ' + esc(f.suggested_fix) + '</div>' : '') + '</div>';
    }
  }
  return h;
}

function renderOrchestration(d) {
  let h = '';
  h += '<div class="info-line"><strong>ID:</strong> ' + esc(d.orchestration_id || '') + '</div>';
  h += '<div class="info-line"><strong>Plan:</strong> ' + esc(d.plan_reference || '') + '</div>';
  h += '<div class="result-box result-' + (d.overall_status || 'unknown') + '">Overall: ' + esc(d.overall_status || '') + '</div>';
  if (d.current_milestone) h += '<div class="info-line"><strong>Current Milestone:</strong> ' + esc(d.current_milestone) + '</div>';
  if (d.milestones_status && d.milestones_status.length) {
    h += '<h3>Milestones Status</h3><table class="dt"><thead><tr><th>#</th><th>Name</th><th>Status</th><th>Verdict</th></tr></thead><tbody>';
    for (const ms of d.milestones_status) {
      h += '<tr><td>' + esc(ms.milestone) + '</td><td>' + esc(ms.name) + '</td><td>' + status(ms.status) + '</td><td>' + (ms.verdict ? status(ms.verdict) : '') + '</td></tr>';
    }
    h += '</tbody></table>';
  }
  if (d.summary) h += '<div class="summary-box">' + esc(d.summary) + '</div>';
  if (d.next_action) h += '<div class="next-box">Next: <code>' + esc(d.next_action) + '</code></div>';
  return h;
}

const RENDER = { analysis: renderAnalysis, implementation: renderImplementation, milestone_implementation: renderImplementation, planning: renderPlanning, verification: renderVerification, milestone_verification: renderVerification, orchestration: renderOrchestration };

const embeddedRender = {};
for (const [k, fn] of Object.entries(RENDER)) {
  const src = fn.toString();
  const body = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
  embeddedRender[k] = body;
}

const dataJson = JSON.stringify(entries).replace(/<\/script>/gi, '<\\/script>');

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Memory Viewer</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f6fa;color:#2d3436;line-height:1.5}
header.app{background:#2d3436;color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px}
header.app h1{font-size:18px;font-weight:600}
header.app h1 span{color:#74b9ff;font-weight:400}
.controls{display:flex;gap:8px;align-items:center}
.controls input,.controls select{padding:6px 12px;border:1px solid #636e72;border-radius:4px;background:#f5f6fa;font-size:13px;color:#2d3436}
.controls input{width:220px}
.controls select{cursor:pointer}
.container{max-width:1200px;margin:0 auto;padding:20px 24px}
.table-wrap{background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08);overflow:hidden}
table.dt{width:100%;border-collapse:collapse;font-size:13px}
table.dt th{background:#f8f9fa;text-align:left;padding:10px 14px;font-weight:600;font-size:12px;text-transform:uppercase;color:#636e72;border-bottom:2px solid #dfe6e9;cursor:pointer;user-select:none}
table.dt td{padding:10px 14px;border-bottom:1px solid #f1f2f6;vertical-align:top}
table.dt tr:hover{background:#f8f9fa}
.name-cell{font-weight:500;color:#0984e3;word-break:break-all}
.tag{display:inline-block;background:#dfe6e9;color:#636e72;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:600;text-transform:uppercase}
.sev{display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:600;text-transform:uppercase}
.sev-low{background:#dfe6e9;color:#636e72}
.sev-medium{background:#ffeaa7;color:#d68910}
.sev-high{background:#fab1a0;color:#c0392b}
.sev-critical{background:#e74c3c;color:#fff}
.sts{display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:600;text-transform:uppercase}
.sts-pass,.sts-success,.sts-completed,.sts-compatible,.sts-defined,.sts-in_use,.sts-integrated{background:#55efc4;color:#00695c}
.sts-fail,.sts-failed,.sts-incompatible{background:#fab1a0;color:#c0392b}
.sts-warn,.sts-partial,.sts-needs_update,.sts-unknown{background:#ffeaa7;color:#d68910}
.sts-skip,.sts-pending,.sts-skipped{background:#dfe6e9;color:#636e72}
.sts-in_progress{background:#74b9ff;color:#0652DD}
.btn{display:inline-block;padding:5px 14px;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:600;transition:all .15s}
.btn-primary{background:#0984e3;color:#fff}
.btn-primary:hover{background:#0767b3}
.btn-secondary{background:#636e72;color:#fff}
.btn-secondary:hover{background:#4a5357}
.btn-close{background:transparent;border:none;color:#636e72;font-size:22px;cursor:pointer;padding:4px 8px;line-height:1}
.btn-close:hover{color:#2d3436}
.pagination{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;font-size:13px}
.pagination button{padding:5px 12px;border:1px solid #dfe6e9;border-radius:4px;background:#fff;cursor:pointer;font-size:12px}
.pagination button:hover:not(:disabled){background:#f1f2f6;border-color:#b2bec3}
.pagination button:disabled{opacity:.4;cursor:default}
.pagination .page-info{color:#636e72;font-size:12px;margin:0 4px}
.empty-state{text-align:center;padding:40px;color:#b2bec3;font-size:14px}
/* Modal */
.modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1000;overflow-y:auto;padding:20px}
.modal.show{display:block}
.modal-panel{background:#fff;border-radius:10px;max-width:960px;margin:20px auto;box-shadow:0 8px 32px rgba(0,0,0,.2);overflow:hidden}
.modal-header{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:#2d3436;color:#fff;position:sticky;top:0;z-index:1}
.modal-header h2{font-size:15px;font-weight:600}
.modal-header .btn-close{color:#b2bec3}
.modal-header .btn-close:hover{color:#fff}
.modal-body{padding:24px}
.modal-body h3{font-size:14px;font-weight:600;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid #f1f2f6;color:#2d3436}
.modal-body h3:first-child{margin-top:0}
/* Content cards */
.obj-box{font-size:15px;font-weight:600;color:#2d3436;margin-bottom:12px;padding:12px 16px;background:#ebf5fb;border-left:4px solid #0984e3;border-radius:4px}
.summary-box{padding:12px 16px;background:#f8f9fa;border-left:4px solid #636e72;border-radius:4px;margin-bottom:12px;color:#555;font-size:13px}
.rec-box{padding:14px 16px;background:#e8f8f5;border-left:4px solid #00b894;border-radius:4px;margin:16px 0;font-size:13px}
.next-box{padding:10px 14px;background:#fef9e7;border:1px solid #f9e79f;border-radius:4px;margin:12px 0;font-size:13px}
.next-box code{background:#f1f2f6;padding:2px 6px;border-radius:3px;font-size:12px}
.result-box{display:inline-block;padding:6px 16px;border-radius:4px;font-weight:700;font-size:13px;text-transform:uppercase;margin-bottom:12px}
.result-success,.result-pass,.result-completed{background:#55efc4;color:#00695c}
.result-fail,.result-failed{background:#fab1a0;color:#c0392b}
.result-partial{background:#ffeaa7;color:#d68910}
.result-unknown{background:#dfe6e9;color:#636e72}
.verdict{display:inline-block;padding:8px 20px;border-radius:6px;font-weight:700;font-size:16px;text-transform:uppercase;margin-bottom:16px}
.verdict-pass{background:#55efc4;color:#00695c}
.verdict-fail{background:#fab1a0;color:#c0392b}
.verdict-partial{background:#ffeaa7;color:#d68910}
.verdict-unknown{background:#dfe6e9;color:#636e72}
.cx{display:inline-block;padding:4px 14px;border-radius:4px;font-size:12px;font-weight:600;text-transform:uppercase;margin:12px 0}
.cx-low{background:#55efc4;color:#00695c}
.cx-medium{background:#ffeaa7;color:#d68910}
.cx-high{background:#fab1a0;color:#c0392b}
.info-line{margin:4px 0;font-size:13px;color:#636e72}
.info-line strong{color:#2d3436}
table.kv{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0}
table.kv td{padding:4px 8px;border-bottom:1px solid #f1f2f6;vertical-align:top}
table.kv td.k{font-weight:600;color:#636e72;width:160px;white-space:nowrap}
.fail-card{padding:12px 16px;background:#fdf2f2;border:1px solid #fab1a0;border-radius:6px;margin:8px 0;font-size:13px}
.fail-card strong{color:#c0392b}
.fix{margin-top:6px;padding:6px 10px;background:#fff;border-radius:4px;font-size:12px;color:#0984e3}
.err-card{padding:10px 14px;background:#fdf2f2;border-left:4px solid #e74c3c;border-radius:4px;margin:6px 0;font-size:13px}
.test-results{background:#f8f9fa;padding:10px 14px;border-radius:4px;font-size:13px;margin:8px 0}
.test-results code{display:block;margin-top:6px;background:#2d3436;color:#dfe6e9;padding:6px 10px;border-radius:4px;font-size:12px}
pre{background:#f8f9fa;padding:12px;border-radius:4px;overflow-x:auto;font-size:12px;line-height:1.4}
ul,ol{padding-left:20px;font-size:13px;margin:6px 0}
li{margin:3px 0}
.type-badge{display:inline-block;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:600}
.type-analysis{background:#dfe6e9;color:#2d3436}
.type-implementation{background:#0984e3;color:#fff}
.type-planning{background:#00b894;color:#fff}
.type-verification{background:#e17055;color:#fff}
.type-orchestration{background:#6c5ce7;color:#fff}
.type-generic{background:#b2bec3;color:#fff}
.type-milestone-implementation{background:#74b9ff;color:#fff}
.type-milestone-verification{background:#fab1a0;color:#fff}
@media(max-width:768px){
  .controls input{width:140px}
  table.dt{font-size:12px}
  table.dt td,table.dt th{padding:8px 10px}
}
</style>
</head>
<body>
<header class="app">
  <h1>.agentic/memory <span>—</span> <span id="count"></span></h1>
  <div class="controls">
    <input id="search" type="text" placeholder="Buscar arquivo..." oninput="render()">
    <select id="typeFilter" onchange="render()"><option value="">Todos os tipos</option></select>
  </div>
</header>
<div class="container">
  <div class="table-wrap">
    <table class="dt">
      <thead><tr><th style="width:50%">Arquivo</th><th>Tipo</th><th style="width:100px">Ações</th></tr></thead>
      <tbody id="tbody"></tbody>
    </table>
    <div class="pagination" id="pagination"></div>
    <div class="empty-state" id="empty" style="display:none">Nenhum arquivo encontrado.</div>
  </div>
</div>
<div class="modal" id="modal">
  <div class="modal-panel">
    <div class="modal-header">
      <h2><span id="modalTitle"></span></h2>
      <button class="btn-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body" id="modalBody"></div>
  </div>
</div>
<script>
var ENTRIES = ${dataJson};

var RENDER_BODIES = ${JSON.stringify(embeddedRender)};

function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function sev(s){return '<span class=\"sev sev-'+s+'\">'+esc(s)+'</span>'}
function status(s){return '<span class=\"sts sts-'+s+'\">'+esc(s)+'</span>'}
function typeClass(t){return 'type-'+t.replace(/_/g,'-')}

var renderFns={};
for(var k in RENDER_BODIES){
  if(RENDER_BODIES.hasOwnProperty(k)){
    renderFns[k]=new Function('d',RENDER_BODIES[k]);
  }
}
function renderGeneric(d){
  if(typeof d==='string')return '<pre>'+esc(d)+'</pre>';
  if(d===null||d===undefined)return '<em>null</em>';
  if(Array.isArray(d)){
    if(!d.length)return '<em>empty</em>';
    var h='<table class="dt"><thead><tr><th>#</th><th>Value</th></tr></thead><tbody>';
    for(var i=0;i<d.length;i++){
      h+='<tr><td>'+i+'</td><td>';
      h+=(d[i]!==null&&typeof d[i]==='object')?renderGeneric(d[i]):esc(String(d[i]));
      h+='</td></tr>';
    }
    return h+'</tbody></table>';
  }
  var h='<table class="kv">';
  for(var k in d){
    if(d.hasOwnProperty(k)){
      var v=d[k];
      h+='<tr><td class="k">'+esc(k)+'</td><td>';
      if(v!==null&&typeof v==='object')h+=renderGeneric(v);
      else h+=esc(String(v));
      h+='</td></tr>';
    }
  }
  return h+'</table>';
}

var page=0,perPage=10;
function renderTable(){
  var q=document.getElementById('search').value.toLowerCase();
  var tf=document.getElementById('typeFilter').value;
  var filtered=ENTRIES.filter(function(e){
    if(q&&!e.filename.toLowerCase().includes(q))return false;
    if(tf&&e.template!==tf)return false;
    return true;
  });
  var totalPages=Math.ceil(filtered.length/perPage)||1;
  if(page>=totalPages)page=totalPages-1;
  if(page<0)page=0;
  var start=page*perPage;
  var end=Math.min(start+perPage,filtered.length);
  var tbody=document.getElementById('tbody');
  var html='';
  for(var i=start;i<end;i++){
    var e=filtered[i];
    html+='<tr><td class="name-cell">'+esc(e.filename)+'</td>';
    html+='<td><span class="type-badge '+typeClass(e.template)+'">'+esc(e.label)+'</span></td>';
    html+='<td><button class="btn btn-primary" onclick="openModal('+(ENTRIES.indexOf(e))+')">Ver</button></td></tr>';
  }
  tbody.innerHTML=html;
  document.getElementById('empty').style.display=filtered.length?'none':'block';
  var pg=document.getElementById('pagination');
  if(totalPages<=1){pg.innerHTML='';return}
  var phtml='<button onclick="page=0;renderTable()"'+(!page?' disabled':'')+'>&#171;</button>';
  phtml+='<button onclick="page=Math.max(0,page-1);renderTable()"'+(!page?' disabled':'')+'>&#8249;</button>';
  phtml+='<span class="page-info">'+(page+1)+' de '+totalPages+'</span>';
  phtml+='<button onclick="page=Math.min('+(totalPages-1)+',page+1);renderTable()"'+(page>=totalPages-1?' disabled':'')+'>&#8250;</button>';
  phtml+='<button onclick="page='+(totalPages-1)+';renderTable()"'+(page>=totalPages-1?' disabled':'')+'>&#187;</button>';
  pg.innerHTML=phtml;
}
function openModal(idx){
  var e=ENTRIES[idx];
  document.getElementById('modalTitle').textContent=e.filename;
  var fn=renderFns[e.template]||renderGeneric;
  var body='';
  try{
    body=fn(e.data);
  }catch(x){
    body='<div class="err-card">Error rendering: '+esc(x.message)+'</div>'+renderGeneric(e.data);
  }
  document.getElementById('modalBody').innerHTML=body;
  document.getElementById('modal').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeModal(){
  document.getElementById('modal').classList.remove('show');
  document.body.style.overflow='';
}
document.getElementById('modal').addEventListener('click',function(e){
  if(e.target===this)closeModal();
});
document.addEventListener('keydown',function(e){
  if(e.key==='Escape')closeModal();
});
(function init(){
  var types={},sel=document.getElementById('typeFilter');
  ENTRIES.forEach(function(e){types[e.template]=true});
  var sorted=Object.keys(types).sort();
  for(var i=0;i<sorted.length;i++){
    var opt=document.createElement('option');
    opt.value=sorted[i];
    var label=sorted[i].replace(/_/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()});
    opt.textContent=label;
    sel.appendChild(opt);
  }
  document.getElementById('count').textContent=ENTRIES.length+' arquivo'+(ENTRIES.length!==1?'s':'');
  renderTable();
})();
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html, 'utf-8');
console.log('[OK] Generated ' + OUT);
console.log('[OK] ' + entries.length + ' memory files indexed');
