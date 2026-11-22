const fs = require('fs');
const {createCanvas, Path2D} = require('@napi-rs/canvas');
const dir = __dirname + '/';
const cream='#f3f0e9', terra='#ac3d2e';
function mark(c, kind, x, y, scale){
 c.save();c.translate(x,y);c.scale(scale,scale);c.translate(-27,-36);
 c.strokeStyle=terra;c.fillStyle=terra;c.lineWidth=7;c.lineCap='butt';c.lineJoin='round';
 const stroke=d=>c.stroke(new Path2D(d));
 stroke('M0 0V72');
 if(kind===0){stroke('M54 0L12 36L56 72');}
 if(kind===1){
  stroke('M54 0L0 36L56 72');
  c.strokeStyle=cream;c.lineWidth=3.2;stroke('M17 13L7 59');
 }
 if(kind===2){
  stroke('M54 0L13 36');
  c.fill(new Path2D('M10.5 33.5 C23 37 39 56 58 74 C37 65 23 48 10.5 38.5 Z'));
 }
 c.restore();
}
const labels=['Собранный узел','Диагональный срез','Органичный штрих'];
const sheet=createCanvas(1500,650),s=sheet.getContext('2d');s.fillStyle=cream;s.fillRect(0,0,1500,650);
for(let i=0;i<3;i++){
 mark(s,i,250+i*500,280,3.5);
 s.fillStyle='#20211d';s.font='24px Arial';s.textAlign='center';s.fillText(labels[i],250+i*500,520);
 const c=createCanvas(1000,800),x=c.getContext('2d');x.fillStyle=cream;x.fillRect(0,0,1000,800);mark(x,i,500,400,5);
 fs.writeFileSync(dir+'bez-k-refinement-'+(i+1)+'.png',c.toBuffer('image/png'));
}
fs.writeFileSync(dir+'bez-k-refinements.png',sheet.toBuffer('image/png'));
