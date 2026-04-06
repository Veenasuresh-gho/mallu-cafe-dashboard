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
  videoId: string = '';
  showVideo: boolean = false;

  backgroundUrl: string = '/dash/live-bg-img.jpg';
  hostAvatarUrl: string = '/dash/host-img.jpg';

  facebookUrl: string = 'https://www.facebook.com/Ma..';
  favoriteCount: number = 455;
  liveTime: string = '00:36';
  shareCount: string = '102';
  viewCount: string = '4.2K';
  likeCount: string = '517';
  platform: 'youtube' | 'facebook' | 'unknown' = 'unknown';
  isAutoPlay: boolean = true;

  constructor(private sanitizer: DomSanitizer) {

  }

ngOnChanges(changes: SimpleChanges) {
  const url = this.publishInfo?.url;

  if (!url) {
    this.showVideo = false;
    return;
  }

  // 🔍 Detect platform
  if (url.includes('youtube') || url.includes('youtu.be')) {
    this.platform = 'youtube';
  } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
    this.platform = 'facebook';
  } else {
    this.platform = 'unknown';
  }

  if (this.publishInfo?.isPublic && this.publishInfo.isPublish) {

    if (this.platform === 'youtube') {
      const match = url.match(/(?:youtu\.be\/|v=)([^?&]+)/);

      if (match) {
        this.videoId = match[1];

        const embedUrl = `https://www.youtube.com/embed/${this.videoId}?autoplay=1&mute=1&playsinline=1`;

        this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
        this.showVideo = true;
        return;
      }
    }

    if (this.platform === 'facebook') {
      const fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;

      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fbEmbedUrl);
      this.showVideo = true;
      return;
    }
  }

  this.showVideo = false;
}

  onPlayAd() {
    console.log('User clicked: Play Ad');
  }

  onGoToFacebook() {
    window.open(this.facebookUrl, '_blank');
  }
}