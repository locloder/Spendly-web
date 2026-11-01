import {fmt,download} from '../core/utils.js';
import {nextDate} from './analytics.js';

const escapeText=x=>x.replace(/[,;\\]/g,'\\$&');
const compact=d=>d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');

export function exportSubscription(sub){
  const start=nextDate(sub);
  const trigger=sub.rem===0?'PT9H':'-PT'+(sub.rem*24-9)+'H';
  const lines=[
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Spendly//RU','BEGIN:VEVENT',
    'UID:'+sub.id+'@spendly',
    'DTSTAMP:'+new Date().toISOString().replace(/[-:]|\.\d+/g,''),
    'DTSTART;VALUE=DATE:'+compact(start),
    'RRULE:FREQ=MONTHLY',
    'SUMMARY:'+escapeText(sub.name+': '+fmt(sub.p)),
    'BEGIN:VALARM','TRIGGER:'+trigger,'ACTION:DISPLAY',
    'DESCRIPTION:'+escapeText('Скоро списание: '+sub.name),
    'END:VALARM','END:VEVENT','END:VCALENDAR'
  ];
  download(new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}),sub.name+'.ics');
}
