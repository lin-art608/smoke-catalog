import fs from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),sharp=require('sharp');
const jobs=JSON.parse(fs.readFileSync('data/2.0/character-art-jobs.json')).filter(j=>j.assetPath&&(process.env.SMOKE_ART_BATCH?j.batch===process.env.SMOKE_ART_BATCH:!j.batch)),cols=jobs.length<=6?3:5,tileW=260,tileH=350,parts=[],masks=[],measurements=[];
for(const [i,j]of jobs.entries()){
 const {data,info}=await sharp(j.assetPath).ensureAlpha().raw().toBuffer({resolveWithObject:true});let solid=0,border=0,minX=info.width,minY=info.height,maxX=0,maxY=0;const alpha=Buffer.alloc(info.width*info.height);
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const a=data[(y*info.width+x)*4+3];alpha[y*info.width+x]=a>150?255:0;if(a>150){solid++;minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);if(x===0||y===0||x===info.width-1||y===info.height-1)border++;}}
 const left=(i%cols)*tileW,top=Math.floor(i/cols)*tileH;
 parts.push({input:await sharp(j.assetPath).resize(240,310,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer(),left:left+10,top:top+5});
 const diagnostic=Buffer.alloc(info.width*info.height*4);for(let p=0;p<alpha.length;p++){diagnostic[p*4]=17;diagnostic[p*4+1]=24;diagnostic[p*4+2]=32;diagnostic[p*4+3]=alpha[p];}const mask=await sharp(diagnostic,{raw:{width:info.width,height:info.height,channels:4}}).resize(240,310,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();masks.push({input:mask,left:left+10,top:top+5});
 const title=Buffer.from(`<svg width="250" height="30"><text x="8" y="19" font-family="sans-serif" font-size="14">${String(i+1).padStart(2,'0')} / ${j.id.replace('sku-yanpk-','')}</text></svg>`);parts.push({input:title,left:left+5,top:top+317});masks.push({input:title,left:left+5,top:top+317});
 measurements.push({id:j.id,width:info.width,height:info.height,hasAlpha:j.hasAlpha,alphaRange:j.alphaRange,solidPixels:solid,bounds:{minX,minY,maxX,maxY},solidBorderPixels:border,flag:border>0?'solid-content-touches-edge':'border-clear',family:j.family});
}
const height=Math.ceil(jobs.length/cols)*tileH,prefix=process.env.SMOKE_ART_BATCH||(jobs.length<=6?'G5-trial-6':'G5-samples-20');
await sharp({create:{width:cols*tileW,height,channels:3,background:'#eee9dc'}}).composite(parts).png().toFile('docs/2.0/screenshots/'+prefix+'-contact.png');
await sharp({create:{width:cols*tileW,height,channels:3,background:'#eee9dc'}}).composite(masks).png().toFile('docs/2.0/screenshots/'+prefix+'-silhouettes.png');
fs.writeFileSync('docs/2.0/reviews/'+prefix+'-measurements.json',JSON.stringify({generated:jobs.length,uniqueHashes:new Set(jobs.map(j=>j.sha256)).size,uniqueBriefFamilies:new Set(jobs.map(j=>j.family)).size,method:'Alpha>150 diagnostic silhouettes; border detection flags possible clipping, not an automatic visual verdict.',measurements},null,2)+'\n');
console.log(JSON.stringify({count:jobs.length,borderFlags:measurements.filter(m=>m.solidBorderPixels).map(m=>m.id)}));
