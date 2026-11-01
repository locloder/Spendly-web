import {state} from '../core/state.js';
import {ui} from '../core/ui.js';
import {esc,fmt} from '../core/utils.js';
import {between,EX,sum,rangeFor,groupByCategory,monthlySeries} from '../services/analytics.js';
import {iconOf,typeOf} from '../data/categories.js';
import {icon} from '../ui/icons.js';
import {bar} from '../ui/components.js';
import {reminders} from './subs.js';

const PERIODS=[['w','Неделя'],['m','Месяц'],['y','Год'],['all','Всё']];

function spark(category){
  const s=monthlySeries(category),max=Math.max(...s,1);
  const rects=s.map((v,i)=>{
    const h=Math.max(2,v/max*26);
    return `<rect x="${i*11}" y="${26-h}" width="8" height="${h}" rx="2" opacity="${i===s.length-1?1:.4}"/>`;
  }).join('');
  return `<svg class="spark" viewBox="0 0 66 26" role="img" aria-label="Траты по месяцам">${rects}</svg>`;
}

function card(c,data){
  const {total,sums,old,counts,monthSpent}=data;
  const v=sums[c]||0,n=counts[c]||0,share=total?v/total*100:0,prev=old[c];
  const delta=prev?Math.round((v/prev-1)*100):null;
  const limit=state.catLimits[c]||0,spent=monthSpent[c]||0;
  const tag=delta!=null&&Math.abs(delta)>=5?`<span class="dl ${delta>0?'up':'dn'}">${delta>0?'+':''}${delta}%</span>`:'';
  const limitBlock=limit
    ?`<div class="dh"><small>Лимит на месяц</small><small>${fmt(spent)} из ${fmt(limit)}</small></div>${bar(spent/limit*100,spent>limit?'bad':'')}`
    :'';
  return `<div class="card cat">
    <div class="row"><div class="ic ${typeOf(c)}">${icon(iconOf(c),20)}</div>
      <div class="grow"><b>${esc(c)}${tag}</b><span>${n} опер., средний чек ${fmt(n?v/n:0)}</span></div>
      <div class="amt">${fmt(v)}</div></div>
    <div class="dh"><small>${Math.round(share)}% всех трат</small><small>6 месяцев</small></div>
    <div class="dh">${bar(share)}${spark(c)}</div>
    ${limitBlock}
    <div class="dh"><span></span><button class="lnk" data-a="catLimit" data-id="${esc(c)}">${limit?'Изменить лимит':'Задать лимит'}</button></div>
  </div>`;
}

export function categoriesView(){
  const now=new Date(),first=new Date(now.getFullYear(),now.getMonth(),1);
  const {a,b,pa,pb}=rangeFor(ui.cp);
  const list=EX(between(a,b)),prev=pa?EX(between(pa,pb)):[];
  const grouped=groupByCategory(list);
  const data={
    total:sum(list),
    sums:Object.fromEntries(grouped),
    old:Object.fromEntries(groupByCategory(prev)),
    counts:list.reduce((m,t)=>{m[t.c]=(m[t.c]||0)+1;return m},{}),
    monthSpent:Object.fromEntries(groupByCategory(EX(between(first,now))))
  };
  const keys=[...new Set([...grouped.map(x=>x[0]),...Object.keys(state.catLimits)])]
    .sort((x,y)=>(data.sums[y]||0)-(data.sums[x]||0));
  const tabs=PERIODS.map(([v,l])=>`<button data-a="cp" data-id="${v}" class="${ui.cp===v?'on':''}">${l}</button>`).join('');
  const top=grouped[0];
  const summary=`<div class="card"><small>Потрачено за период</small><div class="big" style="font-size:36px">${fmt(data.total)}</div>
    <small>${grouped.length?`Категорий: ${grouped.length}. Больше всего: ${esc(top[0])}, ${Math.round(top[1]/data.total*100)}%`:'За этот период трат нет'}</small></div>`;
  return `<div class="h1">Категории<div class="seg sm">${tabs}</div></div><div class="sheet">${reminders()}
    <button class="lnk" data-a="go" data-id="an" style="margin:0 0 12px 4px">${icon('back',16)}Анализ</button>
    ${summary}${keys.map(c=>card(c,data)).join('')}
  </div>`;
}
