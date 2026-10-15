import fs from 'node:fs';
if(fs.existsSync('data/2.0/art-freeze.json')&&!JSON.parse(fs.readFileSync('data/2.0/art-freeze.json')).generationAllowed)throw Error('Artwork frozen by user; retain all existing versions.');
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),sharp=require('sharp');
const jobs=JSON.parse(fs.readFileSync('data/2.0/character-art-jobs.json')),items=JSON.parse(fs.readFileSync('data/2.0/exhibits.json'));
if(jobs.length!==20||jobs.some(j=>!j.assetPath))throw Error('Require twenty generated samples');
const metrics=[];
for(const j of jobs){
 const d=items.find(d=>d.id===j.id),stem=j.assetPath.replace(/\.png$/,'');
 for(const [suffix,width]of [['',1280],['-thumb',640]])await sharp(j.assetPath).resize({width,height:width,fit:'inside',withoutEnlargement:true}).webp({quality:86,alphaQuality:100}).toFile(stem+suffix+'.webp');
 d.v1Portrait??=d.portrait;d.v1Preview??=d.preview;
 d.portrait='v2:'+stem.replace('site-v2/','')+'.webp';d.preview='v2:'+stem.replace('site-v2/','')+'-thumb.webp';d.nativeArt='v2:'+j.assetPath.replace('site-v2/','');d.artVersion='v2';d.characterStatus='v2原创样板 · G5待负责人确认';
 j.status='self-reviewed-awaiting-G5-approval';j.review={date:'2026-10-15',alpha:'true',solidBorder:'clear',humanApproval:'pending',note:'色彩图与剪影联系表目视检查；不代表已完成独立观众盲测或权利审定。'};
 metrics.push({id:j.id,pngBytes:fs.statSync(j.assetPath).size,detailBytes:fs.statSync(stem+'.webp').size,thumbBytes:fs.statSync(stem+'-thumb.webp').size});
}
fs.writeFileSync('data/2.0/exhibits.json',JSON.stringify(items,null,2)+'\n');
fs.writeFileSync('site-v2/shared/catalog.js','window.v2Exhibits = '+JSON.stringify(items,null,2)+';\n');
fs.writeFileSync('data/2.0/character-art-jobs.json',JSON.stringify(jobs,null,2)+'\n');
fs.writeFileSync('docs/2.0/reviews/G5-asset-sizes.json',JSON.stringify(metrics,null,2)+'\n');
console.log(JSON.stringify({exported:metrics.length,thumbTotal:metrics.reduce((a,m)=>a+m.thumbBytes,0)}));
