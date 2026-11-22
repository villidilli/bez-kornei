// Resolution-independent version of the approved root-to-letter animation.
window.createBrandIntro=function(canvas){
const ctx=canvas.getContext('2d');
const ink='#20211d',accent='#ac3d2e',paper='#f3f0e9';
const rawContour=[[414, 139], [457, 143], [481, 143], [506, 138], [507, 141], [499, 147], [473, 155], [432, 156], [404, 154], [423, 175], [437, 184], [520, 214], [544, 218], [549, 221], [547, 224], [542, 225], [515, 223], [466, 209], [472, 219], [493, 238], [492, 242], [487, 241], [470, 230], [454, 214], [448, 205], [426, 195], [410, 184], [381, 149], [339, 122], [323, 108], [332, 142], [360, 187], [366, 193], [404, 212], [423, 225], [450, 236], [452, 239], [451, 242], [444, 242], [419, 235], [362, 208], [368, 249], [375, 262], [391, 279], [407, 301], [426, 334], [428, 344], [425, 344], [421, 340], [400, 310], [364, 270], [362, 270], [362, 295], [366, 313], [362, 315], [356, 305], [352, 284], [353, 255], [347, 220], [346, 198], [316, 146], [297, 76], [294, 78], [290, 87], [276, 126], [274, 159], [280, 183], [290, 206], [296, 215], [324, 240], [339, 268], [339, 272], [335, 272], [324, 254], [313, 243], [298, 234], [300, 260], [319, 311], [324, 347], [320, 348], [319, 346], [316, 332], [300, 292], [298, 292], [291, 306], [288, 323], [285, 324], [283, 321], [284, 306], [292, 284], [292, 274], [287, 257], [283, 222], [263, 179], [260, 185], [251, 228], [251, 239], [258, 261], [262, 285], [262, 306], [259, 321], [254, 320], [250, 282], [243, 254], [242, 251], [240, 251], [228, 270], [227, 309], [225, 317], [220, 318], [220, 298], [218, 282], [216, 282], [196, 304], [187, 319], [182, 337], [178, 337], [179, 321], [189, 296], [197, 285], [214, 269], [232, 241], [233, 236], [225, 238], [211, 246], [198, 260], [195, 260], [194, 257], [206, 240], [221, 229], [235, 223], [239, 217], [244, 187], [255, 158], [263, 114], [237, 134], [229, 143], [209, 181], [187, 212], [182, 239], [169, 269], [159, 281], [147, 290], [144, 290], [143, 287], [153, 276], [162, 260], [169, 236], [171, 221], [129, 234], [111, 244], [102, 254], [98, 255], [97, 252], [104, 241], [125, 223], [171, 204], [190, 181], [209, 147], [154, 165], [124, 202], [115, 209], [97, 218], [91, 218], [91, 214], [114, 196], [133, 171], [133, 168], [109, 173], [65, 195], [31, 208], [30, 204], [36, 199], [93, 168], [93, 166], [90, 165], [57, 160], [53, 156], [55, 154], [119, 157], [143, 152], [168, 142], [205, 131], [235, 114], [264, 88], [278, 65], [283, 47], [309, 39], [311, 39], [318, 68], [329, 87], [339, 99], [363, 118], [395, 135]];
let sourceContour=rawContour;
for(let pass=0;pass<3;pass++){
 const next=[];
 sourceContour.forEach((a,i)=>{const b=sourceContour[(i+1)%sourceContour.length];next.push([.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]],[.25*a[0]+.75*b[0],.25*a[1]+.75*b[1]])});
 sourceContour=next;
}
const letters=[
{x:43,d:'M32 0H2V48H20C30 48 35 43 35 35S30 22 20 22H2'},
{x:90,d:'M33 0H2V48H33 M2 23H28'},
{x:137,d:'M3 5C8 1 13 0 20 0 29 0 34 5 34 11 34 18 29 23 19 23H14 M19 23C29 23 36 27 36 35 36 44 28 48 19 48 12 48 6 46 1 42'},
{x:237,d:'M21 0C33 0 40 9 40 24S33 48 21 48 2 39 2 24 9 0 21 0Z'},
{x:288,d:'M2 48V0H20C30 0 36 5 36 14S30 28 20 28H2'},
{x:335,d:'M2 0V48 M36 0V48 M2 23H36'},
{x:382,d:'M33 0H2V48H33 M2 23H28'},
{x:426,d:'M2 0V48L37 0V48'}
].map(v=>({...v,path:new Path2D(v.d)}));
const leaf=new Path2D('M5 -9C7 -20 19 -25 34 -24C31 -13 22 -5 5 -9Z');
const veins=new Path2D('M8 -10Q20 -15 31 -22 M15 -13L15 -17 M19 -15L24 -14 M24 -18L25 -21');
const clamp=v=>Math.max(0,Math.min(1,v));const smooth=(t,a,b)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u)};
const lerp=(a,b,u)=>a+(b-a)*u;
let time=0,playing=false,raf=0,last=0,started=false;
function point(p,t){const q=1-t;return [0,1].map(i=>q*q*q*p[0][i]+3*q*q*t*p[1][i]+3*q*t*t*p[2][i]+t*t*t*p[3][i]);}
function branch(points,width,tip=width){
if(tip===width){ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(...points[0]);ctx.bezierCurveTo(...points[1],...points[2],...points[3]);ctx.stroke();return;}
const left=[],right=[];for(let i=0;i<=40;i++){const u=i/40;const p=point(points,u),a=point(points,Math.max(0,u-.002)),b=point(points,Math.min(1,u+.002));const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;const half=lerp(width,tip,Math.pow(u,.72))/2;left.push([p[0]-dy/length*half,p[1]+dx/length*half]);right.push([p[0]+dy/length*half,p[1]-dx/length*half]);}ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(...left[0]);left.slice(1).forEach(p=>ctx.lineTo(...p));right.reverse().forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.fill();
}
function draw(t){
const width=canvas.clientWidth||736;const height=canvas.clientHeight||414;const dpr=Math.min(devicePixelRatio||1,3);
if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)}
ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=paper;ctx.fillRect(0,0,width,height);
const unit=Math.min((width-40)/460,(height-70)/190);ctx.save();ctx.translate(width/2,height/2-8);ctx.scale(unit,unit);ctx.translate(-254,-81);
ctx.strokeStyle=ink;ctx.lineWidth=3.4;ctx.lineCap='butt';ctx.lineJoin='round';
letters.forEach((letter,i)=>{const u=smooth(t,2.48+i*.035,2.95+i*.035);ctx.save();ctx.globalAlpha=u;ctx.translate(letter.x,57+8*(1-u));ctx.stroke(letter.path);ctx.restore()});
const morph=smooth(t,1.05,2.05);const rotation=smooth(t,1.5,2.5);const position=smooth(t,1.95,2.65);const scale=lerp(1.35,1,position);
ctx.save();ctx.translate(lerp(254,208,position),lerp(48,81,position));ctx.rotate((1-rotation)*Math.PI/2);ctx.scale(scale,scale);ctx.translate(-18,-24);ctx.strokeStyle=accent;
// The horizontal bar is drawn only after the roots have become recognizable.
const bar=smooth(t,.62,1.02);if(bar>0){ctx.lineWidth=3.4;ctx.beginPath();ctx.moveTo(2,48);ctx.lineTo(2,48-48*bar);ctx.stroke();}
ctx.globalAlpha=smooth(t,.08,.48);
// Both root curves share the exact branch point of the final letter.
// The actual supplied silhouette, traced as a single vector contour.
// Each lateral region contracts towards its corresponding diagonal of K.
ctx.fillStyle=accent;ctx.beginPath();
sourceContour.forEach((p,i)=>{
const dx=p[0]-297,dy=p[1]-39;
const initial=[2+dy*.245,25-dx*.245];
const side=dx>=0?1:-1;
const reach=clamp(dy/290)*clamp(Math.abs(dx)/48);
const target=side>0?[10+23*reach,25-25*reach]:[10+25*reach,25+23*reach];
const x=lerp(initial[0],target[0],morph),y=lerp(initial[1],target[1],morph);
if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
});
ctx.closePath();ctx.fill();
// The core strokes emerge from the contracting root mass, reaching exact logo geometry.
const core=smooth(t,1.45,2.05);ctx.lineWidth=3.4;ctx.lineCap='butt';
if(core>0){ctx.beginPath();ctx.moveTo(2,25);ctx.lineTo(10,25);ctx.lineTo(10+23*core,25-25*core);ctx.moveTo(10,25);ctx.lineTo(10+25*core,25+23*core);ctx.stroke();}
ctx.restore();
const growth=smooth(t,3.15,3.6);if(growth>0){ctx.save();ctx.translate(431,48);ctx.scale(growth,growth);ctx.translate(-5,9);ctx.fillStyle=accent;ctx.fill(leaf);ctx.strokeStyle=paper;ctx.lineWidth=1.1;ctx.lineCap='round';ctx.stroke(veins);ctx.restore()}
const subtitle=smooth(t,3.5,3.95);ctx.restore();ctx.globalAlpha=subtitle;ctx.fillStyle=ink;ctx.font='300 '+Math.max(10,Math.min(18,width*.021))+'px monospace';ctx.textAlign='center';ctx.fillText('ателье искусственного озеленения',width/2,height*.744);const ruleUnit=Math.min((width-40)/460,(height-70)/190),ruleWidth=418*ruleUnit,ruleY=height/2-8+44.95575*ruleUnit;ctx.strokeStyle='#b8b2a7';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo((width-ruleWidth)/2,ruleY);ctx.lineTo((width+ruleWidth)/2,ruleY);ctx.stroke();ctx.globalAlpha=1;

}

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
