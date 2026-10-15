import fs from 'node:fs';import assert from 'node:assert/strict';
const seeds=JSON.parse(fs.readFileSync('data/2.0/seeds.json')),schema=JSON.parse(fs.readFileSync('data/2.0/exhibit.schema.json'));
const ledger=JSON.parse(fs.readFileSync('data/2.0/image-rights-ledger.json')),ids=new Set(seeds.map(d=>d.id));
assert.equal(seeds.length,6);assert.equal(ids.size,seeds.length);assert.equal(ledger.length,126);assert.equal(new Set(ledger.map(d=>d.id)).size,126);
for(const d of seeds){
 for(const key of schema.required)assert.ok(Object.hasOwn(d,key),d.id+' missing '+key);
 assert.ok(d.packagingVersion===null||typeof d.packagingVersion==='string');
 assert.equal(d.observations.length,3);assert.equal(new Set(d.observations).size,3);
 assert.equal(d.translations.length,3);assert.ok(d.translations.every(t=>t.length===2&&t.every(s=>typeof s==='string'&&s.length>0)));
 assert.ok(d.type&&d.alternative&&d.type!==d.alternative);
 assert.ok(d.lore.length>=schema.properties.lore.minLength&&d.lore.length<=schema.properties.lore.maxLength);
 assert.equal(d.loreKind,'original-fiction');
 assert.ok(d.relatedIds.length>=2&&d.relatedIds.length<=4);assert.equal(new Set(d.relatedIds).size,d.relatedIds.length);assert.ok(d.relatedIds.every(id=>ids.has(id)&&id!==d.id));
 assert.ok(d.sourceReferences.length>0);for(const s of d.sourceReferences){assert.ok(s.url.startsWith('https://'));assert.match(s.accessed,/^\d{4}-\d{2}-\d{2}$/);assert.equal(s.certainty,'source-claim-not-independently-verified');}
 for(const s of d.folkSayings)assert.ok(s.text&&s.source&&s.certainty);
 assert.equal(d.imageRights.publicReplacementAllowed,false);assert.equal(d.imageResolution.hdVerified,false);assert.equal(d.votes.status,'not-open');assert.equal(d.votes.count,null);
 for(const asset of [d.packFront,d.portrait,d.preview])assert.ok(fs.existsSync('dist/'+asset),asset);
 assert.ok(fs.existsSync(d.observationEvidence.localPath));assert.equal(d.observationEvidence.reviewed,'2026-10-15');
}
assert.ok(ledger.every(d=>d.publicReplacementAllowed===false&&d.hdVerified===false));
const report={date:'2026-10-15',status:'pass',validator:'G1领域断言；未宣称完整JSON Schema标准实现',schemaRequiredFieldsChecked:true,seeds:seeds.length,observations:18,translationPairs:18,storyLengths:seeds.map(d=>({id:d.id,characters:d.lore.length})),rightsRecords:ledger.length,referencedAssetsExist:true,relatedIdsValid:true,publicVotesOpen:false};
fs.writeFileSync('docs/2.0/reviews/data-results.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: six G1 narratives, required schema fields, related IDs, source states, asset paths and 126 rights records.');
