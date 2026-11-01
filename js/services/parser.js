const UNITS={ноль:0,один:1,одна:1,одну:1,два:2,две:2,три:3,четыре:4,пять:5,шесть:6,семь:7,восемь:8,девять:9,десять:10,одиннадцать:11,двенадцать:12,тринадцать:13,четырнадцать:14,пятнадцать:15,шестнадцать:16,семнадцать:17,восемнадцать:18,девятнадцать:19};
const TENS={двадцать:20,тридцать:30,сорок:40,пятьдесят:50,шестьдесят:60,семьдесят:70,восемьдесят:80,девяносто:90};
const HUNDREDS={сто:100,двести:200,триста:300,четыреста:400,пятьсот:500,шестьсот:600,семьсот:700,восемьсот:800,девятьсот:900};

const DROP=new Set('руб рублей рубля рубль р rub долл доллар долларов доллара usd евро eur крон кроны крона czk грн тенге по потратил потратила купил купила купили заплатил заплатила оплатил оплатила взял взяла за на было итого всего примерно около получил получила пришло'.split(' '));

const INCOME=/получил|зарплат|стипенди|аванс|прем[иь]|доход|кэшбэк|кешбек|фриланс|заработал|продал|вернули|перевели|поступил|salary|income|bonus|refund/;

export const norm=s=>String(s).toLowerCase().replace(/ё/g,'е')
  .replace(/(\d)\s(?=\d{3}(?!\d))/g,'$1')
  .replace(/(\d),(?=\d)/g,'$1.')
  .replace(/(\d)(?=[^\d\s.,])/g,'$1 ')
  .replace(/([^\d\s.,])(?=\d)/g,'$1 ')
  .replace(/[^\p{L}\d.\s]/gu,' ')
  .replace(/\s+/g,' ')
  .trim();

export const tokens=text=>norm(text).split(' ').map(w=>w.replace(/^\.+|\.+$/g,'')).filter(Boolean);

function scaleOf(w){
  if(!w)return 0;
  if(/^(тысяч|тыс$)/.test(w)||w==='к'||w==='k')return 1e3;
  if(/^(миллион|млн)/.test(w))return 1e6;
  return 0;
}

const wordValue=w=>w in UNITS?UNITS[w]:w in TENS?TENS[w]:w in HUNDREDS?HUNDREDS[w]:null;

export function parseAmount(text){
  const t=tokens(text),runs=[];
  let total=0,cur=0,active=false,digits=false;
  const flush=()=>{
    if(active)runs.push({v:total+cur,digits});
    total=0;cur=0;active=false;digits=false;
  };
  for(let i=0;i<t.length;i++){
    const w=t[i];
    if(/^\d+(\.\d+)?$/.test(w)){
      const v=parseFloat(w),mult=scaleOf(t[i+1]);
      if(active&&total>0&&!cur&&v<1000&&!mult){cur=v;digits=true;continue}
      flush();
      if(mult){total=v*mult;i++}else cur=v;
      active=true;digits=true;
      continue;
    }
    const word=wordValue(w);
    if(word!=null){cur+=word;active=true;continue}
    const mult=scaleOf(w);
    if(mult&&active){total+=(cur||1)*mult;cur=0;continue}
    if(mult>=1e3&&/^(тысяч|миллион)/.test(w)){total+=mult;active=true;continue}
    flush();
  }
  flush();
  const withDigits=runs.filter(r=>r.digits),pool=withDigits.length?withDigits:runs.filter(r=>r.v>1);
  return pool.length?Math.max(...pool.map(r=>r.v)):undefined;
}

export function cleanNote(text){
  const words=tokens(text).filter(w=>!/^\d/.test(w)&&wordValue(w)==null&&!scaleOf(w)&&!DROP.has(w));
  const out=words.join(' ');
  return out?out[0].toUpperCase()+out.slice(1):'';
}

export const isIncome=text=>INCOME.test(norm(text));
