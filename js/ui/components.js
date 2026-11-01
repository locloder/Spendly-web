import {esc,fmt,fd} from '../core/utils.js';
import {iconOf,typeOf} from '../data/categories.js';
import {icon} from './icons.js';

export const emptyText='Пока пусто. Нажмите +, скажите «кофе 150» или сфотографируйте чек.';

export function row(t){
  return `<div class="row">
    <div class="ic ${typeOf(t.c)}">${icon(iconOf(t.c),20)}</div>
    <div class="grow"><b>${esc(t.n||t.c)}</b><span>${esc(t.c)}, ${fd(t.d)}</span></div>
    <div class="amt ${t.inc?'pos':''}">${t.inc?'+':'−'}${fmt(t.a)}</div>
    <button class="x" data-a="del" data-id="${t.id}" aria-label="Удалить">${icon('x',16)}</button>
  </div>`;
}

export function bar(percent,tone=''){
  return `<div class="bar ${tone}"><i style="width:${Math.min(100,Math.max(0,percent))}%"></i></div>`;
}

export function score(value){
  return `<span class="score">${value??'–'}<small>/10</small></span>`;
}

export function ring(p){
  return `<svg viewBox="0 0 36 36" width="46" height="46"><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--bg)" stroke-width="4"/><circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--pos)" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="${Math.min(100,p*100)} 100" transform="rotate(-90 18 18)"/></svg>`;
}
