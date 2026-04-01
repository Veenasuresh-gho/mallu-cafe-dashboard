import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormSelect } from '../form-select/form-select';
import { CustomCalendar } from '../../custom-calendar/custom-calendar';

@Component({
  selector: 'app-schedule-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, FormSelect, CustomCalendar],
  templateUrl: './schedule-picker.html',
  styleUrls: ['./schedule-picker.css'],
})
export class SchedulePicker implements OnInit {

  @Input() model: any = {};
  @Output() modelChange = new EventEmitter<any>();
  @Input() showScheduleDay: boolean = true;

  // 📅 Calendar state
  isCalendarOpen: boolean = false;
  selectedDate: Date | null = null; // ✅ FIXED (no undefined issues)

  // 📆 Days
  days = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
    { label: 'Sunday', value: '7' },
  ];

  // ⏰ Times
  times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  // Form values
  fromDay: string = '';
  toDay: string = '';
  fromTime: string = '';
  toTime: string = '';

  // 🔄 INIT
  ngOnInit(): void {
    if (this.model) {
      this.fromDay = this.model.fromDay || '';
      this.toDay = this.model.toDay || '';
      this.fromTime = this.model.fromTime || '';
      this.toTime = this.model.toTime || '';
      this.selectedDate = this.model.selectedDate || null;
    }
  }

  // 📅 OPEN / CLOSE CALENDAR
  toggleCalendar(): void {
    this.isCalendarOpen = !this.isCalendarOpen;
    console.log('Calendar Open:', this.isCalendarOpen); // ✅ debug
  }

  closeCalendar(): void {
    this.isCalendarOpen = false;
  }

  // 📅 RECEIVE DATE FROM CHILD
  onDateSelected(date: Date): void {
    if (!date) return;

    this.selectedDate = date;

    // ✅ Map JS day → your format
    const day = date.getDay(); // 0 (Sun) → 6 (Sat)
    this.fromDay = day === 0 ? '7' : day.toString();

    this.emitChange();
    this.closeCalendar();
  }

  // 📤 EMIT TO PARENT
  emitChange(): void {
    this.modelChange.emit({
      fromDay: this.fromDay,
      toDay: this.toDay,
      fromTime: this.fromTime,
      toTime: this.toTime,
      selectedDate: this.selectedDate
    });
  }
}