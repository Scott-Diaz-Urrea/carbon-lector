import { pick, shuffle } from '../../utils.js';

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

const ROLES_BANK = [
  { pregunta:'¿Quién apaga los incendios?', correcto:'👨‍🚒 Bombero', opts:['👩‍⚕️ Doctora','👨‍🍳 Cocinero','👮 Policía'] },
  { pregunta:'¿Quién cuida nuestra salud cuando estamos enfermos?', correcto:'👩‍⚕️ Doctora', opts:['👨‍🚒 Bombero','👩‍🏫 Profesora','👨‍🌾 Agricultor'] },
  { pregunta:'¿Quién nos enseña en el jardín o el colegio?', correcto:'👩‍🏫 Profesora', opts:['👮 Policía','👨‍🍳 Cocinero','👩‍⚕️ Doctora'] },
  { pregunta:'¿Quién cuida el orden y la seguridad en la calle?', correcto:'👮 Policía', opts:['👨‍🌾 Agricultor','👩‍🏫 Profesora','👨‍🚒 Bombero'] },
  { pregunta:'¿Quién cultiva los alimentos que comemos?', correcto:'👨‍🌾 Agricultor', opts:['👮 Policía','👨‍🚒 Bombero','👩‍⚕️ Doctora'] },
  { pregunta:'¿Quién prepara el pan que comemos?', correcto:'👨‍🍳 Panadero', opts:['👮 Policía','👩‍🏫 Profesora','👨‍🌾 Agricultor'] },
];

const OBJETOS_TEC_BANK = [
  { emoji:'📱', obj:'el teléfono celular', correcta:'Comunicarse y llamar a otras personas', opts:['Cocinar los alimentos','Iluminar la casa','Lavar la ropa'] },
  { emoji:'📺', obj:'el televisor', correcta:'Ver programas y películas', opts:['Guardar la comida fría','Cortar el pasto','Transportar personas'] },
  { emoji:'🍳', obj:'la cocina', correcta:'Cocinar los alimentos', opts:['Comunicarse por llamada','Guardar la ropa','Iluminar la noche'] },
  { emoji:'💡', obj:'la ampolleta', correcta:'Iluminar la casa', opts:['Cocinar los alimentos','Lavar los platos','Transportar personas'] },
  { emoji:'🚗', obj:'el auto', correcta:'Transportar personas de un lugar a otro', opts:['Cocinar los alimentos','Comunicarse por llamada','Guardar la comida fría'] },
];

const INSTITUCIONES_BANK = [
  { pregunta:'¿A dónde vas si te enfermas o te sientes mal?', correcto:'🏥', opts:['🏫','📚','🚒'] },
  { pregunta:'¿A dónde vas a pedir prestado un libro?', correcto:'📚', opts:['🏥','🚒','🏫'] },
  { pregunta:'¿A dónde llamas si hay un incendio?', correcto:'🚒', opts:['🏥','📚','🏫'] },
  { pregunta:'¿A dónde vas todos los días a aprender?', correcto:'🏫', opts:['🏥','🚒','📚'] },
  { pregunta:'¿Qué usas para viajar por la ciudad junto a otras personas?', correcto:'🚌', opts:['🏥','📚','🏫'] },
];

const SEGURIDAD_PREV_BANK = [
  { pregunta:'Si hay un sismo, ¿qué debes hacer?', correcto:'Agacharte junto a un adulto y cubrirte', opts:['Correr por las escaleras solo','Asomarte por la ventana','Esconderte bajo la cama solo'] },
  { pregunta:'¿Qué color del semáforo significa "Detente"?', correcto:'🔴 Rojo', opts:['🟢 Verde','🟡 Amarillo','🔵 Azul'] },
  { pregunta:'Si hay un incendio, ¿qué debes hacer?', correcto:'Salir con un adulto por la salida más cercana', opts:['Esconderte en un clóset','Volver a buscar tus juguetes','Usar el ascensor'] },
  { pregunta:'Antes de cruzar la calle, ¿qué debes hacer primero?', correcto:'Mirar a ambos lados y dar la mano a un adulto', opts:['Cruzar corriendo','Cruzar mirando el celular','Cruzar sin mirar'] },
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
    explain: 'La respuesta correcta es '+item.correcto+'.',
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
