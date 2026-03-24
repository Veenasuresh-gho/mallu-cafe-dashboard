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
    icon: 'podcasts',
    label: 'Podcasts: 14'
  },
  {
    icon: 'videocam',
    label: 'Featured: 6'
  },
  {
    icon: 'arrow_right',
    label: 'Shorts: 2',
    isCircle: true 
  }
];
}
