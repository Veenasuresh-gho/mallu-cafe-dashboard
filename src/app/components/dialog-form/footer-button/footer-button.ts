import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer-button',
   standalone: true,  
  imports: [CommonModule],

  templateUrl: './footer-button.html',
  styleUrl: './footer-button.css',
})
export class FooterButton {
   @Input() text: string = 'Button';       // button label
  @Input() icon: string = '';             // icon src path
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; 
}
