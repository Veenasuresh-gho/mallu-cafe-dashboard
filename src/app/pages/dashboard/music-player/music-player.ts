import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'music-player',
  imports: [MatSliderModule,MatSlideToggleModule,MatIcon,FormsModule],
  templateUrl: './music-player.html',
  styleUrl: './music-player.css',
})
export class MusicPlayer {

  // live
   // Update these URLs to resolve your real assets dynamically
  backgroundUrl: string = '/dash/live-bg-img.jpg'; 
  hostAvatarUrl: string = '/dash/host-img.jpg';
  
  // Dummy Data variables
  facebookUrl: string = 'https://www.facebook.com/Ma..';
  isAutoPlay: boolean = true;
  favoriteCount: number = 455;
  liveTime: string = '00:36';
  
  shareCount: string = '102';
  viewCount: string = '4.2K';
  likeCount: string = '517';
  // Action Triggers
  onPlayAd() {
    console.log('User clicked: Play Ad');
  }
  onGoToFacebook() {
    console.log('Redirecting to Facebook Live...');
    window.open(this.facebookUrl, '_blank');
  }
}
