import { shuffle } from '../utils.js';
import { sfxCorrect, sfxWrong } from '../audio.js';
import { awardXP } from '../state.js';
import { showExplain, showResult } from '../rewards.js';
import { crisalidaSVG, toothbrushSVG } from '../svg.js';

/* "Capullo" usaba 🍃 (una hoja, sin relación con la etapa de crisálida) →
   crisalidaSVG(), el mismo dibujo ya usado para esta etapa en
   exploracionEntornoNatural.js. "Tomar el cepillo" usaba el emoji 🪥 crudo,
   que no se renderiza en varios navegadores → toothbrushSVG(). */
const SECUENCIA_BANK = [
  { title:'Un día de escuela', steps:[{emoji:'🛌',text:'Despertar'},{emoji:'🎒',text:'Ir al colegio'},{emoji:'📚',text:'Aprender'}] },
  { title:'Plantar una semilla', steps:[{emoji:'🌱',text:'Sembrar'},{emoji:'💧',text:'Regar'},{emoji:'🌻',text:'Florecer'}] },
  { title:'Hacer un sándwich', steps:[{emoji:'🍞',text:'Sacar el pan'},{emoji:'🧀',text:'Poner el queso'},{emoji:'😋',text:'Comer'}] },
  { title:'Un día de lluvia', steps:[{emoji:'☁️',text:'Se nubla'},{emoji:'🌧️',text:'Llueve'},{emoji:'🌈',text:'Sale el arcoíris'}] },
  { title:'La mariposa', steps:[{emoji:'🐛',text:'Oruga'},{emoji: crisalidaSVG(28),text:'Capullo'},{emoji:'🦋',text:'Mariposa'}] },
  { title:'Lavarse las manos', steps:[{emoji:'🚿',text:'Mojar'},{emoji:'🧼',text:'Jabón'},{emoji:'🤲',text:'Secar'}] },
  { title:'Cepillarse los dientes', steps:[{emoji: toothbrushSVG(28),text:'Tomar el cepillo'},{emoji:'🦷',text:'Cepillar'},{emoji:'😁',text:'Sonreír'}] },
  { title:'Hornear un pastel', steps:[{emoji:'🥣',text:'Mezclar'},{emoji:'🔥',text:'Hornear'},{emoji:'🎂',text:'Decorar'}] },
  { title:'Ir a dormir', steps:[{emoji:'🌙',text:'Anochece'},{emoji:'🛁',text:'Bañarse'},{emoji:'😴',text:'Dormir'}] },
  { title:'Un partido de fútbol', steps:[{emoji:'⚽',text:'Empieza el juego'},{emoji:'🏃',text:'Corren y juegan'},{emoji:'🏆',text:'Alguien gana'}] },
];

let qGame = null;

export function renderSecuenciaScreen(){
  return '<div class="screen" id="secuencia-screen"></div>';
}

export function initSecuenciaGame(){
  qGame = { round:0, correct:0, total:8, pool: shuffle(SECUENCIA_BANK), current:null };
  drawSecuenciaRound();
}

function seqStepChip(step){
  return '<span class="seq-emoji">'+step.emoji+'</span><span class="seq-text">'+step.text+'</span>';
}

export function drawSecuenciaRound(){
  if(qGame.round >= qGame.total){ showResult('secuencia', qGame.correct, qGame.total, false); return; }
  const item = qGame.pool[qGame.round % qGame.pool.length];
  const order = shuffle([0,1,2]);
  qGame.current = { item: item, order: order, answer: [null,null,null], usedTiles: {} };
  renderSecuenciaUI();
}

function renderSecuenciaUI(){
  const el = document.getElementById('secuencia-screen');
  if(!el) return;
  const cur = qGame.current;
  el.innerHTML =
    '<p class="section-title">Secuencia</p>'+
    '<div class="game-progress">'+
      '<div class="progress-track"><div class="progress-fill" style="width:'+((qGame.round/qGame.total)*100)+'%"></div></div>'+
      '<div class="progress-num">'+(qGame.round+1)+'/'+qGame.total+'</div>'+
    '</div>'+
    '<div class="prompt-card">'+
      '<p class="prompt-hint">"'+cur.item.title+'" — ordena los pasos</p>'+
      '<div class="seq-slots">'+
        cur.answer.map(function(a,i){
          return '<div class="seq-slot '+(a!==null?'filled':'')+'">'+(a!==null ? seqStepChip(cur.item.steps[a]) : (i+1))+'</div>';
        }).join('')+
      '</div>'+
    '</div>'+
    '<div class="seq-tiles">'+
      cur.order.map(function(stepIdx,i){
        return '<button class="seq-tile '+(cur.usedTiles[i]?'used':'')+'" '+(cur.usedTiles[i]?'disabled':'')+' onclick="tapSecuencia('+i+')">'+seqStepChip(cur.item.steps[stepIdx])+'</button>';
      }).join('')+
    '</div>';
}

export function tapSecuencia(tileIdx){
  const cur = qGame.current;
  if(cur.usedTiles[tileIdx]) return;
  const nextSlot = cur.answer.findIndex(function(a){ return a===null; });
  if(nextSlot === -1) return;
  cur.answer[nextSlot] = cur.order[tileIdx];
  cur.usedTiles[tileIdx] = true;
  renderSecuenciaUI();

  if(cur.answer.every(function(a){ return a!==null; })){
    setTimeout(function(){
      const slots = document.querySelectorAll('.seq-slot');
      const correct = cur.answer[0]===0 && cur.answer[1]===1 && cur.answer[2]===2;
      if(correct){
        slots.forEach(function(s){ s.classList.add('correct'); });
        qGame.correct++;
        sfxCorrect();
        awardXP(8);
        qGame.round++;
        setTimeout(drawSecuenciaRound, 950);
      }else{
        slots.forEach(function(s){ s.classList.add('wrong'); });
        sfxWrong();
        qGame.round++;
        const orderText = cur.item.steps.map(function(s){ return s.text; }).join(' → ');
        setTimeout(function(){
          showExplain('El orden correcto de "'+cur.item.title+'" es: <b>'+orderText+'</b>.', drawSecuenciaRound);
        }, 700);
      }
    }, 250);
  }
}
