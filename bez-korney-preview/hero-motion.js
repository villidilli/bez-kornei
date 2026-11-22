(()=>{
'use strict';
const scene=document.querySelector('#bez-lounge-hero .bh-scene');
if(!scene)return;
const image=scene.querySelector('.bh-photo'),canvas=scene.querySelector('canvas'),button=scene.querySelector('.bh-motion-toggle');
const before=new Image();before.alt='';before.className='bh-before';before.setAttribute('aria-hidden','true');scene.insertBefore(before,canvas);
const replay=document.createElement('button');replay.type='button';replay.className='bh-replay';replay.textContent='↻ Повторить переход';replay.hidden=true;scene.append(replay);
const status=document.createElement('span');status.className='bh-state';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='Без озеленения';status.hidden=true;scene.append(status);
let revealTime=0,started=false;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let gl,program,raf=0,elapsed=0,last=0,manual=false,visible=false,initialized=false;
function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
function allowed(){return !manual&&visible&&!document.hidden&&!preference.matches;}
function resume(){if(initialized&&started&&allowed()&&!raf)raf=requestAnimationFrame(draw);}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('shader');return s;}
function resize(){if(!gl)return;const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);const w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(canvas.width===w&&canvas.height===h)return;canvas.width=w;canvas.height=h;gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);gl.uniform1f(gl.getUniformLocation(program,'time'),elapsed/1000);gl.drawArrays(gl.TRIANGLES,0,6);}
// Each loop: one second empty, slow reveal, hold, reverse, then repeat.
function progress(){const t=revealTime%16500;let p;if(t<1000)p=0;else if(t<8000)p=(t-1000)/7000;else if(t<10000)p=1;else if(t<15500)p=1-(t-10000)/5500;else p=0;return p*p*(3-2*p);}
function maybeStart(){const intro=document.getElementById('assembly-intro');if(started||!initialized||!visible||document.hidden||preference.matches||(intro&&!intro.hidden))return;started=true;scene.classList.add('reveal-active');replay.hidden=false;status.hidden=false;resume();}
function draw(now){raf=0;if(!allowed())return;if(last){const dt=Math.min(now-last,100);elapsed+=dt;revealTime+=dt;}last=now;const amount=progress();const text=amount===0?'Без озеленения':amount===1?'С озеленением':revealTime%16500<10000?'Пространство меняется':'Возвращаемся к началу';if(status.textContent!==text)status.textContent=text;if(!gl){before.style.setProperty('--before-edge',(118-amount*136)+'%');resume();return;}gl.uniform1f(gl.getUniformLocation(program,'progress'),amount);gl.uniform1f(gl.getUniformLocation(program,'time'),elapsed/1000);gl.drawArrays(gl.TRIANGLES,0,6);resume();}
function init(){if(initialized||preference.matches||!image.naturalWidth||!before.naturalWidth)return;try{
gl=canvas.getContext('webgl',{alpha:false,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});if(!gl){fallback();return;}
const vertex=shader(gl.VERTEX_SHADER,'attribute vec2 position; varying vec2 uv; void main(){uv=(position+1.0)*0.5;gl_Position=vec4(position,0.,1.);}');
const fragment=shader(gl.FRAGMENT_SHADER,`precision mediump float;
varying vec2 uv;uniform sampler2D photo;uniform sampler2D beforePhoto;uniform float progress;uniform vec2 resolution;uniform vec2 imageSize;uniform float time;
void main(){
 float vr=resolution.x/resolution.y,ir=imageSize.x/imageSize.y;
 vec2 p=uv;
 if(ir>vr)p.x=(p.x-.5)*(vr/ir)+.5;else p.y=(p.y-.5)*(ir/vr)+.5;
 // Keep every object fixed. Only the illumination changes.
 vec3 afterColor=texture2D(photo,p).rgb;
 vec3 beforeColor=texture2D(beforePhoto,p).rgb;
 // Preserve the original furniture and floor throughout the transition.
 float plantArea=smoothstep(.44+p.x*.07,.455+p.x*.07,p.y);
 beforeColor=mix(afterColor,beforeColor,plantArea);
 float edge=-.16+progress*1.32;
 float contour=sin(p.x*13.+.7)*.018+sin(p.x*31.)*.009;
 float reveal=1.-smoothstep(edge-.075,edge+.075,p.y+contour);
 vec3 original=mix(beforeColor,afterColor,reveal);
 float drift=sin(time*.19)*.12;
 float diagonal=p.x*.82+p.y*.55;
 float sunCenter=.66+drift;
 float sunlight=exp(-pow((diagonal-sunCenter)/.27,2.));
 float softShadow=exp(-pow((diagonal-(sunCenter-.22))/.15,2.));
 float fineShadow=.5+.5*sin(diagonal*29.+sin(time*.13)*.85);
 float shadowBand=smoothstep(.35,.65,fineShadow)*softShadow;
 float exposure=1.+sunlight*.065-softShadow*.055-shadowBand*.022;
 vec3 color=original*exposure;
 color+=vec3(.009,.006,.001)*sunlight;
 gl_FragColor=vec4(color,1.);
}`);
program=gl.createProgram();gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('program');gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const location=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);gl.uniform2f(gl.getUniformLocation(program,'imageSize'),image.naturalWidth,image.naturalHeight);
gl.uniform1i(gl.getUniformLocation(program,'photo'),0);
gl.activeTexture(gl.TEXTURE1);const beforeTexture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,beforeTexture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,before);gl.uniform1i(gl.getUniformLocation(program,'beforePhoto'),1);
initialized=true;resize();gl.uniform1f(gl.getUniformLocation(program,'time'),0);gl.drawArrays(gl.TRIANGLES,0,6);scene.classList.add('is-ready','has-gl');maybeStart();new ResizeObserver(resize).observe(scene);resume();
 }catch{stop();fallback();}}
function fallback(){gl=null;initialized=true;scene.classList.remove('is-ready','has-gl');maybeStart();}
replay.addEventListener('click',()=>{stop();revealTime=0;manual=false;status.textContent='Без озеленения';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Приостановить анимацию');button.querySelector('.bh-motion-label').textContent='Пауза';button.querySelector('[aria-hidden]').textContent='Ⅱ';if(gl){gl.uniform1f(gl.getUniformLocation(program,'progress'),0);gl.drawArrays(gl.TRIANGLES,0,6);}else before.style.setProperty('--before-edge','118%');resume();});
const intro=document.getElementById('assembly-intro');if(intro)new MutationObserver(maybeStart).observe(intro,{attributes:true,attributeFilter:['hidden']});
button.addEventListener('click',()=>{manual=!manual;button.setAttribute('aria-pressed',String(manual));button.setAttribute('aria-label',manual?'Возобновить движение':'Приостановить движение');button.querySelector('.bh-motion-label').textContent=manual?'Продолжить':'Пауза';button.querySelector('[aria-hidden]').textContent=manual?'▷':'Ⅱ';manual?stop():resume();});
document.addEventListener('visibilitychange',()=>{document.hidden?stop():(maybeStart(),resume())});
preference.addEventListener('change',()=>{if(preference.matches){stop();scene.classList.remove('reveal-active');status.hidden=true;replay.hidden=true;}else{started=false;init();maybeStart();resume()}});
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?(maybeStart(),resume()):stop()},{threshold:0}).observe(scene);
canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stop();gl=null;scene.classList.remove('is-ready','has-gl');resume()});
before.addEventListener('load',init,{once:true});before.src='assets/hero-before.png';if(image.complete)init();else image.addEventListener('load',init,{once:true});
})();
