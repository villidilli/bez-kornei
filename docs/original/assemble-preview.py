from pathlib import Path
import re,base64,hashlib,shutil
v=Path('C:/Users/eukuz/.codex/visualizations/2026/11/10/01a1c758-004f-78d2-8a32-fc66360aa836')
out=Path(__file__).parent/'bez-korney-preview'
assets=out/'assets';assets.mkdir(parents=True,exist_ok=True)
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
shutil.copyfile(Path(__file__).parent/'bez-korney-approved-animation.gif',assets/'brand-reveal.gif')
head='''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>БЕЗ КОРНЕЙ — ателье искусственного озеленения</title>
<meta name="description" content="Композиции из искусственных растений для коммерческих интерьеров. Реальные работы, примеры стоимости и сотрудничество с дизайнерами.">
<link rel="stylesheet" href="assembly.css"><script src="assembly.js" defer></script></head><body>
<a class="skip-link" href="#bez-lounge-hero">К содержанию</a>
<div id="assembly-intro" hidden aria-hidden="true"><img src="assets/brand-reveal.gif" alt=""></div><main id="page-content">
'''
(out/'index.html').write_text(head+'\n'.join(fragments)+'\n</main></body></html>',encoding='utf-8')
print(str(out/'index.html'))
