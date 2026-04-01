import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-form-multiselect',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './form-multiselect.html',
  styleUrls: ['./form-multiselect.css']
})
export class FormMultiSelect {

  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() selectedItems: any[] = [];
  @Input() placeholder: string = '';
  @Input() optionLabel: string = '';

  @Output() selectedItemsChange = new EventEmitter<any[]>();

  open = false;

  toggleDropdown() {
    this.open = !this.open;
  }

  select(item: any) {
    const exists = this.selectedItems.includes(item);

    if (exists) {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    } else {
      this.selectedItems = [...this.selectedItems, item];
    }

    this.selectedItemsChange.emit(this.selectedItems);
  }

  remove(item: any, event: Event) {
    event.stopPropagation(); // prevent dropdown open
    this.selectedItems = this.selectedItems.filter(i => i !== item);
    this.selectedItemsChange.emit(this.selectedItems);
  }

  getLabel(item: any) {
    return this.optionLabel ? item[this.optionLabel] : item;
  }
}