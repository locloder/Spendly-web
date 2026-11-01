import {state} from '../core/state.js';
import {esc,fmt} from '../core/utils.js';
import {nextDate,daysTo,overLimits} from '../services/analytics.js';
import {icon} from '../ui/icons.js';

export function reminders(){
  const warns=overLimits()
    .map(x=>`<div class="note warn">${esc(x.c)}: лимит превышен на ${fmt(x.over)}</div>`).join('');
  return warns+state.subs
    .map(s=>({s,n:daysTo(s)}))
    .filter(x=>x.n<=x.s.rem)
    .sort((a,b)=>a.n-b.n)
    .map(x=>{
      const when=x.n===0?'списание сегодня':x.n===1?'списание завтра':'списание через '+x.n+' дн.';
      return `<div class="note">${esc(x.s.name)}: ${when}, ${fmt(x.s.p)}</div>`;
    }).join('');
}

function item(s){
  const date=nextDate(s).toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
  return `<div class="item">
    <div class="row"><div class="ic d">${icon('repeat',20)}</div>
      <div class="grow"><b>${esc(s.name)}</b><span>Следующее списание ${date}</span></div>
      <div class="amt">${fmt(s.p)}</div></div>
    <div class="acts">
      <button data-a="paid" data-id="${s.id}">Записать трату</button>
      <button data-a="ics" data-id="${s.id}">В календарь</button>
      <button data-a="delSub" data-id="${s.id}">Удалить</button>
    </div>
  </div>`;
}

export function subsView(){
  const total=state.subs.reduce((a,s)=>a+s.p,0);
  const list=[...state.subs].sort((a,b)=>daysTo(a)-daysTo(b)).map(item).join('');
  return `<div class="h1">Подписки</div><div class="sheet">${reminders()}
    <div class="card"><small>В месяц</small><div class="big" style="font-size:40px">${fmt(total)}</div><small>В год ${fmt(total*12)}</small></div>
    <div class="card">${list||'<div class="empty">Подписок нет. Нажмите +, чтобы добавить первую.</div>'}</div>
  </div>`;
}
