export const STATIONS = [
 {id:'cabin',title:'Cabina segura',zone:'01 / CABINA',point:[-0.72,1.62,-1.53],stand:[-1.95,0,-1.9],intro:'Antes de tocar el exterior, dejá el avión en una condición segura.',steps:[
  {text:'El avión está estacionado. ¿Cómo empezás la inspección exterior?',options:['Motor detenido, encendido y alimentación apagados.','Arranco el motor para comprobar todo más rápido.'],correct:0,feedback:'Primero se asegura la cabina. El motor sigue detenido durante el recorrido.'},
  {text:'Hay una traba de comandos colocada. Retirala para poder comprobar su recorrido.',options:['Retirar la traba de comandos.'],correct:0,feedback:'Traba retirada. Podés continuar con el recorrido exterior.'}]},
 {id:'tail',title:'Empenaje y timón',zone:'02 / EMPENAJE',point:[0,1.55,3.6],stand:[1.6,0,4.6],intro:'Acercate a la cola y observá las superficies y sus uniones.',steps:[
  {text:'En esta escena no hay daños visibles. ¿Qué comprobación completa la inspección?',options:['Verificar fijaciones y movimiento libre, sin forzar.','Dar por terminado el punto mirando desde lejos.'],correct:0,feedback:'Superficies de cola verificadas. La animación representa la comprobación de movimiento.'}]},
 {id:'right-wing',title:'Ala derecha',zone:'03 / ALA DERECHA',point:[4.7,2,-0.54],stand:[5.8,0,0.4],intro:'Observá el borde de ataque, el alerón y el flap.',steps:[
  {text:'¿Qué buscás en las superficies del ala?',options:['Daños, obstrucciones y fijaciones anormales.','Solo que la pintura esté limpia.'],correct:0,feedback:'Ala y superficies comprobadas en el escenario.'}]},
 {id:'right-fuel',title:'Combustible derecho',zone:'04 / COMBUSTIBLE',point:[2.5,1.78,-1.6],stand:[3.4,0,-2.9],intro:'La muestra virtual es azul y transparente, sin partículas ni capa separada. Es una representación simplificada.',steps:[
  {text:'Además del color, ¿qué buscás al observar la muestra?',options:['Agua, sedimentos y señales de contaminación.','Solo que el recipiente esté lleno.'],correct:0,feedback:'Muestra inspeccionada. Si hubiera contaminación real, este punto no habilitaría el vuelo.'},
  {text:'Completá la comprobación del tanque en esta misión.',options:['Verificar cantidad para la misión y cierre del tapón.'],correct:0,feedback:'Cantidad y cierre verificados en el juego.'}]},
 {id:'right-gear',title:'Tren derecho',zone:'05 / TREN PRINCIPAL',point:[1.34,0.55,-1.2],stand:[2.5,0,-0.4],intro:'Revisá el neumático, el conjunto de freno y la pata del tren.',steps:[
  {text:'¿Qué hallazgo impediría dar este punto por aprobado?',options:['Una pérdida de fluido o un neumático dañado.','Una sombra debajo del avión.'],correct:0,feedback:'Sin daños ni pérdidas representados en esta misión.'}]},
 {id:'oil',title:'Aceite y motor',zone:'06 / MORRO',point:[0.7,1.28,-2.9],stand:[1.8,0,-3.5],intro:'La varilla virtual muestra aceite dentro de la zona marcada para el escenario. No representa una cantidad de servicio real.',steps:[
  {text:'¿Qué criterio usarías para comprobar el aceite de un avión real?',options:['El nivel y las condiciones indicados en su POH.','Cualquier nivel sirve para un vuelo corto.'],correct:0,feedback:'Nivel y zona del motor comprobados en la simulación.'},
  {text:'Terminaste de observar la varilla y el acceso al motor.',options:['Asegurar tapón y cierre del acceso.'],correct:0,feedback:'Acceso asegurado.'}]},
 {id:'propeller',title:'Hélice y tomas',zone:'07 / HÉLICE',point:[0,1.55,-3.9],stand:[0,0,-5.2],intro:'El motor continúa detenido. Observá la hélice y las entradas de aire.',steps:[
  {text:'Completá la inspección visual de esta zona.',options:['Buscar daños y obstrucciones sin girar la hélice.','Girar la hélice a mano para probar el motor.'],correct:0,feedback:'Hélice e ingresos de aire inspeccionados visualmente.'}]},
 {id:'nose-gear',title:'Tren de nariz',zone:'08 / TREN DE NARIZ',point:[-0.25,0.55,-2.98],stand:[-1.55,0,-3.75],intro:'Observá la rueda delantera y el conjunto amortiguador.',steps:[
  {text:'¿Qué revisás antes de continuar?',options:['Neumático, fijaciones y señales de pérdidas.','Únicamente que la rueda apunte hacia adelante.'],correct:0,feedback:'Tren de nariz comprobado en esta misión.'}]},
 {id:'left-fuel',title:'Combustible izquierdo',zone:'09 / COMBUSTIBLE',point:[-2.45,1.78,-1.6],stand:[-3.5,0,-2.9],intro:'Este tanque también necesita una comprobación propia. La muestra virtual se ve limpia.',steps:[
  {text:'¿Alcanza con haber revisado el otro tanque?',options:['No. Inspeccionar también este tanque y su muestra.','Sí. Ambos lados siempre están iguales.'],correct:0,feedback:'Segundo tanque comprobado. Los puntos reales de drenaje deben seguir el POH aplicable.'},
  {text:'Finalizá la comprobación del tanque izquierdo.',options:['Verificar cantidad para la misión y asegurar tapón.'],correct:0,feedback:'Cantidad y cierre verificados.'}]},
 {id:'pitot',title:'Pitot y cubierta',zone:'10 / ALA IZQUIERDA',point:[-3.35,1.78,-1.64],stand:[-4.45,0,-2.7],intro:'Hay una cubierta roja en la representación del tubo pitot.',steps:[
  {text:'El pitot está cubierto. ¿Qué hacés antes del vuelo?',options:['Retirar la cubierta y observar que la entrada esté libre.','Dejar la cubierta puesta para protegerlo al volar.'],correct:0,feedback:'Cubierta retirada. Entrada verificada visualmente.'}]},
 {id:'left-wing',title:'Ala y tren izquierdos',zone:'11 / LADO IZQUIERDO',point:[-4.7,2,-0.52],stand:[-5.8,0,0.4],intro:'Completá el recorrido del lado izquierdo: ala, superficies, rueda y freno.',steps:[
  {text:'¿Qué incluye esta inspección?',options:['Superficies y fijaciones, neumático, freno y posibles pérdidas.','Nada más: el lado derecho ya estaba bien.'],correct:0,feedback:'Lado izquierdo comprobado en la misión.'}]},
 {id:'secure',title:'Amarras y cierre final',zone:'12 / ÚLTIMA MIRADA',point:[-1.8,0.8,0.5],stand:[-2.9,0,1.35],intro:'El recorrido termina con una mirada general al avión y a su entorno.',steps:[
  {text:'¿Qué debe pasar con las amarras, calzos y elementos de protección?',options:['Retirarlos y comprobar que no quede material suelto.','Dejarlos colocados hasta que el avión se mueva.'],correct:0,feedback:'Amarras, calzos y protecciones retirados del modelo.'},
  {text:'Terminá la vuelta al avión.',options:['Comprobar área despejada y cerrar la inspección.'],correct:0,feedback:'Recorrido completo. Cuando estén aprobados los doce puntos, se habilitará el vuelo arcade.'}]}
];

