import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Mission,STATIONS} from './mission.js';
import {COURSE,newFlight,stepFlight} from './flight.js';

const $=id=>document.getElementById(id), mission=new Mission();
const scene=new THREE.Scene();
scene.background=new THREE.Color('#c7d6d0');
scene.fog=new THREE.Fog('#c7d6d0',90,440);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.xr.enabled=true;renderer.xr.setReferenceSpaceType('local-floor');renderer.xr.setFramebufferScaleFactor(.85);
$('world').appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.05,1600);
const rig=new THREE.Group();scene.add(rig);rig.add(camera);camera.position.y=1.65;
const aircraft=new THREE.Group();scene.add(aircraft);
const propellerRotor=new THREE.Group();propellerRotor.position.set(0,1.22,-3.69);aircraft.add(propellerRotor);
const flightRig=new THREE.Group();scene.add(flightRig);
const hemi=new THREE.HemisphereLight('#edf5ff','#797750',2.6);scene.add(hemi);
const sun=new THREE.DirectionalLight('#ffdfac',3.4);sun.position.set(-16,30,-18);sun.castShadow=true;
sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-17;sun.shadow.camera.right=17;sun.shadow.camera.top=17;sun.shadow.camera.bottom=-17;sun.shadow.camera.far=95;sun.shadow.bias=-.0004;sun.shadow.normalBias=.025;scene.add(sun);
const clock=new THREE.Clock(),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
const tempVec=new THREE.Vector3(),eye=new THREE.Vector3(),forward=new THREE.Vector3(),matrix=new THREE.Matrix4();
let loaded=false,model=null,yaw=0,pitch=0,drag=null,toastUntil=0,vrAvailable=false,vrEntryPose=null;
let soundEnabled=true,audio=null,windGain=null,engineGain=null,engineOsc=null,freeMove=false;
const keys=new Set(),markers=[],controllers=[];
let activeStation=null,optionOrder=[],panelMode='mission',lastPanelKey='',lastPanelTime=0;
let flight=newFlight();
let tailAnimation=0;

function material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.86,...extra});}
const mats={ground:material('#85916f'),concrete:material('#c9c7af'),asphalt:material('#59615b'),paint:material('#e9d49a'),white:material('#e5e5d2'),dark:material('#173247'),wall:material('#8a9caa'),roof:material('#143b59')};
function box(w,h,d,x,y,z,mat,parent=scene){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m;}
function cylinder(r,h,x,y,z,mat,parent=scene){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12),mat);m.position.set(x,y,z);parent.add(m);return m;}
function canvasTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function label(text,w=2,h=.45,fg='#f4f9ff',bg='#082440'){const tex=canvasTexture(768,160,(c,W,H)=>{c.fillStyle=bg;c.fillRect(0,0,W,H);c.fillStyle=fg;c.textAlign='center';c.textBaseline='middle';c.font='600 46px Arial';c.fillText(text,W/2,H/2);});return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));}

