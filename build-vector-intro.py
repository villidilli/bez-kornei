from pathlib import Path
import re,json,math

root = Path(__file__).parent
source = (root/'sketches/bez-roots-reveal.html').read_text(encoding='utf-8')
code = source[source.index("const ink="):source.index('function stop()')]
code = code.replace('const sourceContour=', 'const rawContour=')
# Remove the tiny stair steps inherited from the original raster trace.
def simplify(points,epsilon=1.4):
    if len(points)<3:return points
    a,b=points[0],points[-1]
    dx,dy=b[0]-a[0],b[1]-a[1]
    length=math.hypot(dx,dy)
    distances=[abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/length if length else math.dist(p,a) for p in points]
    i=max(range(len(points)),key=distances.__getitem__)
    if distances[i]<=epsilon:return [a,b]
    return simplify(points[:i+1],epsilon)[:-1]+simplify(points[i:],epsilon)
m=re.search(r'const rawContour=(\[.*?\]);',code)
contour=json.loads(m[1])
code=code[:m.start(1)]+json.dumps(simplify(contour))+code[m.end(1):]
# Smooth the traced, pixel-stepped contour once, before animation starts.
at = code.index('const letters=')
code = code[:at] + '''let sourceContour=rawContour;
for(let pass=0;pass<3;pass++){
 const next=[];
 sourceContour.forEach((a,i)=>{const b=sourceContour[(i+1)%sourceContour.length];next.push([.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]],[.25*a[0]+.75*b[0],.25*a[1]+.75*b[1]])});
 sourceContour=next;
}
''' + code[at:]
code = code.replace('Math.min(devicePixelRatio||1,2)', 'Math.min(devicePixelRatio||1,3)')
# Align the root crown with the red bar before the morph begins.
code = code.replace('dy=p[1]-47', 'dy=p[1]-39')
code = re.sub(r"signature.style.opacity=.*?ctx.restore\(\);", "ctx.restore();ctx.globalAlpha=subtitle;ctx.fillStyle=ink;ctx.font='300 '+Math.max(10,Math.min(18,width*.021))+'px monospace';ctx.textAlign='center';ctx.fillText('ателье искусственного озеленения',width/2,height*.744);ctx.globalAlpha=1;", code)
code = re.sub(r'range.value=.*?;', '', code)
code = re.sub(r'readout.textContent=.*?;', '', code)
code = code.replace('ctx.globalAlpha=1;', "const ruleUnit=Math.min((width-40)/460,(height-70)/190),ruleWidth=418*ruleUnit,ruleY=height/2-8+44.95575*ruleUnit;ctx.strokeStyle='#b8b2a7';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo((width-ruleWidth)/2,ruleY);ctx.lineTo((width+ruleWidth)/2,ruleY);ctx.stroke();ctx.globalAlpha=1;")
script = '''// Resolution-independent version of the approved root-to-letter animation.
window.createBrandIntro=function(canvas){
const ctx=canvas.getContext('2d');
''' + code + '''
let startTime=null,frameId=0;
function frame(now){
 if(startTime===null)startTime=now;
 time=Math.min(4,(now-startTime)/1000);draw(time);
 if(time<4)frameId=requestAnimationFrame(frame);
}
const resize=new ResizeObserver(()=>draw(time));resize.observe(canvas);
draw(0);frameId=requestAnimationFrame(frame);
return ()=>{cancelAnimationFrame(frameId);resize.disconnect()};
};
'''
(root/'bez-korney-preview/brand-intro.js').write_text(script,encoding='utf-8')
