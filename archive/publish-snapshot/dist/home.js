const media = document.querySelector('.hero-media');
const frames = [...media.querySelectorAll('.hero-image')];
const controls = media.querySelector('.frame-controls');
const frameButtons = [...controls.querySelectorAll('[data-frame]')];
const motionButton = document.querySelector('#motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let playing = !reducedMotion.matches;
let onScreen = true;
let timer;

function setFrame(index) {
  current = index;
  for (const [i, frame] of frames.entries()) {
    frame.classList.toggle('is-current', i === current);
    frame.setAttribute('aria-hidden', String(i !== current));
    frameButtons[i].setAttribute('aria-pressed', String(i === current));
  }
}

function schedule() {
  clearTimeout(timer);
  const active = playing && onScreen && !document.hidden && !document.querySelector('#brand-intro[open]');
  media.classList.toggle('is-playing', active);
  motionButton.textContent = playing ? 'Пауза' : 'Пуск';
  if (active) timer = setTimeout(() => {
    setFrame((current + 1) % frames.length);
    schedule();
  }, 7500);
}

for (const button of frameButtons) {
  button.addEventListener('click', () => {
    setFrame(Number(button.dataset.frame));
    schedule();
  });
}
motionButton.addEventListener('click', () => {
  playing = !playing;
  schedule();
});
document.addEventListener('visibilitychange', schedule);
document.addEventListener('brand-intro-end', schedule);
reducedMotion.addEventListener('change', event => {
  playing = !event.matches;
  schedule();
});

if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    schedule();
  }, { threshold: 0.2 }).observe(media);

  if (!reducedMotion.matches) {
    const reveal = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    for (const element of document.querySelectorAll('[data-reveal]')) reveal.observe(element);
  }
}

controls.hidden = false;
schedule();