const brandBoards=[];
function brandSign(width){const sign=label('AURAV / PLANO AÉREO',width,width*.572,'#ffffff','#082440');sign.material.side=THREE.FrontSide;const back=sign.clone();back.material=sign.material.clone();back.rotation.y=Math.PI;back.position.z=-.006;const group=new THREE.Group();group.add(sign,back);brandBoards.push(sign,back);return group;}
function applyBrand(){
 const style=document.createElement('style');style.textContent=`
 :root{color:#082440;--ink:#082440;--lime:#29b6f6;--line:rgba(8,36,64,.2)}
 .topbar{background:linear-gradient(180deg,#082440f5,#082440dc);color:#f4f9ff;padding:12px 30px}.brand{letter-spacing:2px}.brand img{width:210px;height:76px;object-fit:cover;border-radius:5px}.brand small{color:#b9dcef}.brand-divider{background:#ffffff40}.dot{background:#29b6f6}.round-button{color:#fff;border-color:#73b6dc}
 .intro{background:#f4f9fff0;padding:22px;border-radius:10px;border:1px solid #ffffffa0}.eyebrow{color:#096494}p{color:#274660}.primary{background:#29b6f6;color:#062039}.primary:hover:enabled{background:#6fd3ff}.secondary{background:#082440;color:#f4f9ff;border-color:#318fc0}.load-track>div,.progress-track>div{background:#29b6f6}.airport-card,.checklist-panel,.inspection,.modal>div{background:#f4f9ffed;border-color:#b9dcef}.progress-row span:last-child,li button.done{color:#26749c}li button{color:#274660;border-color:#d1e2ef}li button.current{color:#082440}li button.done .num{background:#c9eaff;border-color:#59b5e0}
 .bottom-hint,.toast,.flight-hud{background:#082440f0;color:#f4f9ff;border-color:#29b6f6}kbd,.flight-hud button{background:#194363;color:white}.sound-button{background:#f4f9ff;color:#082440}.option{background:#e7f4ff;color:#082440;border:1px solid #78bce0}.option:hover{background:#c9edff}.feedback{color:#096494}#credits{background:#082440;color:#d5e7f5}button:focus-visible,a:focus-visible{outline-color:#29b6f6}
 @media(max-width:550px){.brand img{width:150px;height:55px}.intro{padding:16px}.topbar{padding:10px 20px}}
 `;document.head.appendChild(style);
 const small=document.querySelector('.brand small');if(small)small.textContent='BY PLANO AÉREO';
 const image=new Image();image.alt='AURAV by Plano Aéreo';image.onload=()=>{const texture=new THREE.Texture(image);texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;for(const sign of brandBoards){sign.material.map.dispose();sign.material.map=texture;sign.material.needsUpdate=true;}document.querySelector('.brand').replaceChildren(image);document.body.dataset.brand='loaded';};image.onerror=()=>{document.body.dataset.brand='unavailable';};image.src='./aurav-plano-aereo.webp';
}
function buildWorld(){
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(2400,2400),mats.ground);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 box(39,.06,46,-1,-.025,2,mats.concrete);
 box(18,.07,1300,30,-.012,-500,mats.asphalt);
 box(33,.071,9,11,-.01,15,mats.asphalt);
 for(let z=-1100;z<120;z+=23)box(.18,.015,7,30,.034,z,mats.white);
 for(const x of [22,38])box(.13,.015,1280,x,.034,-510,mats.white);
 for(let x=24;x<=36;x+=2)box(.8,.015,12,x,.04,-12,mats.white);
 for(const x of [-7,7])box(.07,.015,14,x,.035,-1,mats.paint);
 box(14,.015,.07,0,.035,6,mats.paint);box(.11,.015,18,0,.035,13,mats.paint);
 for(let z=4;z<22;z+=3)box(.16,.015,1.5,0,.036,z,mats.paint);
 for(let x=-15;x<18;x+=3){box(.025,.006,46,x,.015,2,material('#b7b7a4'));}
 for(let z=-18;z<24;z+=4){box(39,.006,.025,-1,.015,z,material('#b7b7a4'));}
 for(let i=0;i<3;i++){
  const x=-31-i*21,z=18+i*5;
  box(18,8,20,x,4,z,mats.wall).castShadow=true;
  box(18.6,.5,20.6,x,8,z,mats.roof);
  box(14,6.3,.08,x,3.2,z-10.1,mats.dark);
  for(let p=-6;p<=6;p+=2)box(.06,6.2,.1,x+p,3.2,z-10.18,mats.roof);
  const l=i===0?brandSign(6):label(`HANGAR 0${i+1}`,8,.95);l.position.set(x,i===0?6.4:7.1,z-10.25);l.rotation.y=Math.PI;scene.add(l);
 }
 // Low polygon landscape, deterministic and inexpensive in stereo.
 let seed=721;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 const ridgeGeo=new THREE.IcosahedronGeometry(1,2);
 const vertices=ridgeGeo.attributes.position;
 for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),z=vertices.getZ(i),rough=1+.12*Math.sin(x*13+z*7)*Math.cos(y*9);vertices.setXYZ(i,x*rough,y*rough,z*rough);}ridgeGeo.computeVertexNormals();
 const ridges=new THREE.InstancedMesh(ridgeGeo,material('#a5b3a5',{flatShading:true}),28),o=new THREE.Object3D();
 for(let i=0;i<28;i++){const side=i%2?-1:1,h=42+rnd()*72;o.position.set(side*(270+rnd()*140),-h*.22,150-Math.floor(i/2)*100);o.rotation.set(0,rnd()*Math.PI,0);o.scale.set(70+rnd()*90,h,95+rnd()*65);o.updateMatrix();ridges.setMatrixAt(i,o.matrix);ridges.setColorAt(i,new THREE.Color(i%3?'#94a695':'#b2b5a3'));}scene.add(ridges);
 const treeCount=110,trunks=new THREE.InstancedMesh(new THREE.CylinderGeometry(.16,.25,1,6),material('#66513b'),treeCount);
 const crowns=Array.from({length:3},()=>new THREE.InstancedMesh(new THREE.ConeGeometry(1,1,7),material('#526f55',{flatShading:true}),treeCount));
 for(let i=0;i<treeCount;i++){const a=rnd()*Math.PI*2,r=75+rnd()*140,h=6+rnd()*7;let x=Math.cos(a)*r;const z=Math.sin(a)*r;if(Math.abs(x-30)<20)x+=x>=30?40:-40;const rotation=rnd()*Math.PI;
  o.rotation.set(0,rotation,0);o.position.set(x,h*.21,z);o.scale.set(1,h*.42,1);o.updateMatrix();trunks.setMatrixAt(i,o.matrix);
  for(let layer=0;layer<3;layer++){o.position.set(x,h*(.32+layer*.23),z);o.scale.set(h*(.27-layer*.065),h*.55,h*(.27-layer*.065));o.rotation.y=rotation+layer*.5;o.updateMatrix();crowns[layer].setMatrixAt(i,o.matrix);crowns[layer].setColorAt(i,new THREE.Color().setHSL(.29+rnd()*.05,.16+rnd()*.12,.62+layer*.055));}
 }scene.add(trunks,...crowns);
 for(let i=0;i<18;i++){const x=-200+rnd()*430,z=-90-rnd()*1000;box(25+rnd()*45,.05,35+rnd()*80,x,.04,z,material(i%2?'#a2a477':'#748867'));}
 cylinder(.08,8,14,4,7,mats.white);const sock=new THREE.Group();sock.position.set(14,8,7);sock.rotation.z=-Math.PI/2.5;
 for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.35-i*.04,.39-i*.04,.4,12,1,true),material(i%2?'#eee6cb':'#d78955',{side:THREE.DoubleSide}));m.position.y=i*.4;sock.add(m);}scene.add(sock);
 const board=brandSign(3);board.position.set(-8,1.8,5);board.rotation.y=.45;scene.add(board);box(.09,1.6,.09,-8,.8,5,mats.dark);
 const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(13,16,12),new THREE.MeshBasicMaterial({color:'#fff1c5',fog:false}));sunDisc.position.set(-280,150,-390);scene.add(sunDisc);
}
buildWorld();applyBrand();

const pitotCover=box(.13,.12,.43,-3.35,1.78,-1.64,material('#c74535'),aircraft);
const removeTag=label('REMOVE BEFORE FLIGHT',.7,.14,'#fff7e7','#b62d2b');removeTag.position.set(-3.35,1.55,-1.65);aircraft.add(removeTag);
const controlLock=box(.035,.3,.035,-.2,1.4,-2.1,material('#d34b37'),aircraft);

function makeMarkers(){STATIONS.forEach((s,i)=>{
 const g=new THREE.Group();g.position.fromArray(s.point);
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),new THREE.MeshBasicMaterial({color:'#29b6f6'}));sphere.userData.station=i;g.add(sphere);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.21,.018,6,32),new THREE.MeshBasicMaterial({color:'#29b6f6'}));g.add(ring);
 const number=label(String(i+1).padStart(2,'0'),.32,.12,'#f7ffdf','#264938');number.position.y=.35;g.add(number);scene.add(g);
 const floor=new THREE.Mesh(new THREE.RingGeometry(.43,.48,32),new THREE.MeshBasicMaterial({color:'#168bc3',side:THREE.DoubleSide}));floor.rotation.x=-Math.PI/2;floor.position.set(s.stand[0],.045,s.stand[2]);scene.add(floor);
 const floorTarget=new THREE.Mesh(new THREE.CircleGeometry(.55,32),new THREE.MeshBasicMaterial({side:THREE.DoubleSide,transparent:true,opacity:0,depthWrite:false}));floorTarget.userData.station=i;floor.add(floorTarget);
 markers.push({group:g,sphere,ring,number,floor,floorTarget,station:s});
});}
makeMarkers();

