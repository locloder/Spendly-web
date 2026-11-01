import {fd,fmt} from '../core/utils.js';
import {byDate,EX,sum} from '../services/analytics.js';
import {row,emptyText} from '../ui/components.js';
import {reminders} from './subs.js';

export function historyView(){
  const days={};
  byDate().forEach(t=>{(days[t.d]=days[t.d]||[]).push(t)});
  const cards=Object.entries(days).map(([date,list])=>`<div class="card">
    <div class="dh"><b>${fd(date)}</b><span class="amt">${fmt(sum(EX(list)))}</span></div>
    ${list.map(row).join('')}
  </div>`).join('');
  return `<div class="h1">История</div><div class="sheet">${reminders()}${cards||`<div class="card"><div class="empty">${emptyText}</div></div>`}</div>`;
}
