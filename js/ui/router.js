import {ui} from '../core/ui.js';
import {$,$$} from '../core/utils.js';
import {homeView} from '../views/home.js';
import {historyView} from '../views/history.js';
import {analysisView} from '../views/analysis.js';
import {subsView} from '../views/subs.js';
import {categoriesView} from '../views/categories.js';

const views={home:homeView,hist:historyView,an:analysisView,subs:subsView,cats:categoriesView};

export function render(){
  $$('.tab').forEach(b=>b.classList.toggle('on',b.dataset.v===(ui.view==='cats'?'an':ui.view)));
  document.body.dataset.v=ui.view;
  $('#app').innerHTML=views[ui.view]();
}

export function go(view){
  ui.view=view;
  render();
  scrollTo(0,0);
}
