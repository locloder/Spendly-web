import {toast,$} from '../core/utils.js';

const Engine=window.SpeechRecognition||window.webkitSpeechRecognition;
const MAX_LISTEN=20000;
const START_WAIT=2500;

let engine=null,active=false,started=false,handler=null,limitTimer=0,startTimer=0;

function setActive(value){
  active=value;
  $('#mic').classList.toggle('rec',value);
  clearTimeout(limitTimer);
  if(value)limitTimer=setTimeout(stopVoice,MAX_LISTEN);
  else clearTimeout(startTimer);
}

function create(){
  const e=new Engine();
  e.lang='ru-RU';
  e.interimResults=true;
  e.continuous=false;
  e.maxAlternatives=1;
  e.onstart=()=>{started=true};
  e.onresult=ev=>{if(handler)handler([...ev.results].map(r=>r[0].transcript).join(' '))};
  e.onerror=ev=>{
    setActive(false);
    if(ev.error==='not-allowed'||ev.error==='service-not-allowed'){
      engine=null;
      toast('Разрешите микрофон и распознавание речи в настройках браузера');
    }else if(ev.error!=='aborted'){
      toast('Не расслышал, попробуйте ещё раз');
    }
  };
  e.onend=()=>setActive(false);
  return e;
}

export function stopVoice(){
  if(!engine)return;
  setActive(false);
  try{engine.abort()}catch(e){engine=null}
}

function begin(){
  started=false;
  engine.start();
  setActive(true);
  startTimer=setTimeout(()=>{
    if(active&&!started){
      stopVoice();
      engine=null;
      toast('Микрофон не ответил. Нажмите ещё раз');
    }
  },START_WAIT);
}

export function listen(onText){
  if(!Engine)return toast('Голосовой ввод здесь не поддерживается. Откройте сайт в Safari или Chrome');
  handler=onText;
  if(active)return stopVoice();
  if(!engine)engine=create();
  try{
    begin();
  }catch(e){
    engine=create();
    setTimeout(()=>{
      try{begin()}
      catch(err){setActive(false);engine=null;toast('Микрофон занят. Нажмите ещё раз')}
    },250);
  }
}
