import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-media-contribution',
  standalone: true,
  imports: [MatDivider, CommonModule,MatIconModule],
  templateUrl: './media-contribution.html',
  styleUrl: './media-contribution.css',
})
export class MediaContribution implements OnChanges {

  @Input() mediaContributions: any = {};

  mediaStats: any[] = [];

  ngOnChanges() {
    const data = this.mediaContributions?.[0] || {};

    this.mediaStats = [
      {
        icon: '/profile/airdrop.svg',
        label: 'Podcasts',
        count: data.Podcasts ?? 0,
      },
      {
        icon: '/profile/video-icon.svg',
        label: 'Videos',
        count: data.Videos ?? 0,
      },
      {
        icon: '/profile/video.svg',
        label: 'Shorts',
        count: data.Shorts ?? 0,
        isCircle: true
      }
    ];

    console.log('Media Stats:', this.mediaStats);
  }
}