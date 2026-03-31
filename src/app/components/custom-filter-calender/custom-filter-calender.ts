import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type ViewMode = 'date' | 'month' | 'year';

@Component({
  selector: 'app-custom-filter-calender',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './custom-filter-calender.html',
  styleUrls: ['./custom-filter-calender.css'],
})
export class CustomFilterCalender {

  viewMode: ViewMode = 'date';
  isOpen = false;
  currentDate: Date = new Date();

  startDate: Date | null = null;
  endDate: Date | null = null;

  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  weekDays = ['M','T','W','T','F','S','S'];
  selectedWeekDays: Date[] = []; // store full Date objects
  selectedWeekDayIndex: number | null = null;

  years: number[] = [];

  @Input() inlineMode: boolean = false;
  @Output() filterApplied = new EventEmitter<any>();
  constructor() {
    this.generateYears();
  }

  ngOnInit() {
  if (this.inlineMode) {
    this.isOpen = true; // always open
  }
}
toggleCalendar() {
  if (this.inlineMode) return; // disable toggle
  this.isOpen = !this.isOpen;
}



  // toggleCalendar() { this.isOpen = !this.isOpen; }
  closeCalendar() { this.isOpen = false; }
  showMonthPicker() { this.viewMode = 'month'; }
  showYearPicker() { this.viewMode = 'year'; }
  goBack() {
    if (this.viewMode === 'month') this.viewMode = 'date';
    else if (this.viewMode === 'year') this.viewMode = 'month';
  }

  generateYears() {
    const currentYear = this.currentDate.getFullYear();
    const start = currentYear - 6;
    this.years = Array.from({ length: 12 }, (_, i) => start + i);
  }

  selectMonth(index: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), index, 1);
    this.viewMode = 'date';
  }

  selectYear(year: number) {
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
    this.viewMode = 'month';
    this.generateYears();
  }

  prev() {
    if (this.viewMode === 'date') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    } else if (this.viewMode === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear() - 1, 0, 1);
    } else this.prevYears();
  }

  next() {
    if (this.viewMode === 'date') {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    } else if (this.viewMode === 'month') {
      this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0, 1);
    } else this.nextYears();
  }

  prevYears() {
    this.currentDate = new Date(this.currentDate.getFullYear() - 12, this.currentDate.getMonth(), 1);
    this.generateYears();
  }

  nextYears() {
    this.currentDate = new Date(this.currentDate.getFullYear() + 12, this.currentDate.getMonth(), 1);
    this.generateYears();
  }

  getDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: { date: Date; currentMonth: boolean }[] = [];
    const start = firstDay === 0 ? 6 : firstDay - 1;

    // previous month's days
    for (let i = start - 1; i >= 0; i--) days.push({ date: new Date(year, month - 1, prevMonthDays - i), currentMonth: false });

    // current month's days
    for (let i = 1; i <= totalDays; i++) days.push({ date: new Date(year, month, i), currentMonth: true });

    // next month's days to fill 6x7 grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date: new Date(year, month + 1, i), currentMonth: false });

    return days;
  }

  // SINGLE / RANGE
  selectDate(date: Date, currentMonth: boolean) {
    if (!currentMonth) return;

    // clear weekday selection
    this.selectedWeekDays = [];
    this.selectedWeekDayIndex = null;

    if (!this.startDate) { 
      this.startDate = date; 
      this.endDate = null; 
      return; 
    }

    if (this.startDate && !this.endDate) {
      if (date.getTime() === this.startDate.getTime()) { 
        this.startDate = null; 
        this.endDate = null; 
      }
      else if (date > this.startDate) this.endDate = date;
      else { this.endDate = this.startDate; this.startDate = date; }
      return;
    }

    this.startDate = date;
    this.endDate = null;
  }

  // WEEKDAY SELECTION
  selectWeekday(dayIndex: number) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();

    this.selectedWeekDays = [];
    this.selectedWeekDayIndex = dayIndex;

    const jsDayIndex = (dayIndex + 1) % 7; // map Monday=0 → JS 1

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === jsDayIndex) this.selectedWeekDays.push(date);
    }

    // clear single/range selection
    this.startDate = null;
    this.endDate = null;
  }

  // SINGLE / RANGE HELPERS
  isSelected(date: Date, currentMonth: boolean): boolean {
    if (!currentMonth) return false;

    if (this.selectedWeekDays.length > 0)
      return this.selectedWeekDays.some(d => d.getTime() === date.getTime());

    if (this.startDate && !this.endDate) return this.startDate.getTime() === date.getTime();
    if (this.startDate && this.endDate) return date >= this.startDate && date <= this.endDate;

    return false;
  }

  isStart(date: Date, currentMonth: boolean) {
    return this.startDate && date.getTime() === this.startDate.getTime();
  }

  isEnd(date: Date, currentMonth: boolean) {
    return this.endDate && date.getTime() === this.endDate.getTime();
  }

  isInRange(date: Date, currentMonth: boolean) {
    if (!this.startDate || !this.endDate) return false;
    return date > this.startDate && date < this.endDate;
  }

  // WEEKDAY HELPERS
  isWeekdayStart(date: Date) {
    return this.selectedWeekDays.length > 0 &&
           date.getTime() === this.selectedWeekDays[0].getTime();
  }

  isWeekdayEnd(date: Date) {
    return this.selectedWeekDays.length > 0 &&
           date.getTime() === this.selectedWeekDays[this.selectedWeekDays.length - 1].getTime();
  }

  isWeekdayInRange(date: Date) {
    return this.selectedWeekDays.some(d => d.getTime() === date.getTime());
  }

  hasSelectedDates(): boolean { 
    return !!this.startDate || this.selectedWeekDays.length > 0 || !!this.endDate; 
  }

  // applyFilter() {
  //   if (!this.hasSelectedDates()) return;

  //   if (this.selectedWeekDays.length > 0) console.log('Selected Weekdays:', this.selectedWeekDays);
  //   else if (this.endDate) console.log('Selected Range:', this.startDate, 'to', this.endDate);
  //   else console.log('Selected Single Date:', this.startDate);

  //   this.closeCalendar();
  // }

  applyFilter() {
  if (!this.hasSelectedDates()) return;

  let payload: any;

  if (this.selectedWeekDays.length > 0) {
    payload = { type: 'weekday', value: this.selectedWeekDays };
    console.log('Selected Weekdays:', this.selectedWeekDays);
  } 
  else if (this.endDate) {
    payload = { type: 'range', start: this.startDate, end: this.endDate };
    console.log('Selected Range:', this.startDate, 'to', this.endDate);
  } 
  else {
    payload = { type: 'single', value: this.startDate };
    console.log('Selected Single Date:', this.startDate);
  }

  // 🔥 SEND DATA TO PARENT
  this.filterApplied.emit(payload);

  // ✅ ONLY close if NOT inline mode
  if (!this.inlineMode) {
    this.closeCalendar();
  }
}

  formatDate() {
    if (this.selectedWeekDays.length > 0) return 'Weekday Selection';
    if (!this.startDate) return 'Select date';
    if (!this.endDate) return this.startDate.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    return `${this.startDate.toLocaleDateString('en-US',{month:'short',day:'numeric'})} - ${this.endDate.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
  }

}