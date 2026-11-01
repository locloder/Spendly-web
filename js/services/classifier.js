import {state} from '../core/state.js';
import {names,CATS} from '../data/categories.js';
import {tokens} from './parser.js';

const STOP=new Set('потратил купил заплатил оплатил было рублей долларов евро получил'.split(' '));
const LIMIT=600;

function matches(stem,words){
  if(stem[0]==='=')return words.includes(stem.slice(1));
  const latin=/^[a-z]/.test(stem);
  return words.some(w=>w.startsWith(stem)||(latin&&w.includes(stem)));
}

export function guess(text){
  const words=tokens(text);
  for(const w of words){
    const saved=state.memory[w];
    if(saved&&names.includes(saved))return saved;
  }
  let best='Другое',top=0;
  names.forEach(c=>{
    const score=CATS[c].words.split(' ').filter(s=>s&&matches(s,words)).length;
    if(score>top){top=score;best=c}
  });
  return best;
}

export function learn(note,category){
  if(!note||category==='Другое')return;
  tokens(note)
    .filter(w=>w.length>=4&&!/^\d/.test(w)&&!STOP.has(w))
    .forEach(w=>{state.memory[w]=category});
  const keys=Object.keys(state.memory);
  if(keys.length>LIMIT)keys.slice(0,keys.length-LIMIT).forEach(k=>{delete state.memory[k]});
}
