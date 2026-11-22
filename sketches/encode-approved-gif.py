from pathlib import Path
from PIL import Image
folder=Path(__file__).parent
paper=(243,240,233)
colors=[]
for color in [(32,33,29),(172,61,46)]:
    for i in range(128):
        colors.extend(round(paper[j]+(color[j]-paper[j])*i/127) for j in range(3))
palette=Image.new('P',(1,1));palette.putpalette(colors)
frames=[Image.open(p).convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE) for p in sorted((folder/'approved-gif-frames').glob('*.png'))]
destination=folder.parent/'bez-korney-approved-animation.gif'
if destination.exists():
    destination=destination.with_name('bez-korney-approved-animation-v2.gif')
frames[0].save(destination,save_all=True,append_images=frames[1:],duration=[40]*100+[2000],optimize=True,disposal=1)
with Image.open(destination) as result:
    total=0
    for i in range(result.n_frames):result.seek(i);total+=result.info.get('duration',0)
    print({'path':str(destination),'frames':result.n_frames,'size':result.size,'duration_ms':total,'bytes':destination.stat().st_size})
