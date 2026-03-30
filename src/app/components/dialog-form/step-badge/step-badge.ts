import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-badge',
  imports: [],
  templateUrl: './step-badge.html',
  styleUrl: './step-badge.css',
})
export class StepBadge {
   @Input() stepNumber!: number | string; // Step number
  @Input() title!: string;  
}
