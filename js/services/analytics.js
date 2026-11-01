import {state} from '../core/state.js';
import {ui} from '../core/ui.js';
import {ds,addD,fmt,esc} from '../core/utils.js';
import {typeOf} from '../data/categories.js';

export const EX=l=>l.filter(t=>!t.inc);
export const IN=l=>l.filter(t=>t.inc);
export const sum=l=>l.reduce((x,t)=>x+t.a,0);
export const between=(a,b)=>state.tx.filter(t=>t.d>=ds(a)&&t.d<=ds(b));
export const byDate=()=>[...state.tx].sort((a,b)=>b.d.localeCompare(a.d)||b.id.localeCompare(a.id));

export function groupByCategory(list){
  const map={};
  list.forEach(t=>{map[t.c]=(map[t.c]||0)+t.a});
  return Object.entries(map).sort((a,b)=>b[1]-a[1]);
}

export function balance(){
  const flow=state.tx.reduce((a,t)=>a+(t.inc?t.a:-t.a),0);
  const saved=state.jars.reduce((a,j)=>a+j.saved,0);
  return state.start+flow-saved;
}

export function rangeFor(p){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth();
  if(p==='w')return{a:addD(now,-6),b:now,pa:addD(now,-13),pb:addD(now,-7)};
  if(p==='y')return{a:new Date(y,0,1),b:now,pa:new Date(y-1,0,1),pb:new Date(y-1,m,now.getDate())};
  if(p==='all'){
    const dates=state.tx.map(t=>t.d).sort();
    return{a:dates.length?new Date(dates[0]+'T00:00'):now,b:now,pa:null,pb:null};
  }
  const prevDays=new Date(y,m,0).getDate();
  return{a:new Date(y,m,1),b:now,pa:new Date(y,m-1,1),pb:new Date(y,m-1,Math.min(now.getDate(),prevDays))};
}

export const period=()=>rangeFor(ui.per);

export function monthlySeries(category,count=6){
  const now=new Date();
  return Array.from({length:count},(_,i)=>{
    const key=ds(new Date(now.getFullYear(),now.getMonth()-(count-1-i),1)).slice(0,7);
    return sum(state.tx.filter(t=>!t.inc&&t.c===category&&t.d.slice(0,7)===key));
  });
}

export function overLimits(){
  const now=new Date(),first=new Date(now.getFullYear(),now.getMonth(),1);
  const spent=Object.fromEntries(groupByCategory(EX(between(first,now))));
  return Object.entries(state.catLimits)
    .filter(([c,limit])=>limit>0&&(spent[c]||0)>limit)
    .map(([c,limit])=>({c,over:spent[c]-limit}));
}

export function health(a,b){
  const all=between(a,b),list=EX(all),total=sum(list),parts={e:0,d:0,i:0};
  list.forEach(t=>{parts[typeOf(t.c)]+=t.a});
  const pct=k=>total?Math.round(parts[k]/total*100):0;
  const span=Math.floor((Math.min(b,Date.now())-a)/864e5)+1;
  const logged=new Set(all.map(t=>t.d)).size;
  const income=sum(IN(all));
  let score=null;
  if(total){
    score=10-pct('i')/6-(logged/span<.5?1:0)-(income&&total>income?2:0);
    score=Math.max(1,Math.min(10,Math.round(score)));
  }
  return{tot:total,e:pct('e'),d:pct('d'),i:pct('i'),s:score,logged,span};
}

export function dayScore(date){
  const list=EX(between(date,date)),total=sum(list);
  if(!total)return null;
  const impulse=sum(list.filter(t=>typeOf(t.c)==='i'));
  return Math.max(1,Math.min(10,Math.round(10-impulse/total*100/6)));
}

export function streak(){
  const days=new Set(state.tx.map(t=>t.d));
  let d=new Date();
  if(!days.has(ds(d)))d=addD(d,-1);
  let n=0;
  while(days.has(ds(d))){n++;d=addD(d,-1)}
  return n;
}

