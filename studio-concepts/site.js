const works = {
  wall: {
    kind: 'Вертикаль',
    title: 'Фитостена у лестницы',
    description: 'Сплошная зелёная плоскость вдоль прохода. Напротив неё — рельефная стена и лестница.',
    frames: [
      ['wall.jpg', 'Общий план. Фитостена, лестница и рельеф напротив.'],
      ['wall-detail.jpg', 'Деталь. Папоротники и листва крупным планом.'],
    ],
  },
  seating: {
    kind: 'Зонирование',
    title: 'Зелень между посадочными местами',
    description: 'Длинные деревянные кашпо отмечают границы между столами. С общего плана видно, как они повторяются вдоль зала.',
    frames: [
      ['seating.jpg', 'Общий план зала с растительными композициями.'],
      ['seating-close.jpg', 'Деревянное кашпо целиком.'],
      ['seating-detail.jpg', 'Листва у окна.'],
    ],
  },
  arch: {
    kind: 'Вход',
    title: 'Цветочная арка',
    description: 'Красные и малиновые цветы, зелень и декоративные шляпы собираются в рамку вокруг дверного проёма.',
    frames: [
      ['arch.jpg', 'Фронтальный вид цветочной арки.'],
      ['arch-wide.jpg', 'Арка в контексте фасада.'],
      ['arch-install.jpg', 'Монтаж композиции со стремянки.'],
    ],
  },
  window: {
    kind: 'Фасад',
    title: 'Композиция вокруг окна',
    description: 'Две вертикали зелени обрамляют окно. Розовые цветы и жёлтые скворечники отмечают нижнюю часть композиции.',
    frames: [['window.jpg', 'Вид на окно и ступени у входа.']],
  },
  planter: {
    kind: 'Деталь интерьера',
    title: 'Композиция в светлом кашпо',
    description: 'Вид сверху показывает плотность листвы и форму длинного кашпо рядом с диваном.',
    frames: [['planter.jpg', 'Композиция рядом с диваном, снятая сверху.']],
  },
};

const editions = [...document.querySelectorAll('main > article')];
const switchLinks = [...document.querySelectorAll('[data-switch]')];
const studioIcon = document.querySelector('#studio-icon');
const workDialog = document.querySelector('#work-dialog');
const visitDialog = document.querySelector('#visit-dialog');
const workImage = document.querySelector('#work-image');
const previous = document.querySelector('#work-prev');
const next = document.querySelector('#work-next');
let activeWork;
let frameIndex;

function showEdition() {
  const target = document.getElementById(location.hash.slice(1));
  const active = target?.closest('main > article') ?? editions[0];
  for (const edition of editions) edition.hidden = edition !== active;
  for (const link of switchLinks) {
    if (link.dataset.switch === active.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  document.title = active === editions[0] ? 'НЕСЕЗОН — дизайн-проба' : 'БЕЗ КОРНЕЙ — дизайн-проба';
  studioIcon.href = active === editions[0] ? 'nesezon-mark.svg' : 'bez-mark.svg';
  if (target === active) window.scrollTo(0, 0);
  else target?.scrollIntoView();
}

for (const gallery of document.querySelectorAll('[data-gallery]')) {
  gallery.dataset.gallery.split(',').forEach((key, index) => {
    const work = works[key];
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'work-card';
    card.dataset.work = key;
    const number = String(index + 1).padStart(2, '0');
    card.innerHTML = `
      <img src="photos/${work.frames[0][0]}" alt="" loading="lazy">
      <span class="card-label"><span><span class="eyebrow">${number} / ${work.kind}</span>
      <span class="card-title">${work.title}</span></span><span class="card-arrow" aria-hidden="true">↗</span></span>`;
    gallery.append(card);
  });
}

function showFrame(index) {
  frameIndex = index;
  const [file, caption] = activeWork.frames[index];
  workImage.src = 'photos/' + file;
  workImage.alt = caption;
  document.querySelector('#work-caption').textContent = caption;
  document.querySelector('#work-count').textContent = (index + 1) + ' / ' + activeWork.frames.length;
  previous.disabled = index === 0;
  next.disabled = index === activeWork.frames.length - 1;
}

for (const opener of document.querySelectorAll('[data-work]')) {
  opener.addEventListener('click', () => {
    activeWork = works[opener.dataset.work];
    document.querySelector('#work-title').textContent = activeWork.title;
    document.querySelector('#work-kind').textContent = activeWork.kind;
    document.querySelector('#work-description').textContent = activeWork.description;
    showFrame(0);
    workDialog.showModal();
  });
}

previous.addEventListener('click', () => showFrame(frameIndex - 1));
next.addEventListener('click', () => showFrame(frameIndex + 1));
workDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && !previous.disabled) showFrame(frameIndex - 1);
  if (event.key === 'ArrowRight' && !next.disabled) showFrame(frameIndex + 1);
});
for (const opener of document.querySelectorAll('[data-visit]')) {
  opener.addEventListener('click', () => visitDialog.showModal());
}
window.addEventListener('hashchange', showEdition);
showEdition();
