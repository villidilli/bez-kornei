const intro = document.querySelector('#brand-intro');
const introImage = intro.querySelector('img');
const introMotion = matchMedia('(prefers-reduced-motion: reduce)');
let introTimeout;
let introFadeTimeout;
let introClosing = false;

function finishIntro(immediate = false) {
  if (!intro.open || introClosing) return;
  introClosing = true;
  clearTimeout(introTimeout);
  intro.classList.add('is-closing');
  introFadeTimeout = setTimeout(() => {
    intro.close();
    document.documentElement.classList.remove('brand-intro-active');
    introImage.removeAttribute('src');
    document.dispatchEvent(new Event('brand-intro-end'));
  }, immediate || introMotion.matches ? 0 : 450);
}

if (!location.hash && typeof intro.showModal === 'function') {
  intro.showModal();
  document.documentElement.classList.add('brand-intro-active');
  introImage.addEventListener('load', () => {
    clearTimeout(introTimeout);
    introTimeout = setTimeout(() => finishIntro(), 6000);
  }, { once: true });
  introImage.addEventListener('error', () => finishIntro(true), { once: true });
  introTimeout = setTimeout(() => finishIntro(true), 12000);
  introImage.src = 'brand-reveal.gif?v=atelier-greening';
}

intro.addEventListener('cancel', event => {
  event.preventDefault();
  finishIntro();
});
window.addEventListener('pagehide', () => {
  clearTimeout(introTimeout);
  clearTimeout(introFadeTimeout);
  if (intro.open) intro.close();
  document.documentElement.classList.remove('brand-intro-active');
});
