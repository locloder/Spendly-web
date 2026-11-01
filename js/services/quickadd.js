import {state,save} from '../core/state.js';
import {uid,today,toast,fmt} from '../core/utils.js';
import {names} from '../data/categories.js';
import {guess} from './classifier.js';
import {parseAmount,cleanNote,isIncome} from './parser.js';

export function handleQuickAdd(){
  const q=new URLSearchParams(location.search);
  if(!q.has('add'))return;
  const text=q.get('add'),amount=parseAmount(text),note=q.get('note')||cleanNote(text);
  if(amount>0){
    const category=names.includes(q.get('cat'))?q.get('cat'):guess(text+' '+(q.get('cat')||'')+' '+note);
    state.tx.push({id:uid(),a:amount,inc:q.get('income')==='1'||isIncome(text),c:category,n:note,d:today()});
    save();
    setTimeout(()=>toast('Добавлено: '+fmt(amount)+', '+category),300);
  }
  history.replaceState(null,'',location.pathname);
}
