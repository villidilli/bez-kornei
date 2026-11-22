(()=>{
 const overlay=document.getElementById('assembly-intro'),main=document.getElementById('page-content');
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(overlay&&main){
  // The overlay is visible in the HTML, before deferred scripts or images load.
  main.inert=true;
  document.body.style.overflow='hidden';
  const img=overlay.querySelector('img');
  let stopDrawing;
  const previousOverflow='';
  let closed=false,started=false,playTimer;
  function finish(){
   if(closed)return;closed=true;
   clearTimeout(playTimer);clearTimeout(safetyTimer);stopDrawing?.();
   overlay.classList.add('leaving');main.inert=false;
   document.documentElement.classList.remove('intro-pending');
   setTimeout(()=>{overlay.hidden=true;document.body.style.overflow=previousOverflow;window.dispatchEvent(new Event('intro-finished'))},reduce?0:310);
  }
  function start(){
   if(started||closed)return;started=true;
   overlay.hidden=false;main.inert=true;document.body.style.overflow='hidden';
   // Four seconds of vector animation, then a 1.5-second final hold.
   clearTimeout(safetyTimer);
   safetyTimer=setTimeout(finish,9500);
   playTimer=setTimeout(finish,reduce?1500:5500);
  }
  let safetyTimer=setTimeout(finish,10000);
  if(!reduce&&window.createBrandIntro){
   const canvas=document.createElement('canvas');
   canvas.setAttribute('aria-hidden','true');
   img.replaceWith(canvas);stopDrawing=window.createBrandIntro(canvas);start();
  }else if(img){
   img.addEventListener('load',start,{once:true});
   img.addEventListener('error',finish,{once:true});
   // A fresh image URL restarts the GIF on cached and repeated visits.
   img.src=reduce?'assets/57f4d9ec5a364ce2.svg':`assets/brand-reveal.gif?play=${Date.now()}`;
   if(img.complete&&img.naturalWidth)start();
  }else{finish()}
 }
 // Local event interface only. No analytics provider, cookies or network transmission.
 window.dataLayer=window.dataLayer||[];
 const emit=(event,detail)=>window.dataLayer.push({event,...detail});
 const contactBack=document.getElementById('bct-back');
 let contactOrigin=null;
 document.querySelectorAll('a[href^="tel:"],a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>emit('contact_channel_click',{channel:a.href.startsWith('tel:')?'phone':'email',placement:a.closest('section, #bez-lounge-hero')?.id})));
 document.querySelectorAll('[data-contact-link]').forEach(link=>link.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const target=document.getElementById('bez-contacts');if(!target)return;
  event.preventDefault();
  const section=link.closest('section, #bez-lounge-hero');
  contactOrigin=section?{section,link}:null;
  if(contactBack&&contactOrigin){contactBack.href='#'+section.id;contactBack.hidden=false;}
  window.dispatchEvent(new Event('contact-navigation'));
  if(location.hash!=='#bez-contacts')history.pushState(null,'','#bez-contacts');
  target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
  target.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
  emit('contact_cta_click',{placement:link.closest('section, #bez-lounge-hero')?.id});
 }));
 contactBack?.addEventListener('click',event=>{
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!contactOrigin)return;
  event.preventDefault();
  window.dispatchEvent(new Event('contact-navigation'));
  const {section,link}=contactOrigin;
  history.pushState(null,'','#'+section.id);
  link.focus({preventScroll:true});
  section.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
 });
 document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>emit('work_open',{work_id:b.dataset.project})));
 document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)emit(d.matches('.bc-fold')?'price_example_open':d.dataset.question?'faq_open':'contact_reveal',{placement:d.closest('section')?.id,...(d.dataset.question?{question:d.dataset.question}:{})})}));
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){emit('section_view',{section:e.target.id});observer.unobserve(e.target)}}),{threshold:.25});document.querySelectorAll('#page-content>section').forEach(s=>observer.observe(s))}
})();
