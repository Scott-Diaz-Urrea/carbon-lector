import { shuffle } from '../utils.js';
import { sfxCorrect, sfxWrong, speak } from '../audio.js';
import { showResult } from '../rewards.js';

const MEMORY_LETTERS_EASY = ['A','E','I','O','U','M'];
const MEMORY_LETTERS_HARD = ['A','E','I','O','U','M','P','S','L','T'];

export let mGame = null;

export function renderMemoramaIntro(){
  return '<div class="screen" id="memorama-screen">'+
    '<p class="section-title">Letras</p>'+
    '<p class="section-sub">Elige la dificultad del memorama</p>'+
    '<div class="diff-grid">'+
      '<button class="diff-card" onclick="initMemoryGame(\'facil\')"><span class="diff-emoji">🙂</span><b>Fácil</b><span>6 parejas</span></button>'+
      '<button class="diff-card" onclick="initMemoryGame(\'dificil\')"><span class="diff-emoji">🤓</span><b>Difícil</b><span>10 parejas</span></button>'+
    '</div>'+
  '</div>';
}

function memoryStars(moves, pairs){
  const par = pairs*2;
  if(moves <= par+2) return 3;
  if(moves <= par+6) return 2;
  if(moves <= par+12) return 1;
  return 0;
}

export function initMemoryGame(diff){
  const letters = diff==='dificil' ? MEMORY_LETTERS_HARD : MEMORY_LETTERS_EASY;
  let cards = [];
  letters.forEach(function(l){
    cards.push({ letter:l.toUpperCase(), pairKey:l });
    cards.push({ letter:l.toLowerCase(), pairKey:l });
  });
  cards = shuffle(cards);
  mGame = { cards:cards, flippedIdx:[], matched:{}, moves:0, locked:false, diff:diff };
  drawMemory();
}

function drawMemory(){
  const el = document.getElementById('memorama-screen');
  if(!el) return;
  el.innerHTML =
    '<p class="section-title">Memorama de letras</p>'+
    '<p class="section-sub">Encuentra la mayúscula y su minúscula.</p>'+
    '<div class="memory-grid" id="mgrid">'+
      mGame.cards.map(function(c,i){
        return '<div class="mcard '+(mGame.matched[i]?'matched':'')+'" data-i="'+i+'" onclick="flipCard('+i+')">'+
          '<div class="mcard-inner">'+
            '<div class="mface back">?</div>'+
            '<div class="mface front">'+c.letter+'</div>'+
          '</div>'+
        '</div>';
      }).join('')+
    '</div>';
  mGame.cards.forEach(function(c,i){
    if(mGame.flippedIdx.indexOf(i)!==-1 || mGame.matched[i]){
      const node = el.querySelector('.mcard[data-i="'+i+'"]');
      if(node) node.classList.add('flipped');
    }
  });
}

export function flipCard(i){
  if(mGame.locked) return;
  if(mGame.matched[i] || mGame.flippedIdx.indexOf(i)!==-1) return;
  if(mGame.flippedIdx.length >= 2) return;

  mGame.flippedIdx.push(i);
  const node = document.querySelector('.mcard[data-i="'+i+'"]');
  if(node) node.classList.add('flipped');

  if(mGame.flippedIdx.length === 2){
    mGame.moves++;
    const a = mGame.flippedIdx[0], b = mGame.flippedIdx[1];
    const cardA = mGame.cards[a], cardB = mGame.cards[b];
    if(cardA.pairKey === cardB.pairKey){
      mGame.matched[a] = true; mGame.matched[b] = true;
      mGame.flippedIdx = [];
      sfxCorrect();
      speak('¡Pareja!');
      const na = document.querySelector('.mcard[data-i="'+a+'"]');
      const nb = document.querySelector('.mcard[data-i="'+b+'"]');
      if(na) na.classList.add('matched');
      if(nb) nb.classList.add('matched');
      if(Object.keys(mGame.matched).length === mGame.cards.length){
        setTimeout(function(){
          const stars = memoryStars(mGame.moves, mGame.cards.length/2);
          showResult('memorama', stars, 3, true);
        }, 500);
      }
    }else{
      mGame.locked = true;
      sfxWrong();
      setTimeout(function(){
        const na = document.querySelector('.mcard[data-i="'+a+'"]');
        const nb = document.querySelector('.mcard[data-i="'+b+'"]');
        if(na) na.classList.remove('flipped');
        if(nb) nb.classList.remove('flipped');
        mGame.flippedIdx = [];
        mGame.locked = false;
      }, 750);
    }
  }
}
