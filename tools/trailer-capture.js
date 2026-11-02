const {chromium}=require('playwright');const {spawn}=require('child_process');const fs=require('fs');
const PREVIEW=process.argv[2]=='preview';
const INIT=`(()=>{let T=1000;performance.now=()=>T;const cbs=[];window.requestAnimationFrame=f=>{cbs.push(f);return cbs.length};window.cancelAnimationFrame=()=>{};
window.__step=ms=>{T+=ms;const l=cbs.splice(0);l.forEach(f=>{try{f(T)}catch(e){console.error(e)}})};
const r=Math.random;let s=12345;Math.random=()=>{s=(s*16807)%2147483647;return (s-1)/2147483646};})();`;
const CSS=`#top{visibility:hidden}#cap{position:absolute;left:0;right:0;z-index:20;padding:6px 0 10px;background:rgba(13,12,19,.88);text-align:center;pointer-events:none;font-family:system-ui,sans-serif}
#cap .a{font-size:40px;font-weight:800;color:#FAC775;letter-spacing:.5px;line-height:1.15}
#cap .b{font-size:21px;font-weight:600;color:#ECEAF6;margin-top:8px}
#card{position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:system-ui,sans-serif;pointer-events:none}
#flash{position:absolute;inset:0;z-index:40;background:#fff;opacity:0;pointer-events:none}`;
const scenes=[
{n:'s1',d:3.0},{n:'s2',d:6.0},{n:'s3',d:4.5},{n:'s4',d:4.5},{n:'s5',d:6.0},{n:'s6',d:4.0},{n:'s7',d:3.0},{n:'s8',d:3.5}];
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:540,height:960},deviceScaleFactor:2});
const p=await ctx.newPage();p.on('pageerror',e=>console.log('ERR',e.message));
await p.addInitScript(INIT);await p.goto('http://localhost:8765/index.html');
await p.addStyleTag({content:CSS});
await p.evaluate(()=>{const c=document.createElement('div');c.id='cap';document.getElementById('app').appendChild(c);const k=document.createElement('div');k.id='card';document.getElementById('app').appendChild(k);const f=document.createElement('div');f.id='flash';document.getElementById('app').appendChild(f);
window.__orig_hurt=hurt;window.hurt=()=>{};
const cv=document.getElementById('cv').getBoundingClientRect();window.__arena=cv;
window.setCap=(a,b,t,dur,pos)=>{const el=document.getElementById('cap');if(!a){el.innerHTML='';return}const k=Math.min(1,t/.35),o=Math.min(k,Math.max(0,(dur-t)/.3));
el.innerHTML='<div class="a">'+a+'</div>'+(b?'<div class="b">'+b+'</div>':'');el.style.top='18px';el.style.opacity=o;el.style.transform='translateY('+((1-k)*24)+'px) scale('+(0.92+0.08*k)+')'};
window.flash=v=>{document.getElementById('flash').style.opacity=v};
window.botT=0;window.bot=(dt)=>{if(G&&state=='pick'&&!window.__keepPick){const c=[...document.querySelectorAll('.card')][0];applyPick(UPS.find(u=>c&&c.innerHTML.includes(u.n)).id)}if(!G||state!='play')return;botT+=dt;let cxx=W/2,cyy=H/2,n=0;for(const e of G.E){cxx+=e.x;cyy+=e.y;n++}if(n){cxx/=n+1;cyy/=n+1}
const a=botT*1.9,R=Math.min(S.L*.5,85);const tg=[[cxx+Math.cos(a)*R,cyy+Math.sin(a)*R],[cxx-Math.cos(a)*R,cyy-Math.sin(a)*R]];
G.P.forEach((p,i)=>{const j=joy[i];if(window.__hold&&window.__hold[i]){j.dx=window.__hold[i][0];j.dy=window.__hold[i][1];return}const dx=tg[i][0]-p.x,dy=tg[i][1]-p.y,m=Math.hypot(dx,dy);j.dx=m>6?dx/m:0;j.dy=m>6?dy/m:0})}});
const FR=30,dt=1000/FR;
const setup={
s1:async()=>{await p.evaluate(()=>{hideOv();document.getElementById('card').innerHTML=''})},
s2:async()=>{await p.evaluate(()=>{SAVE.skin=['crown','shades'];newGame();G.cd=0;G.cdN=0;G.wave=2;nextWave();S.L=185;S.brn=1;S.sh=0;
for(let i=0;i<9;i++){const q=spot();mkE(['c','r','c','s','c'][i%5],q[0],q[1])}G.parts=[];G.dias.push({x:W*.7,y:H*.3,t:9})})},
s3:async()=>{await p.evaluate(()=>{S.chn=2;S.boom=2;S.dps*=1.6;for(let i=0;i<8;i++){const q=spot();mkE(['c','r','t','g'][i%4],q[0],q[1])}})},
s4:async()=>{await p.evaluate(()=>{G.E=[];G.B=[];G.warn=[];G.spawnLeft=0;G.P[0].x=90;G.P[0].y=330;G.P[1].x=250;G.P[1].y=230;for(let i=0;i<6;i++){mkE('c',60+i*45,90+(i%2)*40)}G.spawnLeft=0;G.clr=null})},
s5:async()=>{await p.evaluate(()=>{G.E=[];G.B=[];G.warn=[];G.gems=[];G.wave=9;G.clr=null;nextWave();G.warn[0].t=.3;G.P.forEach(p=>{p.down=0;p.inv=0});G.down=-1;G.slow=1;S.dps*=1.4})},
s6:async()=>{await p.evaluate(()=>{SAVE.dia=740;SAVE.owned=SKINS.map(s=>s.id).slice(0,6);save();updTop();state='menu';G=null;showShop(0);document.getElementById('ov').style.background='rgba(13,12,19,.96)'})},
s7:async()=>{await p.evaluate(()=>{mode='host';state='lobby';showLobby('K7Q2');lobbyStatus('Партнёр подключился!');document.getElementById('lgo').style.display=''})},
s8:async()=>{await p.evaluate(()=>{hideOv();mode='local';state='menu';G=null;SAVE.skin=['crown','flame']})}};
const frame={
s1:(t,d)=>`document.getElementById('card').innerHTML='<div style="font-size:'+(96+t*6)+'px;font-weight:800;color:#FAC775;letter-spacing:2px;opacity:'+Math.min(1,t/.5)+';transform:translateY('+(Math.max(0,1-t/.5)*30)+'px)">Связка</div><div style="font-size:26px;font-weight:600;color:#ECEAF6;margin-top:10px;opacity:'+Math.min(1,Math.max(0,(t-.6)/.4))+'">Двое. Один трос.</div><div style="font-size:18px;color:#9a98b3;margin-top:8px;opacity:'+Math.min(1,Math.max(0,(t-1.1)/.4))+'">кооперативный роглайт</div>';flash(Math.max(0,1-t/.25)*.0)`,
s2:(t,d)=>`if(t>=2.5&&!window.__sp2){window.__sp2=1;for(let i=0;i<7;i++){const q=spot();mkE(['c','r','s',TY[2]][i%4],q[0],q[1])}}setCap(${'t<3'}?'Трос режет врагов':'Натяни сильнее',${'t<3'}?'Двигайтесь вместе, чтобы резать':'Чем туже трос, тем больнее',${'t<3'}?t:t-3,3,'top');flash(Math.max(0,.6-t*3))`,
s3:(t,d)=>`if(t>=0.7&&!window.__sp3){window.__sp3=1;for(let i=0;i<9;i++){const q=spot();mkE(['c','r','g','s',TY[2]][i%5],q[0],q[1])}}window.__keepPick=(t>=2.4&&t<3.9);if(t>=2.4&&t<2.45&&state=='play'){G.pend=1}if(t>=3.9&&state=='pick'){window.__keepPick=0;applyPick(UPS.find(u=>document.querySelector('.card').innerHTML.includes(u.n)).id)}setCap('Прокачка до первой смерти','Молнии, взрывы, огонь',t,2.3,'top');flash(Math.max(0,.6-t*3))`,
s4:(t,d)=>`if(t>=0.5&&G.down<0&&!window.__dn){window.__dn=1;S.sh=0;G.P[1].inv=0;G.P[1].dash=0;G.P[1].breath=1;G.P[0].down=0;G.P[0].x=60;G.P[0].y=430;G.P[1].x=290;G.P[1].y=210;__orig_hurt(1)}if(t>=0.5&&t<=1.4&&G.down>=0){window.__hold={0:[0,0]}}else if(t>1.4&&G.down>=0){window.__hold={0:[(G.P[1].x-G.P[0].x)/Math.hypot(G.P[1].x-G.P[0].x,G.P[1].y-G.P[0].y),(G.P[1].y-G.P[0].y)/Math.hypot(G.P[1].x-G.P[0].x,G.P[1].y-G.P[0].y)]}}else window.__hold=null;setCap('Упал? Партнёр спасёт','У него 3,5 секунды',t,d,'top');flash(Math.max(0,.6-t*3))`,
s5:(t,d)=>`if(t>=1.8&&!window.__sp5){window.__sp5=1;for(let i=0;i<5;i++){const q=spot();mkE(['c','r','g'][i%3],q[0],q[1])}}window.__hold=null;G.P.forEach(p=>p.down=0);if(G.boss&&t>4.6)G.boss.hp=Math.min(G.boss.hp,G.boss.mh*(1-(t-4.6)/1.0));setCap('Стражи этажей','Каждая пятая волна',t,3,'top');flash(Math.max(0,.6-t*3))`,
s6:(t,d)=>`setCap('Алмазы → скины','Собирай на арене, трать в магазине',t,d,'bottom');document.getElementById('ov').scrollTop=Math.max(0,(t-1)*110);flash(Math.max(0,.6-t*3))`,
s7:(t,d)=>`setCap('Онлайн по коду комнаты','Каждый со своего телефона',t,d,'bottom');flash(Math.max(0,.6-t*3))`,
s8:(t,d)=>`setCap('');document.getElementById('card').innerHTML='<div style="font-size:92px;font-weight:800;color:#FAC775;opacity:'+Math.min(1,t/.4)+'">Связка</div><div style="font-size:26px;font-weight:600;color:#ECEAF6;margin-top:12px;opacity:'+Math.min(1,Math.max(0,(t-.4)/.4))+'">Играй бесплатно на itch.io</div><div style="font-size:18px;color:#9a98b3;margin-top:10px;opacity:'+Math.min(1,Math.max(0,(t-.8)/.4))+'">Вдвоём на одном экране или онлайн<br>Телефон и компьютер</div>';flash(Math.max(0,.6-t*3))`};
const previewAt={s4b:[0],s1:[2.0],s2:[2.0,5.0],s3:[1.2,3.0],s4:[1.2,2.4,3.2],s5:[2.0,4.0],s6:[2.5],s7:[1.5],s8:[2.5]};
for(const sc of scenes){console.log('scene',sc.n);await p.evaluate(()=>{document.getElementById('card').innerHTML='';setCap('');window.__hold=null;window.__dn=0;window.__keepPick=0});await setup[sc.n]();
 const N=Math.round(sc.d*FR);let ff=null,out='parts/'+sc.n+'.tmp.mp4';
 if(!PREVIEW){fs.mkdirSync('parts',{recursive:true});ff=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-vf','scale=1080:1920,format=yuv420p','-c:v','libx264','-preset','veryfast','-crf','19','-r','30','-pix_fmt','yuv420p',out]);}
 const pv=(previewAt[sc.n]||[]).map(x=>Math.round(x*FR));
 for(let f=0;f<N;f++){const t=f/FR;await p.evaluate(`(()=>{bot(${1/FR});${frame[sc.n](0,0).replace(/\bt\b/g,String(t)).replace(/\bd\b/g,String(sc.d))};__step(${dt})})()`);
  if(PREVIEW){if(pv.includes(f))await p.screenshot({path:`pv_${sc.n}_${f}.jpg`,type:'jpeg',quality:85})}
  else{const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r))}}
 if(!PREVIEW){ff.stdin.end();await new Promise((res,rej)=>ff.on('close',c=>c===0?res():rej(new Error('ffmpeg '+c))));fs.renameSync(out,'parts/'+sc.n+'.mp4');console.log('done',sc.n)}}
await b.close()})();
