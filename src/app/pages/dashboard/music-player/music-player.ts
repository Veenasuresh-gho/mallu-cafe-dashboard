import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'music-player',
  standalone: true,
  imports: [MatSliderModule, MatSlideToggleModule, MatIconModule, FormsModule,CommonModule],
  templateUrl: './music-player.html',
  styleUrls: ['./music-player.css'],
})
export class MusicPlayer implements OnChanges, OnInit {
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
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  reloadIframe = true;

  constructor(private sanitizer: DomSanitizer) {

  }
ngOnInit(): void {
  this.tv = [{ T: 'c10', V: '13' }];

  this.srv.getdata('program', this.tv).subscribe({
    next: (r) => {
      const url = r?.Data?.[0]?.[0]?._url;
console.log(url)
      if (!url) return;

      this.prepareVideo(url); // ✅ only this
    }
  });
}

prepareVideo(url: string) {

  if (!url) {
    this.showVideo = false;
    return;
  }

  let embedUrl = '';

  // Detect platform
  if (url.includes('youtube') || url.includes('youtu.be')) {
    this.platform = 'youtube';
  } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
    this.platform = 'facebook';
  } else {
    this.platform = 'unknown';
  }

  // ✅ YOUTUBE (ROBUST WAY)
 if (this.platform === 'youtube') {

  try {
    let videoId = '';

    const parsedUrl = new URL(url);

    // ✅ youtu.be
    if (parsedUrl.hostname === 'youtu.be') {
      videoId = parsedUrl.pathname.slice(1);
    }

    // ✅ youtube.com
    if (parsedUrl.hostname.includes('youtube.com')) {

      // watch?v=
      if (parsedUrl.searchParams.get('v')) {
        videoId = parsedUrl.searchParams.get('v')!;
      }

      // embed/
      else if (parsedUrl.pathname.includes('/embed/')) {
        videoId = parsedUrl.pathname.split('/embed/')[1];
      }

      // 🔥 live/
      else if (parsedUrl.pathname.includes('/live/')) {
        videoId = parsedUrl.pathname.split('/live/')[1];
      }
    }

    if (videoId.includes('?')) {
      videoId = videoId.split('?')[0];
    }

    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;
    }

  } catch (e) {
    console.error('Invalid URL', e);
  }
}

  // ✅ FACEBOOK
  if (this.platform === 'facebook') {
    embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
  }

  if (embedUrl) {
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.showVideo = true;
  } else {
    this.showVideo = false;
  }
}
  ngOnChanges() {
    const url = this.publishInfo?.url;

    if (!url || !this.publishInfo?.isPublish) {
      this.showVideo = false;
      return;
    }

    this.prepareVideo(url);
  }
  onPlayAd() {
    console.log('User clicked: Play Ad');
  }

  onGoToFacebook() {
    window.open(this.facebookUrl, '_blank');
  }
}