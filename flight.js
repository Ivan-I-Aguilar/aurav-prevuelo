export const COURSE=[{x:30,y:35,z:-150},{x:90,y:62,z:-340},{x:-5,y:40,z:-550},{x:80,y:80,z:-770},{x:15,y:52,z:-990}];
export function newFlight(){return{speed:0,altitude:0,time:0,rings:0,paused:false,heading:0,x:30,z:45};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function stepFlight(f,delta,climb=0,turn=0){
 if(f.paused||f.rings>=COURSE.length)return null;
 const dt=clamp(delta,0,.05);f.time+=dt;f.speed=Math.min(42,f.speed+dt*3.2);
 const target=COURSE[f.rings];
 // Assisted arcade climb keeps the introductory flight accessible in a headset.
 const assist=f.time>5&&f.rings===0?clamp((35-f.altitude)*.8,-4,6):0;
 f.altitude=clamp(f.altitude+(assist+clamp(climb,-1,1)*12)*dt,0,300);
 f.heading-=clamp(turn,-1,1)*.32*dt;
 f.x-=Math.sin(f.heading)*f.speed*dt;f.z-=Math.cos(f.heading)*f.speed*dt;
 if(Math.hypot(target.x-f.x,target.y-f.altitude,target.z-f.z)<13){f.rings++;return f.rings===COURSE.length?'complete':'ring';}
 if(f.z<target.z-38){f.paused=true;return 'missed';}
 return null;
}
