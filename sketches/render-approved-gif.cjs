const fs=require('fs'),path=require('path'),vm=require('vm');
const {createCanvas,Path2D,GlobalFonts}=require('@napi-rs/canvas');
const folder=__dirname;
GlobalFonts.registerFromPath(path.join(folder,'IBMPlexMono-Light.ttf'),'IBM Plex Mono');
const script=fs.readFileSync(path.join(folder,'bez-roots-reveal.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const ratio=1024/736;
const canvas=createCanvas(1024,576);canvas.clientWidth=736;canvas.clientHeight=414;
const events={},signature={style:{}};
const nodes={canvas,'.br-signature':signature,'.br-replay':{addEventListener:(n,f)=>events.replay=f},'.br-pause':{addEventListener:(n,f)=>events.pause=f},input:{value:0,addEventListener:(n,f)=>events.scrub=f},'.br-time':{}};
vm.runInNewContext(script,{document:{getElementById:()=>({querySelector:s=>nodes[s]})},Path2D,devicePixelRatio:ratio,ResizeObserver:class{observe(){}},matchMedia:()=>({matches:true}),requestAnimationFrame:()=>1,cancelAnimationFrame(){}});
const destination=path.join(folder,'approved-gif-frames');fs.mkdirSync(destination,{recursive:true});
for(let i=0;i<=100;i++){
  const time=i/25;nodes.input.value=time;events.scrub();
  const ctx=canvas.getContext('2d');ctx.save();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalAlpha=Number(signature.style.opacity);ctx.fillStyle='#20211d';ctx.font='300 16px "IBM Plex Mono"';ctx.textAlign='center';ctx.textBaseline='alphabetic';ctx.letterSpacing='.56px';ctx.fillText('ателье искусственного озеленения',368,414*.76-6.4+4*(1-ctx.globalAlpha));ctx.restore();
  fs.writeFileSync(path.join(destination,String(i).padStart(3,'0')+'.png'),canvas.toBuffer('image/png'));
}
console.log('Rendered 101 frames at 1024 × 576 with IBM Plex Mono Light.');
