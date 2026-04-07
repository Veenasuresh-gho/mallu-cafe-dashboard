import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-perfomance',
  imports: [MatDivider, CommonModule],
  templateUrl: './perfomance.html',
  styleUrl: './perfomance.css',
})
// export class Perfomance {

//      @Input() assignedPrograms: any = {};

//   stats = [
//     {
//       icon: '/profile/microphone.svg',
//       label: 'Shows Hosted',
//       count: '120'
//     },
//     {
//       icon: '/profile/headphone.svg',
//       label: 'Listener Engagement ',
//       count: '85%',

//       trendIcon: '/profile/arrowUp.svg',
//       trendColor: 'text-success'
//     },
//     {
//       icon: '/profile/heart.svg',
//       label: 'Favourites ',
//       count: '1450',

//     },
//     {
//       icon: '/profile/call-received.svg',
//       label: 'Calls Received',
//       count: '310',

//     }
//   ];
// }

export class Perfomance {

  @Input() performance: any = [];

  stats: any[] = [];

  ngOnChanges() {
    const data = this.performance?.[0] || {};

    this.stats = [
      {
        icon: '/profile/microphone.svg',
        label: 'Shows Hosted',
        count: data?.ShowsHosted || 0
      },
      {
        icon: '/profile/headphone.svg',
        label: 'Listener Engagement',
        count: data?.ListenerEngagementPercentage
          ? data.ListenerEngagementPercentage + '%'
          : '0%',
        trendIcon: '/profile/arrowUp.svg',
        trendColor: 'text-success'
      },
      {
        icon: '/profile/heart.svg',
        label: 'Favourites',
        count: data?.Favourites || 0
      },
      {
        icon: '/profile/call-received.svg',
        label: 'Calls Received',
        count: data?.CallsReceived || 0
      }
    ];
  }
}