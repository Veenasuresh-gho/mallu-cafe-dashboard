import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-media-contribution',
  standalone: true,
  imports: [MatDivider, CommonModule],
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
        icon: 'podcasts',
        label: 'Podcasts',
        count: data.Podcasts ?? 0,
      },
      {
        icon: 'videocam',
        label: 'Videos',
        count: data.Videos ?? 0,
      },
      {
        icon: 'arrow_right',
        label: 'Shorts',
        count: data.Shorts ?? 0,
        isCircle: true
      }
    ];

    console.log('Media Stats:', this.mediaStats);
  }
}