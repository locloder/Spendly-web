import {state,save} from '../core/state.js';
import {ui} from '../core/ui.js';
import {uid,today,toast,fmt,num} from '../core/utils.js';
import {render,go} from './router.js';
import {openSettings,openJar} from './dialogs.js';
import {exportSubscription} from '../services/calendar.js';

export const actions={
  del(id){
    if(!confirm('Удалить операцию?'))return;
    state.tx=state.tx.filter(t=>t.id!==id);
    save();
    render();
  },
  delSub(id){
    if(!confirm('Удалить подписку?'))return;
    state.subs=state.subs.filter(s=>s.id!==id);
    save();
    render();
  },
  paid(id){
    const s=state.subs.find(x=>x.id===id);
    state.tx.push({id:uid(),a:s.p,inc:false,c:'Подписки',n:s.name,d:today()});
    save();
    toast('Записано: '+s.name);
  },
  ics(id){
    exportSubscription(state.subs.find(x=>x.id===id));
  },
  settings:openSettings,
  newJar:openJar,
  deposit(id){
    const jar=state.jars.find(j=>j.id===id);
    const value=num(prompt('Сколько отложить, '+state.cur+'?')||'');
    if(!(value>0))return;
    jar.saved+=value;
    save();
    render();
    toast('В копилке «'+jar.name+'»: '+fmt(jar.saved));
  },
  delJar(id){
    if(!confirm('Удалить цель? Отложенные деньги вернутся на баланс.'))return;
    state.jars=state.jars.filter(j=>j.id!==id);
    save();
    render();
  },
  per(id){ui.per=id;render()},
  cp(id){ui.cp=id;render()},
  catLimit(id){
    const current=state.catLimits[id]||'';
    const value=prompt('Лимит на месяц для «'+id+'», '+state.cur+'. Пусто или 0 убирает лимит.',current);
    if(value===null)return;
    const limit=num(value);
    if(limit>0)state.catLimits[id]=limit;
    else delete state.catLimits[id];
    save();
    render();
  },
  cm(id){ui.cm=+id;render()},
  nextIns(){ui.insight++;render()},
  go
};
