import { pick, shuffle } from '../../utils.js';
import { cascoSVG } from '../../svg.js';

/* Núcleo Comprensión del Entorno Sociocultural — Educación Parvularia, NT
   (Decreto 481/2017, ámbito Interacción y Comprensión del Entorno,
   curriculumnacional.cl/portal/Educacion-Parvularia/Interaccion-y-comprension-del-entorno-/Comprension-del-entorno-sociocultural/):
   OA01 -> Roles de mi Comunidad · OA03 -> Objetos Tecnológicos ·
   OA07 -> Instituciones de mi Comunidad · OA10 -> Seguridad y Prevención.
   Quedan fuera: OA02, OA04-06, OA08-09, OA11 — son de apreciación de formas
   de vida de otras culturas/épocas, interpretación de la historia de un
   invento, relatos históricos de la propia comunidad, cuidado del patrimonio,
   biografías de personas destacadas, y estrategias de indagación con TICs:
   requieren datos históricos/biográficos específicos que arriesgan
   inexactitud sin una fuente adicional (mismo criterio ya aplicado al
   excluir "personajes históricos" en Historia de 1° básico), o dependen de
   la experiencia de indagación propia del niño/a, no de un hecho con
   respuesta única evaluable con opción múltiple. */

export const COMPRENSION_ENTORNO_SOCIOCULTURAL_MODULES = [
  { id:'rolescomunidadnt', label:'Roles de mi Comunidad', open:true, key:'rolescomunidadnt' },
  { id:'objetostecnt', label:'Objetos Tecnológicos', open:true, key:'objetostecnt' },
  { id:'institucionesnt', label:'Instituciones de mi Comunidad', open:true, key:'institucionesnt' },
  { id:'seguridadprevnt', label:'Seguridad y Prevención', open:true, key:'seguridadprevnt' },
];
export const COMPRENSION_ENTORNO_SOCIOCULTURAL_POS = [
  {x:24,y:82},{x:68,y:62},{x:24,y:38},{x:68,y:16}
];

/* Panadero usa 🥖 (no 👨‍🍳) porque ese emoji ya representa "Cocinero" como
   distractor en otras preguntas de este mismo banco — reutilizar el mismo
   ícono para dos oficios distintos confunde a quien todavía no lee. */
const ROLES_BANK = [
  { pregunta:'¿Quién apaga los incendios?', correcto:'👨‍🚒 Bombero', opts:['👩‍⚕️ Doctora','👨‍🍳 Cocinero','👮 Policía'] },
  { pregunta:'¿Quién cuida nuestra salud cuando estamos enfermos?', correcto:'👩‍⚕️ Doctora', opts:['👨‍🚒 Bombero','👩‍🏫 Profesora','👨‍🌾 Agricultor'] },
  { pregunta:'¿Quién nos enseña en el jardín o el colegio?', correcto:'👩‍🏫 Profesora', opts:['👮 Policía','👨‍🍳 Cocinero','👩‍⚕️ Doctora'] },
  { pregunta:'¿Quién cuida el orden y la seguridad en la calle?', correcto:'👮 Policía', opts:['👨‍🌾 Agricultor','👩‍🏫 Profesora','👨‍🚒 Bombero'] },
  { pregunta:'¿Quién cultiva los alimentos que comemos?', correcto:'👨‍🌾 Agricultor', opts:['👮 Policía','👨‍🚒 Bombero','👩‍⚕️ Doctora'] },
  { pregunta:'¿Quién prepara el pan que comemos?', correcto:'🥖 Panadero', opts:['👮 Policía','👩‍🏫 Profesora','👨‍🌾 Agricultor'] },
  { pregunta:'¿Quién construye las casas y edificios?', correcto:'👷 Constructor', opts:['👨‍🍳 Cocinero','👩‍⚕️ Doctora','👨‍🌾 Agricultor'] },
  { pregunta:'¿Quién arregla los autos cuando se dañan?', correcto:'🧑‍🔧 Mecánico', opts:['👮 Policía','👩‍🏫 Profesora','👷 Constructor'] },
];

const OBJETOS_TEC_BANK = [
  { emoji:'📱', obj:'el teléfono celular', correcta:'Comunicarse y llamar a otras personas', opts:['Cocinar los alimentos','Iluminar la casa','Lavar la ropa'] },
  { emoji:'📺', obj:'el televisor', correcta:'Ver programas y películas', opts:['Guardar la comida fría','Cortar el pasto','Transportar personas'] },
  { emoji:'🍳', obj:'la cocina', correcta:'Cocinar los alimentos', opts:['Comunicarse por llamada','Guardar la ropa','Iluminar la noche'] },
  { emoji:'💡', obj:'la ampolleta', correcta:'Iluminar la casa', opts:['Cocinar los alimentos','Lavar los platos','Transportar personas'] },
  { emoji:'🚗', obj:'el auto', correcta:'Transportar personas de un lugar a otro', opts:['Cocinar los alimentos','Comunicarse por llamada','Guardar la comida fría'] },
  { emoji:'🔦', obj:'la linterna', correcta:'Alumbrar en lugares oscuros', opts:['Ver programas y películas','Transportar personas de un lugar a otro','Cocinar los alimentos'] },
  { emoji:'📷', obj:'la cámara fotográfica', correcta:'Tomar fotografías', opts:['Iluminar la casa','Comunicarse y llamar a otras personas','Cocinar los alimentos'] },
  { emoji:'🖥️', obj:'el computador', correcta:'Buscar información y escribir documentos', opts:['Ver programas y películas','Transportar personas de un lugar a otro','Iluminar la casa'] },
];

