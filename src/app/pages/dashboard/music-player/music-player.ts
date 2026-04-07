import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'music-player',
  standalone: true,
  imports: [MatSliderModule, MatSlideToggleModule, MatIconModule, FormsModule],
  templateUrl: './music-player.html',
  styleUrls: ['./music-player.css'],
})
export class MusicPlayer implements OnChanges {
  @Input() publishInfo!: { isPublic: boolean; url: string; isPublish: boolean } | null;

  videoUrl!: SafeResourceUrl;
  backgroundUrl: string = '/dash/live-bg-img.jpg';
  hostAvatarUrl: string = '/dash/host-img.jpg';

  facebookUrl: string = 'https://www.facebook.com/Ma..';
  favoriteCount: number = 455;
  liveTime: string = '00:36';
  shareCount: string = '102';
  viewCount: string = '4.2K';
  likeCount: string = '517';

  isAutoPlay: boolean = true;

  constructor(private sanitizer: DomSanitizer) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/2PSyCG7yfKw?autoplay=1&mute=1'
    );
    console.log(this.videoUrl)
  }

ngOnChanges(changes: SimpleChanges) {
  const url = this.publishInfo?.url;

  if (this.publishInfo?.isPublic && this.publishInfo.isPublish && url) {

    const match = url.match(/(?:youtu\.be\/|v=)([^?&]+)/);

    if (match) {
      const videoId = match[1];

      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;

      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

    }
  }
}

  onPlayAd() {
    console.log('User clicked: Play Ad');
  }

  onGoToFacebook() {
    window.open(this.facebookUrl, '_blank');
  }
}