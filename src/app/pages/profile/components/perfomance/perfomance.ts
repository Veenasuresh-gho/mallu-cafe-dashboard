import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-perfomance',
  imports: [MatDivider, CommonModule],
  templateUrl: './perfomance.html',
  styleUrl: './perfomance.css',
})
export class Perfomance {
  stats = [
    {
      icon: 'mic',
      label: 'Shows Hosted',
      count: '120'
    },
    {
      icon: 'headphones',
      label: 'Listener Engagement ',
      count: '85%',

      trendIcon: 'trending_up',
      trendColor: 'text-success'
    },
    {
      icon: 'favorite',
      label: 'Favourites ',
      count: '1450',

    },
    {
      icon: 'call',
      label: 'Calls Received',
      count: '310',

    }
  ];
}