/* El ítem del bus se reemplazó por Municipalidad/Correos/Banco/Supermercado:
   un medio de transporte no encaja en "instituciones de mi comunidad" (las
   demás son edificios/servicios, no vehículos). Por la misma razón, la
   pregunta de bomberos ya no dice "¿A dónde llamas...?" (que implica un
   lugar) — se reformuló para preguntar explícitamente por el vehículo, así
   🚒 deja de ser una respuesta inconsistente con el resto del banco. Cada
   entrada trae un `label` para que `explain` pueda nombrar la respuesta en
   vez de solo repetir el emoji. */
const INSTITUCIONES_BANK = [
  { pregunta:'¿A dónde vas si te enfermas o te sientes mal?', correcto:'🏥', label:'el hospital', opts:['🏫','📚','🚒'] },
  { pregunta:'¿A dónde vas a pedir prestado un libro?', correcto:'📚', label:'la biblioteca', opts:['🏥','🚒','🏫'] },
  { pregunta:'¿En qué vehículo llegan los bomberos a apagar un incendio?', correcto:'🚒', label:'el carro de bomberos', opts:['🏥','📚','🏫'] },
  { pregunta:'¿A dónde vas todos los días a aprender?', correcto:'🏫', label:'la escuela', opts:['🏥','🚒','📚'] },
  { pregunta:'¿Dónde trabaja el alcalde de tu comuna?', correcto:'🏛️', label:'la municipalidad', opts:['🏥','📚','🏫'] },
  { pregunta:'¿A dónde vas a enviar una carta o un paquete?', correcto:'🏤', label:'el correo', opts:['🏦','🏪','🏛️'] },
  { pregunta:'¿A dónde va tu familia a guardar su dinero?', correcto:'🏦', label:'el banco', opts:['🏤','🏪','🏥'] },
  { pregunta:'¿A dónde va tu familia a comprar los alimentos de la semana?', correcto:'🏪', label:'el supermercado', opts:['🏦','🏤','🏫'] },
];

const SEGURIDAD_PREV_BANK = [
  { pregunta:'Si hay un sismo, ¿qué debes hacer?', correcto:'Agacharte junto a un adulto y cubrirte', opts:['Correr por las escaleras solo','Asomarte por la ventana','Esconderte bajo la cama solo'] },
  { pregunta:'¿Qué color del semáforo significa "Detente"?', correcto:'🔴 Rojo', opts:['🟢 Verde','🟡 Amarillo','🔵 Azul'] },
  { pregunta:'Si hay un incendio, ¿qué debes hacer?', correcto:'Salir con un adulto por la salida más cercana', opts:['Esconderte en un clóset','Volver a buscar tus juguetes','Usar el ascensor'] },
  { pregunta:'Antes de cruzar la calle, ¿qué debes hacer primero?', correcto:'Mirar a ambos lados y dar la mano a un adulto', opts:['Cruzar corriendo','Cruzar mirando el celular','Cruzar sin mirar'] },
  { pregunta:'¿Qué debes ponerte antes de andar en bicicleta o patines?', correcto: cascoSVG(40)+' El casco', opts:['👒 Un sombrero de verano','👟 Solo zapatillas','🧤 Solo guantes'] },
  { pregunta:'¿Qué debes hacer si un extraño te ofrece dulces o te pide que lo acompañes?', correcto:'Decir que no y contarle a un adulto de confianza', opts:['Irte con esa persona','Aceptar los dulces callado','Seguirlo sin avisar a nadie'] },
  { pregunta:'¿Qué debes hacer si te pierdes en un lugar con mucha gente?', correcto:'Quedarte quieto y buscar a un adulto que trabaje ahí', opts:['Seguir caminando solo','Esconderte sin avisar a nadie','Irte con la primera persona que veas'] },
  { pregunta:'¿Qué debes hacer si encuentras fósforos, remedios o productos de limpieza?', correcto:'No tocarlos y avisar a un adulto', opts:['Jugar con ellos','Probarlos para ver qué son','Guardarlos en tu mochila'] },
];

export function genRolesComunidadNTRound(){
  const item = pick(ROLES_BANK);
  const opts = shuffle([item.correcto].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcto, speakText: item.pregunta, cols:2, panel:true,
    explain: 'La respuesta es '+item.correcto+'.',
  };
}

export function genObjetosTecNTRound(){
  const item = pick(OBJETOS_TEC_BANK);
  const opts = shuffle([item.correcta].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<span class="prompt-emoji">'+item.emoji+'</span><p class="prompt-hint">¿Para qué sirve '+item.obj+'?</p>',
    options: opts, correctValue: item.correcta, speakText: '¿Para qué sirve '+item.obj+'?', cols:2, panel:true,
    explain: item.obj.charAt(0).toUpperCase()+item.obj.slice(1)+' sirve para '+item.correcta.toLowerCase()+'.',
  };
}

export function genInstitucionesNTRound(){
  const item = pick(INSTITUCIONES_BANK);
  const opts = shuffle([item.correcto].concat(item.opts)).map(function(e){ return {label:e, value:e}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcto, speakText: item.pregunta, cols:4,
    explain: 'La respuesta correcta es <b>'+item.label+'</b> '+item.correcto+'.',
  };
}

export function genSeguridadPrevNTRound(){
  const item = pick(SEGURIDAD_PREV_BANK);
  const opts = shuffle([item.correcto].concat(item.opts)).map(function(o){ return {label:o, value:o}; });
  return {
    promptHTML: '<p class="prompt-hint">'+item.pregunta+'</p>',
    options: opts, correctValue: item.correcto, speakText: item.pregunta, cols:2, panel:true,
    explain: 'Lo correcto es "'+item.correcto+'".',
  };
}
