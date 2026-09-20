// Doce puntos, diecisiete comprobaciones. Cada comprobación tiene tres opciones: la correcta
// es siempre la primera (correct:0) y la interfaz las muestra en orden rotado. Los distractores
// son errores que un alumno real puede cometer; `hint` se muestra al equivocarse.
export const STATIONS = [
 {id:'cabin',title:'Cabina segura',zone:'01 / CABINA',point:[-0.72,1.62,-1.53],stand:[-1.95,0,-1.9],intro:'Antes de tocar el exterior, dejá el avión en una condición segura.',steps:[
  {text:'Entrás a la cabina para empezar. ¿Qué es lo primero que confirmás?',
   options:['Encendido (magnetos) en OFF y llave afuera, así la hélice no puede arrancar mientras la revisás.',
            'Que el motor arranque bien: si arranca, todo lo demás está funcionando.',
            'Selector de combustible en OFF, para que no se pierda combustible mientras recorrés el avión.'],
   correct:0,hint:'Pensá en la hélice: lo primero es que no pueda girar sola mientras estás afuera.',
   feedback:'Con el encendido en OFF y la llave afuera, la hélice no puede arrancar. El motor sigue detenido durante toda la vuelta.'},
  {text:'La traba de comandos está colocada. ¿Cuándo la retirás?',
   options:['Ahora, en la revisión de cabina, y comprobás que el comando se mueva libre en todo su recorrido.',
            'Recién en la cabecera, antes de despegar, para que el viento no golpee las superficies mientras hago la vuelta.',
            'La dejo puesta y muevo las superficies a mano desde afuera para ver si están libres.'],
   correct:0,hint:'Si la traba sigue puesta, no podés comprobar que los comandos lleguen a las superficies.',
   feedback:'Traba retirada. Ahora sí podés verificar que alerones, elevadores y timón respondan al comando.'}]},
 {id:'tail',title:'Empenaje y timón',zone:'02 / EMPENAJE',point:[0,1.55,3.6],stand:[1.6,0,4.6],intro:'Acercate a la cola y observá las superficies y sus uniones.',steps:[
  {text:'Mirás el timón y los elevadores. Además de golpes, ¿qué comprobás?',
   options:['Que bisagras y pasadores estén asegurados y que las superficies se muevan libres, sin forzarlas.',
            'Que el timón quede centrado y firme: si se mueve solo con el viento, es señal de falla.',
            'Que el compensador esté en posición de despegue; si no, lo acomodo a mano desde la cola.'],
   correct:0,hint:'Las superficies de cola deben moverse libres. El compensador se ajusta desde la cabina, nunca a mano.',
   feedback:'Superficies de cola verificadas: fijaciones seguras y movimiento libre. Que el timón se mueva con el viento es normal.'}]},
 {id:'right-wing',title:'Ala derecha',zone:'03 / ALA DERECHA',point:[4.7,2,-0.54],stand:[5.8,0,0.4],intro:'Observá el borde de ataque, el alerón y el flap.',steps:[
  {text:'Recorrés borde de ataque, alerón y flap. ¿Cuál de estos hallazgos te obliga a frenar y avisar?',
   options:['Una abolladura en el borde de ataque o un remache flojo o faltante en la unión de una superficie.',
            'Restos de insectos y polvo pegados en el borde de ataque.',
            'El alerón izquierdo sube cuando el derecho baja.'],
   correct:0,hint:'Que los alerones se muevan en sentido opuesto es normal. Buscá daño estructural.',
   feedback:'Abolladuras y remaches flojos comprometen la estructura: se avisa antes de volar. Los insectos se limpian; los alerones opuestos son normales.'}]},
 {id:'right-fuel',title:'Combustible derecho',zone:'04 / COMBUSTIBLE',point:[2.5,1.78,-1.6],stand:[3.4,0,-2.9],intro:'La muestra virtual es azul y transparente. Es una representación simplificada.',steps:[
  {text:'Drenaste una muestra del tanque. ¿Cuál descartás y volvés a drenar?',
   options:['Una muestra azul con una gota o capa transparente separada en el fondo del frasco.',
            'Una muestra azul clara, sin partículas, con olor a nafta de aviación.',
            'Una muestra azul con pequeñas burbujas de aire que suben.'],
   correct:0,hint:'El agua es más pesada que el combustible y no se mezcla: se ve como una capa aparte abajo.',
   feedback:'La capa transparente en el fondo es agua. Se drena hasta que salga solo combustible limpio. Las burbujas de aire son normales.'},
  {text:'El indicador de cabina marca tres cuartos de tanque. ¿Con eso alcanza?',
   options:['No. Verifico la cantidad mirando dentro del tanque y compruebo que el tapón quede bien cerrado.',
            'Sí: los indicadores del Cessna 172S son precisos y con eso basta.',
            'Sí, siempre que el otro tanque marque lo mismo.'],
   correct:0,hint:'Los indicadores de cabina son una referencia. La cantidad se confirma en el tanque.',
   feedback:'Cantidad confirmada en el tanque y tapón cerrado. Un tapón mal cerrado pierde combustible en vuelo por succión.'}]},
 {id:'right-gear',title:'Tren derecho',zone:'05 / TREN PRINCIPAL',point:[1.34,0.55,-1.2],stand:[2.5,0,-0.4],intro:'Revisá el neumático, el conjunto de freno y la pata del tren.',steps:[
  {text:'Mirás neumático, freno y pata del tren derecho. ¿Qué hallazgo impide aprobar el punto?',
   options:['Una mancha de líquido en el disco o en la manguera de freno, o el neumático con las lonas a la vista.',
            'El carenado de la rueda tiene un rayón en la pintura.',
            'El disco de freno está tibio porque el avión rodó hace un rato.'],
   correct:0,hint:'Buscá pérdidas y desgaste que afecten frenar o rodar. La pintura y la temperatura después de rodar no lo hacen.',
   feedback:'Una pérdida de líquido de freno o un neumático con lonas a la vista impiden el vuelo. Sin daños ni pérdidas en esta misión.'}]},
 {id:'oil',title:'Aceite y motor',zone:'06 / MORRO',point:[0.7,1.28,-2.9],stand:[1.8,0,-3.5],intro:'La varilla virtual muestra aceite dentro de la zona marcada. No representa una cantidad real.',steps:[
  {text:'Sacás la varilla. ¿Qué nivel te habilita a volar en un Cessna 172S?',
   options:['Como mínimo 5 cuartos; para vuelos largos conviene salir con más. Por debajo del mínimo no se despega.',
            'Cualquier nivel que se vea en la varilla: mientras toque aceite, el motor está lubricado.',
            'Solo la marca máxima: si no está lleno hasta arriba, hay que agregar antes de volar.'],
   correct:0,hint:'El POH fija un mínimo para despegar y una cantidad recomendada según la duración del vuelo.',
   feedback:'El POH del 172S fija el mínimo de 5 cuartos. Salir con menos es tan malo como sobrellenar, que hace que el motor lo expulse por el respiradero.'},
  {text:'Terminaste de leer la varilla. ¿Cómo la dejás?',
   options:['Enroscada y ajustada a mano, con la puerta de acceso cerrada y trabada.',
            'Apoyada sin enroscar, para que el aceite respire mientras el motor está frío.',
            'Ajustada con fuerza con una pinza, para que no se afloje con la vibración.'],
   correct:0,hint:'La varilla se cierra a mano. Ni suelta ni forzada.',
   feedback:'Varilla ajustada a mano y acceso asegurado. Una varilla suelta puede bombear aceite fuera del motor en vuelo.'}]},
 {id:'propeller',title:'Hélice y tomas',zone:'07 / HÉLICE',point:[0,1.55,-3.9],stand:[0,0,-5.2],intro:'El motor continúa detenido. Observá la hélice y las entradas de aire.',steps:[
  {text:'Revisás la hélice y las tomas de aire. ¿Qué hacés con la hélice?',
   options:['La miro y la toco buscando muescas y grietas en el borde de ataque, sin pararme en su plano ni girarla.',
            'La giro una vuelta a mano para sentir la compresión y comprobar que el motor no esté trabado.',
            'Si encuentro muescas chicas en el borde, las limo con lija fina antes de salir.'],
   correct:0,hint:'Una hélice puede arrancar con un solo movimiento si un magneto falla. Y las muescas se reparan en taller.',
   feedback:'Hélice inspeccionada sin girarla. Las muescas concentran esfuerzos y las repara un mecánico. Tomas de aire libres.'}]},
 {id:'nose-gear',title:'Tren de nariz',zone:'08 / TREN DE NARIZ',point:[-0.25,0.55,-2.98],stand:[-1.55,0,-3.75],intro:'Observá la rueda delantera y el conjunto amortiguador.',steps:[
  {text:'Mirás el tren de nariz. ¿Cuál de estas observaciones te obliga a avisar antes de volar?',
   options:['El amortiguador está totalmente comprimido, sin la parte brillante de la pata a la vista.',
            'La rueda de nariz gira libremente cuando el avión se mueve, en lugar de quedar fija.',
            'La parte brillante del amortiguador tiene una película fina de aceite.'],
   correct:0,hint:'La pata oleoneumática debe mostrar una extensión mínima. Una película fina de aceite es normal.',
   feedback:'Un amortiguador colapsado no absorbe el aterrizaje. En el 172 la rueda de nariz orientable gira con los pedales; una película fina de aceite es normal.'}]},
 {id:'left-fuel',title:'Combustible izquierdo',zone:'09 / COMBUSTIBLE',point:[-2.45,1.78,-1.6],stand:[-3.5,0,-2.9],intro:'Este tanque también necesita una comprobación propia. La muestra virtual se ve limpia.',steps:[
  {text:'El tanque derecho estaba limpio. ¿Qué hacés con el izquierdo?',
   options:['Lo dreno también, y además el drenaje del filtro del motor: cada punto de drenaje se revisa por separado.',
            'Lo doy por bueno: los dos tanques se cargaron del mismo surtidor al mismo tiempo.',
            'Miro la cantidad, pero no drena: el agua se junta en el tanque más bajo, que ya revisé.'],
   correct:0,hint:'El agua puede estar en cualquier tanque, y también en el filtro. Ningún drenaje se saltea.',
   feedback:'Segundo tanque drenado. El 172S tiene varios puntos de drenaje entre alas y fuselaje; el POH indica cuáles y cuándo.'},
  {text:'Van a cargar combustible. ¿Cuál corresponde a este avión?',
   options:['100LL, de color azul.',
            'Jet A, incoloro, porque es el combustible más usado en aviación.',
            'Nafta súper de auto: el motor es de pistón, como el de un auto.'],
   correct:0,hint:'Mirá el color de la muestra que drenaste. El motor del 172S es de pistón y usa nafta de aviación.',
   feedback:'100LL azul. Cargar Jet A en un motor de pistón lo destruye en vuelo: por eso el color de la muestra importa tanto.'}]},
 {id:'pitot',title:'Pitot y cubierta',zone:'10 / ALA IZQUIERDA',point:[-3.35,1.78,-1.64],stand:[-4.45,0,-2.7],intro:'Hay una cubierta roja en la representación del tubo pitot.',steps:[
  {text:'El tubo pitot tiene su cubierta roja. ¿Qué hacés?',
   options:['La retiro, la guardo en la cabina y miro que la entrada y el orificio de drenaje estén libres, sin soplar.',
            'La retiro y soplo fuerte en el tubo para asegurarme de que no esté obstruido.',
            'La dejo puesta hasta la cabecera: el velocímetro no se usa en tierra y así lo protejo del polvo.'],
   correct:0,hint:'Soplar en el pitot daña el velocímetro. Y despegar con la cubierta puesta te deja sin velocidad.',
   feedback:'Cubierta retirada y guardada. Entrada y drenaje verificados a la vista.'}]},
 {id:'left-wing',title:'Ala y tren izquierdos',zone:'11 / LADO IZQUIERDO',point:[-4.7,2,-0.52],stand:[-5.8,0,0.4],intro:'Completá el recorrido del lado izquierdo: ala, superficies, rueda y freno.',steps:[
  {text:'En el borde de ataque del ala izquierda hay algo que el ala derecha no tiene. ¿Qué es y cómo lo probás?',
   options:['La toma del avisador de pérdida: se prueba aspirando suavemente sobre ella hasta oír la bocina.',
            'La luz de aterrizaje: se prueba encendiéndola desde la cabina.',
            'Nada: el borde de ataque izquierdo es igual al derecho y ya lo revisé del otro lado.'],
   correct:0,hint:'Es un sensor pequeño en el borde de ataque. En el 172S la luz de aterrizaje va en el morro.',
   feedback:'Avisador de pérdida probado. El resto del lado izquierdo (superficies, rueda y freno) se revisa igual que el derecho.'}]},
 {id:'secure',title:'Amarras y cierre final',zone:'12 / ÚLTIMA MIRADA',point:[-1.8,0.8,0.5],stand:[-2.9,0,1.35],intro:'El recorrido termina con una mirada general al avión y a su entorno.',steps:[
  {text:'¿Qué hacés con amarras y calzos?',
   options:['Los retiro y los guardo; antes de subir doy una última vuelta mirando que no quede nada suelto cerca de la hélice.',
            'Los dejo puestos hasta encender el motor: así el avión no se mueve durante el arranque.',
            'Retiro amarras y calzos y los dejo en el suelo al costado de la plataforma.'],
   correct:0,hint:'Nada suelto en la plataforma: cualquier objeto puede terminar en la hélice.',
   feedback:'Amarras, calzos y protecciones retirados y guardados. El área queda despejada.'},
  {text:'Última mirada antes de subir. ¿Qué confirmás?',
   options:['Que no quede ninguna cubierta, banderín ni traba puesta, y que puertas de acceso y tapones estén cerrados.',
            'Que el avión esté apuntando contra el viento para arrancar.',
            'Que el tanque más lleno sea el seleccionado, para arrancar con ese.'],
   correct:0,hint:'Es una mirada general al avión: lo que quedó puesto o abierto es lo que falla después.',
   feedback:'Recorrido completo. Cuando estén aprobados los doce puntos, se habilitará el vuelo arcade.'}]}
];

