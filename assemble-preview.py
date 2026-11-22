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
head='''<!doctype html>
<html lang="ru" class="intro-pending"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>html.intro-pending{background:#f3f0e9}html.intro-pending #page-content{visibility:hidden}#assembly-intro{position:fixed;inset:0;z-index:1000;background:#f3f0e9;display:grid;place-items:center}#assembly-intro img{width:100%;height:100%;object-fit:contain}#assembly-intro[hidden]{display:none}</style>
<noscript><style>#assembly-intro{display:none!important}html.intro-pending #page-content{visibility:visible}</style></noscript>
<meta name="robots" content="noindex,nofollow"><title>БЕЗ КОРНЕЙ — ателье искусственного озеленения</title>
<meta name="description" content="Композиции из искусственных растений для коммерческих интерьеров. Реальные работы, примеры стоимости и сотрудничество с дизайнерами.">
<link rel="stylesheet" href="assembly.css"><link rel="stylesheet" href="cta.css"><script src="brand-intro.js" defer></script><script src="assembly.js" defer></script><script src="screen-scroll.js" defer></script></head><body>
<a class="skip-link" href="#bez-lounge-hero">К содержанию</a>
<div id="assembly-intro" aria-hidden="true"><img alt=""></div><main id="page-content">
'''
head=head.replace('</head>',favicon_links+'\n</head>',1)
(out/'index.html').write_text(head+'\n'.join(fragments)+'\n</main></body></html>',encoding='utf-8')
print(str(out/'index.html'))
