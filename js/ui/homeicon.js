export function installHomeIcon(){
  const size=180,canvas=document.createElement('canvas');
  canvas.width=canvas.height=size;
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const g=ctx.createLinearGradient(0,0,0,size);
  g.addColorStop(0,'#1B47E0');
  g.addColorStop(1,'#0A1C78');
  ctx.fillStyle=g;
  ctx.fillRect(0,0,size,size);
  ctx.strokeStyle='#fff';
  ctx.lineWidth=16;
  ctx.lineCap='round';
  ctx.beginPath();
  ctx.moveTo(118,62);
  ctx.bezierCurveTo(112,53,101,49,88,49);
  ctx.bezierCurveTo(71,49,60,57,60,70);
  ctx.bezierCurveTo(60,99,121,84,121,114);
  ctx.bezierCurveTo(121,128,109,137,90,137);
  ctx.bezierCurveTo(75,137,63,132,56,122);
  ctx.stroke();
  const link=document.createElement('link');
  link.rel='apple-touch-icon';
  link.href=canvas.toDataURL();
  document.head.append(link);
}