// The state machine is the only authority for unlocking the flight phase.
export class Mission {
 constructor(){this.reset();}
 reset(){this.completed=new Set();this.steps=Object.fromEntries(STATIONS.map(s=>[s.id,0]));this.active=null;this.phase='intro';this.mistakes=0;this.startedAt=0;
  // Modo demostración: vuelo suelto desde la portada, sin chequeo y sin nota. Solo para mostrar el juego.
  this.esDemo=false;
  // Registro de examen: por cada punto, cuántas respuestas incorrectas hubo y cuándo se aprobó.
  this.registro=Object.fromEntries(STATIONS.map(s=>[s.id,{errores:0,ok:false,ms:0}]));this.terminadoEn=0;}
 start(){if(this.phase==='intro'){this.phase='inspection';this.startedAt=Date.now();}}
 get ready(){return STATIONS.every(s=>this.completed.has(s.id));}
 open(id){if(this.phase!=='inspection')return{ok:false,message:'Primero iniciá el recorrido.'};const station=STATIONS.find(s=>s.id===id);if(!station)return{ok:false,message:'Punto no válido.'};if(id!=='cabin'&&!this.completed.has('cabin'))return{ok:false,message:'Primero asegurá la cabina en el punto 01.'};if(this.completed.has(id))return{ok:false,message:'Este punto ya está comprobado.'};this.active=id;return{ok:true,station,step:station.steps[this.steps[id]]};}
 answer(index){const station=STATIONS.find(s=>s.id===this.active);if(this.phase!=='inspection'||!station||this.completed.has(station.id))return{ok:false};const step=station.steps[this.steps[station.id]];if(!step||!Number.isInteger(index)||index<0||index>=step.options.length)return{ok:false};if(index!==step.correct){this.mistakes++;this.registro[station.id].errores++;return{ok:false,message:step.hint||'Revisá la situación. Esa opción no permite aprobar el punto.'};}this.steps[station.id]++;const finished=this.steps[station.id]===station.steps.length;if(finished){this.completed.add(station.id);this.registro[station.id].ok=true;this.registro[station.id].ms=Date.now()-this.startedAt;this.active=null;if(this.ready)this.terminadoEn=Date.now()-this.startedAt;}return{ok:true,finished,id:station.id,message:step.feedback};}

