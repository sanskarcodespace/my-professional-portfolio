(function(){
'use strict';
// Tab switching
const tabs = document.querySelectorAll('.skill-tab');
const panels = document.querySelectorAll('.skill-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById('tab-' + tab.dataset.tab);
    if (target) { target.classList.add('active'); triggerSkillBars(target); }
  });
});
// Skill bar fill on view
function triggerSkillBars(panel) {
  panel.querySelectorAll('.sk-card').forEach(c => c.classList.add('in-view'));
}
triggerSkillBars(document.getElementById('tab-frontend'));

// AI Constellation canvas
const canvas = document.getElementById('aiConstellation');
if (!canvas) return;
const ctx = canvas.getContext('2d');
const nodes = [
  {label:'Claude',x:.15,y:.3,color:'#63B3ED'},
  {label:'ChatGPT',x:.38,y:.15,color:'#9F7AEA'},
  {label:'Gemini',x:.62,y:.2,color:'#4FD1C5'},
  {label:'Gamma AI',x:.82,y:.35,color:'#63B3ED'},
  {label:'Antigravity',x:.5,y:.65,color:'#9F7AEA'},
  {label:'FlutterFlow',x:.25,y:.72,color:'#4FD1C5'}
];
const edges = [[0,1],[1,2],[2,3],[0,4],[1,4],[2,4],[3,4],[4,5],[0,5]];
let t = 0;
function drawConst() {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  // Edges
  edges.forEach(([a,b]) => {
    const na = nodes[a], nb = nodes[b];
    ctx.beginPath();
    ctx.moveTo(na.x*W, na.y*H);
    ctx.lineTo(nb.x*W, nb.y*H);
    ctx.strokeStyle = 'rgba(99,179,237,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Animated particle on edge
    const frac = (Math.sin(t*0.02 + a + b) + 1) / 2;
    const px = na.x*W + (nb.x*W - na.x*W)*frac;
    const py = na.y*H + (nb.y*H - na.y*H)*frac;
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(99,179,237,0.6)';
    ctx.fill();
  });
  // Nodes
  nodes.forEach((n, i) => {
    const x = n.x*W, y = n.y*H;
    const pulse = 1 + Math.sin(t*0.03 + i) * 0.15;
    const r = 18 * pulse;
    // Glow
    const g = ctx.createRadialGradient(x,y,0,x,y,r*2);
    g.addColorStop(0, n.color + '40');
    g.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(x,y,r*2,0,Math.PI*2);
    ctx.fillStyle = g; ctx.fill();
    // Core
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = n.color + '30'; ctx.fill();
    ctx.strokeStyle = n.color; ctx.lineWidth = 1.5; ctx.stroke();
    // Label
    ctx.fillStyle = '#F7FAFC';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(n.label, x, y + r + 16);
  });
  t++;
  requestAnimationFrame(drawConst);
}
// Resize canvas
function resizeCanvas() {
  const container = canvas.parentElement;
  canvas.width = Math.min(container.offsetWidth, 800);
  canvas.height = 380;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawConst();
// Page transitions
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.includes('.pdf')) return;
    e.preventDefault();
    if (window.pageWipe) window.pageWipe(() => { window.location.href = href; });
    else window.location.href = href;
  });
});
})();
