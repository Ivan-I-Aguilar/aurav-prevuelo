export const COURSE=[
 {x:30,y:35,z:-150,name:'Salida'},
 {x:100,y:55,z:-350,name:'Ascenso'},
 {x:200,y:65,z:-650,name:'Hacia el pino'},
 {x:200,y:65,z:-1000,name:'Rodeá la referencia'},
 {x:100,y:55,z:-1250,name:'Viraje de regreso'},
 {x:-40,y:38,z:-1250,name:'Buscá la cabecera'},
 {x:30,y:16,z:-1080,name:'Final a pista'}
];
export const RING_RADIUS=18;
export const RUNWAY={x:30,halfWidth:9,minZ:-1150,maxZ:150};
export const REFERENCE={x:100,z:-1120};
export function newFlight(){return{speed:0,altitude:0,time:0,rings:0,paused:false,heading:0,x:30,z:45,stage:'takeoff',airborne:false,failure:''};}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function angleDifference(a,b){return Math.atan2(Math.sin(a-b),Math.cos(a-b));}
export function flightTarget(f){return COURSE[f.rings]||{x:30,y:0,z:-880,name:'Aterrizá en la pista'};}
export function flightGuidance(f){
 if(f.failure)return f.failure;
 if(f.stage==='complete')return 'Aterrizaje completado';
 if(f.stage==='rollout')return 'En pista · frenado automático';
 const target=flightTarget(f),desired=Math.atan2(f.x-target.x,f.z-target.z),error=angleDifference(f.heading,desired);
 const turn=Math.abs(error)<.13?'Recto':error>0?'Derecha':'Izquierda';
 return `${f.rings<COURSE.length?`${f.rings+1}/${COURSE.length} ${target.name}`:'Aterrizá'} · ${turn} · ${Math.round(Math.hypot(target.x-f.x,target.z-f.z))} m`;
}
function fail(f,message){f.paused=true;f.failure=message;return 'missed';}
function onRunway(f){return Math.abs(f.x-RUNWAY.x)<=RUNWAY.halfWidth-1&&f.z>=RUNWAY.minZ&&f.z<=RUNWAY.maxZ;}
export function stepFlight(f,delta,climb=0,turn=0){
 if(f.paused||f.stage==='complete')return null;
 const dt=clamp(delta,0,.05);f.time+=dt;
 if(f.stage==='rollout'){
  f.speed=Math.max(0,f.speed-4*dt);f.x-=Math.sin(f.heading)*f.speed*dt;f.z-=Math.cos(f.heading)*f.speed*dt;
  if(!onRunway(f))return fail(f,'Fuera de pista · reiniciá el vuelo');
  if(f.speed===0){f.stage='complete';return 'complete';}return null;
 }
 const approach=f.rings>=4,limit=approach?22:35;
 f.speed=f.speed<limit?Math.min(limit,f.speed+dt*2.7):Math.max(limit,f.speed-dt*2);
 const target=flightTarget(f);
 const assist=f.time>5&&f.rings===0?clamp((35-f.altitude)*.8,-4,6):0;
 const vertical=assist+clamp(climb,-1,1)*(approach?6:12);
 f.altitude=Math.max(0,Math.min(300,f.altitude+vertical*dt));
 if(f.altitude>3)f.airborne=true;
 f.heading-=clamp(turn,-1,1)*.32*dt;
 f.x-=Math.sin(f.heading)*f.speed*dt;f.z-=Math.cos(f.heading)*f.speed*dt;
 if(f.airborne&&f.altitude===0){
  if(f.rings<COURSE.length)return fail(f,'Todavía faltan anillos · reiniciá el vuelo');
  if(!onRunway(f)||Math.cos(f.heading)>-.94||Math.abs(Math.sin(f.heading))>.1||f.speed>26||vertical<-6.1)return fail(f,'Aterrizaje fuera de alineación · reiniciá el vuelo');
  f.stage='rollout';return 'touchdown';
 }
 if(f.rings<COURSE.length&&Math.hypot(target.x-f.x,target.y-f.altitude,target.z-f.z)<RING_RADIUS){
  f.rings++;f.stage=f.rings===COURSE.length?'landing':f.rings>=4?'approach':'circuit';return 'ring';
 }
 if(Math.hypot(target.x-f.x,target.z-f.z)>750)return fail(f,'Te alejaste del recorrido · reiniciá el vuelo');
 return null;
}