 // --- Resultado, tratado como examen ---
 get nota(){return Math.max(0,100-this.mistakes*6);}
 get limpios(){return STATIONS.filter(s=>this.registro[s.id].ok&&!this.registro[s.id].errores).length;}
 get duracion(){return this.terminadoEn||(this.startedAt?Date.now()-this.startedAt:0);}
 static reloj(ms){const t=Math.floor(ms/1000);return String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');}
 detalle(){return STATIONS.map((s,i)=>{const r=this.registro[s.id];
  return{n:String(i+1).padStart(2,'0'),titulo:s.title,ok:r.ok,errores:r.errores,
   estado:!r.ok?'sin hacer':r.errores?(r.errores===1?'1 error':r.errores+' errores'):'correcto'};});}
 informe(alumno){
  const l=['AURAV · La vuelta al avión — resultado del chequeo previo al vuelo','',
   'Alumno: '+(alumno||'________________________'),
   'Fecha: '+new Date().toLocaleString('es-AR'),'',
   'Puntos aprobados: '+this.completed.size+' de '+STATIONS.length,
   'Aprobados sin errores: '+this.limpios+' de '+STATIONS.length,
   'Respuestas incorrectas: '+this.mistakes,
   'Nota: '+this.nota+'/100',
   'Tiempo: '+Mission.reloj(this.duracion),'','Detalle por punto:'];
  for(const d of this.detalle())l.push('  '+d.n+' · '+d.titulo+' — '+d.estado);
  l.push('','Juego con inspecciones simplificadas. No sustituye el POH ni una checklist aprobada.');
  return l.join('\n');}
 takeoff(){if(this.phase!=='inspection'||!this.ready)return false;this.active=null;this.phase='flight';return true;}
 // Demo: solo se entra desde la portada (phase 'intro'). Una vez adentro se puede reiniciar el vuelo.
 // Nunca se puede activar en medio del recorrido, así que el chequeo sigue siendo la única puerta al vuelo real.
 demo(){if(this.phase!=='intro'&&!this.esDemo)return false;this.active=null;this.esDemo=true;this.phase='flight';return true;}
 finish(){if(this.phase!=='flight')return false;this.phase='complete';return true;}
 returnToApron(){if(this.phase==='flight'||this.phase==='complete'){this.phase='inspection';return true;}return false;}
}
