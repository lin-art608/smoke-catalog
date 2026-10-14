/* Folk sayings are cultural annotations, separate from product facts. */
window.archiveCulture = {
  render(item) {
    const name = item.name || item.brand || '';
    const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const collected = [
      {match:/南京.*[炫煊]赫门/, quote:'抽烟只抽煊赫门，一生只爱一个人。', note:'这句押韵的情话在网络喊麦与短视频里流传，后来连仿烟盒打火机也印上了它。资料中的产品名写作“炫赫门”，段子里常写“煊赫门”；把两个写法放在一起，反倒能看见网络传播留下的痕迹。', url:'https://m.mnw.cn/keji/internet/1669386.html', source:'闽南网 · 网络梗报道'},
      {match:/黄山.*皖/, quote:'安徽没有情与爱，只有黄皖十八块。', note:'你提供的地方段子版本。笑点在于把“情与爱”落到便利店里的熟悉称呼和押韵数字上。“黄皖”是段子用语，具体对应规格暂未核实；“十八块”只保留为梗的一部分，不作为本款价格。', source:'用户提供 · 流传出处与规格对应待核实'},
      {match:/黄鹤楼/, quote:'抽烟只抽黄鹤楼，一生一世到白头。', note:'网络顺口溜把“楼”和“头”凑成一对，烟名于是被借来讲爱情。这类句子有很多改写，趣味在押韵和记忆点；收录的是品牌相关段子，并非某一规格的官方文案。', url:'https://post.smzdm.com/p/a30lr477/', source:'什么值得买 · 用户顺口溜整理'},
      {match:/中华.*[软硬]/, quote:'抽烟只抽软中华，心里想啥就有啥。', note:'流传版本也会把“软中华”换成“硬中华”。同一套韵脚换个产品名，就能变出另一句，这正是民间顺口溜容易被记住、也容易被改写的地方。', url:'https://post.smzdm.com/p/a30lr477/', source:'什么值得买 · 用户顺口溜整理'},
      {match:/利群.*软红/, quote:'抽烟只抽红利群，错爱一群是一群。', note:'一句故意拐弯的失恋段子：“利群”里的“群”被拿来做文字游戏。这里只保留网络流传文本，不据此推断使用者的性格或感情经历。', url:'https://post.smzdm.com/p/a30lr477/', source:'什么值得买 · 用户顺口溜整理'}
    ];
    const story = collected.find(entry => entry.match.test(name));
    return story ? `<section class="culture-note"><span class="culture-kicker">街巷里的另一种记忆</span><h3>民间烟语</h3><blockquote>${esc(story.quote)}</blockquote><p>${esc(story.note)}</p><small>民间调侃 · 非品牌广告${story.url ? ` · <a href="${esc(story.url)}" target="_blank" rel="noopener noreferrer">${esc(story.source)} ↗</a>` : ` · ${esc(story.source)}`}</small></section>` : '';
  }
};
