from pathlib import Path
import re,base64,hashlib,shutil
v=Path(__file__).parent/'sketches'
out=Path(__file__).parent/'bez-korney-preview'
assets=out/'assets';assets.mkdir(parents=True,exist_ok=True)
shutil.copyfile(v/'bez-k-leaf-favicon.svg',out/'favicon.svg')
names=['bez-lounge-hero','bez-why-artificial','bez-selected-works','bez-design-partners','bez-process','bez-cost-factors','bez-questions','bez-contacts']
def extract(m):
 mime,b64=m.groups();data=base64.b64decode(b64);ext={'image/jpeg':'jpg','image/png':'png','image/svg+xml':'svg'}[mime]
 name=hashlib.sha256(data).hexdigest()[:16]+'.'+ext
 (assets/name).write_bytes(data)
 return 'assets/'+name
fragments=[]
for name in names:
 html=(v/(name+'.html')).read_text(encoding='utf-8')
 html=re.sub(r'data:(image/(?:jpeg|png|svg\+xml));base64,([A-Za-z0-9+/=]+)',extract,html)
 html=html.replace('https://bez-korney-studio.cherishedfrog1.chatgpt.site/works.html','#bez-selected-works').replace(' target="_blank"','').replace(' rel="noopener"','')
 fragments.append(html)
shutil.copyfile(v/'hero-motion.js',out/'hero-motion.js')
shutil.copyfile(v/'hero-light.js',out/'hero-light.js')
shutil.copyfile(v/'screen-scroll.js',out/'screen-scroll.js')
for filename in ['portfolio.js','portfolio.css','works.css']:
 shutil.copyfile(v/filename,out/filename)