const manager=new THREE.LoadingManager();
manager.onProgress=(_,count,total)=>{$('load-progress').style.width=`${Math.max(8,count/total*100)}%`;};
new GLTFLoader(manager).load('./scene.gltf',async gltf=>{
 try{
  model=gltf.scene;model.rotation.y=Math.PI;model.scale.setScalar(11/(1.8447104692459106*2));model.position.y=-.0098;
  // Bound texture memory on the standalone headset; retain full original files.
  const seen=new Set();model.traverse(o=>{if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;for(const m of Array.isArray(o.material)?o.material:[o.material]){
   for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap','emissiveMap']){
    const t=m[key];if(!t||seen.has(t))continue;seen.add(t);const im=t.image,limit=key==='map'?2048:1024;
    if(im&&Math.max(im.width,im.height)>limit){const scale=limit/Math.max(im.width,im.height),c=document.createElement('canvas');c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);c.getContext('2d').drawImage(im,0,0,c.width,c.height);t.image=c;t.needsUpdate=true;}t.anisotropy=2;
   }
   if(m.name==='Window'){m.transparent=true;m.opacity=.18;m.depthWrite=false;}
  }});
  aircraft.add(model);aircraft.updateMatrixWorld(true);for(const name of ['Object_39','Object_40']){const part=model.getObjectByName(name);if(part)propellerRotor.attach(part);}loaded=true;$('start').disabled=false;$('start-label').textContent='Comenzar recorrido';$('load-progress').style.width='100%';updateVRButton();
  document.body.dataset.model='loaded';
 }catch(e){loadError(e);}
},undefined,loadError);
function loadError(e){console.error(e);$('start-label').textContent='No se pudo cargar el avión';$('xr-note').textContent='Abrí el juego con INICIAR.cmd. Si el servidor está activo, recargá la página.';$('xr-note').classList.add('error');document.body.dataset.model='error';}

