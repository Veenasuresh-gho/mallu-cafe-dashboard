import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="checkbox-card">
      <input type="checkbox" 
  name="checkbox"
  [ngModel]="checked" 
  (ngModelChange)="onCheckedChange($event)"  />
      <div class="content">
        <span class="title pt-1">{{ title }}</span>
        <p class="description">{{ description }}</p>
      </div>
    </label>
  `,
  styleUrls: ['./checkbox.css'],
})
export class Checkbox {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() checked: boolean = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  onCheckedChange(value: boolean) {
    this.checked = value;
    this.checkedChange.emit(value);
  }
}