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
    // this.emitChange();
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
fromState = {
  hour: '10',
  minute: '00',
  period: 'AM' as 'AM' | 'PM',
  index: 0
};

toState = {
  hour: '11',
  minute: '30',
  period: 'AM' as 'AM' | 'PM',
  index: 0
};

togglePicker(type: 'from' | 'to') {
  this.activePicker = this.activePicker === type ? null : type;
}

selectedIndex: number = 0;

selectHour(h: string) {
  const index = this.hours.indexOf(h);

  if (this.activePicker === 'from') {
    this.fromState.hour = h;
    this.fromState.index = index;
  } else {
    this.toState.hour = h;
    this.toState.index = index;
  }
}

selectMinute(m: string) {
  const index = this.minutes.indexOf(m);

  if (this.activePicker === 'from') {
    this.fromState.minute = m;
    this.fromState.index = index;
  } else {
    this.toState.minute = m;
    this.toState.index = index;
  }
}
selectPeriod(p: 'AM' | 'PM') {
  if (this.activePicker === 'from') {
    this.fromState.period = p;
  } else {
    this.toState.period = p;
  }
}
timeModel = {
  fromTime: '',
  toTime: ''
};
confirmTime() {
  if (this.activePicker === 'from') {
    this.fromTime = `${this.fromState.hour}:${this.fromState.minute} ${this.fromState.period}`;
  }

  if (this.activePicker === 'to') {
    this.toTime = `${this.toState.hour}:${this.toState.minute} ${this.toState.period}`;
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