const headWorldMatrix=new THREE.Matrix4();
function getHeadWorldMatrix(){rig.updateWorldMatrix(true,false);return headWorldMatrix.multiplyMatrices(rig.matrixWorld,renderer.xr.getCamera().matrix);}
function getEye(){return renderer.xr.isPresenting?eye.setFromMatrixPosition(getHeadWorldMatrix()):camera.getWorldPosition(eye);}
function getViewDirection(out){return renderer.xr.isPresenting?out.set(0,0,-1).transformDirection(getHeadWorldMatrix()):camera.getWorldDirection(out);}
function placeRig(x,z,lookAt,eyeHeight=null){
 rig.position.set(x,0,z);rig.rotation.set(0,0,0);
 if(renderer.xr.isPresenting){
  // Recenter and rotate around the tracked head, including seated users.
  const head=renderer.xr.getCamera();
  if(lookAt){const facing=new THREE.Vector3(0,0,-1).transformDirection(head.matrix);const current=Math.atan2(-facing.x,-facing.z);const desired=Math.atan2(x-lookAt[0],z-lookAt[2]);rig.rotation.y=desired-current;}
  const local=new THREE.Vector3().setFromMatrixPosition(head.matrix).applyAxisAngle(new THREE.Vector3(0,1,0),rig.rotation.y);rig.position.x-=local.x;rig.position.z-=local.z;
  if(eyeHeight!==null)rig.position.y=eyeHeight-new THREE.Vector3().setFromMatrixPosition(head.matrix).y;
 }else{camera.position.set(0,eyeHeight??1.65,0);}
 if(lookAt&&!renderer.xr.isPresenting){camera.lookAt(lookAt[0],lookAt[1],lookAt[2]);const e=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');yaw=e.y;pitch=e.x;}
 rig.updateMatrixWorld(true);
}
function start(){if(!loaded)return;mission.start();document.body.classList.add('playing');$('intro').classList.add('hidden');$('airport-card').classList.add('hidden');$('hud').classList.remove('hidden');placeRig(-7,-6,[0,1.4,-.5]);initAudio();updateHUD();showToast('Empezá por la cabina. Cada punto cuenta.');positionPanel();}
$('start').onclick=start;
function goStation(i,inspect=false){if(mission.phase!=='inspection')return;const s=STATIONS[i];closeInspection();placeRig(s.stand[0],s.stand[2],s.point);playCue('move');positionPanel();if(inspect)openStation(i);else showToast(`${s.title} · apuntá al marcador o presioná E`);}
function nextStation(){const i=STATIONS.findIndex(s=>!mission.completed.has(s.id));if(i>=0)goStation(i,true);else showBoarding();}
function openStation(i){const s=STATIONS[i];if(!s)return;const r=mission.open(s.id);if(!r.ok){showToast(r.message);return;}activeStation=i;panelMode='inspection';drawInspection();positionPanel();playCue('open');}
function nearestStation(){getEye();let index=-1,d=3.6;markers.forEach((m,i)=>{if(mission.completed.has(m.station.id))return;const dist=eye.distanceTo(m.group.position);if(dist<d){d=dist;index=i;}});return index;}
function drawInspection(){
 const s=STATIONS[activeStation];if(!s)return;const step=s.steps[mission.steps[s.id]];optionOrder=step.options.map((_,i)=>i);if(step.options.length>1&&(activeStation+mission.steps[s.id])%2===1)optionOrder.reverse();
 $('inspection').classList.remove('hidden');$('inspection-zone').textContent=`${s.zone} · ${mission.steps[s.id]+1}/${s.steps.length}`;$('inspection-title').textContent=s.title;$('inspection-copy').textContent=s.intro+' '+step.text;$('inspection-feedback').textContent='';$('inspection-options').replaceChildren();
 optionOrder.forEach(index=>{const b=document.createElement('button');b.className='option';b.textContent=step.options[index];b.onclick=()=>answer(index);$('inspection-options').appendChild(b);});updateProp(s.id);lastPanelKey='';
}
function answer(index){const r=mission.answer(index);if(!r.ok){$('inspection-feedback').textContent=r.message||'Reintentá la inspección.';showToast(r.message||'Revisá la situación.');playCue('incorrect');lastPanelKey='';return;}
 playCue('correct');showToast(r.message);if(r.id==='cabin'&&mission.steps.cabin>=2)controlLock.visible=false;
 if(r.id==='pitot'){pitotCover.visible=false;removeTag.visible=false;}
 if(r.id==='tail')tailAnimation=2;
 if(r.id==='secure'&&mission.steps.secure>=1){for(const name of ['Object_72','Object_76','Object_78','Object_116','Object_114']){const o=model?.getObjectByName(name);if(o)o.visible=false;}}
 if(r.finished){closeInspection();updateHUD();showToast(r.message);if(mission.ready){panelMode='ready';showToast('12 de 12. Chequeo completo: vuelo arcade habilitado.');}}else{drawInspection();$('inspection-feedback').textContent=r.message;}lastPanelKey='';
}
function closeInspection(){mission.active=null;activeStation=null;panelMode=mission.ready?'ready':'mission';$('inspection').classList.add('hidden');inspectionProp.visible=false;lastPanelKey='';positionPanel();}
$('close-inspection').onclick=closeInspection;
function updateHUD(){
 $('progress-label').textContent=`${mission.completed.size} / 12 completados`;$('mission-progress').style.width=`${mission.completed.size/12*100}%`;$('status-label').textContent=mission.ready?'LISTO PARA VOLAR':'EN TIERRA';$('board').disabled=!mission.ready;$('board').textContent=mission.ready?'Subir y volar ↗':'Completar chequeo para volar';
 $('checklist').replaceChildren();STATIONS.forEach((s,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.className=mission.completed.has(s.id)?'done':STATIONS.find(t=>!mission.completed.has(t.id))?.id===s.id?'current':'';const n=document.createElement('span');n.className='num';n.textContent=mission.completed.has(s.id)?'✓':String(i+1).padStart(2,'0');b.append(n,document.createTextNode(s.title));b.onclick=()=>goStation(i,true);li.append(b);$('checklist').append(li);markers[i].sphere.material.color.set(mission.completed.has(s.id)?'#557b98':'#29b6f6');markers[i].ring.material.color.copy(markers[i].sphere.material.color);});
 document.body.dataset.completed=String(mission.completed.size);document.body.dataset.phase=mission.phase;lastPanelKey='';
}
function showToast(text){$('toast').textContent=text;$('toast').classList.remove('hidden');toastUntil=performance.now()+4700;
 const c=vrToastCanvas.getContext('2d');c.fillStyle='#123b60';c.fillRect(0,0,1024,180);c.fillStyle='#f4f9ff';c.font='30px Arial';let y=55,line='';for(const word of text.split(' ')){if(c.measureText(line+word+' ').width>930){c.fillText(line,45,y);line=word+' ';y+=42;}else line+=word+' ';}c.fillText(line,45,y);vrToastTexture.needsUpdate=true;
}

// A canvas-backed, ray-interactive board keeps every essential action inside VR.
const panelCanvas=document.createElement('canvas');panelCanvas.width=1024;panelCanvas.height=900;
const pc=panelCanvas.getContext('2d'),panelTexture=new THREE.CanvasTexture(panelCanvas);panelTexture.colorSpace=THREE.SRGBColorSpace;
const panel=new THREE.Mesh(new THREE.PlaneGeometry(1.65,1.45),new THREE.MeshBasicMaterial({map:panelTexture,side:THREE.DoubleSide,toneMapped:false,depthTest:false,depthWrite:false}));panel.visible=false;panel.renderOrder=20;scene.add(panel);
const vrToastCanvas=document.createElement('canvas');vrToastCanvas.width=1024;vrToastCanvas.height=180;const vrToastTexture=new THREE.CanvasTexture(vrToastCanvas);vrToastTexture.colorSpace=THREE.SRGBColorSpace;
const vrToast=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.264),new THREE.MeshBasicMaterial({map:vrToastTexture,depthTest:false,toneMapped:false}));vrToast.visible=false;vrToast.renderOrder=10;scene.add(vrToast);
let panelButtons=[],hoveredButton=-1;
function wrap(text,x,y,maxWidth,lineHeight,font='26px Arial',color='#d5e7f5'){pc.font=font;pc.fillStyle=color;let line='';for(const word of text.split(' ')){const test=line+word+' ';if(pc.measureText(test).width>maxWidth&&line){pc.fillText(line,x,y);line=word+' ';y+=lineHeight;}else line=test;}pc.fillText(line,x,y);return y+lineHeight;}
function panelButton(text,y,action,primary=false){const selected=panelButtons.length===hoveredButton;pc.fillStyle=selected?'#ffffff':primary?'#29b6f6':'#194363';pc.beginPath();pc.roundRect(32,y,960,104,12);pc.fill();if(selected){pc.strokeStyle='#29b6f6';pc.lineWidth=7;pc.stroke();}wrap(text,56,y+39,916,33,'bold 31px Arial',selected||primary?'#062039':'#f4f9ff');panelButtons.push({x:32,y,w:960,h:104,action});}
function drawPanel(){
 panelButtons=[];pc.fillStyle='#082440';pc.fillRect(0,0,1024,900);pc.fillStyle='#29b6f6';pc.font='bold 30px Arial';pc.fillText(`AURAV · ${mission.completed.size}/12 COMPLETADOS`,48,55);
 pc.fillStyle=hoveredButton===0?'#ffffff':'#29b6f6';pc.beginPath();pc.roundRect(795,16,181,58,10);pc.fill();pc.fillStyle='#062039';pc.font='bold 24px Arial';pc.fillText(soundEnabled?'Sonido: sí':'Sonido: no',808,54);panelButtons.push({x:795,y:16,w:181,h:58,action:toggleSound});
 if(mission.phase==='flight'){
  wrap(flight.paused?'Vuelo en pausa':'El cielo es tuyo',48,124,900,52,'46px Arial','#f4f9ff');
  wrap(`${Math.round(flight.speed*1.944)} KT · ${Math.round(flight.altitude*3.281)} FT · ${flight.rings}/5 aros`,48,212,900,40,'32px Arial');
  wrap('Vuelo arcade. Stick izquierdo: subir / bajar. Stick derecho: virar. Atravesá los cinco aros luminosos.',48,280,900,38);
  panelButton(flight.paused?'Continuar vuelo':'Pausar vuelo',465,()=>togglePause(),true);panelButton('Volver a plataforma',578,()=>returnToApron());panelButton('Salir de realidad virtual',760,()=>renderer.xr.getSession()?.end());
 }else if(mission.phase==='complete'){
  wrap('Misión completada',48,136,900,52,'48px Arial','#f4f9ff');wrap(`12 inspecciones. 5 aros. ${mission.mistakes} decisiones revisadas.`,48,238,900,40,'32px Arial');
  wrap('El vuelo empezó con una buena inspección. Volvé al aeródromo para jugar otra vez.',48,335,900,38);
  panelButton('Jugar de nuevo',535,()=>resetGame(),true);panelButton('Salir de realidad virtual',760,()=>renderer.xr.getSession()?.end());
 }else if(panelMode==='inspection'&&activeStation!==null){
  const s=STATIONS[activeStation],step=s.steps[mission.steps[s.id]];
  wrap(`Punto ${activeStation+1}/12 · ${s.title}`,48,120,900,45,'bold 39px Arial','#f4f9ff');wrap(`Comprobación ${mission.steps[s.id]+1} de ${s.steps.length}`,48,211,900,37,'31px Arial');wrap(step.text,48,275,900,43,'bold 35px Arial','#ffffff');
  optionOrder.forEach((index,i)=>panelButton(step.options[index],480+i*112,()=>answer(index),i===0));
  panelButton('Ver el avión / volver a la guía',760,()=>closeInspection());
 }else if(panelMode==='boarding'||mission.ready){
  wrap('Chequeo completo.',48,130,900,54,'48px Arial','#f4f9ff');wrap('Tu avión está listo en esta misión.',48,228,900,40,'32px Arial');
  wrap('Ahora comienza un vuelo arcade simplificado. No representa los procedimientos de puesta en marcha, rodaje o despegue reales.',48,313,900,38);
  panelButton('Iniciar vuelo arcade',535,()=>startFlight(),true);panelButton('Seguir en tierra',648,()=>{panelMode='mission';closeInspection();});panelButton('Salir de realidad virtual',760,()=>renderer.xr.getSession()?.end());
 }else{
  const next=STATIONS.find(s=>!mission.completed.has(s.id)),n=STATIONS.indexOf(next)+1;wrap(mission.completed.has('cabin')?'Elegí un punto pendiente':'Primero: cabina segura',48,130,900,52,'bold 47px Arial','#f4f9ff');wrap(next?.title||'¡Completado!',48,217,900,43,'bold 38px Arial');
  wrap('Después de la cabina, elegí cualquier marcador con el gatillo. El botón de abajo sugiere un punto pendiente. A: traer cartel al frente.',48,302,900,42,'32px Arial');
  panelButton(`Punto sugerido ${n}: ${next?.title||'Finalizar'}`,505,()=>nextStation(),true);panelButton(freeMove?'Movimiento libre: activo':'Solo teletransporte (confort)',617,()=>{freeMove=!freeMove;lastPanelKey='';});panelButton('Salir de realidad virtual',760,()=>renderer.xr.getSession()?.end());
 }
 panelTexture.needsUpdate=true;
}
function positionPanel(forceFront=false){
 getEye();
 if(!forceFront&&panelMode==='inspection'&&activeStation!==null){
  const station=STATIONS[activeStation];
  forward.set(station.stand[0]-station.point[0],0,station.stand[2]-station.point[2]).normalize();
  panel.position.set(station.point[0],eye.y-.08,station.point[2]).addScaledVector(forward,.45);
 }else{
  getViewDirection(forward);forward.y=0;if(forward.lengthSq()<.001)forward.set(0,0,-1);forward.normalize();
  panel.position.copy(eye).addScaledVector(forward,1.65);panel.position.y=eye.y-.08;
 }
 facePanel();lastPanelKey='';
}
function facePanel(){getEye();tempVec.copy(eye);tempVec.y=panel.position.y;panel.lookAt(tempVec);}
function panelButtonIndex(hit){const x=hit.uv.x*1024,y=(1-hit.uv.y)*900;return panelButtons.findIndex(b=>x>=b.x-8&&x<=b.x+b.w+8&&y>=b.y-4&&y<=b.y+b.h+4);}
function panelHitAction(hit){const b=panelButtons[panelButtonIndex(hit)];if(b){b.action();lastPanelKey='';return true;}return false;}
function updatePanelHover(){let next=-1;for(const c of controllers){controllerRay(c);const hit=panel.visible?raycaster.intersectObject(panel,false)[0]:null;const index=hit?panelButtonIndex(hit):-1;c.userData.cursor.visible=!!hit;if(hit){c.worldToLocal(c.userData.cursor.position.copy(hit.point));c.userData.line.scale.z=hit.distance;c.userData.cursor.material.color.set(index>=0?'#ffffff':'#29b6f6');}else c.userData.line.scale.z=4;if(index>=0)next=index;}if(next!==hoveredButton){hoveredButton=next;lastPanelKey='';}}

