import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormSelect } from '../form-select/form-select';

@Component({
  selector: 'app-schedule-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, FormSelect],
  templateUrl: './schedule-picker.html',
  styleUrl: './schedule-picker.css',
})
export class SchedulePicker {

  @Input() model: any = {};
  @Output() modelChange = new EventEmitter<any>();

  days = [

    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
     { label: 'Sunday', value: '7' },
  ];

  times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  fromDay = '';
  toDay = '';
  fromTime = '';
  toTime = '';

  ngOnInit() {
    // initialize from parent if exists
    if (this.model) {
      this.fromDay = this.model.fromDay || '';
      this.toDay = this.model.toDay || '';
      this.fromTime = this.model.fromTime || '';
      this.toTime = this.model.toTime || '';
    }
  }

  emitChange() {
    this.modelChange.emit({
      fromDay: this.fromDay,
      toDay: this.toDay,
      fromTime: this.fromTime,
      toTime: this.toTime
    });
  }
}