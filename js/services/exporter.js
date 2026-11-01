import {state} from '../core/state.js';
import {download} from '../core/utils.js';

const cell=v=>'"'+String(v??'').replace(/"/g,'""')+'"';

export function exportCsv(){
  const head=['Дата','Тип','Категория','Сумма','Заметка'];
  const rows=[...state.tx]
    .sort((a,b)=>a.d.localeCompare(b.d))
    .map(t=>[t.d,t.inc?'Доход':'Расход',t.c,t.a,t.n||'']);
  const text=[head,...rows].map(r=>r.map(cell).join(';')).join('\n');
  download(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}),'spendly.csv');
}

export function exportJson(){
  download(new Blob([JSON.stringify(state)],{type:'application/json'}),'spendly-backup.json');
}
