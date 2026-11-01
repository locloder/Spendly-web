import {amounts,toast} from '../core/utils.js';

const TESSERACT='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';

function loadEngine(){
  return new Promise((ok,fail)=>{
    if(window.Tesseract)return ok();
    const s=document.createElement('script');
    s.src=TESSERACT;
    s.onload=ok;
    s.onerror=fail;
    document.head.append(s);
  });
}

async function toCanvas(file){
  const bmp=await createImageBitmap(file);
  const k=Math.min(1,1800/Math.max(bmp.width,bmp.height));
  const canvas=document.createElement('canvas');
  canvas.width=bmp.width*k;
  canvas.height=bmp.height*k;
  canvas.getContext('2d').drawImage(bmp,0,0,canvas.width,canvas.height);
  return canvas;
}

export function parseReceipt(text){
  const lines=text.split('\n').map(s=>s.trim()).filter(Boolean);
  let total;
  lines.forEach((line,i)=>{
    if(/итого|итог|к оплате|total|celkem|k úhradě|suma|amount due/i.test(line)){
      const found=amounts(line,true).concat(amounts(lines[i+1]||'',true));
      if(found.length)total=found[0];
    }
  });
  if(total==null){
    const all=lines.flatMap(l=>amounts(l,true));
    if(all.length)total=Math.max(...all);
  }
  const note=lines.find(l=>l.length>2&&!/^[\d\W]+$/.test(l))||'Чек';
  return{total,note,text};
}

export async function readReceipt(file){
  toast('Читаю чек, это может занять до минуты…');
  try{
    await loadEngine();
    const canvas=await toCanvas(file);
    const {data}=await window.Tesseract.recognize(canvas,'rus+eng');
    return parseReceipt(data.text);
  }catch(e){
    toast('Не получилось прочитать чек. Введите сумму вручную');
    return null;
  }
}
