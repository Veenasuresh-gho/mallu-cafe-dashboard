import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-schedule-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-picker.html',
  styleUrl: './schedule-picker.css',
})
export class SchedulePicker {
   days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  times = ['2:00 PM','3:00 PM','5:00 PM'];

  fromDay = '';
  toDay = '';

  fromTime = '';
  toTime = '';
}
