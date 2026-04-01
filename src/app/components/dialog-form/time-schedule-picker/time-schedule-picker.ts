import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-schedule-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-schedule-picker.html',
  styleUrls: ['./time-schedule-picker.css'],
})
export class TimeSchedulePicker {
  @Input() times: string[] = ['2:00 PM', '3:00 PM', '5:00 PM'];

  fromTime: string | null = null;
  toTime: string | null = null;
}