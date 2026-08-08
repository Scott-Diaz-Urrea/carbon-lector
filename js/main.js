/* =========================================================
   LEO — punto de entrada. Expone en window las funciones que
   el HTML generado dinámicamente invoca vía onclick="..." —
   los módulos ES no las hacen globales por su cuenta.
   ========================================================= */
import { goTo, goBack, selectGrade, selectNivel, selectEpjaNivel, selectMedioGrade, showToast } from './state.js';
import { speak } from './audio.js';
import { answerMC, showMCRecurso } from './mcEngine.js';
import { tapSyllable } from './games/silabas.js';
import { tapSecuencia } from './games/secuencia.js';
import { initMemoryGame, flipCard } from './games/memorama.js';
import { replayGame, showNameEntry, closeRecurso } from './rewards.js';
import { diccSpeak } from './games/diccionario.js';
import { selectColoringDrawing, backToDrawingPicker, pickColorNum, pickColorHex, clearColoring, saveColoringPNG } from './games/colorearNumeros.js';
import { render } from './render.js';
import { state } from './state.js';
import { loadProgress } from './persistence.js';

window.goTo = goTo;
window.goBack = goBack;
window.selectGrade = selectGrade;
window.selectNivel = selectNivel;
window.selectEpjaNivel = selectEpjaNivel;
window.selectMedioGrade = selectMedioGrade;
window.showToast = showToast;
window.speak = speak;
window.answerMC = answerMC;
window.showMCRecurso = showMCRecurso;
window.closeRecurso = closeRecurso;
window.tapSyllable = tapSyllable;
window.tapSecuencia = tapSecuencia;
window.initMemoryGame = initMemoryGame;
window.flipCard = flipCard;
window.replayGame = replayGame;
window.diccSpeak = diccSpeak;
window.selectColoringDrawing = selectColoringDrawing;
window.backToDrawingPicker = backToDrawingPicker;
window.pickColorNum = pickColorNum;
window.pickColorHex = pickColorHex;
window.clearColoring = clearColoring;
window.saveColoringPNG = saveColoringPNG;

loadProgress();
render();

if(!state.userName){
  showNameEntry(render);
}
