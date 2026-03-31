import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cancel-button',
  standalone:true,
  imports: [],
  templateUrl: './cancel-button.html',
  styleUrl: './cancel-button.css',
})
export class CancelButton {
    @Output() closeClicked = new EventEmitter<void>();

   close() {
    this.closeClicked.emit();
  }
}
