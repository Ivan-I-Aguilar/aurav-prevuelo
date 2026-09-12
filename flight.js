export const COURSE=Array.from({length:5},(_,i)=>({x:30,y:35+i*7,z:-150-i*160}));
export function newFlight(){return{speed:0,altitude:0,time:0,rings:0,paused:false,heading:0,x:30,z:45};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function stepFlight(f,delta,climb=0,turn=0){
 if(f.paused||f.rings>=COURSE.length)return null;
 const dt=clamp(delta,0,.05);f.time+=dt;f.speed=Math.min(42,f.speed+dt*3.2);
 const target=COURSE[f.rings];
 // Assisted arcade climb keeps the introductory flight accessible in a headset.
 const assist=f.time>5?clamp((target.y-f.altitude)*.8,-4,6):0;
 f.altitude=clamp(f.altitude+(assist+clamp(climb,-1,1)*12)*dt,0,300);
 f.heading-=clamp(turn,-1,1)*.32*dt;
 f.x-=Math.sin(f.heading)*f.speed*dt;f.z-=Math.cos(f.heading)*f.speed*dt;
 if(Math.hypot(target.x-f.x,target.y-f.altitude,target.z-f.z)<13){f.rings++;return f.rings===COURSE.length?'complete':'ring';}
 if(f.z<target.z-38){f.paused=true;return 'missed';}
 return null;
}
