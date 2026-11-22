from pathlib import Path
import json

root=Path(__file__).parent
data=json.loads((root/'sketches/portfolio-build-data.json').read_text(encoding='utf-8'))
logo=data.pop('logo')
payload='<script>window.BEZ_WORKS='+json.dumps(data,ensure_ascii=False)+'</script>'
dialog='''<dialog class="portfolio-dialog" aria-labelledby="portfolio-gallery-title"><div class="portfolio-dialog-head"><h3 id="portfolio-gallery-title" data-gallery-title></h3><button type="button" data-close>Закрыть ×</button></div><img class="portfolio-photo" alt=""><p class="portfolio-description"></p><div class="portfolio-controls"><button type="button" data-prev aria-label="Предыдущая фотография">←</button><span class="portfolio-counter" aria-live="polite"></span><button type="button" data-next aria-label="Следующая фотография">→</button></div></dialog>'''
main='''<section id="bez-selected-works" aria-labelledby="bsw-heading" data-portfolio>
<link rel="stylesheet" href="portfolio.css">
<style>
#page-content>#bez-selected-works{position:relative;padding:0;height:100svh;min-height:560px;overflow:hidden;background:#273322;color:#fff;font-family:Arial,sans-serif}
#bez-selected-works .bsw-grid{height:100%;display:grid;grid-template-columns:60% 40%;gap:0}
#bez-selected-works figure{position:relative;margin:0;min-width:0;min-height:0;overflow:hidden}
#bez-selected-works .bsw-open{position:absolute;inset:0;width:100%;height:100%;padding:0;border:0;background:#273322;cursor:pointer}
#bez-selected-works .bsw-open img{width:100%;height:100%;display:block;object-fit:cover;object-position:50% 36%;transition:transform 1s cubic-bezier(.2,.7,.2,1)}
#bez-selected-works .bsw-wall img{object-position:58% 50%}
#bez-selected-works .bsw-open:hover img{transform:scale(1.025)}
#bez-selected-works figure::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#11190fcc,transparent 52%,#11190f99);pointer-events:none}
#bez-selected-works .bsw-overlay{position:absolute;top:clamp(28px,4vh,48px);left:clamp(24px,3.2vw,60px);z-index:2;pointer-events:none}
#bez-selected-works .brand-lockup .brand-lockup-logo{filter:brightness(0) invert(1);width:185px}
#bez-selected-works .brand-lockup .brand-tagline{color:#fff;font-size:9px}
#bez-selected-works h2{margin:clamp(32px,6vh,72px) 0 0;font:400 clamp(44px,5.5vw,88px)/1.02 Arial,sans-serif;letter-spacing:-.045em}
#bez-selected-works h2 em{font-family:Georgia,serif;font-weight:400}
#bez-selected-works figcaption{position:absolute;left:clamp(24px,3.2vw,60px);bottom:40px;right:24px;z-index:2;pointer-events:none}
#bez-selected-works figcaption p{margin:0 0 8px;font:10px/1.4 monospace;letter-spacing:1px;text-transform:uppercase;color:#ffffffb8}
#bez-selected-works figcaption h3{font:400 clamp(18px,1.7vw,28px)/1.2 Arial,sans-serif;margin:0;max-width:380px}
#bez-selected-works .bsw-wall figcaption{bottom:108px}
#bez-selected-works .bsw-all{position:absolute;right:clamp(24px,3.2vw,60px);bottom:34px;z-index:3;color:#fff;text-decoration:none;font:14px/1.5 Arial,sans-serif;border-bottom:1px solid #ffffff99;padding:10px 0}
#bez-selected-works .bsw-open:focus-visible{outline:3px solid #fff;outline-offset:-8px}
@media(max-width:650px){
 #page-content>#bez-selected-works{min-height:650px}
 #bez-selected-works .bsw-grid{grid-template-columns:1fr;grid-template-rows:56% 44%}
 #bez-selected-works .bsw-overlay{top:24px;left:22px}
 #bez-selected-works .brand-lockup .brand-lockup-logo{width:150px}
 #bez-selected-works .brand-lockup .brand-tagline{font-size:8px}
 #bez-selected-works h2{font-size:44px;margin-top:24px}
 #bez-selected-works figcaption{left:22px;bottom:22px}
 #bez-selected-works figcaption h3{font-size:19px}
 #bez-selected-works .bsw-wall figcaption{bottom:80px}
 #bez-selected-works .bsw-all{bottom:20px;right:22px}
 #bez-selected-works .bsw-open img{object-position:50% 35%}
}
@media(prefers-reduced-motion:reduce){#bez-selected-works .bsw-open img{transition:none;transform:none}}
</style>
<div class="bsw-grid">
<figure><button class="bsw-open" data-project="seating" aria-label="Открыть проект: композиции между посадочными местами"><img data-photo="seating-close" alt="Растительная композиция в деревянном кашпо между посадочными местами" loading="lazy"></button><figcaption><p>Композиции в кашпо</p><h3>Зелень разделяет пространство ↗</h3></figcaption></figure>
<figure class="bsw-wall"><button class="bsw-open" data-project="wall" aria-label="Открыть проект: фитостена у лестницы"><img data-photo="wall" alt="Фитостена в интерьере рядом с лестницей" loading="lazy"></button><figcaption><p>Вертикальное озеленение</p><h3>Фитостена у лестницы ↗</h3></figcaption></figure>
</div>
<div class="bsw-overlay">LOGO<h2 id="bsw-heading">Уже<br><em>в пространстве</em></h2></div>
<a class="bsw-all" href="works.html">Все работы ↗</a>
DIALOG
PAYLOAD
<script src="portfolio.js" defer></script>
</section>'''.replace('LOGO',logo).replace('DIALOG',dialog).replace('PAYLOAD',payload)
(root/'sketches/bez-selected-works.html').write_text(main,encoding='utf-8')

