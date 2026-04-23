
const config = {
  whatsappNumber: '5511999999999',
  whatsappDefaultMessage: 'Olá! Quero solicitar um orçamento de peças automotivas.',
};

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

function createWhatsappLink(message = config.whatsappDefaultMessage) {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function bindWhatsappLinks() {
  ['#headerWhatsapp', '#heroWhatsapp', '#contactWhatsapp', '#floatingWhatsapp'].forEach((selector) => {
    const el = qs(selector);
    if (el) el.href = createWhatsappLink();
  });
}

function initMenu() {
  const menuBtn = qs('#menuBtn');
  const nav = qs('#nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  qsa('#nav a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  qsa('.reveal').forEach((el) => observer.observe(el));
}

function validateField(field) {
  const valid = field.checkValidity();
  field.classList.toggle('invalid', !valid);
  return valid;
}

function initForm() {
  const form = qs('#quoteForm');
  const note = qs('#formNote');
  if (!form || !note) return;

  const fields = qsa('#quoteForm input, #quoteForm textarea');
  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const ok = form.checkValidity();
    fields.forEach(validateField);

    if (!ok) {
      note.textContent = 'Revise os campos obrigatórios antes de enviar.';
      note.className = 'form-note error';
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const text = [
      'Olá! Quero solicitar um orçamento.',
      `Nome: ${data.name}`,
      `Telefone: ${data.phone}`,
      `E-mail: ${data.email}`,
      `Veículo: ${data.vehicle || 'Não informado'}`,
      `Detalhes: ${data.message}`,
    ].join('\n');

    note.textContent = 'Abrindo conversa no WhatsApp...';
    note.className = 'form-note success';
    window.open(createWhatsappLink(text), '_blank', 'noopener');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindWhatsappLinks();
  initMenu();
  initReveal();
  initForm();
});
