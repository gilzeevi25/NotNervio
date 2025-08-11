// Main interaction logic

document.addEventListener('DOMContentLoaded', () => {
  // Letter-by-letter reveal for hero headline
  const headline = document.querySelector('.hero h1');
  const text = headline.textContent;
  headline.innerHTML = '';
  [...text].forEach((char, i) => {
    const span = document.createElement('span');
    if (char === ' ') {
      span.innerHTML = '&nbsp;';
      span.style.display = 'inline';
    } else {
      span.textContent = char;
      span.style.display = 'inline-block';
    }
    span.style.transitionDelay = `${i * 50}ms`;
    headline.appendChild(span);
  });
  setTimeout(() => headline.classList.add('revealed'), 100);

  // IntersectionObserver animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

  // Parallax effect for hero background
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    hero.style.backgroundPositionY = window.scrollY * 0.5 + 'px';
  });

  // Testimonial carousel
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  let current = 0;

  function show(index) {
    testimonials.forEach((t, i) => {
      t.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function next() {
    current = (current + 1) % testimonials.length;
    show(current);
  }

  let interval = setInterval(next, 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      show(i);
      clearInterval(interval);
      interval = setInterval(next, 5000);
    });
  });
});

// === Live Demo: simple signal generator + fake alerts ===
(function(){
  const cfg = {
    width: 900, height: 120,
    speed: 1,
    noise: 0.15,
    colors: { stroke: '#3d7fff', grid: '#14254d' }
  };

  const canvases = [
    { id: 'emgCanvas', label: 'EMG', baseFreq: 6.5, spikes: true },
    { id: 'ssepCanvas', label: 'SSEP', baseFreq: 1.5, blocky: true },
    { id: 'mepCanvas', label: 'MEP', baseFreq: 0.9, burst: true }
  ].map(row => ({ ...row, el: document.getElementById(row.id), x: 0 }));

  const alertBar = document.getElementById('alertBar');
  const toggle = document.getElementById('demoToggle');
  const speedInput = document.getElementById('demoSpeed');

  let running = false, rafId = null, t = 0;

  function grid(ctx, w, h){
    ctx.strokeStyle = cfg.colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = 0; y < h; y += 30) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();
  }
  function drawWave(ctx, w, h, baseFreq, style){
    ctx.strokeStyle = cfg.colors.stroke; ctx.lineWidth = 2; ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const px = (t + x) / 60;
      let y = Math.sin(px * baseFreq);
      if (style.spikes && Math.random() < 0.008) y += (Math.random() * 2 - 1) * 2.6;
      if (style.blocky) y = Math.round(y*2)/2;
      if (style.burst) y += Math.sin(px*12) * Math.exp(-((x-450)**2)/20000);
      y += (Math.random()*2 - 1) * cfg.noise;
      const py = h/2 + y * (h*0.35);
      if (x === 0) ctx.moveTo(x, py); else ctx.lineTo(x, py);
    }
    ctx.stroke();
  }
  function paintRow(row){
    const { el, baseFreq, spikes, blocky, burst } = row;
    if (!el) return;
    const ctx = el.getContext('2d');
    const w = el.width = cfg.width, h = el.height = cfg.height;
    ctx.clearRect(0,0,w,h);
    grid(ctx, w, h);
    drawWave(ctx, w, h, baseFreq, { spikes, blocky, burst });
  }
  function cycleAlerts(){
    // Fake alert states
    const r = Math.random();
    alertBar.innerHTML = '';
    if (r < 0.75) {
      alertBar.append(elPill('Quiet','quiet'));
      alertBar.append(elPill('Stable','ok'));
    } else if (r < 0.92) {
      alertBar.append(elPill('Check SSEP amplitude','warn'));
    } else {
      alertBar.append(elPill('ALERT: Possible pedicle irritation (EMG)','alert'));
    }
  }
  function elPill(text, cls){
    const s = document.createElement('span'); s.className = `pill ${cls}`; s.textContent = text; return s;
  }
  function loop(){
    if (!running) return;
    t += cfg.speed * 2;
    canvases.forEach(paintRow);
    if (Math.random() < 0.04) cycleAlerts();
    rafId = requestAnimationFrame(loop);
  }
  toggle?.addEventListener('click', () => {
    running = !running;
    toggle.textContent = running ? 'Pause Demo' : 'Start Demo';
    toggle.setAttribute('aria-pressed', running ? 'true' : 'false');
    if (running) loop(); else cancelAnimationFrame(rafId);
  });
  speedInput?.addEventListener('input', e => cfg.speed = parseFloat(e.target.value));
})();

// Hero particles
(function(){
  const c = document.getElementById('heroParticles');
  if (!c) return;
  const ctx = c.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let w, h, dots;

  function resize(){
    const rect = c.getBoundingClientRect();
    w = c.width = rect.width * dpr; h = c.height = rect.height * dpr;
    c.style.width = rect.width + 'px'; c.style.height = rect.height + 'px';
    dots = Array.from({length: 70}, () => ({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.2*dpr, vy:(Math.random()-0.5)*0.2*dpr
    }));
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = '#3d7fff';
    dots.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if (p.x<0||p.x>w) p.vx*=-1;
      if (p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,1.4*dpr,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(step);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize(); step();
})();
