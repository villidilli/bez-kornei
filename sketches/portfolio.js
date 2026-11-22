(()=>{
 const data=window.BEZ_WORKS,root=document.querySelector('[data-portfolio]');
 if(!data||!root)return;
 root.querySelectorAll('[data-photo]').forEach(img=>{img.src=data.assets[img.dataset.photo]});
 const dialog=root.querySelector('dialog'),image=dialog.querySelector('.portfolio-photo'),caption=dialog.querySelector('.portfolio-description'),counter=dialog.querySelector('.portfolio-counter'),prev=dialog.querySelector('[data-prev]'),next=dialog.querySelector('[data-next]');
 let project,index=0,trigger,previousOverflow='';
 function render(){
  const [key,description]=project.photos[index];image.src=data.assets[key];image.alt=description;caption.textContent=description;
  counter.textContent=`${index+1} / ${project.photos.length}`;prev.disabled=index===0;next.disabled=index===project.photos.length-1;
  prev.hidden=next.hidden=project.photos.length===1;
 }
 root.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
  trigger=button;project=data.projects[button.dataset.project];index=Number(button.dataset.photoIndex||0);
  dialog.querySelector('[data-gallery-title]').textContent=project.title;render();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
 }));
 const move=step=>{if(index+step>=0&&index+step<project.photos.length){index+=step;render()}};
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
 dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1)}if(event.key==='ArrowRight'){event.preventDefault();move(1)}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;trigger?.focus({preventScroll:true})});
})();
