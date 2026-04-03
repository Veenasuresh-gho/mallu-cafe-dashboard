// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-schedule-date-range',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './schedule-date-range.html',
//   styleUrls: ['./schedule-date-range.css']
// })

// export class ScheduleDateRange {
//   @Input() fromDate: string = '';
//   @Input() toDate: string = '';

//   @Output() fromDateChange = new EventEmitter<string>();
//   @Output() toDateChange = new EventEmitter<string>();

//   isOpen = false;
//   selectedField: 'from' | 'to' | null = null;

//   currentDate = new Date();
//   viewMode: 'date' | 'month' | 'year' = 'date';
//   months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
//   weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
//   years = Array.from({length: 20}, (_, i) => new Date().getFullYear() - 10 + i);


//   formatDateForDisplay(date: Date | string) {
//   if (!date) return '';
//   const d = typeof date === 'string' ? new Date(date) : date;
//   const day = d.getDate().toString().padStart(2, '0');
//   const month = this.months[d.getMonth()].substring(0,3); 
//   const year = d.getFullYear();
//   return `${day} ${month} ${year}`; 
// }

//   openCalendar(field: 'from' | 'to') {
//     this.selectedField = field;
//     this.isOpen = true;
//     this.viewMode = 'date';
//   }

//   selectDate(day: number) {
//     const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
//     const formatted = this.formatDate(date);

//     if (this.selectedField === 'from') {
//       this.fromDate = formatted;
//       this.fromDateChange.emit(formatted);
//     } else if (this.selectedField === 'to') {
//       this.toDate = formatted;
//       this.toDateChange.emit(formatted);
//     }

//     this.isOpen = false;
//   }

//   isSelected(day: number) {
//     const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
//     const formatted = this.formatDate(date);
//     return this.selectedField === 'from' ? formatted === this.fromDate : formatted === this.toDate;
//   }

//   formatDate(date: Date) {
//     const mm = (date.getMonth() + 1).toString().padStart(2, '0');
//     const dd = date.getDate().toString().padStart(2, '0');
//     const yyyy = date.getFullYear();
//     return `${yyyy}-${mm}-${dd}`;
//   }

//   prev() { this.currentDate.setMonth(this.currentDate.getMonth() - 1); }
//   next() { this.currentDate.setMonth(this.currentDate.getMonth() + 1); }
//   prevYears() { this.currentDate.setFullYear(this.currentDate.getFullYear() - 10); }
//   nextYears() { this.currentDate.setFullYear(this.currentDate.getFullYear() + 10); }

//   showMonthPicker() { this.viewMode = 'month'; }
//   showYearPicker() { this.viewMode = 'year'; }
//   goBack() { this.viewMode = 'date'; }

//   selectMonth(month: number) { this.currentDate.setMonth(month); this.viewMode = 'date'; }
//   selectYear(year: number) { this.currentDate.setFullYear(year); this.viewMode = 'date'; }

//   getDays() {
//     const year = this.currentDate.getFullYear();
//     const month = this.currentDate.getMonth();

//     const firstDay = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const prevDays = new Date(year, month, 0).getDate();

//     const days: any[] = [];

//     for (let i = firstDay - 1; i >= 0; i--) {
//       days.push({ day: prevDays - i, currentMonth: false });
//     }

//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push({ day: i, currentMonth: true });
//     }

//     while (days.length % 7 !== 0) {
//       days.push({ day: days.length - daysInMonth - firstDay + 1, currentMonth: false });
//     }

//     return days;
//   }

// }



import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-date-range',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule-date-range.html',
  styleUrls: ['./schedule-date-range.css']
})
export class ScheduleDateRange {

  @Input() fromDate: string = '';
  @Input() toDate: string = '';

  @Output() fromDateChange = new EventEmitter<string>();
  @Output() toDateChange = new EventEmitter<string>();

  // ✅ controls which calendar is open
  openFor: 'from' | 'to' | null = null;

  currentDate = new Date();
  viewMode: 'date' | 'month' | 'year' = 'date';

  months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  years = Array.from({length: 20}, (_, i) => new Date().getFullYear() - 10 + i);

  // ================= DISPLAY FORMAT =================
  formatDateForDisplay(date: Date | string) {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;

    const day = d.getDate().toString().padStart(2, '0');
    const month = this.months[d.getMonth()].substring(0,3);
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  }

  // ================= OPEN CALENDAR =================
  openCalendar(field: 'from' | 'to', event: Event) {
    event.stopPropagation();

    // toggle same calendar
    if (this.openFor === field) {
      this.openFor = null;
    } else {
      this.openFor = field;
      this.viewMode = 'date';
    }
  }

  // ================= SELECT DATE =================
  selectDate(day: number) {
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );

    const formatted = this.formatDate(date);

    if (this.openFor === 'from') {
      this.fromDate = formatted;
      this.fromDateChange.emit(formatted);
    } else if (this.openFor === 'to') {
      this.toDate = formatted;
      this.toDateChange.emit(formatted);
    }

    this.openFor = null; // close after select
  }

  // ================= SELECTED STATE =================
  isSelected(day: number) {
    const date = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );

    const formatted = this.formatDate(date);

    return this.openFor === 'from'
      ? formatted === this.fromDate
      : formatted === this.toDate;
  }

  // ================= FORMAT FOR STORAGE =================
  formatDate(date: Date) {
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  // ================= NAVIGATION =================
  prev() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
  }

  next() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
  }

  prevYears() {
    this.currentDate.setFullYear(this.currentDate.getFullYear() - 10);
  }

  nextYears() {
    this.currentDate.setFullYear(this.currentDate.getFullYear() + 10);
  }

  showMonthPicker() {
    this.viewMode = 'month';
  }

  showYearPicker() {
    this.viewMode = 'year';
  }

  goBack() {
    this.viewMode = 'date';
  }

  selectMonth(month: number) {
    this.currentDate.setMonth(month);
    this.viewMode = 'date';
  }

  selectYear(year: number) {
    this.currentDate.setFullYear(year);
    this.viewMode = 'date';
  }

  // ================= CALENDAR GRID =================
  getDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();

    const days: any[] = [];

    // previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevDays - i, currentMonth: false });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }

    // next month
    while (days.length % 7 !== 0) {
      days.push({
        day: days.length - daysInMonth - firstDay + 1,
        currentMonth: false
      });
    }

    return days;
  }

  // ================= OUTSIDE CLICK =================
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (
      !target.closest('.calendar-trigger') &&
      !target.closest('.calendar-wrapper')
    ) {
      this.openFor = null;
    }
  }
}