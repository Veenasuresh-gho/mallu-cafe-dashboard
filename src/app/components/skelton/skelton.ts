import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skelton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skelton.html',
  styleUrl: './skelton.css',
})
export class Skelton {
  @Input() type: 'text' | 'title' | 'avatar' | 'card' = 'text';
}
