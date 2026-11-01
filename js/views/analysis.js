import {state} from '../core/state.js';
import {ui} from '../core/ui.js';
import {esc,fmt,fd,ds,addD,today} from '../core/utils.js';
import {between,EX,IN,sum,period,health,dayScore,groupByCategory,recurring,forecast} from '../services/analytics.js';
import {typeOf} from '../data/categories.js';
import {icon} from '../ui/icons.js';
import {row,bar,score} from '../ui/components.js';
import {reminders} from './subs.js';

function dayList(a,b){
  const end=ui.per==='w'?b:new Date(b.getFullYear(),b.getMonth()+1,0),days=[];
  for(let d=new Date(a.getFullYear(),a.getMonth(),a.getDate());ds(d)<=ds(end);d=addD(d,1))days.push(ds(d));
  return days;
}

function totalCard(es,is){
  const net=is-es;
  return `<div class="card">
    <div class="dh"><small>Итого за период</small><b class="${net>=0?'pos':'neg'}">${net>=0?'+':'−'}${fmt(Math.abs(net))}</b></div>
    <small>${is?`Потрачено ${Math.round(es/is*100)}% от дохода`:'Доходов за период нет'}</small>
    <div class="dh" style="margin-top:10px"><span>−${fmt(es)}</span><span class="pos">+${fmt(is)}</span></div>
    ${bar(is?es/is*100:es?100:0)}
  </div>`;
}

function dayChart(list,days,es){
  const values=days.map(d=>sum(list.filter(t=>t.d===d))),max=Math.max(...values,1),now=today();
  const passed=Math.max(1,days.filter(d=>d<=now).length);
  const cols=days.map((d,i)=>`<div class="col ${d>now?'fu':''}" title="${fd(d)}: ${fmt(values[i])}"><i style="height:${values[i]/max*100}%"></i></div>`).join('');
  return `<div class="card">
    <div class="dh"><b>По дням</b><small>В среднем ${fmt(es/passed)} в день</small></div>
    <div class="chart">${cols}</div>
    <div class="dh"><small>${fd(days[0])}</small><small>${fd(days[days.length-1])}</small></div>
  </div>`;
}

function healthCard(a,b,pa,pb,es,prevExpenses){
  const h=health(a,b),ph=health(pa,pb),why=[];
  if(h.tot&&ph.tot&&h.i!==ph.i)why.push([h.i<ph.i,`Импульсные траты: ${h.i}% (было ${ph.i}%)`]);
  if(h.tot&&prevExpenses){
    const p=Math.round((es/prevExpenses-1)*100);
    if(p)why.push([p<0,`Траты ${p>0?'выросли':'снизились'} на ${Math.abs(p)}% к прошлому периоду`]);
  }
  why.push([h.logged>=h.span*.7,`Траты записаны ${h.logged} из ${h.span} дн.`]);
  return `<div class="card">
    <div class="dh"><b>Фин. здоровье</b>${score(h.s)}</div>${bar((h.s||0)*10,'g')}
    <div class="tri">
      <div><b>${h.e}%</b><small>Необходимое</small></div>
      <div><b>${h.d}%</b><small>Осознанное</small></div>
      <div><b>${h.i}%</b><small>Импульсное</small></div>
    </div>
    <ul class="why">${why.map(([good,text])=>`<li class="${good?'good':'bad'}">${text}</li>`).join('')}</ul>
  </div>`;
}

function weekCard(){
  const cells=[...Array(7)].map((_,i)=>{
    const d=addD(new Date(),i-6),s=dayScore(d);
    const tone=s==null?'':s>=7?'g':s>=4?'y':'r';
    return `<div class="cell ${tone}">${s??'–'}<small>${d.toLocaleDateString('ru-RU',{weekday:'short'})}</small></div>`;
  }).join('');
  return `<div class="card"><b>Эта неделя</b><div class="trend">${cells}</div></div>`;
}

