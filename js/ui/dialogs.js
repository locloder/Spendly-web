import {state,save,replaceState} from '../core/state.js';
import {$,fmt,toast,uid,today,num} from '../core/utils.js';
import {ui} from '../core/ui.js';
import {names} from '../data/categories.js';
import {guess,learn} from '../services/classifier.js';
import {parseAmount,cleanNote,isIncome} from '../services/parser.js';
import {render} from './router.js';
import {listen,stopVoice} from '../services/voice.js';
import {readReceipt} from '../services/receipt.js';
import {exportCsv,exportJson} from '../services/exporter.js';

let kind=0;

function setKind(value){
  kind=value;
  [...$('#kind').children].forEach(b=>b.classList.toggle('on',+b.dataset.k===value));
}

function fillFromText(text){
  $('#heard').textContent='«'+text+'»';
  const amount=parseAmount(text),income=isIncome(text);
  if(amount)$('#a').value=amount;
  setKind(income?1:0);
  $('#c').value=income?'Другое':guess(text);
  $('#n').value=cleanNote(text);
}

export function openAdd(){
  setKind(0);
  $('#a').value='';
  $('#c').value='Другое';
  $('#n').value='';
  $('#d').value=today();
  $('#heard').textContent='';
  $('#add').showModal();
}

export function openSub(){
  ['sn','sp'].forEach(id=>{$('#'+id).value=''});
  $('#sub').showModal();
}

export function openJar(){
  ['jn','jt'].forEach(id=>{$('#'+id).value=''});
  $('#jar').showModal();
}

export function openSettings(){
  $('#st').value=state.start;
  $('#cu').value=state.cur;
  $('#gl').value=state.limit||'';
  $('#wg').value=state.wage||'';
  $('#set').showModal();
}

function initAdd(){
  $('#c').innerHTML=names.map(c=>`<option>${c}</option>`).join('');
  $('#kind').onclick=e=>{
    const b=e.target.closest('[data-k]');
    if(b)setKind(+b.dataset.k);
  };
  $('#fab').onclick=()=>ui.view==='subs'?openSub():openAdd();
  $('#cancel').onclick=()=>$('#add').close();
  $('#save').onclick=()=>{
    const amount=num($('#a').value);
    if(!(amount>0))return toast('Введите сумму больше нуля');
    const category=$('#c').value,note=$('#n').value.trim();
    state.tx.push({id:uid(),a:amount,inc:!!kind,c:category,n:note,d:$('#d').value||today()});
    learn(note,category);
    save();
    $('#add').close();
    render();
    toast('Сохранено');
  };
  $('#mic').onclick=()=>listen(fillFromText);
  $('#add').addEventListener('close',stopVoice);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice()});
  $('#photo').onchange=async e=>{
    const file=e.target.files[0];
    e.target.value='';
    if(!file)return;
    const result=await readReceipt(file);
    if(!result)return;
    setKind(0);
    if(result.total!=null)$('#a').value=result.total;
    $('#c').value=guess(result.text);
    $('#n').value=result.note;
    toast(result.total!=null?'Проверьте сумму: '+fmt(result.total):'Сумму найти не удалось, введите вручную');
  };
}

function initSubs(){
  $('#sCancel').onclick=()=>$('#sub').close();
  $('#sSave').onclick=()=>{
    const price=num($('#sp').value),name=$('#sn').value.trim();
    const day=Math.min(28,Math.max(1,+$('#sd').value||1));
    if(!name||!(price>0))return toast('Укажите название и цену');
    state.subs.push({id:uid(),name,p:price,day,rem:+$('#sr').value});
    save();
    $('#sub').close();
    render();
    toast('Добавлено. Нажмите «В календарь», чтобы получать напоминания');
  };
}

function initJars(){
  $('#jCancel').onclick=()=>$('#jar').close();
  $('#jSave').onclick=()=>{
    const name=$('#jn').value.trim(),target=num($('#jt').value);
    if(!name||!(target>0))return toast('Укажите название и сумму');
    state.jars.push({id:uid(),name,target,saved:0});
    save();
    $('#jar').close();
    render();
  };
}

function initSettings(){
  $('#setSave').onclick=()=>{
    state.start=num($('#st').value)||0;
    state.cur=$('#cu').value;
    state.limit=num($('#gl').value)||0;
    state.wage=num($('#wg').value)||0;
    save();
    $('#set').close();
    render();
  };
  $('#exp').onclick=exportJson;
  $('#csv').onclick=exportCsv;
  $('#imp').onchange=async e=>{
    try{
      replaceState(JSON.parse(await e.target.files[0].text()));
      $('#set').close();
      render();
      toast('Данные загружены');
    }catch(err){
      toast('Файл не подошёл');
    }
  };
}

export function initDialogs(){
  initAdd();
  initSubs();
  initJars();
  initSettings();
}
