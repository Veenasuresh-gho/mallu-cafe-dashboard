import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

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
  @Input() options: { value: string; label: string }[] = [];
  @Input() placeholder: string = '';
  @Input() name: string = '';

  selectedValue: string = '';

  // Functions to propagate value back to parent
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Called by parent to set the initial value
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Called when user selects a new option
  setValue(value: string) {
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }
}