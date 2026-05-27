import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-muted-button',
  imports: [MatIconModule, MatButtonModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './muted-button.html',
  styleUrl: './muted-button.css',
})
export class MutedButton {
  @Input() label: string = '';
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() iconSrc: string = '';
  @Input() type: 'stroked' | 'flat' | 'raised' | 'danger' | 'ghost' = 'stroked';
  @Output() clicked = new EventEmitter<void>();
  @Input() disabled: boolean = false;

  onClick() {
    if (this.loading || this.disabled) return;
    this.clicked.emit();
  }
}