// Small virtual inspection props provide a visible sample and dipstick near the task.
const inspectionProp=new THREE.Group();scene.add(inspectionProp);inspectionProp.visible=false;
const jar=cylinder(.075,.22,0,0,0,new THREE.MeshStandardMaterial({color:'#ddf4ef',transparent:true,opacity:.32,roughness:.1,depthWrite:false}),inspectionProp);
const fuel=cylinder(.058,.14,0,-.025,0,material('#528dde',{transparent:true,opacity:.85}),inspectionProp);
const stick=box(.025,.38,.008,0,0,0,material('#c7bfa4'),inspectionProp);
const oilMark=box(.028,.10,.012,0,-.09,0,material('#806332'),inspectionProp);
function updateProp(id){inspectionProp.visible=/fuel|oil/.test(id);jar.visible=fuel.visible=id.includes('fuel');stick.visible=oilMark.visible=id==='oil';if(!inspectionProp.visible)return;getEye();getViewDirection(forward);forward.y=0;forward.normalize();inspectionProp.position.copy(eye).addScaledVector(forward,.65);inspectionProp.position.y=eye.y-.35;}

function initAudio(){if(audio){audio.resume();return;}try{audio=new(window.AudioContext||window.webkitAudioContext)();const size=audio.sampleRate*2,buffer=audio.createBuffer(1,size,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*.25;const source=audio.createBufferSource();source.buffer=buffer;source.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=500;windGain=audio.createGain();windGain.gain.value=soundEnabled?.06:0;source.connect(filter).connect(windGain).connect(audio.destination);source.start();engineOsc=audio.createOscillator();engineOsc.type='sawtooth';engineGain=audio.createGain();engineGain.gain.value=0;const engineFilter=audio.createBiquadFilter();engineFilter.type='lowpass';engineFilter.frequency.value=320;engineOsc.connect(engineFilter).connect(engineGain).connect(audio.destination);engineOsc.start();}catch(e){console.warn('Audio no disponible',e);}}
function tone(hz,duration){if(!audio||!soundEnabled)return;const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=hz;g.gain.setValueAtTime(.045,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
let lastFootstep=0;
function playCue(kind){
 if(!audio||!soundEnabled)return;
 const notes={open:[[420,0,.11],[660,.08,.14]],correct:[[660,0,.12],[880,.1,.19]],incorrect:[[240,0,.12],[160,.1,.2]],move:[[180,0,.12],[270,.05,.12]],step:[[90,0,.07]]}[kind];
 if(!notes)return;
 for(const [hz,delay,duration] of notes){const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime+delay;o.type=kind==='step'?'triangle':'sine';o.frequency.setValueAtTime(hz,t);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(kind==='step'?.025:.04,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+duration);o.onended=()=>{o.disconnect();g.disconnect();};}
}
function toggleSound(){soundEnabled=!soundEnabled;$('sound').textContent=`Sonido: ${soundEnabled?'activo':'apagado'}`;if(windGain)windGain.gain.value=soundEnabled?.06:0;lastPanelKey='';}
$('sound').onclick=toggleSound;

function showBoarding(){if(!mission.ready){showToast('Completá los doce puntos antes de volar.');return;}closeInspection();panelMode='boarding';positionPanel();
 if(!renderer.xr.isPresenting){$('inspection').classList.remove('hidden');$('inspection-zone').textContent='12 / 12 · CHEQUEO COMPLETO';$('inspection-title').textContent='Tu lugar está en el cielo';$('inspection-copy').textContent='Comienza un vuelo arcade: despegue simplificado y cinco aros para atravesar. No representa procedimientos ni física de vuelo reales.';$('inspection-feedback').textContent='';$('inspection-options').replaceChildren();const b=document.createElement('button');b.className='option';b.textContent='Iniciar vuelo arcade';b.onclick=startFlight;$('inspection-options').append(b);}}
$('board').onclick=showBoarding;
const flightRings=[];
for(const p of COURSE){const mesh=new THREE.Mesh(new THREE.TorusGeometry(12,.35,8,56),new THREE.MeshBasicMaterial({color:'#29b6f6'}));mesh.position.set(p.x,p.y,p.z);mesh.visible=false;scene.add(mesh);flightRings.push(mesh);}
const cockpitHUD=label('AURAV / VUELO ARCADE',.52,.1,'#29b6f6','#082440');cockpitHUD.position.set(-.24,1.48,-2.33);aircraft.add(cockpitHUD);let lastInstrumentTime=0;
function startFlight(){
 if(!mission.takeoff()){showToast('El vuelo sigue bloqueado: faltan inspecciones.');return;}
 closeInspection();flight=newFlight();flightRig.position.set(30,0,45);flightRig.rotation.set(0,0,0);flightRig.add(aircraft);flightRig.add(rig);placeRig(-.26,-1.73,[0,1.65,-20],1.65);
 if(!renderer.xr.isPresenting){yaw=0;pitch=0;camera.rotation.set(0,0,0);}
 markers.forEach(m=>{m.group.visible=false;m.floor.visible=false;});flightRings.forEach((r,i)=>{r.visible=true;r.material.color.set(i===0?'#ffffff':'#628a72');});$('hud').classList.add('hidden');$('flight-hud').classList.remove('hidden');document.body.dataset.phase='flight';panelMode='flight';panel.visible=false;sun.castShadow=false;lastPanelKey='';initAudio();showToast('Despegue arcade. Atravesá los cinco aros. W/S: altura · A/D: virar.');
}
function togglePause(){if(mission.phase!=='flight')return;flight.paused=!flight.paused;$('pause-flight').textContent=flight.paused?'Continuar':'Pausar';if(flight.paused)positionPanel();lastPanelKey='';}
$('pause-flight').onclick=togglePause;$('return-flight').onclick=()=>returnToApron();
function returnToApron(){mission.returnToApron();scene.add(aircraft);scene.add(rig);flightRig.position.set(0,0,0);flightRig.rotation.set(0,0,0);aircraft.position.set(0,0,0);aircraft.rotation.set(0,0,0);flightRings.forEach(r=>r.visible=false);markers.forEach(m=>{m.group.visible=true;m.floor.visible=true;});sun.castShadow=true;$('flight-hud').classList.add('hidden');$('debrief').classList.add('hidden');$('hud').classList.remove('hidden');placeRig(-7,-6,[0,1.4,0]);panelMode=mission.ready?'ready':'mission';positionPanel();updateHUD();}
function resetGame(){returnToApron();mission.reset();mission.start();pitotCover.visible=removeTag.visible=controlLock.visible=true;for(const name of ['Object_72','Object_76','Object_78','Object_116','Object_114']){const o=model?.getObjectByName(name);if(o)o.visible=true;}panelMode='mission';$('pause-flight').textContent='Pausar';updateHUD();showToast('Nueva misión. Empezá por la cabina.');}
$('replay').onclick=resetGame;
function finishFlight(){mission.finish();document.body.dataset.phase='complete';$('flight-hud').classList.add('hidden');$('debrief').classList.remove('hidden');$('debrief-copy').textContent=`Completaste las doce inspecciones y atravesaste los cinco aros. Revisaste ${mission.mistakes} decisiones durante el chequeo. Buen recorrido.`;positionPanel();tone(880,.45);}
function updateFlight(dt){if(flight.paused||mission.phase!=='flight')return;let climb=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),turn=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);
 const session=renderer.xr.getSession();if(session)for(const source of session.inputSources){const g=source.gamepad;if(!g)continue;const axes=g.axes;if(source.handedness==='left')climb=-(axes[3]??axes[1]??0);if(source.handedness==='right')turn=axes[2]??axes[0]??0;}
 const previousRing=flight.rings,event=stepFlight(flight,dt,climb,turn);flightRig.rotation.y=flight.heading;flightRig.position.set(flight.x,flight.altitude,flight.z);
 if(event==='ring'||event==='complete'){flightRings[previousRing].visible=false;if(flightRings[flight.rings])flightRings[flight.rings].material.color.set('#ffffff');tone(760,.16);if(event==='complete'){finishFlight();return;}}
 if(event==='missed'){$('pause-flight').textContent='Continuar';showToast('Aro no alcanzado. Volvé a plataforma para reintentar el vuelo.');positionPanel();}
const stats=`${Math.round(flight.speed*1.944)} KT  ·  ${Math.round(flight.altitude*3.281)} FT  ·  AROS ${flight.rings}/5`;$('flight-stats').textContent=stats;
if(flight.time-lastInstrumentTime>.15||flight.time<.1){const c=cockpitHUD.material.map.image.getContext('2d');c.fillStyle='#082440';c.fillRect(0,0,768,160);c.fillStyle='#29b6f6';c.textAlign='center';c.textBaseline='middle';c.font='34px Arial';c.fillText(stats,384,80);cockpitHUD.material.map.needsUpdate=true;lastInstrumentTime=flight.time;}
}

// Mouse/keyboard desktop preview shares the same mission and flight gates.
renderer.domElement.addEventListener('pointerdown',e=>{if(mission.phase==='intro')return;drag={x:e.clientX,y:e.clientY,moved:false};renderer.domElement.setPointerCapture(e.pointerId);});
renderer.domElement.addEventListener('pointermove',e=>{if(!drag||renderer.xr.isPresenting)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>2)drag.moved=true;drag.x=e.clientX;drag.y=e.clientY;yaw-=dx*.004;pitch=THREE.MathUtils.clamp(pitch-dy*.004,-1.25,1.25);camera.rotation.set(pitch,yaw,0,'YXZ');});
renderer.domElement.addEventListener('pointerup',e=>{if(drag&&!drag.moved&&mission.phase==='inspection'){pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(markers.flatMap(m=>[m.sphere,m.floorTarget]),false)[0];if(hit){const i=hit.object.userData.station;if(hit.object===markers[i].floorTarget)goStation(i,true);else if(camera.getWorldPosition(tempVec).distanceTo(markers[i].group.position)<3.6)openStation(i);else goStation(i,true);}}drag=null;});
addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='KeyE'&&mission.phase==='inspection'){const i=nearestStation();if(i>=0)openStation(i);else showToast('Acercate a un marcador. N te lleva al siguiente punto.');}if(e.code==='KeyN')nextStation();if(e.code==='Escape'){$('help-modal').classList.add('hidden');closeInspection();}if(e.code==='Space')togglePause();});
addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',()=>{keys.clear();drag=null;});
function allowedGround(x,z){return Math.abs(x)<18&&z>-19&&z<22&&!(Math.abs(x)<1.05&&z>-4.2&&z<4.25);}
function walk(dx,dz,dt){getViewDirection(forward);forward.y=0;forward.normalize();const right=new THREE.Vector3().crossVectors(forward,new THREE.Vector3(0,1,0));const move=forward.multiplyScalar(-dz).addScaledVector(right,dx);if(move.lengthSq()>1)move.normalize();move.multiplyScalar(dt*2.4);const p=getEye().clone().add(move);if(allowedGround(p.x,p.z)){rig.position.x+=move.x;rig.position.z+=move.z;if(move.lengthSq()>.000001&&performance.now()-lastFootstep>430){playCue('step');lastFootstep=performance.now();}}}

