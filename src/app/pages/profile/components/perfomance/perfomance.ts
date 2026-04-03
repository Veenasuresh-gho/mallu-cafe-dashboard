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
      icon: '/profile/microphone.svg',
      label: 'Shows Hosted',
      count: '120'
    },
    {
      icon: '/profile/headphone.svg',
      label: 'Listener Engagement ',
      count: '85%',

      trendIcon: '/profile/arrowUp.svg',
      trendColor: 'text-success'
    },
    {
      icon: '/profile/heart.svg',
      label: 'Favourites ',
      count: '1450',

    },
    {
      icon: '/profile/call-received.svg',
      label: 'Calls Received',
      count: '310',

    }
  ];
}
