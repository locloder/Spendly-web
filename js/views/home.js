import {state} from '../core/state.js';
import {ui} from '../core/ui.js';
import {esc,fmt} from '../core/utils.js';
import {between,EX,sum,balance,health,streak,insights,weeklyGoals,byDate} from '../services/analytics.js';
import {icon} from '../ui/icons.js';
import {row,bar,score,ring,emptyText} from '../ui/components.js';
import {reminders} from './subs.js';

function goalsCard(){
  const items=weeklyGoals().map(g=>`<div class="goal" ${g.action?`data-a="${g.action}"`:''}>
    <div class="dh"><span>${g.title}</span><span>${g.value}</span></div>
    ${bar(g.p*100,g.bad?'bad':g.ok?'g':'')}
  </div>`).join('');
  return `<div class="card"><b>Цели на неделю</b>${items}</div>`;
}

function jarsCard(){
  const items=state.jars.map(j=>`<div class="row">
    <div class="ringbox">${ring(j.saved/j.target)}</div>
    <div class="grow"><b>${esc(j.name)}</b><span>${fmt(j.saved)} из ${fmt(j.target)}</span></div>
    <button class="mini" data-a="deposit" data-id="${j.id}">Пополнить</button>
    <button class="x" data-a="delJar" data-id="${j.id}" aria-label="Удалить">${icon('x',16)}</button>
  </div>`).join('');
  return `<div class="card"><div class="dh"><b>Копилка</b><button class="lnk" data-a="newJar">${icon('plus',16)}Цель</button></div>
    ${items||'<div class="empty">Создайте цель и откладывайте деньги: они вычтутся из баланса.</div>'}</div>`;
}

function worthCard(){
  return `<div class="card"><b>Стоит ли оно того?</b><small>Сколько часов работы стоит покупка</small>
    <label for="wp">Цена</label><input id="wp" inputmode="decimal" placeholder="0">
    <div id="worth">${state.wage?'':'Укажите свой заработок в час в настройках'}</div></div>`;
}

export function homeView(){
  const now=new Date(),first=new Date(now.getFullYear(),now.getMonth(),1);
  const spent=sum(EX(between(first,now)));
  const bal=balance();
  const left=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()-now.getDate()+1;
  const h=health(first,now);
  const tips=insights();
  const month=now.toLocaleDateString('ru-RU',{month:'long'});
  const tip=tips.length?tips[ui.insight%tips.length]:'Добавьте несколько трат, и здесь появятся наблюдения о ваших расходах.';
  const recent=state.tx.length?byDate().slice(0,5).map(row).join(''):`<div class="empty">${emptyText}</div>`;

  return `<div class="top">
    <div class="trow">
      <button class="pill" data-a="settings">${icon('sliders',16)}${month}</button>
      <span class="pill">${icon('flame',16)}${streak()}</span>
    </div>
    <small>Расходы за месяц</small>
    <div class="big">${fmt(spent)}</div>
    <small>В среднем ${fmt(spent/now.getDate())} в день</small>
    <div class="tiles">
      <div class="glass"><small>Баланс</small><b>${fmt(bal)}</b></div>
      <div class="glass"><small>Доступно в день</small><b>${fmt(bal>0?bal/left:0)}</b></div>
    </div>
  </div>
  <div class="sheet">${reminders()}
    <div class="card ins" data-a="nextIns"><small>${icon('spark',16)}Наблюдение дня</small><p>${tip}</p></div>
    <div class="card" data-a="go" data-id="an" style="cursor:pointer"><div class="dh"><b>Фин. здоровье</b>${score(h.s)}</div>${bar((h.s||0)*10,'g')}</div>
    ${goalsCard()}
    ${jarsCard()}
    ${worthCard()}
    <div class="card"><div class="dh"><b>Последние операции</b><a data-a="go" data-id="hist">Вся история</a></div>${recent}</div>
  </div>`;
}
