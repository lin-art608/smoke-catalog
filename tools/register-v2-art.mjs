import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import crypto from 'node:crypto';
if(fs.existsSync('data/2.0/art-freeze.json')&&!JSON.parse(fs.readFileSync('data/2.0/art-freeze.json')).generationAllowed)throw Error('Artwork generation and replacement frozen by user; retain existing images.');
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),sharp=require('sharp');
const index=Number(process.argv[2]),source=process.argv[3],jobs=JSON.parse(fs.readFileSync('data/2.0/character-art-jobs.json')),job=jobs[index];if(!job||!fs.existsSync(source))throw Error('Invalid art registration');
const dest=`site-v2/assets/characters/v2/${job.id}-v2.png`;if(fs.existsSync(dest))throw Error('Do not overwrite an existing art version');
fs.copyFileSync(source,dest);const m=await sharp(dest).metadata(),stats=await sharp(dest).stats();
job.status='generated-awaiting-visual-review';job.assetPath=dest;job.nativeSource=path.basename(source);job.width=m.width;job.height=m.height;job.hasAlpha=m.hasAlpha;job.alphaRange=m.hasAlpha?[stats.channels.at(-1).min,stats.channels.at(-1).max]:null;job.sha256=crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex');job.tool='built-in image_gen';
fs.writeFileSync('data/2.0/character-art-jobs.json',JSON.stringify(jobs,null,2)+'\n');console.log(JSON.stringify({id:job.id,dest,alpha:job.alphaRange}));
