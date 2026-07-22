/* =========================================================
   LEO — punto de entrada. Expone en window las funciones que
   el HTML generado dinámicamente invoca vía onclick="..." —
   los módulos ES no las hacen globales por su cuenta.
   ========================================================= */
import { goTo, goBack, selectGrade, selectNivel, showToast } from './state.js';
import { speak } from './audio.js';
import { answerMC } from './mcEngine.js';
import { tapSyllable } from './games/silabas.js';
import { tapSecuencia } from './games/secuencia.js';
import { initMemoryGame, flipCard } from './games/memorama.js';
import { replayGame, showNameEntry } from './rewards.js';
import { diccSpeak } from './games/diccionario.js';
import { render } from './render.js';
import { state } from './state.js';
import { loadProgress } from './persistence.js';

window.goTo = goTo;
window.goBack = goBack;
window.selectGrade = selectGrade;
window.selectNivel = selectNivel;
window.showToast = showToast;
window.speak = speak;
window.answerMC = answerMC;
window.tapSyllable = tapSyllable;
window.tapSecuencia = tapSecuencia;
window.initMemoryGame = initMemoryGame;
window.flipCard = flipCard;
window.replayGame = replayGame;
window.diccSpeak = diccSpeak;

loadProgress();
render();

if(!state.userName){
  showNameEntry(render);
}
