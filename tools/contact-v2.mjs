import fs from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js');const sharp=require('sharp');
const folder='docs/2.0/screenshots';
for(const dir of ['a','b']){
 const parts=[];
 for(const [i,name]of ['home','regions','labels','characters','detail'].entries())parts.push({input:await sharp(`${folder}/G2-${dir}-${name}-desktop.png`).resize(576,400).toBuffer(),left:(i%3)*576,top:Math.floor(i/3)*400});
 for(const [i,name]of ['home-mobile','detail-mobile','pack-zoom-mobile'].entries())parts.push({input:await sharp(`${folder}/G2-${dir}-${name}.png`).resize(260,563).toBuffer(),left:i*576,top:800});
 await sharp({create:{width:1728,height:1363,channels:3,background:'#bbb6a8'}}).composite(parts).png().toFile(`${folder}/G2-${dir}-overview.png`);
 const file=`${folder}/G2-${dir}-detail-mobile-full.png`,m=await sharp(file).metadata(),tiles=[];
 for(let top=0,i=0;top<m.height;top+=1200,i++)tiles.push({input:await sharp(file).extract({left:0,top,width:m.width,height:Math.min(1200,m.height-top)}).toBuffer(),left:i*m.width,top:0});
 await sharp({create:{width:m.width*tiles.length,height:1200,channels:3,background:'#bcb8a8'}}).composite(tiles).png().toFile(`${folder}/G2-${dir}-detail-mobile-review.png`);
}
const comparison=[];
for(const [i,dir]of ['a','b'].entries())comparison.push({input:await sharp(`${folder}/G2-${dir}-home-desktop.png`).resize(720,500).toBuffer(),left:i*720,top:0});
await sharp({create:{width:1440,height:500,channels:3,background:'#bcb8a8'}}).composite(comparison).png().toFile(`${folder}/G2-home-comparison.png`);
console.log('Regenerated review sheets from latest screenshots.');
