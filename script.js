// ===== Global: Mobile nav toggle =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// ===== Smooth scroll for same-page anchors (if any) =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
  });
});

// ===== Active link highlight based on path =====
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link=>{
  const href = link.getAttribute('href');
  if (href === path) link.classList.add('active');
});

// ===== Courses: search & filter =====
(function initCourseFilter(){
  const grid = document.getElementById('course-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.course'));
  const search = document.getElementById('course-search');
  const chips = document.querySelectorAll('.chip');

  let currentFilter = 'all';
  const apply = ()=>{
    const q = (search?.value || '').trim().toLowerCase();
    cards.forEach(card=>{
      const level = card.dataset.level;
      const tags = (card.dataset.tags || '') + ' ' + card.querySelector('h3').textContent;
      const textMatch = tags.toLowerCase().includes(q);
      const levelMatch = (currentFilter==='all') || (level===currentFilter);
      card.style.display = (textMatch && levelMatch) ? '' : 'none';
    });
  };

  search?.addEventListener('input', apply);
  chips.forEach(ch=>{
    ch.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      ch.classList.add('active');
      currentFilter = ch.dataset.filter;
      apply();
    });
  });
})();

// ===== Gallery: Lightbox =====
(function initLightbox(){
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = document.getElementById('lightbox-img');
  const closeBtn = lb.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-grid .thumb').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const src = btn.getAttribute('data-full');
      const alt = btn.querySelector('img')?.getAttribute('alt') || 'Gallery image';
      lbImg.src = src;
      lbImg.alt = alt;
      lb.removeAttribute('hidden');
      closeBtn.focus();
    });
  });

  const close = ()=>{
    lb.setAttribute('hidden','');
    lbImg.src = '';
  };
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', (e)=>{ if (e.target === lb) close(); });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && !lb.hasAttribute('hidden')) close(); });
})();

// ===== Contact: validation + WhatsApp prefill + course param =====
(function initContact(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const name = form.querySelector('#name');
  const email = form.querySelector('#email');
  const phone = form.querySelector('#phone');
  const course = form.querySelector('#course');
  const message = form.querySelector('#message');
  const waBtn = document.getElementById('wa-btn');

  // Prefill course from URL param
  const params = new URLSearchParams(location.search);
  if (params.get('course')) course.value = params.get('course');

  const setErr = (el, msg='')=>{
    const small = el.parentElement.querySelector('.error');
    if (small) small.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true':'false');
  };

  const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = v => /^\+?\d[\d\s\-]{8,}$/.test(v);

  form.addEventListener('submit', e=>{
    e.preventDefault();
    let ok = true;
    if (!name.value.trim()) { setErr(name,'Please enter your name'); ok=false; } else setErr(name);
    if (!email.value.trim() || !validateEmail(email.value)) { setErr(email,'Enter a valid email'); ok=false; } else setErr(email);
    if (!phone.value.trim() || !validatePhone(phone.value)) { setErr(phone,'Enter a valid phone'); ok=false; } else setErr(phone);
    if (!message.value.trim() || message.value.trim().length<5) { setErr(message,'Write a brief message'); ok=false; } else setErr(message);

    if (ok) {
      // Demo: show alert. Replace with fetch() to your backend endpoint.
      alert('Thanks! Your message was validated (demo). Connect a backend to send emails.');
    }
  });

  // Update WhatsApp link text with form values
  const updateWA = ()=>{
    const text = `Hello M-Tech,%0AName: ${encodeURIComponent(name.value)}%0AEmail: ${encodeURIComponent(email.value)}%0APhone: ${encodeURIComponent(phone.value)}%0ACourse: ${encodeURIComponent(course.value)}%0AMessage: ${encodeURIComponent(message.value)}`;
    waBtn.href = `https://wa.me/923000000000?text=${text}`;
  };
  [name,email,phone,course,message].forEach(el=> el.addEventListener('input', updateWA));
  updateWA();
})();
