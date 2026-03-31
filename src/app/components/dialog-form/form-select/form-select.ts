

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.css',
})
export class FormSelect {
  @Input() label: string = '';
  @Input() options: any[] = [];   // ✅ keep only this
  @Input() model: string = '';
  @Input() name: string = '';
  @Input() placeholder: string = '';
  @Input() optionLabel: string = '';
  @Input() optionValue: string = '';

  @Output() modelChange = new EventEmitter<string>();

  open = false;

  toggleDropdown() {
    this.open = !this.open;
  }

  select(item: any) {
    const value = this.optionValue ? item[this.optionValue] : item;
    this.model = value;
    this.modelChange.emit(value);
    this.open = false;
  }

  getLabel(item: any) {
    return this.optionLabel ? item[this.optionLabel] : item;
  }

  getSelectedLabel() {
    const selected = this.options.find(
      (opt) => (this.optionValue ? opt[this.optionValue] : opt) === this.model
    );
    return selected ? this.getLabel(selected) : '';
  }
}