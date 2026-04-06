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

  // 🔥 LOADER STATE
  isVideoLoading: boolean = true;

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

  programDetails: any;

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.tv = [{ T: 'c10', V: '13' }];

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {

        this.programDetails = r?.Data?.[0]?.[0];

        const url = this.programDetails?._url;
        if (!url) return;

        this.prepareVideo(url);
         this.cdr.detectChanges(); 
      },
      error: (err) => console.error(err)
    });
  }

  // ✅ MAIN VIDEO HANDLER
  prepareVideo(url: string) {

    if (!url) {
      this.showVideo = false;
      return;
    }

    let embedUrl = '';

    // 🔍 Detect platform
    if (url.includes('youtube') || url.includes('youtu.be')) {
      this.platform = 'youtube';
    } else if (url.includes('facebook.com') || url.includes('fb.watch')) {
      this.platform = 'facebook';
    } else {
      this.platform = 'unknown';
    }

    // ✅ YOUTUBE PARSER (ROBUST)
    if (this.platform === 'youtube') {
      try {
        let videoId = '';
        const parsedUrl = new URL(url);

        // youtu.be
        if (parsedUrl.hostname === 'youtu.be') {
          videoId = parsedUrl.pathname.slice(1);
        }

        // youtube.com
        if (parsedUrl.hostname.includes('youtube.com')) {

          // watch?v=
          if (parsedUrl.searchParams.get('v')) {
            videoId = parsedUrl.searchParams.get('v')!;
          }

          // embed/
          else if (parsedUrl.pathname.includes('/embed/')) {
            videoId = parsedUrl.pathname.split('/embed/')[1];
          }

          // live/
          else if (parsedUrl.pathname.includes('/live/')) {
            videoId = parsedUrl.pathname.split('/live/')[1];
          }
        }

        // clean query params
        if (videoId.includes('?')) {
          videoId = videoId.split('?')[0];
        }

        if (videoId) {
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1`;
        }

      } catch (e) {
        console.error('Invalid YouTube URL', e);
      }
    }

    // ✅ FACEBOOK
    if (this.platform === 'facebook') {
      embedUrl =
        `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=1`;
    }

    // 🎬 APPLY VIDEO
    if (embedUrl) {
      this.isVideoLoading = true; // 🔥 START LOADER
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      this.showVideo = true;
    } else {
      this.showVideo = false;
    }
  }

  // ✅ IFRAME LOAD EVENT
  onIframeLoad() {
    this.isVideoLoading = false; // 🔥 STOP LOADER
  }

ngOnChanges(): void {
  if (!this.publishInfo || !this.publishInfo.isPublish) return;

  const url = this.publishInfo.url;
  if (!url) return;

  // 🎬 update player
  this.prepareVideo(url);

  // 🔥 CALL API AFTER PUBLISH
  this.tv = [{ T: 'c10', V: '13' }];

  this.srv.getdata('program', this.tv).subscribe({
    next: (r) => {
      this.programDetails = r?.Data?.[0]?.[0];
      this.cdr.detectChanges();
    },
    error: (err) => console.error(err)
  });
}
  // ✅ KEEP AS IS
  onPlayAd() {
    console.log('User clicked: Play Ad');
  }

  // ✅ KEEP AS IS
  onGoToFacebook() {
    window.open(this.facebookUrl, '_blank');
  }
}