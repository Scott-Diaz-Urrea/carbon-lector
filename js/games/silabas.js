import { shuffle } from '../utils.js';
import { sfxCorrect, sfxWrong, speak } from '../audio.js';
import { awardXP } from '../state.js';
import { showExplain, showResult } from '../rewards.js';

const SYLLABLE_WORDS = [
  { emoji:'🐱', word:'GATO', syllables:['GA','TO'] },
  { emoji:'🦆', word:'PATO', syllables:['PA','TO'] },
  { emoji:'🐸', word:'SAPO', syllables:['SA','PO'] },
  { emoji:'🏍️', word:'MOTO', syllables:['MO','TO'] },
  { emoji:'🌙', word:'LUNA', syllables:['LU','NA'] },
  { emoji:'🍲', word:'SOPA', syllables:['SO','PA'] },
  { emoji:'☕', word:'TAZA', syllables:['TA','ZA'] },
  { emoji:'👕', word:'ROPA', syllables:['RO','PA'] },
  { emoji:'🏠', word:'CASA', syllables:['CA','SA'] },
  { emoji:'✋', word:'MANO', syllables:['MA','NO'] },
  { emoji:'👆', word:'DEDO', syllables:['DE','DO'] },
  { emoji:'👁️', word:'OJO', syllables:['O','JO'] },
  { emoji:'👄', word:'BOCA', syllables:['BO','CA'] },
  { emoji:'🐂', word:'TORO', syllables:['TO','RO'] },
  { emoji:'🐄', word:'VACA', syllables:['VA','CA'] },
  { emoji:'🐀', word:'RATA', syllables:['RA','TA'] },
  { emoji:'🍯', word:'PANAL', syllables:['PA','NAL'] },
  { emoji:'🎈', word:'GLOBO', syllables:['GLO','BO'] },
  { emoji:'🐖', word:'CHANCHO', syllables:['CHAN','CHO'] },
  { emoji:'🦷', word:'DIENTE', syllables:['DIEN','TE'] },
  { emoji:'🌵', word:'CACTUS', syllables:['CAC','TUS'] },
  { emoji:'🥁', word:'TAMBOR', syllables:['TAM','BOR'] },
  { emoji:'🧦', word:'MEDIA', syllables:['ME','DIA'] },
  { emoji:'🎀', word:'MOÑO', syllables:['MO','ÑO'] },
];

let sGame = null;

export function renderSilabasScreen(){
  return '<div class="screen" id="silabas-screen"></div>';
}

export function initSilabasGame(){
  sGame = { round:0, correct:0, total:8, pool: shuffle(SYLLABLE_WORDS), current:null };
  drawSilabaRound();
}

export function drawSilabaRound(){
  if(sGame.round >= sGame.total){ showResult('silabas', sGame.correct, sGame.total, false); return; }
  const item = sGame.pool[sGame.round % sGame.pool.length];
  const tiles = shuffle(item.syllables);
  sGame.current = { item: item, tiles: tiles, answer: new Array(item.syllables.length).fill(null), usedTiles: {} };
  renderSilabaUI();
}

function renderSilabaUI(){
  const el = document.getElementById('silabas-screen');
  if(!el) return;
  const cur = sGame.current;
  el.innerHTML =
    '<p class="section-title">Sílabas</p>'+
    '<div class="game-progress">'+
      '<div class="progress-track"><div class="progress-fill" style="width:'+((sGame.round/sGame.total)*100)+'%"></div></div>'+
      '<div class="progress-num">'+(sGame.round+1)+'/'+sGame.total+'</div>'+
    '</div>'+
    '<div class="prompt-card">'+
      '<span class="prompt-emoji">'+cur.item.emoji+'</span>'+
      '<div class="syll-slots">'+
        cur.answer.map(function(a){ return '<span class="syll-slot '+(a?'filled':'')+'">'+(a||'')+'</span>'; }).join('')+
      '</div>'+
      '<p class="prompt-hint">Ordena las sílabas</p>'+
    '</div>'+
    '<div class="syll-tiles">'+
      cur.tiles.map(function(t,i){ return '<button class="syll-tile '+(cur.usedTiles[i]?'used':'')+'" '+(cur.usedTiles[i]?'disabled':'')+' onclick="tapSyllable('+i+')">'+t+'</button>'; }).join('')+
    '</div>';
}

export function tapSyllable(i){
  const cur = sGame.current;
  if(cur.usedTiles[i]) return;
  const nextSlot = cur.answer.findIndex(function(a){ return a===null; });
  if(nextSlot === -1) return;
  cur.answer[nextSlot] = cur.tiles[i];
  cur.usedTiles[i] = true;
  renderSilabaUI();

  if(cur.answer.every(function(a){ return a!==null; })){
    const built = cur.answer.join('');
    const target = cur.item.syllables.join('');
    setTimeout(function(){
      const slots = document.querySelectorAll('.syll-slot');
      if(built === target){
        slots.forEach(function(s){ s.classList.add('correct'); });
        sGame.correct++;
        sfxCorrect();
        awardXP(8);
        speak(cur.item.word);
        sGame.round++;
        setTimeout(drawSilabaRound, 900);
      }else{
        slots.forEach(function(s){ s.classList.add('wrong'); });
        sfxWrong();
        sGame.round++;
        setTimeout(function(){
          showExplain('La palabra se forma así: '+cur.item.syllables.join(' + ')+' = <b>'+cur.item.word+'</b>.', drawSilabaRound);
        }, 700);
      }
    }, 250);
  }
}