portfolio=(v/'works.html').read_text(encoding='utf-8')
portfolio=re.sub(r'data:(image/(?:jpeg|png|svg\+xml));base64,([A-Za-z0-9+/=]+)',extract,portfolio)
favicon_links='''<link rel="icon" href="favicon.ico?v=k-leaf-2" sizes="16x16 32x32 48x48">
<link rel="icon" href="favicon.svg?v=k-leaf-2" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="apple-touch-icon.png?v=k-leaf-2" sizes="180x180">'''
portfolio=portfolio.replace('</head>',favicon_links+'\n</head>',1)
(out/'works.html').write_text(portfolio,encoding='utf-8')
shutil.copyfile(v/'assets'/'hero-before.png',assets/'hero-before.png')
shutil.copyfile(v/'assets'/'brand-final.png',assets/'brand-final.png')
shutil.copyfile(Path(__file__).parent/'bez-korney-approved-animation.gif',assets/'brand-reveal.gif')
shutil.copyfile(Path(__file__).parent/'brand'/'merch'/'k-leaf-concept-2026-11-22.png',assets/'merch-k-leaf.png')
head='''<!doctype html>
<html lang="ru" class="intro-pending"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html.intro-pending{background:#f3f0e9}html.intro-pending #page-content{visibility:hidden}#assembly-intro{position:fixed;inset:0;z-index:1000;background:#f3f0e9;display:grid;place-items:center}#assembly-intro img{width:100%;height:100%;object-fit:contain}#assembly-intro[hidden]{display:none}</style>
<style>/* Slow-load indicator: original merch artwork, with a quiet leaf orbit. */
#bez-load-wait{position:fixed;inset:0;z-index:1002;display:grid;place-content:center;justify-items:center;gap:24px;background:#f3f0e9;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .3s,visibility .3s}
html.load-wait #bez-load-wait{opacity:1;visibility:visible;pointer-events:auto}
.blw-art{position:relative;width:290px;height:290px}
.blw-mark{position:absolute;width:124px;height:218px;left:50%;top:50%;transform:translate(-50%,-50%);overflow:hidden}
#bez-load-wait .blw-mark img{position:absolute;width:620px;max-width:none;height:auto;left:50%;top:50%;transform:translate(-50%,-50%);filter:url(#blw-ink)}
.blw-orbit{position:absolute;inset:0;animation:blw-turn 16s linear infinite;animation-play-state:paused}
html.load-wait .blw-orbit{animation-play-state:running}
.blw-leaf{position:absolute;left:calc(50% - 10px);top:calc(50% - 6px);width:20px;height:12px;transform:rotate(var(--angle)) translateY(-136px) rotate(28deg);color:#ac3d2e;opacity:var(--opacity)}
.blw-leaf svg{width:100%;height:100%;overflow:visible}
.blw-caption{margin:0;color:#626359;font:12px/1.5 Arial,sans-serif;letter-spacing:.08em}
@keyframes blw-turn{to{transform:rotate(360deg)}}
@media(max-height:430px){.blw-art{transform:scale(.7);margin:-40px}#bez-load-wait{gap:12px}}
@media(prefers-reduced-motion:reduce){.blw-orbit{animation:none}#bez-load-wait{transition:none}}
</style>
<script>
(()=>{let timer,escapeTimer;const root=document.documentElement;
const show=()=>{root.classList.add('load-wait');document.getElementById('bez-load-wait')?.setAttribute('aria-hidden','false')};
const hide=()=>{clearTimeout(timer);root.classList.remove('load-wait');document.getElementById('bez-load-wait')?.setAttribute('aria-hidden','true')};
window.bezLoadWait={show,hide,release:()=>clearTimeout(escapeTimer)};
timer=setTimeout(show,900);
escapeTimer=setTimeout(()=>{hide();root.classList.remove('intro-pending');const main=document.getElementById('page-content');if(main)main.inert=false;const intro=document.getElementById('assembly-intro');if(intro)intro.hidden=true;document.body.style.overflow='';window.dispatchEvent(new Event('intro-finished'))},18000);
})();
</script>
<noscript><style>#bez-load-wait{display:none!important}#assembly-intro{display:none!important}html.intro-pending #page-content{visibility:visible}</style></noscript>
<meta name="robots" content="noindex,nofollow"><title>БЕЗ КОРНЕЙ — ателье искусственного озеленения</title>
<meta name="description" content="Композиции из искусственных растений для коммерческих интерьеров. Реальные работы, примеры стоимости и сотрудничество с дизайнерами.">
<link rel="preload" href="assets/fonts/cormorant-garamond-regular.ttf" as="font" type="font/ttf" crossorigin>
<link rel="stylesheet" href="assembly.css"><link rel="stylesheet" href="cta.css"><script src="brand-intro.js" defer></script><script src="assembly.js" defer></script><script src="screen-scroll.js" defer></script></head><body>
<a class="skip-link" href="#bez-lounge-hero">К содержанию</a>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><filter id="blw-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 8 -8 0 0 -.35"/></filter></defs></svg><div id="bez-load-wait" role="status" aria-live="polite" aria-label="Загружаем пространство" aria-hidden="true"><div class="blw-art" aria-hidden="true"><div class="blw-mark"><img src="assets/merch-k-leaf.png" width="1536" height="1024" alt="" fetchpriority="high"></div><div class="blw-orbit"><span class="blw-leaf" style="--angle:0deg;--opacity:1"><svg viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 20C4 7 15 1 32 2C28 16 17 23 2 20Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 19L28 5" stroke="currentColor" stroke-width=".9"/></svg></span><span class="blw-leaf" style="--angle:60deg;--opacity:0.88"><svg viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 20C4 7 15 1 32 2C28 16 17 23 2 20Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 19L28 5" stroke="currentColor" stroke-width=".9"/></svg></span><span class="blw-leaf" style="--angle:120deg;--opacity:0.76"><svg viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 20C4 7 15 1 32 2C28 16 17 23 2 20Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 19L28 5" stroke="currentColor" stroke-width=".9"/></svg></span><span class="blw-leaf" style="--angle:180deg;--opacity:0.64"><svg viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 20C4 7 15 1 32 2C28 16 17 23 2 20Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 19L28 5" stroke="currentColor" stroke-width=".9"/></svg></span><span class="blw-leaf" style="--angle:240deg;--opacity:0.52"><svg viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 20C4 7 15 1 32 2C28 16 17 23 2 20Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 19L28 5" stroke="currentColor" stroke-width=".9"/></svg></span><span class="blw-leaf" style="--angle:300deg;--opacity:0.4"><svg viewBox="0 0 34 24" fill="none" aria-hidden="true"><path d="M2 20C4 7 15 1 32 2C28 16 17 23 2 20Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 19L28 5" stroke="currentColor" stroke-width=".9"/></svg></span></div></div><p class="blw-caption">Загружаем пространство</p></div>
<div id="assembly-intro" aria-hidden="true"><img alt=""></div><main id="page-content">
'''
head=head.replace('</head>',favicon_links+'\n</head>',1)
(out/'index.html').write_text(head+'\n'.join(fragments)+'\n</main></body></html>',encoding='utf-8')
print(str(out/'index.html'))
