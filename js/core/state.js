const KEY='spendly';

const defaults=()=>({start:0,cur:'RUB',tx:[],subs:[],jars:[],limit:0,wage:0,memory:{},catLimits:{}});

function read(){
  try{return JSON.parse(localStorage.getItem(KEY)||'{}')}
  catch(e){return {}}
}

export const state=Object.assign(defaults(),read());

export function save(){
  try{
    localStorage.setItem(KEY,JSON.stringify(state));
    return true;
  }catch(e){
    return false;
  }
}

export function replaceState(data){
  Object.keys(state).forEach(k=>delete state[k]);
  Object.assign(state,defaults(),data);
  save();
}
