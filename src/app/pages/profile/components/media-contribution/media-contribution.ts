import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-media-contribution',
  imports: [MatDivider,CommonModule],
  templateUrl: './media-contribution.html',
  styleUrl: './media-contribution.css',
})
export class MediaContribution {
  mediaStats = [
  {
    icon: '/profile/airdrop.svg',
    label: 'Podcasts',
    count:'14',

  },
  {
    icon: '/profile/video-icon.svg',
    label: 'Featured',
    count: '6',
  },
  {
    icon: '/profile/video.svg',
    label: 'Shorts',
    count:'2',
    isCircle: true 
  }
];
}
