import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-time',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-time.html',
  styleUrls: ['./input-time.css'],
})
export class InputTime implements OnInit, OnChanges {

  @Input() model: any = {};
  @Output() modelChange = new EventEmitter<any>();
  @ViewChild('hourCol') hourCol!: ElementRef;
@ViewChild('minuteCol') minuteCol!: ElementRef;

  // ⏰ Time options
  times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  fromTime: string = '';
  toTime: string = '';

  errors: any = {};

  ngOnInit(): void {
    this.setValuesFromModel();
    this.emitChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model']) {
      this.setValuesFromModel();
    }
  }

  private setValuesFromModel(): void {
    if (!this.model) this.model = {};

    this.fromTime = this.model.fromTime || '';
    this.toTime = this.model.toTime || '';
  }

  emitChange(): void {
    this.modelChange.emit({
      fromTime: this.fromTime || '',
      toTime: this.toTime || ''
    });
  }
scrollToCenter(index: number, column: ElementRef) {
  const itemHeight = 32; // must match CSS height
  const containerHeight = 120;

  const scrollPosition =
    index * itemHeight - containerHeight / 2 + itemHeight / 2;

  column.nativeElement.scrollTo({
    top: scrollPosition,
    behavior: 'smooth',
  });
}
  activePicker: 'from' | 'to' | null = null;

hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, '0')
);

minutes = Array.from({ length: 59 }, (_, i) =>
  (i + 1).toString().padStart(2, '0')
);
selectedHour = '00';
selectedMinute = '00';
period: 'AM' | 'PM' = 'AM';

togglePicker(type: 'from' | 'to') {
  this.activePicker = this.activePicker === type ? null : type;
}

// selectHour(h: string) {
//   this.selectedHour = h;
// }
selectHour(h: string) {
  this.selectedHour = h;

  // this.scrollToCenter(index, this.hourCol);

  // 🔥 also align minute column
  // const minuteIndex = this.minutes.indexOf(this.selectedMinute);
  // this.scrollToCenter(minuteIndex, this.minuteCol);
}

// selectMinute(m: string) {
//   this.selectedMinute = m;
// }
selectMinute(m: string) {
  this.selectedMinute = m;

  // this.scrollToCenter(index, this.minuteCol);

  // 🔥 also align hour column
  // const hourIndex = this.hours.indexOf(this.selectedHour);
  // this.scrollToCenter(hourIndex, this.hourCol);
}
selectPeriod(p: 'AM' | 'PM') {
  this.period = p;
}

confirmTime() {
  const time = `${this.selectedHour}:${this.selectedMinute} ${this.period}`;

  if (this.activePicker === 'from') {
    this.fromTime = time;
  } else {
    this.toTime = time;
  }

  this.activePicker = null;
  this.emitChange();
}

  validate() {
    this.errors = {};

    if (!this.fromTime) this.errors.fromTime = 'Please select start time';
    if (!this.toTime) this.errors.toTime = 'Please select end time';

    if (this.fromTime && this.toTime) {
      const [fromH, fromM] = this.fromTime.split(':').map(Number);
      const [toH, toM] = this.toTime.split(':').map(Number);

      if (toH < fromH || (toH === fromH && toM <= fromM)) {
        this.errors.toTime = 'End time must be after start time';
      }
    }
  }
}