// The state machine is the only authority for unlocking the flight phase.
export class Mission {
 constructor(){this.reset();}
 reset(){this.completed=new Set();this.steps=Object.fromEntries(STATIONS.map(s=>[s.id,0]));this.active=null;this.phase='intro';this.mistakes=0;this.startedAt=0;}
 start(){if(this.phase==='intro'){this.phase='inspection';this.startedAt=Date.now();}}
 get ready(){return STATIONS.every(s=>this.completed.has(s.id));}
 open(id){if(this.phase!=='inspection')return{ok:false,message:'Primero iniciá el recorrido.'};const station=STATIONS.find(s=>s.id===id);if(!station)return{ok:false,message:'Punto no válido.'};if(id!=='cabin'&&!this.completed.has('cabin'))return{ok:false,message:'Primero asegurá la cabina en el punto 01.'};if(this.completed.has(id))return{ok:false,message:'Este punto ya está comprobado.'};this.active=id;return{ok:true,station,step:station.steps[this.steps[id]]};}
 answer(index){const station=STATIONS.find(s=>s.id===this.active);if(this.phase!=='inspection'||!station||this.completed.has(station.id))return{ok:false};const step=station.steps[this.steps[station.id]];if(!step||!Number.isInteger(index)||index<0||index>=step.options.length)return{ok:false};if(index!==step.correct){this.mistakes++;return{ok:false,message:'Revisá la situación. Esa opción no permite aprobar el punto.'};}this.steps[station.id]++;const finished=this.steps[station.id]===station.steps.length;if(finished){this.completed.add(station.id);this.active=null;}return{ok:true,finished,id:station.id,message:step.feedback};}
 takeoff(){if(this.phase!=='inspection'||!this.ready)return false;this.active=null;this.phase='flight';return true;}
 finish(){if(this.phase!=='flight')return false;this.phase='complete';return true;}
 returnToApron(){if(this.phase==='flight'||this.phase==='complete'){this.phase='inspection';return true;}return false;}
}
