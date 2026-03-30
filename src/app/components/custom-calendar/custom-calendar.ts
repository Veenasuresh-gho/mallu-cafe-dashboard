import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type ViewMode = 'date' | 'month' | 'year';

@Component({
  selector: 'app-custom-calendar',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './custom-calendar.html',
  styleUrls: ['./custom-calendar.css'],
})
export class CustomCalendar {

  viewMode: ViewMode = 'date';
  isOpen = false;

  currentDate: Date = new Date();
  selectedDate: Date = new Date();

  months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  weekDays = ['m','t','w','t','f','s','s'];

  years: number[] = [];

  constructor() {
    this.generateYears();
  }

  toggleCalendar() {
    this.isOpen = !this.isOpen;
  }

  closeCalendar() {
    this.isOpen = false;
  }

  // 🔁 VIEW SWITCH
  showMonthPicker() {
    this.viewMode = 'month';
  }

  showYearPicker() {
    this.viewMode = 'year';
  }

  goBack() {
    if (this.viewMode === 'month') this.viewMode = 'date';
    else if (this.viewMode === 'year') this.viewMode = 'month';
  }

  // 📅 YEARS
  generateYears() {
    const currentYear = this.currentDate.getFullYear();
    const start = currentYear - 6;
    this.years = Array.from({ length: 12 }, (_, i) => start + i);
  }

  // 📆 SELECT
  selectMonth(index: number) {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      index,
      1
    );
    this.viewMode = 'date';
  }

  selectYear(year: number) {
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
    this.viewMode = 'month';
    this.generateYears();
  }

  // ⬅️➡️ NAVIGATION
  prev() {
    if (this.viewMode === 'date') {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    } else if (this.viewMode === 'month') {
      this.currentDate = new Date(
        this.currentDate.getFullYear() - 1,
        0,
        1
      );
    } else {
      this.prevYears();
    }
  }

  next() {
    if (this.viewMode === 'date') {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    } else if (this.viewMode === 'month') {
      this.currentDate = new Date(
        this.currentDate.getFullYear() + 1,
        0,
        1
      );
    } else {
      this.nextYears();
    }
  }

  prevYears() {
    this.currentDate = new Date(
      this.currentDate.getFullYear() - 12,
      this.currentDate.getMonth(),
      1
    );
    this.generateYears();
  }

  nextYears() {
    this.currentDate = new Date(
      this.currentDate.getFullYear() + 12,
      this.currentDate.getMonth(),
      1
    );
    this.generateYears();
  }

  // 📅 DAYS
  getDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days: { day: number; currentMonth: boolean }[] = [];

    const start = firstDay === 0 ? 6 : firstDay - 1;

    // prev month
    for (let i = start - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false });
    }

    // current
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, currentMonth: true });
    }

    // next
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }

    return days;
  }

  selectDate(day: number) {
    this.selectedDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );
    this.closeCalendar();
  }

  formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  isSelected(day: number) {
    return (
      this.selectedDate.getDate() === day &&
      this.selectedDate.getMonth() === this.currentDate.getMonth() &&
      this.selectedDate.getFullYear() === this.currentDate.getFullYear()
    );
  }
}