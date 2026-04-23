
/* script.js — melhorias de interação, validação e acessibilidade
   - Mantém configuração centralizada (whatsappNumber, mapQuery)
   - Sem bibliotecas externas para manter leveza
   - Font Awesome (CDN) foi escolhida para ícones por compatibilidade e leveza
*/

const config = {
  whatsappNumber: '5511999999999',
  whatsappDefaultMessage: 'Olá! Gostaria de solicitar um orçamento de peças automotivas.',
  mapQuery: 'Av. Exemplo, 123 - Centro - São Paulo, SP',
  testimonialInterval: 6000
};

const qs = (s) => document.querySelector(s);
const qsa = (s) => Array.from(document.querySelectorAll(s));

function normalizeNumber(n) {
  return (n || '').toString().replace(/\D/g, '');
}

function createWhatsappLink(message = config.whatsappDefaultMessage, number = config.whatsappNumber) {
  const num = normalizeNumber(number);
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

function bindWhatsappLinks() {
  // Apenas o botão flutuante abre o chat direto; orçamentos devem vir pelo formulário.
  ['#floatingWhatsapp'].forEach((sel) => {
    const el = qs(sel);
    if (el) el.href = createWhatsappLink();
  });
}

function initMenu() {
  const menuBtn = qs('#menuBtn');
  const nav = qs('#nav');
  if (!menuBtn || !nav) return;

  function toggle() {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', toggle);
  qsa('#nav a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach((el) => observer.observe(el));
}

function showFieldError(field, message) {
  const container = field.closest('.field');
  if (!container) return;
  const err = container.querySelector('.field-error');
  if (err) err.textContent = message || '';
  field.classList.toggle('invalid', !!message);
}

function validateField(field) {
  const name = field.name;
  const val = field.value.trim();
  if (field.required && !val) { showFieldError(field, 'Campo obrigatório.'); return false; }

  if (name === 'email') {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) { showFieldError(field, 'E-mail inválido.'); return false; }
  }
  if (name === 'phone') {
    const digits = normalizeNumber(val);
    if (digits.length < 10) { showFieldError(field, 'Informe um telefone válido com DDD.'); return false; }
  }
  if (name === 'name' && val.length < 3) { showFieldError(field, 'Nome muito curto.'); return false; }
  if (name === 'message' && val.length < 8) { showFieldError(field, 'Descreva melhor a peça (mín. 8 caracteres).'); return false; }

  showFieldError(field, '');
  return true;
}

function initForm() {
  const form = qs('#quoteForm');
  const note = qs('#formNote');
  if (!form || !note) return;

  const inputs = qsa('#quoteForm input, #quoteForm textarea');
  inputs.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => { if (field.classList.contains('invalid')) validateField(field); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    inputs.forEach((f) => { if (!validateField(f)) ok = false; });
    if (!ok) { note.textContent = 'Revise os campos obrigatórios antes de enviar.'; note.className = 'form-note error'; return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const text = [
      'Olá! Gostaria de solicitar um orçamento.',
      `Nome: ${data.name}`,
      `Telefone: ${data.phone}`,
      `E-mail: ${data.email}`,
      `Veículo: ${data.vehicle || 'Não informado'}`,
      `Detalhes: ${data.message}`
    ].join('\n');

    note.textContent = 'Abrindo conversa no WhatsApp...';
    note.className = 'form-note success';
    window.open(createWhatsappLink(text), '_blank', 'noopener');
  });
}

function initMap() {
  const iframe = qs('#mapIframe');
  if (!iframe) return;
  const q = config.mapQuery || 'Av. Exemplo, 123 - Centro - São Paulo, SP';
  iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
}

function initTestimonials() {
  const slides = qsa('.slide');
  if (!slides.length) return;
  let i = 0;
  const show = (idx) => { slides.forEach((s, k) => s.classList.toggle('active', k === idx)); };
  show(0);
  const next = () => { i = (i + 1) % slides.length; show(i); };
  const prev = () => { i = (i - 1 + slides.length) % slides.length; show(i); };
  qs('.slider-btn.next')?.addEventListener('click', next);
  qs('.slider-btn.prev')?.addEventListener('click', prev);
  setInterval(next, config.testimonialInterval);
}

document.addEventListener('DOMContentLoaded', () => {
  bindWhatsappLinks();
  initMenu();
  initReveal();
  initForm();
  initMap();
  initTestimonials();
});
