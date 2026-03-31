import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormSelect } from '../form-select/form-select';

@Component({
  selector: 'app-schedule-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, FormSelect],
  templateUrl: './schedule-picker.html',
  styleUrls: ['./schedule-picker.css'],
})
export class SchedulePicker {
   @Input() showScheduleDay: boolean = true;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  times = ['2:00 PM', '3:00 PM', '5:00 PM'];

  fromDay: string = '';
  toDay: string = '';

  fromTime: string = '';
  toTime: string = '';

  openFromTime = false;
}