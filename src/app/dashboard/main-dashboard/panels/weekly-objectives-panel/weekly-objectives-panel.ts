import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { WeeklyObjectives } from '../../../../models/weekly-objectives';
import { WeekRange } from '../../../../models/week-range';
import { WeekRow } from '../../../../models/week-row';

function pad2(n: number) { return String(n).padStart(2, '0'); }

function mondayOf(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; 
  x.setDate(x.getDate() - day);
  x.setHours(0,0,0,0);
  return x;
}

function sundayOf(d: Date) {
  const m = mondayOf(d);
  const s = new Date(m);
  s.setDate(m.getDate() + 6);
  s.setHours(0,0,0,0);
  return s;
}



function buildRowsForMonth(date = new Date()): WeekRow[] {
  const ranges = buildWeeksForMonth(date);

  return ranges.map(r => ({
    label: r.label,
    proformedEu: null,
    proformedVG: null,
    chargedEU: null,
    chargedVG: null,
    objective: 0,          
    accumulated: null,
    days: r.daysInMonth, 
  }));
}

function toISODateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function businessDaysOverlapInMonthWithHolidays(
  start: Date,
  end: Date,
  year: number,
  month0: number,
  holidaySet: Set<string>
) {
  const monthStart = new Date(year, month0, 1);
  const monthEnd = new Date(year, month0 + 1, 0);
  monthStart.setHours(0,0,0,0);
  monthEnd.setHours(0,0,0,0);

  const from = start > monthStart ? start : monthStart;
  const to = end < monthEnd ? end : monthEnd;
  if (to < from) return 0;

  let count = 0;
  const d = new Date(from);
  d.setHours(0,0,0,0);

  while (d <= to) {
    const dow = d.getDay(); 
    const iso = toISODateLocal(d);

    const isWeekday = dow >= 1 && dow <= 5;
    const isHoliday = holidaySet.has(iso);

    if (isWeekday && !isHoliday) count++;
    d.setDate(d.getDate() + 1);
  }

  return count;
}

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  const day = d.getUTCDay() || 7;

  d.setUTCDate(d.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const diffDays = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);

  return Math.floor(diffDays / 7) + 1;
}

export function buildWeeksForMonth(date = new Date(), holidays: string[] = []): WeekRange[] {
  const holidaySet = new Set(holidays);
  const year = date.getFullYear();
  const month0 = date.getMonth(); 

  const firstDay = new Date(year, month0, 1);
  const lastDay = new Date(year, month0 + 1, 0);

  let start = mondayOf(firstDay);
  const endLimit = sundayOf(lastDay);

  let weekNo = isoWeekNumber(start);

  const weeks: WeekRange[] = [];

  while (start <= endLimit) {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const sm = pad2(start.getMonth() + 1);
    const em = pad2(end.getMonth() + 1);

    const label = `${weekNo} (${pad2(start.getDate())}-${pad2(end.getDate())}/${pad2(end.getMonth() + 1)})`;
    weeks.push({
      index: weekNo - 1,
      start,
      end,
      label,
      daysInMonth: businessDaysOverlapInMonthWithHolidays(start, end, year, month0, holidaySet),
    });

    start = new Date(start);
    start.setDate(start.getDate() + 7);
    weekNo++;
  }
  return weeks;
}

@Component({
  selector: 'app-weekly-objectives-panel',
  imports: [CommonModule],
  templateUrl: './weekly-objectives-panel.html',
  styleUrl: './weekly-objectives-panel.css',
  standalone: true
})
export class WeeklyObjectivesPanel implements OnInit {

  @Input() data!: WeeklyObjectives;
  @Input() holidays: string [] = [];
  private timer?: number;
  perDay: number = 7500;

  euro(n: number | null) {  
    if (n === null) return '';
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  monthLabel = new Date().toLocaleString('es-ES', { month: 'long' }).toUpperCase();
  totalMonth = 150000;
  daysMonth = 20;
  weeks: WeekRow[] = buildRowsForMonth();

  ngOnInit() {
    this.recalc();
    this.timer = window.setInterval(() => this.recalc(), 60 * 60 * 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }   

  moneyOrDash(v: number | null) {
    return v == null ? '' : `${v.toLocaleString('es-ES')} €`;
  }

  dashTotal(a: number | null, b: number | null) {
    const sum = (a ?? 0) + (b ?? 0);
    return sum === 0 ? '- €' : `${sum.toLocaleString('es-ES')} €`;
  }

  recalc() {
    const now = new Date();

    this.monthLabel = now.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    this.daysMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const calendar = buildWeeksForMonth(now, this.holidays)
      .filter(w => w.daysInMonth > 0);

    if (this.data?.weeks?.length) {
      this.totalMonth = this.data.totalMonth;
      this.perDay = this.data.day ?? this.perDay; 

      const n = Math.min(calendar.length, this.data.weeks.length);

      this.weeks = Array.from({ length: n }).map((_, i) => ({
        label: calendar[i].label,
        days: calendar[i].daysInMonth,

        proformedEu: this.data.weeks[i].proformedEu ?? null,
        proformedVG: this.data.weeks[i].proformedVG ?? null,
        chargedEU: this.data.weeks[i].chargedEU ?? null,
        chargedVG: this.data.weeks[i].chargedVG ?? null,

        objective: this.perDay * calendar[i].daysInMonth,
        accumulated: null,
      }));

      let acc = 0;
      this.weeks = this.weeks.map(w => {
        acc += w.objective;
        return { ...w, accumulated: acc };
      });

      return;
    }

    this.weeks = calendar.map(r => ({
      label: r.label,
      days: r.daysInMonth,
      proformedEu: null,
      proformedVG: null,
      chargedEU: null,
      chargedVG: null,
      objective: this.perDay * r.daysInMonth,
      accumulated: null,
    }));
  }
  

  private sum(values: Array<number | null | undefined>) {
    return values.reduce((s: number, v) => s + (v ?? 0), 0);
  }

  get totalProformedEU(): number {
    return this.sum(this.weeks.map(w => w.proformedEu));
  }
  get totalProformedVG(): number {
    return this.sum(this.weeks.map(w => w.proformedVG));
  }
  get totalProformed(): number {
    return this.totalProformedEU + this.totalProformedVG;
  }

  get totalChargedEU(): number {
    return this.sum(this.weeks.map(w => w.chargedEU));
  }
  get totalChargedVG(): number {
    return this.sum(this.weeks.map(w => w.chargedVG));
  }
  get totalCharged(): number {
    return this.totalChargedEU + this.totalChargedVG;
  }
}
