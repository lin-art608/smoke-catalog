(() => {
 const themes={
  beijing:['#f3ece7','#b87761','roof'],tianjin:['#edf1ed','#6f9695','river'],hebei:['#eeeede','#8c9873','mountain'],shanxi:['#eee8dd','#a68a64','roof'],neimenggu:['#edf1df','#819369','grass'],
  liaoning:['#eaf2ed','#629a96','sea'],jilin:['#eef1e5','#7f9a7a','forest'],heilongjiang:['#eaf1f4','#84a5b6','snow'],shanghai:['#eaf2f2','#689ca7','sea'],jiangsu:['#eef3ea','#8b9e78','river'],
  zhejiang:['#e8f1e9','#6e9985','river'],anhui:['#f6f0dc','#b89a4e','ginkgo'],fujian:['#e7f3f1','#5e9c98','sea'],jiangxi:['#edf0e5','#8b9a75','mountain'],shandong:['#eaf1f1','#779ca4','sea'],
  henan:['#f3eddf','#b59b67','grain'],hubei:['#ebf2ea','#7b9c8b','river'],hunan:['#edf0e2','#879c6d','lotus'],guangdong:['#e7f3ee','#5a9d8e','sea'],guangxi:['#eaf0e5','#7d9b80','mountain'],
  hainan:['#e8f6ed','#64aa97','palm'],chongqing:['#eee9e3','#aa8d78','mountain'],sichuan:['#edf1e4','#849b67','panda'],guizhou:['#e8eeeb','#789b91','mountain'],yunnan:['#f1e9ed','#b48d9d','flower'],
  xizang:['#edf0f1','#8facc0','snow'],shaanxi:['#f3e9de','#b59670','roof'],gansu:['#f4ebdb','#baa170','dune'],qinghai:['#e9f2f3','#7eaab6','snow'],ningxia:['#f3eddf','#b5a16d','dune'],
  xinjiang:['#f6ecdc','#bd966b','gobi'],taiwan:['#e7f2ef','#72a497','sea'],xianggang:['#e8edf4','#8198b4','sea'],aomen:['#f0e9ee','#ad8eaa','lotus']
 };
 const waves='<path d="M-20 160 Q40 120 100 160T220 160T340 160T460 160 M-20 190 Q40 150 100 190T220 190T340 190T460 190 M-20 220 Q40 180 100 220T220 220T340 220T460 220"/>';
 const fish='<path d="M220 105 Q255 72 290 105Q255 138 220 105L203 90V120Z"/><circle cx="275" cy="102" r="2"/>';
 const mountain='<path d="M-30 230 65 98 145 210 235 62 335 220 420 118 490 230 M180 130 235 62 275 121 M210 94 233 104 250 90"/>';
 const leaf='<path d="M200 204 214 153M214 153C161 151 164 119 177 95L214 115 240 78C268 102 273 138 214 153Z M214 153 177 95 M214 153 240 78 M214 153 212 112"/>';
 const bamboo='<path d="M72 230V35M99 240V65M65 84H79M65 143H79M92 119H106M92 182H106M72 102Q32 91 25 60Q58 59 72 102M99 143Q132 111 145 125Q142 148 99 154M72 176Q39 153 33 169Q37 190 72 186"/>';
 const motifs={
  sea:waves+fish,river:waves+'<path d="M40 148Q110 76 180 148M70 128V155M110 115V170M150 128V155"/>',
  mountain,grass:'<path d="M-20 190Q140 90 440 175M-20 220Q180 130 440 210M210 180V135M210 162 198 149M210 157 222 142M295 175V125M295 150 280 137M295 143 307 132"/>',
  roof:'<path d="M40 155Q140 146 190 75Q240 146 340 155L300 170H80ZM96 170V225M280 170V225M70 225H310M130 186H248M170 225V186M210 225V186"/>',
  forest:bamboo+'<path d="m200 220 0-130m-45 82 45-75 45 75m-58-40 13-34 22 34"/>',
  snow:mountain+'<path d="M75 30V82M52 43 98 69M52 69 98 43 M322 35V75M305 45 339 65M305 65 339 45"/>',
  ginkgo:leaf+'<g transform="translate(110 50) scale(.65)">'+leaf+'</g><g transform="translate(-45 24) scale(.8)">'+leaf+'</g>',
  grain:'<path d="M190 230 220 60M216 85Q175 42 181 95Q191 116 211 119M215 109Q255 72 248 122Q237 146 207 146M205 157Q166 121 173 169Q184 190 198 189M198 192Q237 155 231 204Q217 221 190 224"/>',
  lotus:waves+'<path d="M205 145Q158 114 176 76Q205 91 205 119Q205 85 235 66Q252 107 205 145ZM205 145Q259 151 276 116Q237 104 205 145Z"/>',
  panda:bamboo+'<g stroke-width="2"><circle cx="242" cy="98" r="55"/><circle cx="207" cy="51" r="18" fill="currentColor"/><circle cx="277" cy="51" r="18" fill="currentColor"/><ellipse cx="220" cy="93" rx="12" ry="18" transform="rotate(22 220 93)" fill="currentColor"/><ellipse cx="264" cy="93" rx="12" ry="18" transform="rotate(-22 264 93)" fill="currentColor"/><path d="m235 116 14 0-7 8Z" fill="currentColor"/><path d="M231 134Q242 140 253 134"/></g>',
  dune:'<path d="M-20 240Q65 85 160 160T420 180M60 230Q180 40 300 128T470 195M215 103Q202 142 275 164"/><circle cx="95" cy="67" r="24"/>',
  gobi:'<path d="M-20 240Q65 85 160 160T440 180M105 230Q230 70 390 145M248 214 265 174 290 174 303 218M270 174 275 157H284L290 174"/><circle cx="94" cy="73" r="30"/>',
  palm:waves+'<path d="M210 230Q227 141 250 90M250 90Q205 43 166 85Q218 70 250 90M250 90Q281 36 315 70Q269 73 250 90M250 90Q298 65 335 114Q282 98 250 90M250 90Q197 81 180 130Q223 111 250 90"/>',
  flower:'<path d="M210 235Q212 159 234 117M219 175Q176 171 161 143Q201 137 219 175"/><path d="M234 117C175 125 186 72 220 89C197 42 252 30 254 79C290 42 319 89 272 107C320 130 281 163 254 130C252 174 202 159 234 117Z"/>'
 };
 const params=new URLSearchParams(location.search),view=params.get('view');
 const row=window.v2Exhibits.find(d=>d.id===params.get('item'));
 const id=view==='regions'?params.get('region'):view==='detail'?row?.provinceId:null;
 if(!id||!themes[id])return;
 const [paper,accent,motif]=themes[id],root=document.documentElement;
 root.dataset.regionTheme=id;root.style.setProperty('--paper',paper);root.style.setProperty('--region-accent',accent);root.style.setProperty('--region-tint',accent+'20');
 const decor=document.createElement('div');decor.className='region-atmosphere';decor.setAttribute('aria-hidden','true');decor.innerHTML=`<svg viewBox="0 0 440 260" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${motifs[motif]}</svg><svg viewBox="0 0 440 260" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">${motifs[motif]}</svg>`;document.body.prepend(decor);
})();
