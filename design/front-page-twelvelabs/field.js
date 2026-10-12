// Skyfall hero field (Twelve Labs-inspired): a perspective stream of image tiles flowing out of the
// distance on the left toward the viewer on the right. Tiles are Skyfall imagery and SKY-001 design windows.
// Far tiles are soft and dim, near tiles sharp; the pointer steers the camera and lifts nearby tiles.
(function(){
const cv=document.getElementById('field'); if(!cv) return;
const g=cv.getContext('2d');
const TW=256, TH=144, COLS=8, N=44, SKIP=new Set([9]);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const STILL=location.hash==='#still';
const rnd=i=>{const x=Math.sin(i*12.9898+78.233)*43758.5453;return x-Math.floor(x);};
let W=0,H=0,DPR=Math.min(devicePixelRatio||1,2);
function resize(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);g.setTransform(DPR,0,0,DPR,0,0);}
new ResizeObserver(resize).observe(cv); resize();

// textures: sharp, soft and very soft versions of every tile (downscale-upscale blur works everywhere)
const atlas=new Image(); let tex=null;
atlas.onload=()=>{
  tex=[];
  for(let i=0;i<N;i++){ if(SKIP.has(i)){tex.push(null);continue;}
    const sx=(i%COLS)*TW, sy=Math.floor(i/COLS)*TH;
    const mk=(div)=>{const s=document.createElement('canvas');s.width=Math.max(4,TW/div);s.height=Math.max(3,TH/div);
      const x=s.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(atlas,sx,sy,TW,TH,0,0,s.width,s.height);
      if(div===1) return s; const u=document.createElement('canvas');u.width=TW/2;u.height=TH/2;const y=u.getContext('2d');y.imageSmoothingEnabled=true;y.drawImage(s,0,0,u.width,u.height);return u;};
    tex.push([mk(1),mk(6),mk(14)]);
  }
  if(STILL) frame(performance.now());
};
atlas.src=document.getElementById('field-atlas').getAttribute('data-src');

// slots on a plane: rows (Y) x columns (X). The plane recedes to the left.
const ROWS=17, SPAN=96, ROWH=.165, COLW=.56, TS=.16;
const slots=[];
for(let r=0;r<ROWS;r++) for(let c=0;c<SPAN;c++){ const k=r*SPAN+c;
  slots.push({r,c,on:rnd(k*3.1)<.5,tile:Math.floor(rnd(k*7.7)*N),jy:(rnd(k*5.3)-.5)*.35,jx:(rnd(k*9.1)-.5)*.3,lift:0,hot:0}); }
const pick=k=>{let t=Math.floor(rnd(k)*N); while(SKIP.has(t)) t=(t+1)%N; return t;};
slots.forEach((s,k)=>{s.tile=pick(k*7.7+1);});

const mouse={x:.72,y:.45,tx:.72,ty:.45,in:false,px:-1e4,py:-1e4};
const host=cv.parentElement;
host.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mouse.px=e.clientX-r.left;mouse.py=e.clientY-r.top;mouse.tx=mouse.px/W;mouse.ty=mouse.py/H;mouse.in=true;});
host.addEventListener('pointerleave',()=>{mouse.in=false;mouse.px=mouse.py=-1e4;});

let T=STILL?7.5:0, last=performance.now(), hotT=0, hotSlot=null;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000); last=now; if(!reduce&&!STILL) T+=dt;
  g.fillStyle='#07080A'; g.fillRect(0,0,W,H);
  if(!tex){ if(!STILL) requestAnimationFrame(frame); return; }
  if(!mouse.in){ mouse.tx=.72+Math.sin(T*.13)*.06; mouse.ty=.45+Math.cos(T*.11)*.05; }
  mouse.x+=(mouse.tx-mouse.x)*.04; mouse.y+=(mouse.ty-mouse.y)*.04;
  const k=W/1440;
  const yaw=1.2+(mouse.x-.72)*.08, ca=Math.cos(yaw), sa=Math.sin(yaw);
  const D=6, f=2200*k, cx=W*.75+(mouse.x-.72)*-50*k, cy=H*.36+(mouse.y-.45)*-40*k;
  const flow=(T*.22)%COLW;
  // occasionally mark one near tile as "attended" by the model
  hotT-=dt; if(hotT<=0){ hotSlot=slots[Math.floor(Math.random()*slots.length)]; hotT=2.6; }
  const items=[];
  for(const s of slots){ if(!s.on) continue;
    const X=(s.c-SPAN+5+s.jx)*COLW+flow;               // columns run from far-left (negative) toward the viewer
    const Y=(s.r-(ROWS-1)/2)*ROWH+s.jy*ROWH*.4 - X*.045;    // a slight rise as rows come closer
    const wx=X*ca, wz=-D+X*sa;
    if(wz>-.7) continue;
    const z=-wz, sc=f/z;
    const w=TS*sc, h=w*9/16; let x=cx+wx*sc, y=cy+Y*sc;
    if(x+w<-40||x-w>W+40||y+h<-40||y-h>H+40) continue;
    const d=Math.hypot(x-mouse.px,y-mouse.py), near=mouse.in?Math.max(0,1-d/(110*k)):0;
    s.lift+=(near-s.lift)*.12; s.hot+=((s===hotSlot&&z<7?1:0)-s.hot)*.06;
    items.push({s,z,x,y,w,h});
  }
  items.sort((a,b)=>b.z-a.z);
  for(const it of items){ const {s,z}=it; const t=tex[s.tile]; if(!t) continue;
    const L=1+s.lift*.35, w=it.w*L, h=it.h*L, x=it.x-w/2, y=it.y-h/2;
    const lvl=z>19?2:z>9.5?1:0;
    const fade=Math.max(0,Math.min(1,(70-z)/30));
    g.globalAlpha=fade*(lvl===2?.4:lvl===1?.7:1)*(.88+.12*s.lift);
    const r=Math.min(6*k,w*.05);
    g.save(); g.beginPath(); g.roundRect? g.roundRect(x,y,w,h,r) : g.rect(x,y,w,h); g.clip();
    g.drawImage(t[lvl],x,y,w,h); g.restore();
    if(s.hot>.02||s.lift>.02){ g.globalAlpha=Math.max(s.hot,s.lift)*fade; g.strokeStyle='#6F83F0'; g.lineWidth=1.5;
      g.beginPath(); g.roundRect? g.roundRect(x,y,w,h,r) : g.rect(x,y,w,h); g.stroke(); }
  }
  g.globalAlpha=1;
  if(!STILL) requestAnimationFrame(frame);
}
if(!STILL) requestAnimationFrame(frame);
})();
