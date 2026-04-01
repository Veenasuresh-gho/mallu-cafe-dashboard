import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-primary-button',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.css',
})
export class PrimaryButton {
  @Input() label: string = '';
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() iconSrc: string = '';
  @Input() type: 'stroked' | 'flat' | 'raised' | 'danger' | 'ghost' = 'stroked';
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }

}
