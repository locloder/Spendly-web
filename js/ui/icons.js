const PATHS={
  wallet:'M3 7h15a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7zm0 0V6a2 2 0 0 1 2-2h11M17 14h.01',
  history:'M3 12a9 9 0 1 0 3-6.7M3 4v4h4M12 8v4l3 2',
  chart:'M4 20V10M10 20V4M16 20v-8M22 20H2',
  repeat:'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
  plus:'M12 5v14M5 12h14',
  x:'M6 6l12 12M18 6L6 18',
  flame:'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z',
  sliders:'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M14 4v4M8 10v4M16 16v4',
  mic:'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  camera:'M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  spark:'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
  trend:'M3 17l6-6 4 4 8-8M15 7h6v6',
  jar:'M7 3h10v3H7zM6 6h12v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zM9 12h6',
  cart:'M3 4h2l2 11h11l2-8H6M9 20h.01M17 20h.01',
  cup:'M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5zM17 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2',
  fork:'M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-3 2-4 6-4 9h4',
  car:'M5 16V11l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3M8 12h.01M16 12h.01',
  bus:'M5 4h14v13H5zM5 11h14M8 20v-3M16 20v-3M8 14h.01M16 14h.01',
  fuel:'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M14 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3M6 8h6',
  home:'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6',
  bolt:'M13 2L4 14h7l-1 8 9-12h-7z',
  wifi:'M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01',
  pill:'M10.5 20.5l-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8 8l8 8',
  dumbbell:'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12',
  scissors:'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 8l12 12M8 16L20 4',
  shirt:'M8 3L3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z',
  bag:'M5 8h14l1 13H4zM9 8V6a3 3 0 0 1 6 0v2',
  laptop:'M5 5h14v10H5zM2 19h20',
  broom:'M15 3l-4 8M8 11h8l2 9H6zM9 15l1 5M14 15l-1 5',
  film:'M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4',
  gamepad:'M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5 2l-2-2H9l-2 2a3 3 0 0 1-5-2v-3a4 4 0 0 1 4-4zM8 11v4M6 13h4M16 12h.01M18 14h.01',
  beer:'M6 6h10v14H6zM16 9h3v6h-3M6 6c0-2 2-3 5-3s5 1 5 3M10 10v6',
  plane:'M2 13l20-9-4 16-6-5-4 3 1-6z',
  gift:'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7C9 7 8 3 10 3s2 4 2 4zM12 7c3 0 4-4 2-4s-2 4-2 4z',
  book:'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
  paw:'M12 20c-3 0-5-2-5-4s3-4 5-4 5 2 5 4-2 4-5 4zM5 10h.01M9 6h.01M15 6h.01M19 10h.01',
  back:'M15 6l-6 6 6 6',
  dots:'M6 12h.01M12 12h.01M18 12h.01'
};

export function icon(name,size=20){
  return `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${PATHS[name]||PATHS.dots}"/></svg>`;
}

export function mountIcons(root=document){
  root.querySelectorAll('[data-icon]').forEach(el=>{
    el.innerHTML=icon(el.dataset.icon,+el.dataset.size||22);
  });
}
