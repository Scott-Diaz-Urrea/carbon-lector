import { pick, shuffle } from '../../utils.js';

/* Núcleo Convivencia y Ciudadanía — Educación Parvularia, NT (Decreto 481/2017,
   ámbito Desarrollo Personal y Social, curriculumnacional.cl/614/articles-115243_bases.pdf):
   OA05 -> Resolución Pacífica · OA06 -> Normas de Convivencia ·
   OA07 -> Seguridad y Cuidado.
   Quedan fuera: OA01-04, OA08-11 — son de participación colaborativa,
   empatía vivida, apreciación de manifestaciones culturales, comprensión de
   influencia social y apreciación de la diversidad de las personas: dependen
   de la experiencia grupal real o son juicios de apreciación sin una
   respuesta objetiva única, no aptos para opción múltiple. */

export const CONVIVENCIA_CIUDADANIA_MODULES = [
  { id:'resolucionnt', label:'Resolución Pacífica', open:true, key:'resolucionnt' },
  { id:'normasnt', label:'Normas de Convivencia', open:true, key:'normasnt' },
  { id:'seguridadnt', label:'Seguridad y Cuidado', open:true, key:'seguridadnt' },
];
export const CONVIVENCIA_CIUDADANIA_POS = [
  {x:24,y:82},{x:68,y:50},{x:24,y:18}
];

const CONFLICTO_BANK = [
  { texto:'Dos niños quieren el mismo juguete al mismo tiempo.', correcta:'Turnarse para jugar', malas:['Quitárselo a la fuerza','Gritar y llorar','Empujar al otro niño'] },
  { texto:'Tu amigo está triste porque perdió en el juego.', correcta:'Consolarlo e invitarlo a jugar de nuevo', malas:['Reírse de él','Ignorarlo','Decirle que juega mal'] },
  { texto:'Quieres hablar pero otro niño también está hablando.', correcta:'Esperar tu turno y levantar la mano', malas:['Interrumpir gritando','Hablar más fuerte que el otro','Empujarlo para que se calle'] },
  { texto:'Un compañero rompió sin querer tu dibujo.', correcta:'Decirle cómo te sientes con calma', malas:['Pegarle','Romper su dibujo también','Gritarle'] },
  { texto:'Hay un niño nuevo en la sala y no lo conoces.', correcta:'Acercarte y preguntarle su nombre', malas:['Ignorarlo','Burlarte de él','Decirle que no puede jugar'] },
  { texto:'Dos amigos quieren jugar a juegos distintos al mismo tiempo.', correcta:'Conversar y elegir un juego entre los dos, o turnarse', malas:['Pelear por imponer su juego','Jugar solo y dejar al otro de lado','Gritar hasta que el otro ceda'] },
  { texto:'Un compañero te empujó sin querer al correr.', correcta:'Decirle con calma que tenga más cuidado', malas:['Empujarlo de vuelta más fuerte','Gritarle enojado','Dejar de ser su amigo'] },
  { texto:'Quieres el columpio pero otro niño lo está usando.', correcta:'Esperar tu turno pacientemente', malas:['Bajarlo a la fuerza','Quitarle el columpio empujando','Llorar y no dejarlo jugar'] },
];

const NORMAS_BANK = [
  { correcta:'Guardar los juguetes al terminar de jugar', incorrectas:['Dejar los juguetes tirados','Sacar más juguetes sin guardar','Esconder los juguetes de otros'] },
  { correcta:'Escuchar cuando un compañero está hablando', incorrectas:['Hablar todos al mismo tiempo','Taparse los oídos','Interrumpir todo el tiempo'] },
  { correcta:'Pedir las cosas por favor y dar las gracias', incorrectas:['Quitar las cosas sin pedir','Exigir gritando','Ignorar a quien te ayuda'] },
  { correcta:'Hacer fila para esperar tu turno', incorrectas:['Pasar por encima de otros','Empujar para ser el primero','Saltarse la fila'] },
  { correcta:'Cuidar los materiales de la sala', incorrectas:['Romper los materiales a propósito','Rayar las mesas','Tirar los libros al suelo'] },
  { correcta:'Levantar la mano para pedir la palabra', incorrectas:['Gritar para que te escuchen','Hablar sin esperar tu turno','Interrumpir a la profesora'] },
  { correcta:'Lavarse las manos antes de comer', incorrectas:['Comer con las manos sucias','Tocar la comida de otros sin permiso','Ensuciar la mesa a propósito'] },
  { correcta:'Ayudar a un compañero que se cayó', incorrectas:['Reírse de quien se cayó','Seguir jugando sin mirar','Empujarlo para que se levante rápido'] },
];

const RIESGO_BANK = [
  { correcta:'Tocar un enchufe eléctrico', seguras:['Guardar los juguetes','Lavarse las manos','Leer un cuento'] },
  { correcta:'Cruzar la calle sin mirar', seguras:['Tomar la mano de un adulto','Usar el paso peatonal','Esperar la luz verde'] },
  { correcta:'Jugar con fósforos o encendedores', seguras:['Pintar con lápices','Armar un rompecabezas','Jugar con bloques'] },
  { correcta:'Subirse a un mueble alto sin ayuda', seguras:['Sentarse a comer','Jugar en el patio','Dibujar en la mesa'] },
  { correcta:'Tomar remedios sin permiso de un adulto', seguras:['Tomar agua con un vaso','Comer fruta','Lavarse los dientes'] },
  { correcta:'Correr cerca de una piscina', seguras:['Caminar despacio','Jugar en el pasto','Sentarse a dibujar'] },
  { correcta:'Meter los dedos en un ventilador', seguras:['Aplaudir con las manos','Jugar con un peluche','Armar un rompecabezas'] },
  { correcta:'Salir a la calle solo sin un adulto', seguras:['Jugar en el patio de la casa','Leer un cuento en el sillón','Dibujar en tu pieza'] },
];

export function genResolucionNTRound(){
  const item = pick(CONFLICTO_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema sin lastimar a nadie.',
  };
}

export function genNormasNTRound(){
  const item = pick(NORMAS_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una norma correcta de convivencia?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una norma correcta de convivencia?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a que todos estén bien en la sala.',
  };
}

export function genSeguridadNTRound(){
  const item = pick(RIESGO_BANK);
  const opts = shuffle([item.correcta].concat(item.seguras)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones puede ser peligrosa?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones puede ser peligrosa?', cols:2, panel:true,
    explain: '"'+item.correcta+'" puede lastimarte — siempre pide ayuda a un adulto para esas cosas.',
  };
}