async function checkVR(){try{vrAvailable=!!navigator.xr&&await navigator.xr.isSessionSupported('immersive-vr');}catch{vrAvailable=false;}updateVRButton();}
function updateVRButton(){const b=$('enter-vr');b.disabled=!loaded||!vrAvailable;b.textContent=vrAvailable?'Entrar en realidad virtual ↗':'VR: abrir desde Meta Quest';$('xr-note').textContent=vrAvailable?'Usá los controles Touch. Espacio libre y teletransporte.':!window.isSecureContext?'VR requiere HTTPS o localhost por conexión USB. Consultá LEEME.md.':'En PC: teclado y mouse. En Quest: abrí la versión HTTPS o localhost por USB.';}
$('enter-vr').onclick=async()=>{if(!loaded||!vrAvailable)return;try{
 const session=await navigator.xr.requestSession('immersive-vr',{requiredFeatures:['local-floor'],optionalFeatures:['bounded-floor']});
 vrEntryPose={position:rig.position.clone(),cameraPosition:camera.position.clone(),quaternion:camera.quaternion.clone(),yaw,pitch};
 await renderer.xr.setSession(session);if(mission.phase==='intro')start();else positionPanel();
 }catch(e){console.error(e);showToast('No se pudo iniciar VR. Revisá la conexión del visor y volvé a intentar.');}};
