import { CommonModule } from '@angular/common';
import { Component,Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-dialog-header-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-header-component.html',
  styleUrls: ['./dialog-header-component.css'],
})
export class DialogHeaderComponent {
  
  @Input() title: string = '';
  @Input() subtitle: string = '';

  @Output() closeClicked = new EventEmitter<void>();


  onClose() {
    this.closeClicked.emit();
  }
}

