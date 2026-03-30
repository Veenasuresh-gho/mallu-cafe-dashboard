import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
})
export class FormInput {
   @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() model: any;
  @Input() name: string = '';
  @Output() modelChange = new EventEmitter<any>();
}