function categoryCard(list,prevList){
  const cur=groupByCategory(list),all=sum(list)||1,prev=Object.fromEntries(groupByCategory(prevList)),max=cur.length?cur[0][1]:1;
  const rows=cur.map(([c,v])=>{
    const p=prev[c],delta=p?Math.round((v/p-1)*100):null;
    const bad=(delta>0)!==!!ui.cm;
    const tag=delta!=null&&Math.abs(delta)>=10?`<span class="dl ${bad?'up':'dn'}">${delta>0?'+':''}${delta}%</span>`:'';
    return `<div style="margin-top:12px">
      <div class="row" style="border:0;padding:0"><span>${c}${tag}</span><span class="grow"></span><span class="amt">${fmt(v)} <small style="display:inline">${Math.round(v/all*100)}%</small></span></div>
      ${bar(v/max*100)}
    </div>`;
  }).join('');
  const tabs=[['0','Расходы'],['1','Доходы']].map(([v,l])=>`<button data-a="cm" data-id="${v}" class="${+v===ui.cm?'on':''}">${l}</button>`).join('');
  return `<div class="card"><div class="dh"><b>По категориям</b><div class="seg sm">${tabs}</div></div>
    <div class="dh" style="margin-top:8px"><small>Доли и сравнение с прошлым периодом</small><a data-a="go" data-id="cats">Подробнее</a></div>
    ${rows||'<div class="empty">За этот период данных нет.</div>'}</div>`;
}

function forecastCard(){
  const f=forecast(),W=300,H=110,max=Math.max(f.projected,f.spent,f.income,1)*1.1;
  const x=i=>(i/(f.dim-1)*W).toFixed(1),y=v=>(H-v/max*H).toFixed(1);
  const line=f.cum.map((v,i)=>`${i?'L':'M'}${x(i)} ${y(v)}`).join(' ');
  const last=f.day-1;
  const proj=`M${x(last)} ${y(f.spent)} L${x(f.dim-1)} ${y(f.projected)}`;
  const limit=f.income?`<line class="l" x1="0" x2="${W}" y1="${y(f.income)}" y2="${y(f.income)}"/>`:'';
  let verdict='Пока мало данных для прогноза.';
  if(f.spent){
    const diff=f.income-f.projected;
    verdict=f.income?(diff>=0?`К концу месяца останется около ${fmt(diff)} от дохода.`:`При таком темпе вы выйдете за доход на ${fmt(-diff)}.`):'Добавьте доход за месяц, чтобы увидеть остаток.';
  }
  const runway=f.runway!=null&&f.runway>=0?`Баланса хватит примерно на ${f.runway} дн. при текущем темпе.`:'';
  return `<div class="card">
    <div class="dh"><b>Прогноз месяца</b><span class="amt">${fmt(f.projected)}</span></div>
    <small>${verdict} ${runway}</small>
    <svg class="fc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Накопленные расходы за месяц и прогноз">
      <line class="g" x1="0" x2="${W}" y1="${H}" y2="${H}"/>${limit}
      <path class="p" d="${proj}"/><path class="a" d="${line}"/>
      <circle cx="${x(last)}" cy="${y(f.spent)}" r="3.5"/>
    </svg>
    <div class="dh"><small>1</small><small>${f.dim}</small></div>
  </div>`;
}

function impulseCard(list){
  const impulse=list.filter(t=>typeOf(t.c)==='i');
  if(!impulse.length)return '';
  const last=[...impulse].sort((x,y)=>y.d.localeCompare(x.d)).slice(0,5);
  return `<div class="card"><div class="dh"><b>Импульсные покупки</b><span class="amt">${fmt(sum(impulse))}</span></div>${last.map(row).join('')}</div>`;
}

function regularCard(){
  const subs=state.subs.reduce((x,s)=>x+s.p,0),rec=recurring();
  if(!subs&&!rec.length)return '';
  const subRow=subs?`<div class="row"><div class="ic d">${icon('repeat',20)}</div><div class="grow"><b>Подписки</b><span>${state.subs.length} шт.</span></div><div class="amt">${fmt(subs)}</div></div>`:'';
  const names=rec.length?`<small style="margin-top:8px">Повторяются каждый месяц: ${rec.slice(0,6).map(esc).join(', ')}</small>`:'';
  return `<div class="card"><b>Регулярные платежи</b>${subRow}${names}</div>`;
}

export function analysisView(){
  const {a,b,pa,pb}=period();
  const all=between(a,b),prev=between(pa,pb);
  const E=EX(all),I=IN(all),pE=EX(prev),es=sum(E),is=sum(I);
  const tabs=[['w','Неделя'],['m','Месяц']].map(([v,l])=>`<button data-a="per" data-id="${v}" class="${ui.per===v?'on':''}">${l}</button>`).join('');
  return `<div class="h1">Анализ<div class="seg sm">${tabs}</div></div><div class="sheet">${reminders()}
    ${totalCard(es,is)}
    ${dayChart(E,dayList(a,b),es)}
    ${ui.per==='m'?forecastCard():''}
    ${healthCard(a,b,pa,pb,es,sum(pE))}
    ${weekCard()}
    ${categoryCard(ui.cm?I:E,ui.cm?IN(prev):pE)}
    ${impulseCard(E)}
    ${regularCard()}
  </div>`;
}
