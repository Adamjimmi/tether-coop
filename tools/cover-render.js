const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const [w,h,sc,file] of [[630,500,1,'cover.png'],[630,500,2,'cover@2x.png'],[1920,1080,1,'banner.png']]){
const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:sc});const p=await ctx.newPage();
await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(300);
await p.evaluate(([w,h,file])=>{document.body.innerHTML='';const c=document.createElement('canvas');const d=window.devicePixelRatio;c.width=w*d;c.height=h*d;c.style.cssText='position:fixed;inset:0;width:'+w+'px;height:'+h+'px';document.body.appendChild(c);
const g=c.getContext('2d');g.scale(d,d);const K=file=='banner.png'?1.9:1;g.save();
g.fillStyle='#121119';g.fillRect(0,0,w,h);g.strokeStyle='#1e1c2b';g.lineWidth=1;g.beginPath();for(let x=0;x<w;x+=32*K){g.moveTo(x,0);g.lineTo(x,h)}for(let y=0;y<h;y+=32*K){g.moveTo(0,y);g.lineTo(w,y)}g.stroke();
let s=99;const R=()=>{s=(s*16807)%2147483647;return(s-1)/2147483646};
const cxp=w/2,cyp=h*.66;g.translate(cxp,cyp);g.scale(K,K);
const A={x:-150,y:-20},B={x:150,y:30};
// tether
function teth(){const n=18,dx=B.x-A.x,dy=B.y-A.y,dd=Math.hypot(dx,dy),nx=-dy/dd,ny=dx/dd,pts=[];for(let i=0;i<=n;i++){const t=i/n,j=(i==0||i==n)?0:(R()-.5)*10*Math.sin(t*Math.PI);pts.push([A.x+dx*t+nx*j,A.y+dy*t+ny*j])}
const pa=(lw,col,al)=>{g.globalAlpha=al;g.strokeStyle=col;g.lineWidth=lw;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(...pts[0]);pts.slice(1).forEach(q=>g.lineTo(...q));g.stroke()};pa(20,'#EF9F27',.3);pa(6,'#FAC775',.95);pa(2,'#FFF6E0',1);g.globalAlpha=1}
function enemy(ty,x,y,r,col,ex,ey,flash){g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(x,y+r*.95,r*.9,r*.3,0,0,7);g.fill();g.fillStyle=flash?'#fff':col;g.beginPath();
if(ty=='r'){const an=Math.atan2(ey,ex);for(let k=0;k<3;k++){const q=an+k*2.094;g.lineTo(x+Math.cos(q)*r*1.4,y+Math.sin(q)*r*1.4)}}else if(ty=='t'){for(let k=0;k<6;k++){const q=k*1.047+.3;g.lineTo(x+Math.cos(q)*r,y+Math.sin(q)*r)}}
else if(ty=='g'){g.save();g.translate(x,y);g.rotate(.5);g.rect(-r*.9,-r*.9,r*1.8,r*1.8);g.restore()}else if(ty=='b'){for(let k=0;k<24;k++){const q=k/24*6.283+.2,rr=k%2?r:r*1.22;g.lineTo(x+Math.cos(q)*rr,y+Math.sin(q)*rr)}}else g.arc(x,y,r,0,7);g.closePath();g.fill();
const es=Math.max(1.6,r*.17);g.fillStyle='#121119';for(const s of[-1,1]){g.beginPath();g.arc(x+ex*r*.35-ey*r*.3*s,y+ey*r*.35+ex*r*.3*s,es,0,7);g.fill()}}
// boss in background
const bx=w>1000?330:205,by=-205;enemy('b',bx,by,34,'#F09595',-.6,.8);
for(let k=0;k<12;k++){const a=k/12*6.283+.2;g.fillStyle='#F09595';g.beginPath();g.arc(bx+Math.cos(a)*(60+k%3*8),by+Math.sin(a)*(60+k%3*8),4.5,0,7);g.fill();g.fillStyle='#FCEBEB';g.beginPath();g.arc(bx+Math.cos(a)*(60+k%3*8),by+Math.sin(a)*(60+k%3*8),2,0,7);g.fill()}
teth();
const es=[['c',-60,-40,10,'#AFA9EC',1],['c',30,20,10,'#AFA9EC',1],['r',-10,-5,7,'#ED93B1',1],['c',-230,-90,10,'#AFA9EC'],['t',230,-60,17,'#85B7EB'],['s',-250,70,12,'#97C459'],['g',260,110,11,'#EF9F27'],['c',-120,100,10,'#AFA9EC'],['r',120,-110,7,'#ED93B1'],['c',60,120,10,'#AFA9EC'],['t',-280,-20,17,'#85B7EB'],['c',200,-140,10,'#AFA9EC']];
es.forEach(e=>{const dx=(e[1]<0?A.x:B.x)-e[1],dy=(e[1]<0?A.y:B.y)-e[2],m=Math.hypot(dx,dy)||1;enemy(e[0],e[1],e[2],e[3],e[4],dx/m,dy/m,e[5])});
// particles
g.globalCompositeOperation='lighter';for(let i=0;i<90;i++){const a=R()*6.283,rr=R()*55,x=-20+Math.cos(a)*rr,y=0+Math.sin(a)*rr*.6;g.globalAlpha=.3+R()*.7;g.fillStyle=['#FAC775','#AFA9EC','#FFF6E0','#ED93B1'][i%4];const sz=1.5+R()*3.5;g.fillRect(x,y,sz,sz)}g.globalCompositeOperation='source-over';g.globalAlpha=1;
g.strokeStyle='#AFA9EC';g.lineWidth=2;g.globalAlpha=.6;g.beginPath();g.arc(-20,0,44,0,7);g.stroke();g.globalAlpha=1;
g.fillStyle='#AFA9EC';g.font='700 18px system-ui,sans-serif';g.textAlign='center';g.fillText('+32',-15,-38);g.fillStyle='#FAC775';g.font='700 15px system-ui,sans-serif';g.fillText('Комбо x12',40,-60);
// gems & diamond
[[-180,40],[-170,55],[175,75],[100,70]].forEach(([x,y])=>{g.fillStyle='#9FE1CB';g.save();g.translate(x,y);g.rotate(.6);g.beginPath();g.moveTo(0,-4);g.lineTo(3,0);g.lineTo(0,4);g.lineTo(-3,0);g.fill();g.restore()});
g.fillStyle='rgba(159,225,245,.15)';g.beginPath();g.arc(-80,140,13,0,7);g.fill();g.fillStyle='#9FE1F5';g.beginPath();g.moveTo(-80,132);g.lineTo(-74,139);g.lineTo(-80,149);g.lineTo(-86,139);g.fill();
// players
[[A,0,'crown',1,.2],[B,1,'horns',-1,-.2]].forEach(([p,i,sk,fx,fy])=>{g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(p.x,p.y+14,13,5,0,0,7);g.fill();drawSkin(g,sk,p.x,p.y,14,1,fx,fy,true);drawBody(g,p.x,p.y,14,C[i],fx,fy,sk,1);drawSkin(g,sk,p.x,p.y,14,1,fx,fy,false);
g.strokeStyle='#85B7EB';g.globalAlpha=.5;g.lineWidth=1.5;g.beginPath();g.arc(p.x,p.y,21,0,7);g.stroke();g.globalAlpha=1;
for(let k=0;k<6;k++){g.globalAlpha=.25-k*.04;g.fillStyle=C[i];g.beginPath();g.arc(p.x-fx*(10+k*9),p.y-fy*(10+k*9),9-k,0,7);g.fill()}g.globalAlpha=1});
g.restore();
// vignette-free title
const big=file=='banner.png';g.textAlign='center';g.fillStyle='#FAC775';g.font='800 '+(big?150:70)+'px system-ui,sans-serif';g.fillText('Связка',w/2,big?190:84);
g.fillStyle='#ECEAF6';g.font='600 '+(big?40:20)+'px system-ui,sans-serif';g.fillText('Двое. Один трос.',w/2,big?250:114);
},[w,h,file]);
await p.screenshot({path:file});await ctx.close()}
await b.close()})();
