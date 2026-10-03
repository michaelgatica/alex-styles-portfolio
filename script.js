const projectData = {
  northline: {
    title: 'Northline Coffee',
    category: 'Brand identity · Packaging',
    image: 'assets/northline.svg',
    alt: 'Northline Coffee identity shown on cobalt and cream packaging',
    description: 'A modular identity for a neighborhood roaster that balances utilitarian type with bright, optimistic color. The system extends from packaging and menus to social content and retail signage.',
    facts: { Role: 'Brand strategy, identity, packaging', Year: '2026', Deliverables: 'Logo system, packaging, retail toolkit' }
  },
  'field-notes': {
    title: 'Field Notes Quarterly',
    category: 'Editorial system · Art direction',
    image: 'assets/field-notes.svg',
    alt: 'Field Notes Quarterly editorial covers with modern typography',
    description: 'A flexible editorial system for a publication documenting creative work and overlooked places. A strict grid supports expressive cover typography and highly varied photography.',
    facts: { Role: 'Editorial design, art direction', Year: '2025', Deliverables: 'Grid system, covers, digital templates' }
  },
  kinetic: {
    title: 'Kinetic Health',
    category: 'Digital product · UI system',
    image: 'assets/kinetic.svg',
    alt: 'Kinetic Health mobile interface with lime and dark navy graphics',
    description: 'A clear, energetic interface for a movement coaching platform. The visual language turns complex progress data into an approachable daily rhythm across mobile and desktop screens.',
    facts: { Role: 'Product design, UI system', Year: '2026', Deliverables: 'UX flows, interface system, prototypes' }
  },
  'common-ground': {
    title: 'Common Ground',
    category: 'Campaign · Environmental graphics',
    image: 'assets/common-ground.svg',
    alt: 'Common Ground cultural campaign poster with abstract coral shapes',
    description: 'A public-facing campaign for a citywide arts program. The system uses oversized shapes, accessible color contrast, and a bold typographic voice across posters, wayfinding, and digital media.',
    facts: { Role: 'Campaign concept, environmental design', Year: '2025', Deliverables: 'Posters, wayfinding, social toolkit' }
  }
};

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const modal = document.querySelector('[data-modal]');
const modalDialog = modal.querySelector('.modal__dialog');
const modalTitle = modal.querySelector('[data-modal-title]');
const modalCategory = modal.querySelector('[data-modal-category]');
const modalDescription = modal.querySelector('[data-modal-description]');
const modalImage = modal.querySelector('[data-modal-image]');
const modalFacts = modal.querySelector('[data-modal-facts]');
const toast = document.querySelector('[data-toast]');
let lastFocusedElement = null;

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

function openProject(projectKey, trigger) {
  const project = projectData[projectKey];
  if (!project) return;

  lastFocusedElement = trigger;
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalDescription.textContent = project.description;
  modalImage.src = project.image;
  modalImage.alt = project.alt;
  modalFacts.innerHTML = Object.entries(project.facts)
    .map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`)
    .join('');

  modal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modal.querySelector('.modal__close').focus());
}

function closeProject() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll('[data-project]').forEach(card => {
  const open = () => openProject(card.dataset.project, card);
  card.addEventListener('click', open);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});

modal.querySelectorAll('[data-modal-close]').forEach(control => control.addEventListener('click', closeProject));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.hidden) closeProject();

  if (event.key === 'Tab' && !modal.hidden) {
    const focusable = [...modalDialog.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(element => !element.disabled && !element.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const contactForm = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

function setError(field, message) {
  const error = document.querySelector(`[data-error-for="${field.id}"]`);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  let valid = true;

  setError(name, '');
  setError(email, '');
  setError(message, '');

  if (!name.value.trim()) { setError(name, 'Please enter your name.'); valid = false; }
  if (!email.value.trim() || !email.validity.valid) { setError(email, 'Please enter a valid email address.'); valid = false; }
  if (message.value.trim().length < 15) { setError(message, 'Please share at least 15 characters about your project.'); valid = false; }

  if (!valid) {
    formStatus.textContent = 'Please review the highlighted fields.';
    contactForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  formStatus.textContent = 'Thanks—your inquiry is ready to send.';
  showToast('Project inquiry prepared successfully.');
  contactForm.reset();
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
