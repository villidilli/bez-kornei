const photos = {
  wall: [
    ['wall.jpg', 'Общий план фитостены у лестницы'],
    ['wall-detail.jpg', 'Папоротники и листва крупным планом'],
  ],
  arch: [
    ['arch.jpg', 'Цветочная арка вокруг входа'],
    ['arch-wide.jpg', 'Арка в контексте фасада'],
  ],
  seating: [
    ['seating.jpg', 'Композиции вдоль посадочной зоны'],
    ['seating-close.jpg', 'Деревянное кашпо целиком'],
    ['seating-detail.jpg', 'Детали листвы у окна'],
  ],
  window: [['window.jpg', 'Цветочное оформление окна и входной зоны']],
  planter: [['planter.jpg', 'Композиция в светлом кашпо рядом с диваном, вид сверху']],
};

const gallery = document.querySelector('#gallery');
const image = document.querySelector('#gallery-photo');
const caption = document.querySelector('#gallery-caption');
const count = document.querySelector('#gallery-count');
const previous = document.querySelector('#gallery-prev');
const next = document.querySelector('#gallery-next');
let frames;
let position;

function showFrame(index) {
  position = index;
  const [file, description] = frames[position];
  image.src = 'photos/' + file;
  image.alt = description;
  caption.textContent = description;
  count.textContent = (position + 1) + ' / ' + frames.length;
  previous.disabled = position === 0;
  next.disabled = position === frames.length - 1;
}

for (const opener of document.querySelectorAll('[data-work]')) {
  opener.addEventListener('click', () => {
    frames = photos[opener.dataset.work];
    document.querySelector('#gallery-title').textContent = opener.closest('.work').querySelector('h2').textContent;
    showFrame(0);
    gallery.showModal();
  });
}

previous.addEventListener('click', () => showFrame(position - 1));
next.addEventListener('click', () => showFrame(position + 1));
gallery.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && !previous.disabled) showFrame(position - 1);
  if (event.key === 'ArrowRight' && !next.disabled) showFrame(position + 1);
});
