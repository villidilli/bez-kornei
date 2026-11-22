from PIL import Image
from pathlib import Path
import json, math

root = Path(__file__).parent
source = Path(__file__).parent.parent/'media'/'references'/'codex-clipboard-5109d937-b98d-415e-8586-47a14b71f94f.png'
image = Image.open(source).convert('RGB')
w, h = image.size
pixels = image.load()
mask = {(x, y) for y in range(h) for x in range(w) if max(pixels[x, y]) < 160}
edges = {}
for x, y in mask:
    for neighbor, a, b in [((x,y-1),(x,y),(x+1,y)),((x+1,y),(x+1,y),(x+1,y+1)),((x,y+1),(x+1,y+1),(x,y+1)),((x-1,y),(x,y+1),(x,y))]:
        if neighbor not in mask:
            edges.setdefault(a, []).append(b)
loops=[]
while edges:
    start=next(iter(edges)); current=start; points=[]
    while current in edges:
        points.append(current)
        successors=edges[current]; nxt=successors.pop()
        if not successors: del edges[current]
        current=nxt
        if current==start: break
    loops.append(points)
points=max(loops,key=len)
def simplify(points, tolerance):
    if len(points)<3: return points
    a,b=points[0],points[-1]; dx,dy=b[0]-a[0],b[1]-a[1]; length=math.hypot(dx,dy)
    distances=[abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/length if length else math.dist(a,p) for p in points]
    i=max(range(len(distances)),key=distances.__getitem__)
    if distances[i]<=tolerance: return [a,b]
    return simplify(points[:i+1],tolerance)[:-1]+simplify(points[i:],tolerance)
# Split the closed contour before simplification so the root tips stay sharp.
half=len(points)//2
points=simplify(points[:half+1],.7)[:-1]+simplify(points[half:]+[points[0]],.7)[:-1]
(root/'bez-root-source-contour.json').write_text(json.dumps(points,separators=(',',':')))
print(json.dumps({'source_size':[w,h],'contour_vertices':len(points),'bounds':[min(p[0] for p in points),min(p[1] for p in points),max(p[0] for p in points),max(p[1] for p in points)]}))
