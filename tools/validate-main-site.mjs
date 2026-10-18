import fs from 'node:fs';import vm from 'node:vm';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const c={window:{}};vm.runInNewContext(fs.readFileSync('dist/shared/catalog.js','utf8'),c);const rows=c.window.v2Exhibits,source=JSON.parse(fs.readFileSync('data/2.0/exhibits.json')),freeze=JSON.parse(fs.readFileSync('data/2.0/art-freeze.json'));
assert.equal(rows.length,126);assert.equal(JSON.stringify(rows),JSON.stringify(source));assert.equal(c.window.v2Regions.length,34);
const resolve=p=>'dist/'+(p.startsWith('v2:')?p.slice(3):p);
for(const d of rows)for(const key of ['packFront','portrait','preview','nativeArt'])assert.ok(fs.existsSync(resolve(d[key])),d.id+': '+key);
for(const a of freeze.assets){const target=a.path.replace(/^site-v2\//,'dist/');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex'),a.sha256,'Image changed: '+target);}
const index=fs.readFileSync('dist/index.html','utf8');assert.ok(index.includes('shared/presentation.js'));assert.ok(index.includes('src="map.js"'));assert.ok(!index.includes('../dist/'));
for(const file of fs.readdirSync('dist/shared'))if(file.endsWith('.js')){const s=fs.readFileSync('dist/shared/'+file,'utf8');assert.ok(!s.includes('../dist/'),file+' leaves deployment directory');new vm.Script(s,{filename:file});}
const specs={window:{}};vm.runInNewContext(fs.readFileSync('dist/shared/archive-specs.js','utf8'),specs);
assert.equal(JSON.stringify(specs.window.v2ArchiveSpecs),JSON.stringify(JSON.parse(fs.readFileSync('data/2.0/archive-specs.json','utf8'))));
assert.equal(freeze.items.length,126);assert.equal(freeze.assets.length,378);
for(const d of rows)assert.ok(fs.existsSync(d.observationEvidence.localPath),d.id+': source packaging reference');
for(const photo of JSON.parse(fs.readFileSync('data/2.0/pack-photo-references.json','utf8')))assert.ok(fs.existsSync(photo.path),photo.id+': pack photo');
console.log('Main deployment: 126 exhibits, 34 region entries, 378 frozen image variants, dist entry/resources valid.');
