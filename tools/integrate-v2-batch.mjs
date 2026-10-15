import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
if(fs.existsSync('data/2.0/art-freeze.json')&&!JSON.parse(fs.readFileSync('data/2.0/art-freeze.json')).generationAllowed)throw Error('Artwork frozen by user; retain all existing versions.');
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),sharp=require('sharp'),batch=process.argv[2];
assert.match(batch||'',/^G6-\d\d$/);
const additions=JSON.parse(fs.readFileSync('data/2.0/batches/'+batch+'-content.json')),jobs=JSON.parse(fs.readFileSync('data/2.0/character-art-jobs.json')),current=JSON.parse(fs.readFileSync('data/2.0/exhibits.json')),review=JSON.parse(fs.readFileSync('docs/2.0/reviews/'+batch+'-measurements.json'));
assert.equal(review.generated,additions.length);assert.equal(review.uniqueHashes,additions.length);assert.ok(review.measurements.every(m=>m.hasAlpha&&m.solidBorderPixels===0));
assert.ok(additions.every(d=>!current.some(x=>x.id===d.id)),'Batch already integrated');
for(const d of additions){
 const j=jobs.find(j=>j.id===d.id);assert.ok(j.assetPath);const stem=j.assetPath.replace(/\.png$/,'');
 for(const [suffix,width]of [['',1280],['-thumb',640]])await sharp(j.assetPath).resize({width,height:width,fit:'inside',withoutEnlargement:true}).webp({quality:86,alphaQuality:100}).toFile(stem+suffix+'.webp');
 d.v1Portrait=d.portrait;d.v1Preview=d.preview;d.portrait='v2:'+stem.replace('site-v2/','')+'.webp';d.preview='v2:'+stem.replace('site-v2/','')+'-thumb.webp';d.nativeArt='v2:'+j.assetPath.replace('site-v2/','');d.artVersion='v2';d.batch=batch;d.characterStatus='v2原创 · '+batch+'批次自审';
 j.status='G6-self-reviewed';j.review={date:'2026-10-15',alpha:'true',solidBorder:'clear',humanDirectionApproval:'G5-approved',batchVisualReview:'contact-sheet-and-silhouette-reviewed',rightsConclusion:'not-established'};
}
const rows=[...current,...additions];fs.writeFileSync('data/2.0/exhibits.json',JSON.stringify(rows,null,2)+'\n');fs.writeFileSync('site-v2/shared/catalog.js','window.v2Exhibits = '+JSON.stringify(rows,null,2)+';\n');fs.writeFileSync('data/2.0/character-art-jobs.json',JSON.stringify(jobs,null,2)+'\n');console.log(JSON.stringify({batch,integrated:additions.length,total:rows.length}));
