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

/* Los ítems 2 y 5 originales ("tu amigo está triste", "hay un niño nuevo")
   eran escenarios de empatía/inclusión, no conflictos de dos partes que
   resolver — CLAUDE.md documenta que este núcleo solo cubre OA05
   (Resolución Pacífica) y deja fuera explícitamente la empatía vivida
   (OA01-04). Se reemplazaron por desacuerdos genuinos entre dos niños,
   igual que el resto del banco. */
/* Los 3 bancos de este archivo se ampliaron de 8 a 10 ítems cada uno
   (coincidían exactamente con rounds:8, sin margen — ver mcEngine.js). */
const CONFLICTO_BANK = [
  { texto:'Dos niños quieren el mismo juguete al mismo tiempo.', correcta:'Turnarse para jugar', malas:['Quitárselo a la fuerza','Gritar y llorar','Empujar al otro niño'] },
  { texto:'Dos niños arman la misma torre de bloques y no se ponen de acuerdo en cómo seguir.', correcta:'Conversar y decidir juntos cómo seguir construyendo', malas:['Botar la torre del otro','Pelear por mandar','Quitarle los bloques al otro'] },
  { texto:'Quieres hablar pero otro niño también está hablando.', correcta:'Esperar tu turno y levantar la mano', malas:['Interrumpir gritando','Hablar más fuerte que el otro','Empujarlo para que se calle'] },
  { texto:'Un compañero rompió sin querer tu dibujo.', correcta:'Decirle cómo te sientes con calma', malas:['Pegarle','Romper su dibujo también','Gritarle'] },
  { texto:'Un compañero dice que el juego no es justo porque siempre pierde.', correcta:'Escucharlo y cambiar las reglas para que sea justo para todos', malas:['Decirle que deje de quejarse','Burlarte porque pierde','No dejarlo jugar más'] },
  { texto:'Dos amigos quieren jugar a juegos distintos al mismo tiempo.', correcta:'Conversar y elegir un juego entre los dos, o turnarse', malas:['Pelear por imponer su juego','Jugar solo y dejar al otro de lado','Gritar hasta que el otro ceda'] },
  { texto:'Un compañero te empujó sin querer al correr.', correcta:'Decirle con calma que tenga más cuidado', malas:['Empujarlo de vuelta más fuerte','Gritarle enojado','Dejar de ser su amigo'] },
  { texto:'Quieres el columpio pero otro niño lo está usando.', correcta:'Esperar tu turno pacientemente', malas:['Bajarlo a la fuerza','Quitarle el columpio empujando','Llorar hasta que te lo preste'] },
  { texto:'Dos niños quieren sentarse en la misma silla.', correcta:'Buscar otra silla o preguntar quién llegó primero', malas:['Empujar al otro para sentarse','Pelear por la silla','Tirar al otro niño al suelo'] },
  { texto:'Un compañero no quiere prestarte los colores para pintar.', correcta:'Pedirlos con amabilidad y esperar tu turno', malas:['Quitárselos de las manos','Gritarle que es egoísta','Pintar sobre su dibujo'] },
];

const NORMAS_BANK = [
  { correcta:'Guardar los juguetes al terminar de jugar', incorrectas:['Dejar los juguetes tirados','Sacar más juguetes sin guardar','Esconder los juguetes de otros'] },
  { correcta:'Escuchar cuando un compañero está hablando', incorrectas:['Hablar todos al mismo tiempo','Taparse los oídos','Interrumpir todo el tiempo'] },
  { correcta:'Pedir las cosas por favor y dar las gracias', incorrectas:['Quitar las cosas sin pedir','Exigir gritando','Ignorar a quien te ayuda'] },
  { correcta:'Hacer fila para esperar tu turno', incorrectas:['Pasar por encima de otros','Empujar para ser el primero','Saltarse la fila'] },
  { correcta:'Cuidar los materiales de la sala', incorrectas:['Romper los materiales a propósito','Rayar las mesas','Tirar los libros al suelo'] },
  { correcta:'Levantar la mano para pedir la palabra', incorrectas:['Gritar para que te escuchen','Hablar sin esperar tu turno','Interrumpir a la profesora'] },
  { correcta:'Lavarse las manos antes de comer', incorrectas:['Comer con las manos sucias','Toser sin taparte la boca','Ensuciar la mesa a propósito'] },
  { correcta:'Ayudar a un compañero que se cayó', incorrectas:['Reírse de quien se cayó','Seguir jugando sin mirar','Empujarlo para que se levante rápido'] },
  { correcta:'Guardar silencio cuando alguien está durmiendo o descansando', incorrectas:['Hacer ruido a propósito','Gritar cerca de quien descansa','Golpear cosas fuerte sin razón'] },
  { correcta:'Pedir permiso antes de tomar algo que no es tuyo', incorrectas:['Tomarlo sin avisar','Esconderlo después de tomarlo','Decir que era tuyo desde el principio'] },
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
  { correcta:'Jugar con bolsas de plástico sobre la cabeza', seguras:['Jugar con globos','Jugar con pelotas','Armar un rompecabezas'] },
  { correcta:'Acercarse a un perro desconocido sin cuidado', seguras:['Acariciar a tu propia mascota con calma','Jugar con tus peluches','Leer un cuento de animales'] },
];

