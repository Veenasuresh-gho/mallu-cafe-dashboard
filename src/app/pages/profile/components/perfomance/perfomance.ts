import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-perfomance',
  imports: [MatDivider,CommonModule],
  templateUrl: './perfomance.html',
  styleUrl: './perfomance.css',
})
export class Perfomance {
  stats = [
  {
    icon: 'mic',
    label: 'Shows Hosted: 120'
  },
  {
    icon: 'headphones',
    label: 'Listener Engagement: 85%',
    trendIcon: 'trending_up',
    trendColor: 'text-success'
  },
  {
    icon: 'favorite',
    label: 'Favourites: 1450'
  },
  {
    icon: 'call',
    label: 'Calls Received: 310'
  }
];
}
