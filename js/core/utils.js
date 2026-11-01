import {state} from './state.js';

export const $=s=>document.querySelector(s);
export const $$=s=>[...document.querySelectorAll(s)];

export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const fmt=n=>new Intl.NumberFormat('ru-RU',{style:'currency',currency:state.cur}).format(n);
export const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
export const num=s=>parseFloat(String(s).replace(/\s/g,'').replace(',','.'));

export const ds=d=>new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
export const today=()=>ds(new Date());
export const addD=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n);
export const fd=s=>new Date(s+'T00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});

export const amounts=(t,decimalsOnly)=>{
  t=t.replace(/(\d) (\d{3})(?=[.,]\d{2}\b)/g,'$1$2').replace(/,/g,'.');
  const re=decimalsOnly?/\d+\.\d{2}\b/g:/\d+(?:\.\d{1,2})?/g;
  return (t.match(re)||[]).map(Number);
};

let timer;
export function toast(message){
  const el=$('#toast');
  el.textContent=message;
  el.classList.add('on');
  clearTimeout(timer);
  timer=setTimeout(()=>el.classList.remove('on'),3500);
}

export function download(blob,name){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=name;
  document.body.append(a);
  a.click();
  a.remove();
}