export function recurring(){
  const months={};
  state.tx.filter(t=>!t.inc&&t.n).forEach(t=>{
    const key=t.n.toLowerCase().trim();
    (months[key]=months[key]||new Set()).add(t.d.slice(0,7));
  });
  return Object.entries(months).filter(([,s])=>s.size>=2).map(([k])=>k);
}

export function insights(){
  const now=new Date(),out=[];
  const week=EX(between(addD(now,-6),now)),prev=EX(between(addD(now,-13),addD(now,-7)));
  const repeats={};
  week.forEach(t=>{
    const key=(t.n||t.c).toLowerCase().trim();
    (repeats[key]=repeats[key]||[]).push(t.a);
  });
  Object.entries(repeats).filter(([,v])=>v.length>=3).forEach(([k,v])=>{
    out.push(`«${esc(k)}»: ${v.length} раз за неделю, в среднем ${fmt(v.reduce((a,x)=>a+x,0)/v.length)}.`);
  });
  const top=groupByCategory(week);
  if(top.length)out.push(`Больше всего за неделю ушло на «${top[0][0]}»: ${Math.round(top[0][1]/sum(week)*100)}% трат.`);
  if(sum(week)&&sum(prev)){
    const p=Math.round((sum(week)/sum(prev)-1)*100);
    out.push(p>=0?`Траты за неделю выросли на ${p}% по сравнению с прошлой.`:`Траты за неделю снизились на ${-p}% по сравнению с прошлой.`);
  }
  const impulse=week.filter(t=>typeOf(t.c)==='i');
  if(impulse.length)out.push(`Импульсных покупок за неделю: ${impulse.length} на ${fmt(sum(impulse))}.`);
  const rec=recurring();
  if(rec.length)out.push(`Повторяется каждый месяц: ${rec.slice(0,3).map(esc).join(', ')}.`);
  const month=EX(between(new Date(now.getFullYear(),now.getMonth(),1),now));
  const big=[...month].sort((x,y)=>y.a-x.a)[0];
  if(big)out.push(`Самая крупная трата месяца: ${esc(big.n||big.c)}, ${fmt(big.a)}.`);
  return out;
}

export function weeklyGoals(){
  const now=new Date(),week=between(addD(now,-6),now),spent=EX(week);
  const total=sum(spent),days=new Set(week.map(t=>t.d)).size;
  const impulse=spent.filter(t=>typeOf(t.c)==='i').length;
  const limit=state.limit
    ?{title:`Уложиться в ${fmt(state.limit)}`,value:fmt(total),p:total/state.limit,bad:total>state.limit}
    :{title:'Лимит расходов на неделю',value:'Задать',p:0,action:'settings'};
  return[
    limit,
    {title:'Записывать траты каждый день',value:days+' из 7',p:days/7,ok:days===7},
    {title:'Не больше двух импульсных покупок',value:impulse+' из 2',p:impulse/2,bad:impulse>2}
  ];
}

export function forecast(){
  const now=new Date(),y=now.getFullYear(),m=now.getMonth();
  const dim=new Date(y,m+1,0).getDate(),day=now.getDate();
  const monthTx=between(new Date(y,m,1),now);
  const list=EX(monthTx);
  let acc=0;
  const cum=Array.from({length:day},(_,i)=>acc+=sum(list.filter(t=>+t.d.slice(8)===i+1)));
  const spent=cum[day-1]||0,avg=spent/day;
  return{
    dim,day,cum,spent,avg,
    projected:avg*dim,
    income:sum(IN(monthTx)),
    runway:avg>0?Math.floor(balance()/avg):null
  };
}

export function nextDate(sub){
  const n=new Date(),t=new Date(n.getFullYear(),n.getMonth(),n.getDate());
  let d=new Date(n.getFullYear(),n.getMonth(),sub.day);
  if(d<t)d=new Date(n.getFullYear(),n.getMonth()+1,sub.day);
  return d;
}

export function daysTo(sub){
  const n=new Date();
  return Math.round((nextDate(sub)-new Date(n.getFullYear(),n.getMonth(),n.getDate()))/864e5);
}
