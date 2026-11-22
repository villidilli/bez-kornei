(()=>{
 const scene=document.querySelector('#bez-lounge-hero .bh-scene');if(!scene)return;
 const button=scene.querySelector('.bh-motion-toggle'),preference=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false,visible=false;
 function update(){scene.classList.toggle('light-paused',paused||!visible||document.hidden||preference.matches);button.hidden=preference.matches;}
 scene.classList.add('has-light');
 button.setAttribute('aria-label','Приостановить световые эффекты');
 button.addEventListener('click',()=>{paused=!paused;button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',paused?'Возобновить световые эффекты':'Приостановить световые эффекты');button.querySelector('.bh-motion-label').textContent=paused?'Продолжить':'Пауза';button.querySelector('[aria-hidden]').textContent=paused?'▷':'Ⅱ';update();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;update();}).observe(scene);
 document.addEventListener('visibilitychange',update);preference.addEventListener('change',update);update();
})();
