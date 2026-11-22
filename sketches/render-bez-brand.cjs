const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const size = 768;
const background = '#171816';
const cream = '#efebe3';
const red = '#ff593e';
const frameTime = 50;
const steps = 113;

function progress(time, start, end) {
  return Math.max(0, Math.min(1, (time - start) / (end - start)));
}
function ease(value) {
  return value * value * (3 - 2 * value);
}
function interpolate(start, end, amount) {
  return start + (end - start) * amount;
}

async function main() {
  const source = await fs.readFile(path.join(process.argv[2], 'bez-portal-base.svg'), 'utf8');
  const leftStart = source.indexOf('<g transform="translate(43 57)">');
  const rightStart = source.indexOf('<g transform="translate(190 57)">');
  const dividerStart = source.indexOf('<path d="M182.5 51V109"');
  const leftWord = source.slice(leftStart, rightStart);
  const rightWord = source.slice(rightStart, dividerStart);
  const rightStem = rightWord.replace(/<path d="M5 -9[^>]+\/>\s*<path d="M8 -10[^>]+\/>\s*<path d="M15 -13[^>]+\/>/, '')
    .replace('<path d="M2 0V48 M2 25H10L33 0 M10 25L35 48" transform="translate(0 0)"/>', '');
  const leaf = rightWord.match(/<path d="M5 -9[^>]+\/>\s*<path d="M8 -10[^>]+\/>\s*<path d="M15 -13[^>]+\/>/)?.[0];
  if (leftStart < 0 || rightStart < 0 || dividerStart < 0 || !leaf || rightStem === rightWord) throw new Error('Approved logo paths are missing');

  function scene(time) {
    const rock = progress(time, 3.4, 5.05);
    const poses = [[0, -10.5, 0], [.08, -10.5, 0], [.28, 1, -15], [.43, 1, -15], [.67, 0, 15], [.84, 0, -3], [.94, 0, 0], [1, 0, 0]];
    const nextPose = poses.findIndex(pose => pose[0] >= rock);
    const previousPose = poses[Math.max(0, nextPose - 1)];
    const targetPose = poses[nextPose];
    const poseProgress = ease(progress(rock, previousPose[0], targetPose[0] || 1));
    const kX = interpolate(previousPose[1], targetPose[1], poseProgress);
    const kAngle = interpolate(previousPose[2], targetPose[2], poseProgress);
    const kOpen = ease(progress(rock, .08, .43));
    const kVisible = ease(progress(time, 3.35, 3.45));
    const lineFade = 1 - ease(progress(time, .65, 1.05));
    const drawLine = ease(progress(time, 0, .72));
    const bloom = ease(progress(time, .48, 1.8));
    const settle = ease(progress(time, 2.65, 3.88));
    const reveal = ease(progress(time, 3.15, 4.25));
    const leafGrowth = ease(progress(time, 3.92, 4.71));
    const caption = ease(progress(time, 4.45, 5.22));
    const center = interpolate(384, 273, settle);
    const centerY = interpolate(370, 373.83, settle);
    const unfolding = Math.max(.02, bloom * (1 - settle));
    const height = interpolate(32 + 195 * drawLine, 42, settle);
    const cutX = 273;
    const startLeft = 32;
    const startRight = -8;
    return '<svg width="768" height="768" viewBox="0 0 768 768" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<radialGradient id="back" cx="50%" cy="44%" r="76%"><stop stop-color="#302a24"/><stop offset=".73" stop-color="' + background + '"/><stop offset="1" stop-color="#111210"/></radialGradient>' +
      '<linearGradient id="front" x1="0" x2="1" y1="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#ffb28a"/><stop offset=".45" stop-color="#ed7755"/><stop offset="1" stop-color="#713528"/></linearGradient>' +
      '<linearGradient id="left" x1="0" x2="1" y1="1" y2="0" gradientUnits="objectBoundingBox"><stop stop-color="#52271f"/><stop offset="1" stop-color="#c0664a"/></linearGradient>' +
      '<linearGradient id="right" x1="0" x2="1" y1="1" y2="0" gradientUnits="objectBoundingBox"><stop stop-color="#b74836"/><stop offset="1" stop-color="#e89a70"/></linearGradient>' +
      '<clipPath id="leftClip"><rect x="' + (cutX - reveal * 227) + '" y="275" width="' + (reveal * 227) + '" height="163"/></clipPath>' +
      '<clipPath id="rightClip"><rect x="' + cutX + '" y="275" width="' + (reveal * 445) + '" height="163"/></clipPath>' +
      '</defs>' +
      '<rect width="768" height="768" fill="url(#back)"/>' +
      '<path d="M42 69V42H69 M699 42H726V69 M42 699V726H69 M699 726H726V699" fill="none" stroke="#7a6f62" stroke-width="1" opacity=".38"/>' +
      '<g transform="translate(' + center + ' ' + centerY + ')">' +
      '<ellipse cy="158" rx="' + (128 * bloom) + '" ry="14" fill="#0d0d0b" opacity="' + (.35 * (1 - settle) * bloom) + '"/>' +
      '<g transform="scale(' + unfolding + ' ' + (0.82 + .18 * bloom) + ')" opacity="' + ((1 - settle) * bloom) + '">' +
      '<path d="M0 135C-66 102-135 65-149-20C-114-10-46 9 0 62Z" fill="url(#left)"/>' +
      '<path d="M0 135C60 112 128 66 155-30C102-31 42-14 0 57Z" fill="url(#right)"/>' +
      '<path d="M0 127C-53 49-70-50-19-138C20-93 34-17 0 64Z" fill="url(#front)"/>' +
      '<path d="M0 119C13 21 51-61 99-106C100-43 61 46 0 119Z" fill="url(#left)"/>' +
      '<path d="M0 135C-10 58-10-19-19-138M0 135C30 77 79 42 155-30M0 135C-51 70-97 19-149-20" fill="none" stroke="#ffd7b9" stroke-width="1" opacity=".4"/>' +
      '</g>' +
      '<path d="M0 ' + (-height) + 'V' + height + '" stroke="' + red + '" stroke-width="' + (1.5 + 1.2 * settle) + '" opacity="' + ((1 - bloom * .72 * (1 - settle)) * lineFade) + '"/>' +
      '</g>' +
      '<g fill="none" stroke="' + cream + '" stroke-width="3.4" stroke-linecap="butt" stroke-linejoin="round">' +
      '<g clip-path="url(#leftClip)"><g transform="translate(' + interpolate(startLeft, 12, reveal) + ' 258) scale(1.43)">' + leftWord + '</g></g>' +
      '<g clip-path="url(#rightClip)"><g transform="translate(' + interpolate(startRight, 12, reveal) + ' 258) scale(1.43)">' + rightStem + '</g></g>' +
      '<g transform="translate(12 258) scale(1.43) translate(190 57)" stroke="' + red + '" opacity="' + kVisible + '">' +
      '<g transform="translate(' + kX + ' 0) translate(2 48) rotate(' + kAngle + ') translate(-2 -48)">' +
      '<path d="M2 ' + interpolate(-6, 0, kOpen) + 'V' + interpolate(52, 48, kOpen) + '" stroke-width="' + interpolate(1.8, 3.4, kOpen) + '"/>' +
      '<g transform="translate(2 25) scale(' + Math.max(.001, kOpen) + ' 1) translate(-2 -25)" opacity="' + kOpen + '"><path d="M2 25H10L33 0 M10 25L35 48"/></g>' +
      '</g></g>' +
      '<g transform="translate(12 258) scale(1.43)"><g transform="translate(442 50) rotate(' + (-32 * (1 - leafGrowth)) + ') scale(' + Math.max(.02, leafGrowth) + ') translate(-16 7)" opacity="' + leafGrowth + '">' + leaf + '</g></g>' +
      '</g>' +
      '<g opacity="' + caption + '" transform="translate(0 ' + (9 * (1 - caption)) + ')">' +
      '<path d="M361 461H407" stroke="' + red + '" stroke-width="1.2"/>' +
      '<text x="384" y="499" text-anchor="middle" fill="' + cream + '" font-family="Arial" font-size="15" letter-spacing="3.1">АТЕЛЬЕ</text>' +
      '<text x="384" y="526" text-anchor="middle" fill="#c2baae" font-family="Arial" font-size="15" letter-spacing="2">ИСКУССТВЕННОГО ОЗЕЛЕНЕНИЯ</text>' +
      '</g></svg>';
  }

  const rendered = [];
  for (let offset = 0; offset < steps; offset += 6) {
    const count = Math.min(6, steps - offset);
    const batch = await Promise.all(Array.from({length:count}, (_, index) => {
      const time = (offset + index) * frameTime / 1000;
      return sharp(Buffer.from(scene(time))).removeAlpha().raw().toBuffer();
    }));
    rendered.push(...batch);
  }
  const finalFrame = rendered.at(-1);
  const tail = [];
  for (let index = 1; index <= 10; index++) {
    const amount = ease(index / 10);
    const first = rendered[0];
    const fade = Buffer.allocUnsafe(finalFrame.length);
    for (let byte = 0; byte < fade.length; byte++) fade[byte] = Math.round(interpolate(finalFrame[byte], first[byte], amount));
    tail.push(fade);
  }
  const frames = [...rendered, ...tail];
  const durations = frames.map((_,index) => index === rendered.length - 1 ? 2450 : frameTime);
  const result = path.resolve('bez-korney-brand-reveal.gif');
  await sharp(Buffer.concat(frames), {raw:{width:size,height:size*frames.length,channels:3,pageHeight:size}})
    .gif({loop:0,delay:durations,colours:96,dither:0,effort:4})
    .toFile(result);
  const metadata = await sharp(result,{animated:true}).metadata();
  if (metadata.pages < 80 || metadata.pageHeight !== size) throw new Error('GIF is not animated at the expected size');
  const qa = process.argv[2];
  await Promise.all([2.2,5.45,4.11,4.51].map((time,index)=>sharp(Buffer.from(scene(time))).png().toFile(path.join(qa,'bez-gif-check-'+index+'.png'))));
  console.log(JSON.stringify({path:result,pages:metadata.pages,ms:metadata.delay.reduce((a,b)=>a+b,0),bytes:(await fs.stat(result)).size}));
}
main().catch(error => { console.error(error); process.exitCode = 1; });




