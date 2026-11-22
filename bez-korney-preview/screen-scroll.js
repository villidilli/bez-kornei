(()=>{
 'use strict';
 const hero=document.getElementById('bez-lounge-hero');
 const second=document.getElementById('bez-why-artificial');
 if(!hero||!second)return;
 const screens=[hero,...document.querySelectorAll('#page-content > section')].filter((e,i,a)=>a.indexOf(e)===i);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let total=0,previous=0,lastWheel=0,lockUntil=0,frame=0;
 function cancel(){cancelAnimationFrame(frame);frame=0;lockUntil=0;total=0;}
 function insideControl(target,dy){
  if(!(target instanceof Element))return true;
  if(target.closest('input,textarea,select,[contenteditable="true"],dialog[open]'))return true;
  for(let el=target;el&&el!==document.body;el=el.parentElement){
   if(/auto|scroll/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight+2){
    if(dy>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0)return true;
   }
  }
  return false;
 }
 function glide(destination,now){
  const from=window.scrollY,distance=destination-from;
  lockUntil=now+850;
  function step(stamp){
   const t=Math.min(1,(stamp-now)/680),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
   window.scrollTo({top:from+distance*ease,behavior:'instant'});
   frame=t<1?requestAnimationFrame(step):0;
  }
  frame=requestAnimationFrame(step);
 }
 window.addEventListener('wheel',event=>{
  const intro=document.getElementById('assembly-intro');
  if(reduce.matches||event.ctrlKey||event.metaKey||event.shiftKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)||!event.deltaY||(intro&&!intro.hidden)||document.querySelector('dialog[open]')||insideControl(event.target,event.deltaY))return;
  const now=performance.now(),dy=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1);
  if(lockUntil&&now<lockUntil+Math.min(250,Math.max(0,lastWheel+180-lockUntil))){event.preventDefault();lastWheel=now;return;}
  const y=window.scrollY;let destination=null;
  for(let i=0;i<screens.length;i++){
   const top=screens[i].getBoundingClientRect().top+y;
   const next=i+1<screens.length?screens[i+1].getBoundingClientRect().top+y:null;
   if(dy>0&&next!==null&&y>=Math.max(top,next-innerHeight-40)-2&&y<next-8){destination=next;break;}
   if(dy<0&&i>0&&y>=top-8&&y<=top+40){destination=screens[i-1].getBoundingClientRect().top+y;break;}
  }
  if(destination===null){total=0;previous=dy;lastWheel=now;return;}
  if(now-lastWheel>220||Math.sign(previous)!==Math.sign(dy))total=0;
  total+=dy;previous=dy;lastWheel=now;
  if(Math.abs(total)<65)return;
  event.preventDefault();total=0;
  glide(destination,now);
 },{passive:false});
 window.addEventListener('keydown',event=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Escape',' '].includes(event.key))cancel();});
 window.addEventListener('pointerdown',cancel,{passive:true});
 window.addEventListener('touchstart',cancel,{passive:true});
 window.addEventListener('resize',cancel);
 window.addEventListener('contact-navigation',cancel);
 reduce.addEventListener('change',cancel);
})();