export function genResolucionNTRound(){
  const recurso = 'La <b>resolución pacífica de conflictos</b> significa solucionar un desacuerdo hablando con calma, en vez de usar la fuerza, los gritos o los golpes. Cuando dos personas quieren lo mismo al mismo tiempo (un juguete, un juego, un turno), lo mejor es conversar para llegar a un acuerdo — puede ser turnarse, compartir, o buscar otra alternativa que funcione para ambos. Aprender a resolver conflictos así, desde pequeño, ayuda a mantener buenas relaciones con los demás y evita que un problema pequeño se convierta en uno más grande. Esta habilidad se usa toda la vida: en el jardín, en la escuela, en el trabajo y en la familia siempre van a existir desacuerdos, y saber resolverlos con calma y respeto es una de las habilidades sociales más importantes que existen.';
  const item = pick(CONFLICTO_BANK);
  const opts = shuffle([item.correcta].concat(item.malas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-sentence">'+item.texto+'</p><p class="prompt-hint">¿Qué es lo mejor que puedes hacer?</p>',
    options: opts, correctValue: item.correcta, speakText: item.texto, cols:2, panel:true,
    explain: 'Lo mejor es "'+item.correcta.toLowerCase()+'" — así se resuelve el problema sin lastimar a nadie.',
    recurso: recurso,
  };
}

export function genNormasNTRound(){
  const recurso = 'Las <b>normas de convivencia</b> son acuerdos que ayudan a que un grupo de personas viva y trabaje bien junto, respetándose entre todos — por ejemplo, guardar los juguetes al terminar, escuchar cuando alguien habla, hacer fila para esperar el turno, o pedir las cosas por favor. Estas normas no son reglas arbitrarias: cada una existe por una razón concreta, generalmente para que todos puedan estar cómodos, seguros y ser tratados con respeto. Seguir normas de convivencia en el jardín o la sala de clases prepara para vivir en sociedad más adelante, donde también existen normas (como las leyes de tránsito o las reglas de un lugar de trabajo) que ayudan a que todos puedan convivir en armonía.';
  const item = pick(NORMAS_BANK);
  const opts = shuffle([item.correcta].concat(item.incorrectas)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas es una norma correcta de convivencia?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas es una norma correcta de convivencia?', cols:2, panel:true,
    explain: '"'+item.correcta+'" ayuda a que todos estén bien en la sala.',
    recurso: recurso,
  };
}

export function genSeguridadNTRound(){
  const recurso = 'Reconocer situaciones <b>peligrosas</b> es una parte importante del autocuidado: hay acciones cotidianas (tocar un enchufe, cruzar la calle sin mirar, jugar con fósforos, correr cerca de una piscina) que pueden causar un accidente o una lesión, y aprender a identificarlas ayuda a evitarlas. No se trata de tener miedo de todo, sino de saber distinguir qué actividades son seguras (jugar en el patio, leer un cuento, armar un rompecabezas) de las que requieren mucho cuidado o la ayuda de un adulto. Frente a cualquier situación de riesgo, lo más importante es siempre pedir ayuda a un adulto de confianza en vez de intentar resolverla solo — esta es una de las reglas de seguridad más importantes para niños de cualquier edad.';
  const item = pick(RIESGO_BANK);
  const opts = shuffle([item.correcta].concat(item.seguras)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">¿Cuál de estas acciones puede ser peligrosa?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Cuál de estas acciones puede ser peligrosa?', cols:2, panel:true,
    explain: '"'+item.correcta+'" puede lastimarte — siempre pide ayuda a un adulto para esas cosas.',
    recurso: recurso,
  };
}
