import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioButton } from '@angular/material/radio';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-drop-down',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule,MatRadioButton],
  templateUrl: './select-drop-down.html',
  styleUrl: './select-drop-down.css',
})
export class SelectDropDown {
  @Input() placeholder: string = '';
  @Input() options: { label: string; value: string }[] = [];

  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>(); 
}