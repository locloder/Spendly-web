import {$,$$,num} from './core/utils.js';
import {state} from './core/state.js';
import {render,go} from './ui/router.js';
import {actions} from './ui/actions.js';
import {initDialogs} from './ui/dialogs.js';
import {mountIcons} from './ui/icons.js';
import {installHomeIcon} from './ui/homeicon.js';
import {handleQuickAdd} from './services/quickadd.js';

function initWorthInput(){
  $('#app').oninput=e=>{
    if(e.target.id!=='wp')return;
    const price=num(e.target.value),hours=price/state.wage,out=$('#worth');
    if(!state.wage){
      out.textContent='Укажите свой заработок в час в настройках';
    }else if(price>0){
      const days=hours>=8?', это '+(hours/8).toFixed(1).replace('.',',')+' рабочих дней':'';
      out.textContent='≈ '+hours.toFixed(1).replace('.',',')+' ч работы'+days;
    }else{
      out.textContent='';
    }
  };
}

function initClicks(){
  $('#app').onclick=e=>{
    const b=e.target.closest('[data-a]');
    if(b&&actions[b.dataset.a])actions[b.dataset.a](b.dataset.id);
  };
  $$('.tab').forEach(b=>{b.onclick=()=>go(b.dataset.v)});
}

function registerWorker(){
  if('serviceWorker' in navigator&&location.protocol.startsWith('http')){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
}

mountIcons();
initClicks();
initWorthInput();
initDialogs();
handleQuickAdd();
installHomeIcon();
registerWorker();
render();
