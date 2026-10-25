// Карусели: стрелки, точки, автопрокрутка, пауза при наведении
document.querySelectorAll('.car').forEach(car => {
  const rail = car.querySelector('.rail');
  const prev = Object.assign(document.createElement('button'), { className: 'cb p', type: 'button', textContent: '‹' });
  const next = Object.assign(document.createElement('button'), { className: 'cb n', type: 'button', textContent: '›' });
  prev.setAttribute('aria-label', 'Orqaga');
  next.setAttribute('aria-label', 'Oldinga');
  const dots = Object.assign(document.createElement('div'), { className: 'dots' });
  car.append(prev, next, dots);

  const step = () => rail.clientWidth * 0.8;
  const pages = () => Math.max(1, Math.ceil((rail.scrollWidth - rail.clientWidth) / step()) + 1);
  const atEnd = () => rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;

  const buildDots = () => {
    dots.innerHTML = '';
    const n = pages();
    dots.hidden = n < 2;
    for (let i = 0; i < n; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Slayd ' + (i + 1));
      d.onclick = () => rail.scrollTo({ left: i * step() });
      dots.append(d);
    }
    update();
  };
  const update = () => {
    prev.disabled = rail.scrollLeft <= 4;
    next.disabled = atEnd();
    const i = atEnd() ? dots.children.length - 1 : Math.round(rail.scrollLeft / step());
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
  };

  prev.onclick = () => rail.scrollBy({ left: -step() });
  next.onclick = () => rail.scrollBy({ left: step() });
  rail.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', buildDots);
  addEventListener('load', buildDots);
  buildDots();

  // автопрокрутка (выключена для видео: data-auto="0")
  if (car.dataset.auto === '0') return;
  let paused = false;
  ['mouseenter', 'touchstart', 'focusin'].forEach(e => car.addEventListener(e, () => paused = true, { passive: true }));
  ['mouseleave', 'focusout'].forEach(e => car.addEventListener(e, () => paused = false));
  setInterval(() => {
    if (paused || document.hidden) return;
    atEnd() ? rail.scrollTo({ left: 0 }) : rail.scrollBy({ left: step() });
  }, 4000);
});

// Слайдеры на радиокнопках (акции в первом экране, дни рождения): автосмена
[['of', 3], ['sl', 3]].forEach(([id, n]) => {
  let i = 1;
  const box = document.getElementById(id + '1').parentElement;
  let paused = false;
  box.addEventListener('mouseenter', () => paused = true);
  box.addEventListener('mouseleave', () => paused = false);
  setInterval(() => {
    if (paused || document.hidden) return;
    for (let k = 1; k <= n; k++) if (document.getElementById(id + k).checked) i = k;
    document.getElementById(id + (i % n + 1)).checked = true;
  }, 5000);
});

// Звёздные гости: видео во всплывающем окне
const vm = document.getElementById('vm');
const frame = vm.querySelector('iframe');
const open = id => {
  frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
  vm.classList.add('on');
};
const close = () => {
  vm.classList.remove('on');
  frame.src = '';
};
document.querySelectorAll('[data-yt]').forEach(el => {
  el.addEventListener('click', () => open(el.dataset.yt));
  el.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open(el.dataset.yt)));
});
vm.addEventListener('click', e => (e.target === vm || e.target.closest('.x')) && close());
addEventListener('keydown', e => e.key === 'Escape' && close());

// Анимации при прокрутке (AOS)
if (window.AOS) {
  AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 60 });
  // после смены вкладок высота страницы меняется — пересчитываем позиции
  document.querySelectorAll('input.sr').forEach(r => r.addEventListener('change', () => AOS.refresh()));
}
