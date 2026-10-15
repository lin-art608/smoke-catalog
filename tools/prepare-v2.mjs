import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const base='92820bdea6a4fa902db685bfbad0fb0b7ecdea74';
const context={window:{}};
vm.runInNewContext(fs.readFileSync('dist/current-catalog.js','utf8'),context);
const catalog=context.window.currentCatalog;
const raw=[...JSON.parse(fs.readFileSync('data/current-20261013/catalog.json')),...JSON.parse(fs.readFileSync('data/current-20261013/regional-supplement.json'))];
const draft=[
 {id:'sku-yanpk-929',title:'给屋檐留一条金线',theme:'建筑的回声',color:'#a74637',observations:['朱红底色占据正面主体','金色建筑横向展开，位于品牌文字下方','上下边缘以窄金线收束'],reading:'横向屋檐与细边线形成稳定的重心。这里将它读成一道城市边界；这是对构图的解读，不为画中的建筑补写历史。',type:'都市 / 时装人物',alternative:'建筑装置',translations:[['横向金色屋檐','短外套的水平肩线'],['大面积朱红底色','城市测绘员的红色工作披肩'],['窄金色边线','可展开的细金属测绘尺']],lore:'傍晚的测绘员从不替城市画最后一条线。她总要在屋檐下留一道空白，给还没回家的人。今天的图纸被风吹到了河对岸，她没有追，只把金属尺横放在桥栏上。风穿过刻度，发出像电车驶远的声音。等一扇又一扇窗亮起来，她才把尺收回短外套，写下一个不在地图上的地名：归处。明天会有人问起那条空白，她打算请对方先站在这里，等一次天黑。'},
 {id:'sku-yanpk-213',title:'夜蓝色的层楼',theme:'建筑的回声',color:'#283e68',observations:['中央为深蓝色横向色块','金色多层楼阁图形置于蓝色色块中','上下区域呈金色，与中央蓝色分区明显'],reading:'金与蓝把同一幅面分成明暗两段。楼阁的多层轮廓可以读作节奏，而非对某个年代建筑细节的复原。',type:'动物 / 拟人',alternative:'幻想人物',translations:[['楼阁层叠檐线','成年鹤形旅人的层叠翼羽'],['深蓝横向区块','横跨双翼的夜蓝羽面'],['上下金色色块','细长的金色关节护片']],lore:'那位鹤形旅人把楼层藏在翅膀里。它每落下一根羽毛，岸边就多亮一扇窗。某夜，守夜人发现有一层始终漆黑，便提灯沿着羽纹向上走。最高处没有住客，只有一封写给黎明的信。旅人说，那层楼是给迷路的风留的。守夜人没有点亮它，只在门边系了一条蓝线。后来每逢大风，蓝线总先轻轻动一下，像有人从很远的地方敲门，问夜色还剩几层。'},
 {id:'sku-yanpk-661',title:'一条横线的通行证',theme:'印刷的秩序',color:'#a94d42',observations:['银白色底上有宽朱红横带','红带中央是金色中文与白色拉丁字样','红带上下可见细窄的装饰边线'],reading:'宽横带像一道暂停符，把细小信息与主标题隔开。由此产生的“通行证”意象属于创作联想，不是包装的官方设计释义。',type:'实验平面角色',alternative:'都市人物',translations:[['宽朱红横带','可横向伸展的平面身体'],['银白底面','半透明纸页构成的四肢'],['两道装饰边线','角色行走留下的双线轨迹']],lore:'红线每天早上都会从纸页左边走到右边。它没有脸，只有一个能装下整座车站名字的口袋。旅人递来的旧票，无论多么褪色，它都认真收好，再画一条白线让对方经过。一天，印刷机停了，所有方向都失去文字。红线便把口袋翻过来，让那些陌生地名沿着双线排成长队。人们循着它们找到出口，而它第一次发现，空白也可以是一张有效的通行证。'},
 {id:'sku-yanpk-5611',title:'印里有一座山',theme:'印刷的秩序',color:'#a85a54',observations:['正面底色为浅灰白','上半部有朱红色方形印章式图案','方形图案上方与右侧分布黑色竖向文字'],reading:'红色方形图案与竖排文字并置，形成类似书页钤印的视觉关系。小图中文字与具体典故暂不辨认，也不据此宣称历史出处。',type:'器物 / 自然概念',alternative:'传统人物',translations:[['朱红方形印章式图案','由印面折起的山体'],['灰白底面','纸岩质感的山脚'],['竖向黑色文字','只作抽象形状的垂直行走轨迹']],lore:'印山只在纸被摊平时出现。它的山脊很矮，低头就能看见；它的回声却很远，常常要过一夜才回来。修书人把一张破页放在山脚，想问缺失的一句去了哪里。山没有回答，只落下一小片红色的石屑。修书人把石屑压在空行上，第二天，那里长出了一条可以走的小路。她沿路走到纸边，看见那些被裁掉的句子正在安静地等春天。'},
 {id:'sku-yanpk-93273',title:'宽巷与窄巷之间',theme:'城市的间隙',color:'#626d68',observations:['灰白底面上部有朱红方形区域','中央黑色纹样由对称的弧线与圆形组成','主文字纵向排列在黑色纹样下方'],reading:'对称弧线与留白可以被读作入口和路径。只讨论可见构图，不把纹样直接认定为某座真实桥梁或建筑。',type:'幻想 / 科幻人物',alternative:'几何装置',translations:[['对称黑色弧线','两片可开合的弧形机械肩罩'],['朱红方形区域','无文字的方向信标'],['纵向主文字结构','窄而垂直的身体中轴']],lore:'巷口的引路员有两片可以开合的肩罩。一边接住宽巷的笑声，一边收拢窄巷的脚步。有人问哪条路更快，它总把红色信标转向没有人走的一边。今天来了一位不想抵达的旅客，引路员便将两片肩罩轻轻合拢，借给他一小段没有目的地的阴影。旅客坐到天色变灰，起身时说了声谢谢。机器没有记录这次导航，只把地图中间那条细线，再画得宽了一点。'},
 {id:'sku-yanpk-1483',title:'黄纸上的蓝色结',theme:'印刷的秩序',color:'#b28b32',observations:['主体为明黄色矩形底面','上部有深蓝色徽章式图形','深色花边围绕边缘，下部文字区由横线分隔'],reading:'黄色大底与深蓝小图形形成强烈的面积对比。边框像把视线留在纸面内的围栏，这是一种构图阅读。',type:'器物 / 自然概念',alternative:'实验雕塑',translations:[['明黄色大底','可折叠的黄纸躯体'],['深蓝徽章式图形','悬在身体中央的蓝色结'],['深色花边与横线','可拆开的细框骨架']],lore:'黄纸收藏着整间屋子的下午。它的身体能折成窗，也能折成一把很小的椅子，唯独中间的蓝结怎么也打不开。旧照相馆搬走那天，主人想把它压进箱底，却听见结里传来钟声。那是很多年前有人没有拍完的一张合影。黄纸于是留在空房里，把边框一段段拆开，摆成六个站人的位置。日光再次照进来时，它认真地等了一会儿，才替所有缺席的人合上快门。'}
];
const seeds=draft.map((d,i)=>{const r=catalog.find(x=>x.id===d.id),s=raw.find(x=>x.id===d.id);return {...d,number:String(i+1).padStart(2,'0'),name:r.name,brand:r.brand,region:r.region,provinceId:r.provinceId,packFront:r.pack,portrait:r.portrait,preview:r.portraitThumbnail,packagingVersion:s.packagingVersion||null,imageRights:{status:s.imageLicense||'permission-unconfirmed',publicReplacementAllowed:false},imageResolution:{status:s.imageQuality||'unverified',hdVerified:false},sourceReferences:[{title:r.name+' · 原始规格与包装资料',url:r.source,accessed:r.sourceDate,certainty:'source-claim-not-independently-verified'}],observationEvidence:{localPath:'dist/'+r.pack,reviewed:'2026-10-15',method:'本地原始参考照片人工目视；不扩展小字、历史或版权结论'},characterStatus:'v1参考角色；v2方向草案，未生成',folkSayings:[],relatedIds:draft.filter(x=>x.id!==d.id&&x.theme===d.theme).map(x=>x.id).concat(draft.filter(x=>x.id!==d.id&&x.theme!==d.theme).map(x=>x.id)).slice(0,3),loreKind:'original-fiction',themes:[d.theme],votes:{status:'not-open',count:null}};});
fs.writeFileSync('data/2.0/seeds.json',JSON.stringify(seeds,null,2)+'\n');
fs.writeFileSync('prototypes/2.0/shared/seeds.js','window.v2Seeds='+JSON.stringify(seeds,null,2)+';\n');
if(!fs.existsSync('data/2.0/baseline-manifest.json')){
 const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
 const manifest=files.map(p=>({path:p,bytes:fs.statSync(p).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')}));
 fs.writeFileSync('data/2.0/baseline-manifest.json',JSON.stringify({base,rollbackBranch:'archive/v1-before-2.0',files:manifest},null,2)+'\n');
}
const ledger=raw.map(r=>{const built=catalog.find(x=>x.id===r.id);return {id:r.id,name:r.name,path:built.pack,source:r.sourceUrl,accessed:r.sourceAccessDate||null,rights:r.imageLicense||'permission-unconfirmed',quality:r.imageQuality||'unverified',hdVerified:false,publicReplacementAllowed:false};});
fs.writeFileSync('data/2.0/image-rights-ledger.json',JSON.stringify(ledger,null,2)+'\n');
console.log('Prepared six grounded seed narratives, 126 rights records and immutable v1 manifest.');