checkVR();
renderer.xr.addEventListener('sessionstart',()=>{document.body.classList.add('immersive');initAudio();setTimeout(positionPanel,300);});
renderer.xr.addEventListener('sessionend',()=>{document.body.classList.remove('immersive');panel.visible=false;if(mission.phase==='flight'){flight.paused=true;$('pause-flight').textContent='Continuar';}if(mission.phase==='inspection'){placeRig(-7,-6,[0,1.4,0]);}else{camera.position.set(0,1.65,0);camera.rotation.set(0,0,0);yaw=0;pitch=0;}vrEntryPose=null;});
const teleportMarker=new THREE.Mesh(new THREE.RingGeometry(.28,.35,40),new THREE.MeshBasicMaterial({color:'#29b6f6',side:THREE.DoubleSide}));teleportMarker.rotation.x=-Math.PI/2;teleportMarker.visible=false;scene.add(teleportMarker);
const floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.05);
function controllerRay(controller){matrix.identity().extractRotation(controller.matrixWorld);raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);raycaster.ray.direction.set(0,0,-1).applyMatrix4(matrix);}
function teleportPoint(controller){controllerRay(controller);const p=raycaster.ray.intersectPlane(floorPlane,new THREE.Vector3());return p&&p.distanceTo(raycaster.ray.origin)<18&&allowedGround(p.x,p.z)?p:null;}
for(let i=0;i<2;i++){
 const c=renderer.xr.getController(i);rig.add(c);c.userData.source=null;c.userData.snapReady=true;c.userData.aDown=false;c.userData.bDown=false;
 const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,0,-1)]),new THREE.LineBasicMaterial({color:'#29b6f6',transparent:true,opacity:.75}));line.scale.z=4;line.material.depthTest=false;line.renderOrder=30;c.add(line);c.userData.line=line;const cursor=new THREE.Mesh(new THREE.SphereGeometry(.014,12,8),new THREE.MeshBasicMaterial({color:'#ffffff',depthTest:false}));cursor.renderOrder=31;cursor.visible=false;c.add(cursor);c.userData.cursor=cursor;
 const grip=renderer.xr.getControllerGrip(i);rig.add(grip);const handle=box(.042,.085,.07,0,0,0,material('#e9eddf'),grip);handle.rotation.x=-.2;
 c.addEventListener('connected',e=>{c.userData.source=e.data;});c.addEventListener('disconnected',()=>c.userData.source=null);
 c.addEventListener('selectstart',()=>{
  controllerRay(c);if(panel.visible){const h=raycaster.intersectObject(panel,false)[0];if(h&&h.distance<5&&panelHitAction(h)){haptic(c);return;}}
  if(mission.phase==='flight'){togglePause();return;}
  if(mission.phase!=='inspection')return;const h=raycaster.intersectObjects(markers.flatMap(m=>[m.sphere,m.floorTarget]),false)[0];if(h){const index=h.object.userData.station;if(h.object===markers[index].floorTarget)goStation(index,true);else if(getEye().distanceTo(markers[index].group.position)<3.6)openStation(index);else goStation(index,true);haptic(c);}
 });
 c.addEventListener('squeezestart',()=>{if(mission.phase!=='inspection')return;const p=teleportPoint(c);if(p){closeInspection();placeRig(p.x,p.z);positionPanel();playCue('move');haptic(c);}});
 controllers.push(c);
}
function haptic(c){c.userData.source?.gamepad?.hapticActuators?.[0]?.pulse(.25,70)?.catch(()=>{});}
function updateControllers(dt){teleportMarker.visible=false;for(const c of controllers){const source=c.userData.source,g=source?.gamepad;if(!g)continue;
 const bA=g.buttons[4]?.pressed||false,bB=g.buttons[5]?.pressed||false;if(bA&&!c.userData.aDown){if(mission.phase==='flight')togglePause();else positionPanel(true);}if(bB&&!c.userData.bDown)renderer.xr.getSession()?.end();c.userData.aDown=bA;c.userData.bDown=bB;
 if(mission.phase!=='inspection')continue;
 const axes=g.axes,ax=axes[2]??axes[0]??0,ay=axes[3]??axes[1]??0;
 if(source.handedness==='right'){if(Math.abs(ax)>.7&&c.userData.snapReady){const head=getEye().clone();rig.rotation.y-=Math.sign(ax)*Math.PI/6;rig.updateMatrixWorld(true);const after=getEye().clone();rig.position.add(head.sub(after));playCue('move');c.userData.snapReady=false;}if(Math.abs(ax)<.25)c.userData.snapReady=true;}
 if(source.handedness==='left'&&freeMove&&(Math.abs(ax)>.15||Math.abs(ay)>.15))walk(ax,ay,dt);
 const p=teleportPoint(c);if(p){teleportMarker.position.copy(p);teleportMarker.visible=true;}
}}
$('help').onclick=()=>{$('help-modal').classList.remove('hidden');if(mission.phase==='flight'&&!flight.paused)togglePause();};$('close-help').onclick=()=>$('help-modal').classList.add('hidden');$('comfort').onclick=()=>{freeMove=!freeMove;$('comfort').textContent=freeMove?'Movimiento VR: caminar y teletransporte':'Movimiento VR: solo teletransporte';lastPanelKey='';};
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});

