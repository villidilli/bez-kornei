// Fetch the approved font into this project, without system font installation.
const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const project=path.resolve(__dirname,'..');
const destination=path.join(project,'bez-korney-preview','assets','fonts','cormorant-garamond-regular.ttf');
const expected='1cf23890c1292d3cfeb42103934f84cba528e44b';
const source='https://raw.githubusercontent.com/CatharsisFonts/Cormorant/master/fonts/ttf/CormorantGaramond-Regular.ttf';
const hash=b=>crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
(async()=>{
 try{const existing=await fs.readFile(destination);if(hash(existing)===expected){console.log('Intro font already installed');return}}catch(e){if(e.code!=='ENOENT')throw e}
 const response=await fetch(source,{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw Error('Font download: HTTP '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(hash(bytes)!==expected)throw Error('Upstream font changed; inspect the new file before accepting it');
 await fs.mkdir(path.dirname(destination),{recursive:true});
 await fs.writeFile(destination,bytes);
 console.log('Installed Cormorant Garamond Regular locally for the intro');
})().catch(error=>{console.error(error.message);process.exitCode=1});
