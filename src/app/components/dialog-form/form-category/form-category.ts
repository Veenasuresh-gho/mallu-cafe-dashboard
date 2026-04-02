import {
  Component,
  Input,
  forwardRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';

@Component({
  selector: 'app-form-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-category.html',
  styleUrls: ['./form-category.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCategory),
      multi: true
    }
  ]
})
export class FormCategory implements ControlValueAccessor {

  @Input() label: string = '';
  @Input() options: any[] = [];
  @Input() placeholder: string = '';
  @Input() name: string = '';

  // 🔥 dynamic keys
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';

  selectedValue: any = null;
  open: boolean = false;

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 🔥 set selected value
  setValue(item: any) {
    const value = item[this.optionValue];

    this.selectedValue = value;
    this.open = false;

    this.onChange(value);
    this.onTouched();
  }

  toggleDropdown() {
    this.open = !this.open;
  }

  // 🔥 display selected label
  getDisplayLabel(): string {
    const selected = this.options.find(
      opt => opt[this.optionValue] === this.selectedValue
    );

    return selected
      ? selected[this.optionLabel]
      : (this.placeholder || 'Select ' + this.label);
  }

  // 🔥 close on outside click
  @HostListener('document:click', ['$event'])
  onOutsideClick(event: any) {
    if (!event.target.closest('.select-wrapper')) {
      this.open = false;
    }
  }
}