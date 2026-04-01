import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  // optional: if you want click handling later
  onFromClick() {
    // open date picker later
  }

  onToClick() {
    // open date picker later
  }
}