def tile(key,project,index,label,shape):
    return f'''<figure class="work-tile {shape}"><button data-project="{project}" data-photo-index="{index}" aria-label="Открыть: {label}"><img data-photo="{key}" alt="{label}" loading="lazy"><span class="work-caption">{label}<span aria-hidden="true">↗</span></span></button></figure>'''
left=tile('seating-close','seating',0,'Композиции между посадочными местами','portrait')+tile('wall-detail','wall',1,'Фитостена · детали','landscape')+tile('planter','planter',0,'Композиция в светлом кашпо','portrait')
right=tile('wall','wall',0,'Фитостена у лестницы','short')+tile('seating-detail','seating',2,'Композиция у окна · детали','portrait')+tile('seating','seating',1,'Посадочная зона · во время монтажа','landscape')
page='''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Все работы — БЕЗ КОРНЕЙ</title><meta name="description" content="Выполненные работы ателье БЕЗ КОРНЕЙ: композиции из искусственных растений, фитостены и озеленение интерьеров."><link rel="stylesheet" href="portfolio.css"><link rel="stylesheet" href="works.css"><script src="portfolio.js" defer></script></head><body><a class="portfolio-skip" href="#works-grid">К работам</a><header class="works-header"><a class="works-brand" href="index.html#bez-selected-works" aria-label="БЕЗ КОРНЕЙ — на главную">LOGO</a><a class="works-back" href="index.html#bez-selected-works">← На главную</a></header><main data-portfolio><div class="works-intro"><h1>Уже <em>в пространстве</em></h1><p>Наши работы.<br>Общие планы и детали.</p></div><div class="works-grid" id="works-grid"><div class="works-column">LEFT</div><div class="works-column">RIGHT</div></div><footer class="works-footer"><p>Обсудим ваше пространство?</p><a href="mailto:projects@bezkornei.ru">projects@bezkornei.ru ↗</a><a href="index.html#bez-contacts">Все контакты ↗</a></footer>DIALOG PAYLOAD</main></body></html>'''.replace('LOGO',logo).replace('LEFT',left).replace('RIGHT',right).replace('DIALOG',dialog).replace('PAYLOAD',payload)
(root/'sketches/works.html').write_text(page,encoding='utf-8')