function animate(){const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime,now=performance.now();
 if(mission.phase==='intro'&&!renderer.xr.isPresenting){rig.position.set(0,0,0);camera.position.set(-10+Math.sin(time*.09)*.25,4.1,-9.5);camera.lookAt(-.6,1.05,-.1);camera.setViewOffset(innerWidth,innerHeight,-innerWidth*.17,0,innerWidth,innerHeight);}
 else{if(camera.view?.enabled)camera.clearViewOffset();if(mission.phase==='inspection'&&!renderer.xr.isPresenting&&activeStation===null&&$('help-modal').classList.contains('hidden')){const dx=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),dz=(keys.has('KeyS')?1:0)-(keys.has('KeyW')?1:0);if(dx||dz)walk(dx,dz,dt);}}
 if(renderer.xr.isPresenting)updateControllers(dt);
 if(mission.phase==='flight'){updateFlight(dt);if(!flight.paused)propellerRotor.rotation.z+=dt*(flight.speed*.8+5);}
 if(engineGain){engineGain.gain.value=soundEnabled&&mission.phase==='flight'&&!flight.paused?.035:0;engineOsc.frequency.value=35+flight.speed*2;}
 if(tailAnimation>0){tailAnimation-=dt;const tail=model?.getObjectByName('Plane004_3')||model?.getObjectByName('Plane.004_3');if(tail)tail.rotation.y=Math.sin(tailAnimation*8)*.07;}
 const look=getEye();
 markers.forEach((m,i)=>{m.group.visible=mission.phase==='intro'||mission.phase==='inspection';m.ring.lookAt(look);m.number.lookAt(look);m.ring.scale.setScalar(1+Math.sin(time*2+i)*.06);});
 if(renderer.xr.isPresenting){panel.visible=mission.phase==='inspection'||mission.phase==='complete'||(mission.phase==='flight'&&flight.paused);if(panel.visible)facePanel();updatePanelHover();const key=[mission.phase,panelMode,activeStation,mission.completed.size,mission.active,mission.steps[mission.active],flight.paused,flight.rings,freeMove,hoveredButton].join('|');if(panel.visible&&(key!==lastPanelKey||(mission.phase==='flight'&&now-lastPanelTime>500))){drawPanel();lastPanelKey=key;lastPanelTime=now;}}
 else panel.visible=false;
 vrToast.visible=renderer.xr.isPresenting&&now<toastUntil;if(vrToast.visible){getEye();getViewDirection(forward);forward.y=0;forward.normalize();vrToast.position.copy(eye).addScaledVector(forward,1.9);vrToast.position.y=eye.y-.9;vrToast.lookAt(eye);}
 if(now>toastUntil)$('toast').classList.add('hidden');
 renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);
