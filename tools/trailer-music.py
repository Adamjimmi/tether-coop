import numpy as np, wave
SR=44100;D=34.5;N=int(SR*D);L=np.zeros(N);Rr=np.zeros(N)
def env(n,a=.005,r=None):
    t=np.arange(n)/SR;e=np.minimum(1,t/a) if a>0 else np.ones(n)
    return e*np.exp(-t/(r if r else 1e9))
def add(sig,t0,pan=0,gain=1):
    i=int(t0*SR);j=min(N,i+len(sig));s=sig[:j-i]*gain
    L[i:j]+=s*(1-max(0,pan));Rr[i:j]+=s*(1+min(0,pan))
def osc(f,dur,kind='saw'):
    t=np.arange(int(dur*SR))/SR;ph=(f*t)%1
    if kind=='saw':return 2*ph-1
    if kind=='sq':return np.where(ph<.5,1.,-1.)
    if kind=='tri':return 4*np.abs(ph-.5)-1
    return np.sin(2*np.pi*f*t)
from scipy.signal import lfilter
def lp(x,a):
    return lfilter([a],[1,-(1-a)],x)
def _old(x,a):
    y=np.zeros_like(x);acc=0.
    for i in range(len(x)):acc+=a*(x[i]-acc);y[i]=acc
    return y
rng=np.random.default_rng(1)
def kick(t0,g=1):
    n=int(.25*SR);t=np.arange(n)/SR;f=150*np.exp(-t*25)+45;ph=2*np.pi*np.cumsum(f)/SR;add(np.sin(ph)*np.exp(-t*9),t0,0,.9*g)
def snare(t0,g=1):
    n=int(.18*SR);t=np.arange(n)/SR;s=rng.uniform(-1,1,n)*np.exp(-t*18);add(s,t0,0,.35*g);add(np.sin(2*np.pi*190*t)*np.exp(-t*25),t0,0,.25*g)
def hat(t0,g=1):
    n=int(.04*SR);s=rng.uniform(-1,1,n);s=s-np.concatenate([[0],s[:-1]]);add(s*np.exp(-np.arange(n)/SR*90),t0,.3,.12*g)
def note(m): return 440*2**((m-69)/12)
bpm=124;b=60/bpm;s16=b/4
PROG=[(45,[57,60,64]),(41,[57,60,65]),(48,[55,60,64]),(43,[55,59,62])]
start=3.0
# intro pad 0-3
for (r,ch) in PROG[:1]:
    for m in ch:
        sig=osc(note(m),3.2,'saw')+osc(note(m)*1.005,3.2,'saw');sig=lp(sig,.02);e=np.minimum(1,np.arange(len(sig))/SR/1.5)*np.minimum(1,(3.2-np.arange(len(sig))/SR)/0.4);add(sig*e,0,0,.08)
# riser
n=int(2.8*SR);t=np.arange(n)/SR;ns=rng.uniform(-1,1,n);ns=lp(ns,.05);add(ns*(t/2.8)**2,0.2,0,.35)
end=33.0
step=0;tt=start
while tt<end:
    s=step%16;bar=(step//16)%4;r,ch=PROG[bar]
    inten=1 if tt<31 else .6
    if s%4==0:kick(tt,inten)
    if s in(4,12):snare(tt,inten)
    if s%2==1:hat(tt,inten)
    if s in(0,3,6,8,10,11,14):
        sig=lp(osc(note(r-12+(12 if s==14 else 0)),s16*1.6,'saw'),.08)*env(int(s16*1.6*SR),.003,.12);add(sig,tt,0,.32*inten)
    m=ch[s%3]+12*(1+((s>>3)&1));sig=osc(note(m),s16*.9,'sq')*env(int(s16*.9*SR),.002,.07);add(sig,tt,(-.4 if s%2 else .4),.06*inten)
    step+=1;tt=start+step*s16
# impacts at cuts
for c in [3.0,9.0,13.5,18.0,24.0,28.0,31.0]:
    n=int(.6*SR);t=np.arange(n)/SR;add(rng.uniform(-1,1,n)*np.exp(-t*6),c,0,.18);add(np.sin(2*np.pi*55*t)*np.exp(-t*4),c,0,.5)
# end chord
for m in [57,60,64,69]:
    sig=osc(note(m),3.5,'tri');add(sig*env(len(sig),.01,1.2),31.0,0,.12)
# sparkle for diamonds scene
for i,f in enumerate([1319,1760,2093,2637]):
    sig=np.sin(2*np.pi*f*np.arange(int(.3*SR))/SR)*env(int(.3*SR),.002,.08);add(sig,24.3+i*.07,.3,.15)
mx=max(np.abs(L).max(),np.abs(Rr).max());L/=mx*1.12;Rr/=mx*1.12
fade=np.ones(N);fo=int(1.2*SR);fade[-fo:]=np.linspace(1,0,fo);L*=fade;Rr*=fade
out=(np.stack([L,Rr],1)*32767).astype(np.int16)
w=wave.open('music.wav','wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(out.tobytes());w.close();print('ok')
