import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
  @Input() options: string[] = [];
  @Input() model: any;
  @Input() name: string = '';
}
