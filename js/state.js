import { GRADES, PARVULARIA_NIVELES } from './content/grades.js';
import { render } from './render.js';
import { sfxLevelup } from './audio.js';
import { saveProgress } from './persistence.js';

export const state = {
  xp: 0,
  currentGrade: 1,
  currentNivel: 'nt',
  userName: '',
  stars: { vocales:0, silabas:0, memorama:0, palabras:0, comprension:0, contar:0, sumar:0, comparar:0, formas:0,
           combinaciones:0, secuencia:0, salta:0, multiplicar:0,
           seresvivos:0, plantas:0, micuerpo:0, materiales:0, dianoche:0,
           calendario:0, miidentidad:0, simbolos:0, mapas:0, comunidad:0,
           colores:0, lineastexturas:0, materialesarte:0,
           sonidos:0, instrumentos:0,
           movimiento:0, vidaactiva:0, seguridad:0,
           emociones:0, autocuidado:0, convivencia:0,
           herramientastec:0,
           patrones:0, clasificar:0, posicion:0, cuantificadores:0, secuenciatemporal:0,
           contarveinte:0, sumarquitar:0, formascuerpos:0, medir:0,
           escribenombre:0, silabasnt:0, escucharnt:0, vocabnt:0, letrasnt:0,
           apreciarnt:0,
           emocionesnt:0, autocuidadont:0, alimentosnt:0,
           resolucionnt:0, normasnt:0, seguridadnt:0,
           ubicacionnt:0, movimientont:0,
           aguasolnt:0, materialesnaturalnt:0, animalesplantasnt:0, ciclosnt:0, ambientent:0,
           rolescomunidadnt:0, objetostecnt:0, institucionesnt:0, seguridadprevnt:0 },
  badges: new Set(),
};
export const screenStack = ['home'];

export function currentScreen(){ return screenStack[screenStack.length-1]; }
export function goTo(screen){ screenStack.push(screen); render(); }
export function goBack(){ if(screenStack.length>1){ screenStack.pop(); render(); } }
export function selectGrade(id){ state.currentGrade = id; saveProgress(); goTo('subjectMap'); }
export function gradeLabel(id){
  const g = GRADES.filter(function(x){ return x.id===id; })[0];
  return g ? g.label : '';
}
export function selectNivel(id){ state.currentNivel = id; saveProgress(); goTo('nucleoMap'); }
export function nivelLabel(id){
  const n = PARVULARIA_NIVELES.filter(function(x){ return x.id===id; })[0];
  return n ? n.label : '';
}

export function level(){ return Math.floor(state.xp/100)+1; }
export function totalStars(){ return Object.values(state.stars).reduce((a,b)=>a+b,0); }
export function maxStars(){ return Object.keys(state.stars).length*3; }

export function awardXP(n){
  const oldLevel = level();
  state.xp += n;
  const newLevel = level();
  if(newLevel>oldLevel){
    sfxLevelup();
    const who = state.userName ? ', ' + state.userName : '';
    showToast('⚡ ¡Subiste a Nivel ' + newLevel + who + '!');
  }
  saveProgress();
}

export function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> t.classList.remove('show'), 2200);
}
