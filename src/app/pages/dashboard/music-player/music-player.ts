import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'music-player',
  standalone: true,
  imports: [
    MatSliderModule,
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './music-player.html',
  styleUrls: ['./music-player.css'],
})
export class MusicPlayer implements OnInit, OnChanges {

  @Input() publishInfo!: { isPublic: boolean; url: string; isPublish: boolean } | null;

  videoUrl!: SafeResourceUrl;
  showVideo: boolean = false;
  isVideoLoading: boolean = true;

  isAudio: boolean = false;

  noLive: boolean = false;

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

  audio = new Audio();
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;

  programDetails: any;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  getFileExtension(url: string): string {
    try {
      const cleanUrl = url.split('?')[0];
      const parts = cleanUrl.split('.');
      return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
    } catch {
      return '';
    }
  }

  initAudio(url: string) {
    this.audio.src = url;
    this.audio.load();

    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration || 0;
      this.cdr.detectChanges();
    };

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime || 0;
      this.cdr.detectChanges();
    };

    this.audio.onended = () => {
      this.isPlaying = false;
    };

    if (this.isAutoPlay) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

handleMedia(url: string) {
  if (!url) return;

  const ext = this.getFileExtension(url);

  if (ext === 'mp3') {
    this.isAudio = true;
    this.showVideo = false;
    this.initAudio(url);
    return;
  }

  if (['mp4', 'webm', 'ogg'].includes(ext)) {
    this.isAudio = false;
    this.showVideo = true;
    this.platform = 'unknown';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return;
  }

  this.isAudio = false;
  this.prepareVideo(url);
}

  ngOnInit(): void {
    this.tv = [{ T: 'c10', V: '13' }];

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        this.programDetails = r?.Data?.[0]?.[0];
        const url = this.programDetails?._url;
        this.handleMedia(url);

        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ ON INPUT CHANGE
  ngOnChanges(): void {
    if (!this.publishInfo || !this.publishInfo.isPublish) return;

    const url = this.publishInfo.url;
    this.handleMedia(url);

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        this.programDetails = r?.Data?.[0]?.[0];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  // 🎵 PLAY / PAUSE
  toggleAudio() {
    if (this.audio.paused) {
      this.audio.play();
      this.isPlaying = true;
    } else {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  // 🎚️ SEEK
  onSeek(event: any) {
    const value = event.target.value;
    if (this.duration) {
      this.audio.currentTime = (value / 100) * this.duration;
    }
  }

  // ⏱️ FORMAT TIME
  formatTime(time: number): string {
    if (!time) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // 🎬 VIDEO HANDLER
  prepareVideo(url: string) {
    let embedUrl = '';

    if (url.includes('youtube') || url.includes('youtu.be')) {
      this.platform = 'youtube';
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
      this.platform = 'facebook';
    } else {
      this.platform = 'unknown';
    }

    if (this.platform === 'youtube') {
      try {
        let videoId = '';
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname === 'youtu.be') {
          videoId = parsedUrl.pathname.slice(1);
        }

        if (parsedUrl.hostname.includes('youtube.com')) {
          videoId =
            parsedUrl.searchParams.get('v') ||
            parsedUrl.pathname.split('/embed/')[1] ||
            parsedUrl.pathname.split('/live/')[1] ||
            '';
        }

        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (this.platform === 'facebook') {
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
    }

    if (embedUrl) {
      this.isVideoLoading = true;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      this.showVideo = true;
    } else {
      this.showVideo = false;
    }
  }

  onIframeLoad() {
    this.isVideoLoading = false;
  }

  onPlayAd() {
    console.log('Play Ad clicked');
  }

  onGoToFacebook() {
    window.open(this.facebookUrl, '_blank');
  }
}