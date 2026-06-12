import { Component, inject, Input, OnChanges, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
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
import { Router } from '@angular/router';
import { PublishAd } from '../../advertisements/components/publish-ad/publish-ad';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'music-player',
  standalone: true,
  imports: [
    MatSliderModule,
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './music-player.html',
  styleUrls: ['./music-player.css'],
})
export class MusicPlayer implements OnInit, OnChanges, OnDestroy {

  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @Input() publishInfo!: { isPublic: boolean; url: string; isPublish: boolean } | null;
  private pollInterval: any;
  private autoPlayAfterAd = false;

  videoUrl!: SafeResourceUrl;
  showVideo: boolean = false;
  isVideoLoading: boolean = true;

  isAudio: boolean = false;

  noLive: boolean = false;
  mb: string = '';

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
  isMuted: boolean = false;
  hasSeeked: boolean = false;
  programDetails: any;
  isLoading = true;
  noProgram = false;
  isMediaTransitionLoading = false;
  private adCompleted = false;
  isAdvertisement = false;


  // Add them here
  get isAdvertisementAudio(): boolean {
    return this.isAdvertisement && this.isAudio;
  }

  get isAdvertisementVideo(): boolean {
    return this.isAdvertisement && !this.isAudio;
  }

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog,
  ) { }

  openPublishADModal() {
    this.dialog.open(PublishAd, {
      width: '1020px',
      maxWidth: '1020px',
      maxHeight: '90vh',
      disableClose: true,
    });
  }

  getFileExtension(url: string): string {
    try {
      const cleanUrl = url.split('?')[0];
      const parts = cleanUrl.split('.');
      return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
    } catch {
      return '';
    }
  }

  goToMediaLibrary(): void {
    this.router.navigate(['/media-library']);
  }

  refreshProgram(): void {
    this.tv = [{ T: 'c10', V: '13' }];
    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        const data = r?.Data?.[0];
        if (!data?.length) {
          return;
        }
        const newProgram = data[0];
        this.isAdvertisement =
          newProgram?.IsAdvertisement === 1 ||
          newProgram?.CategoryName === 'AdvertisementVideo' ||
          newProgram?.CategoryName === 'AdvertisementAudio';
        const isAdvertisement = this.isAdvertisement;
        const seekTime = Number(newProgram?.SeekTime || 0);
        const duration = Number(newProgram?.Duration || 0);

        // if (duration > 0 && seekTime >= duration) {
        //   this.stopProgram();
        //   return;
        // }

        // const isAdvertisement =
        //   newProgram?.IsAdvertisement === 1 ||
        //   newProgram?.CategoryName === 'AdvertisementVideo';
        if (duration > 0 && seekTime >= duration) {
          if (isAdvertisement) {
            if (!this.adCompleted) {
              this.adCompleted = true;
              // this.isMediaTransitionLoading = true;
              // this.loadNextAdvertisement();
              setTimeout(() => {
                this.isMediaTransitionLoading = true;
                this.loadNextAdvertisement();
              });

            }

          } else {

            this.stopProgram();

          }
          return;
        }

        // Reset when a new non-ad program starts
        if (!isAdvertisement) {
          this.adCompleted = false;
        }

        // Program changed
        if (
          this.programDetails?.ID !== newProgram?.ID ||
          this.programDetails?._url !== newProgram?._url
        ) {
          this.programDetails = newProgram;
          this.loadCurrentProgram();
          return;
        }

        this.programDetails = newProgram;

        // Sync player position when paused
        if (this.audio.paused) {
          this.audio.currentTime = seekTime;
          this.currentTime = seekTime;
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadCurrentProgram();
    this.pollInterval = setInterval(() => {
      this.refreshProgram();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  // initAudio(url: string) {

  //   this.audio.src = url;
  //   this.audio.load();

  //   // ✅ metadata loaded
  //   this.audio.onloadedmetadata = () => {

  //     this.ngZone.run(() => {

  //       this.duration = this.audio.duration || 0;

  //       this.cdr.detectChanges();

  //     });

  //   };

  //   this.audio.oncanplay = () => {

  //     if (!this.hasSeeked && this.programDetails?.SeekTime) {

  //       const seekValue = Math.min(
  //         this.programDetails.SeekTime,
  //         this.audio.duration || 0
  //       );

  //       this.audio.currentTime = seekValue;

  //       this.hasSeeked = true;
  //     }

  //   };

  //   // ✅ progress update
  //   this.audio.ontimeupdate = () => {

  //     this.ngZone.run(() => {

  //       this.currentTime = this.audio.currentTime || 0;
  //       this.cdr.detectChanges();

  //     });

  //   };

  //   // ✅ ended
  //   this.audio.onended = () => {

  //     this.ngZone.run(() => {

  //       this.isPlaying = false;
  //       this.currentTime = 0;
  //       this.hasSeeked = false;

  //       this.cdr.detectChanges();

  //     });

  //   };

  // }

  initAudio(url: string): void {

    this.audio.src = url;
    this.audio.load();

    // Can play
    this.audio.oncanplay = () => {

      if (!this.hasSeeked && this.programDetails?.SeekTime) {

        const seekValue = Math.min(
          this.programDetails.SeekTime,
          this.audio.duration || 0
        );

        this.audio.currentTime = seekValue;
        this.hasSeeked = true;
      }

      // Advertisement autoplay
      if (this.isAdvertisementAudio) {

        this.audio.muted = false;
        this.isMuted = false;

        this.audio.play()
          .then(() => {

            this.isPlaying = true;
            this.cdr.detectChanges();

          })
          .catch(err => console.error('Ad autoplay failed', err));

        return;
      }

      // Normal program autoplay ONLY after ad sequence completed
      if (this.autoPlayAfterAd) {

        this.autoPlayAfterAd = false;

        this.audio.play()
          .then(() => {

            this.isPlaying = true;
            this.cdr.detectChanges();

          })
          .catch(err => console.error('Autoplay after ad failed', err));
      }
    };
    // Prevent pausing advertisement
    this.audio.onpause = () => {

      if (this.isAdvertisementAudio) {

        this.audio.play()
          .then(() => {

            this.isPlaying = true;
            this.cdr.detectChanges();

          })
          .catch(err => console.error(err));
      }
    };

    // Metadata loaded
    this.audio.onloadedmetadata = () => {

      this.ngZone.run(() => {

        this.duration = this.audio.duration || 0;

        this.cdr.detectChanges();

      });

    };

    // Progress update
    this.audio.ontimeupdate = () => {

      this.ngZone.run(() => {

        this.currentTime = this.audio.currentTime || 0;

        this.cdr.detectChanges();

      });

    };

    // Audio ended
    this.audio.onended = () => {

      this.ngZone.run(() => {

        this.isPlaying = false;
        this.currentTime = 0;
        this.hasSeeked = false;

        this.cdr.detectChanges();

        // Load next ad automatically
        if (this.isAdvertisementAudio) {
          // this.isMediaTransitionLoading = true;
          // this.loadNextAdvertisement();
          setTimeout(() => {
            this.isMediaTransitionLoading = true;
            this.loadNextAdvertisement();
          });
        }

      });

    };

  }

  handleMedia(url: string) {
    if (!url) {
      this.noProgram = true;
      return;
    }

    const ext = this.getFileExtension(url);

    // AUDIO
    if (
      ext === 'mp3' ||
      url.includes('.mp3')
    ) {

      this.isAudio = true;
      this.showVideo = false;

      this.initAudio(url);

      return;
    }

    // VIDEO
    if (
      ['mp4', 'webm', 'ogg'].includes(ext) ||
      url.includes('.mp4') ||
      url.includes('.webm') ||
      url.includes('.ogg')
    ) {

      this.isAudio = false;
      this.showVideo = true;

      this.videoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(url);

      return;
    }

    // Youtube / Facebook
    if (
      url.includes('youtube') ||
      url.includes('youtu.be') ||
      url.includes('facebook.com') ||
      url.includes('fb.watch')
    ) {

      this.isAudio = false;
      this.prepareVideo(url);

      return;
    }

    // Default → treat as audio
    this.isAudio = true;
    this.showVideo = false;

    this.initAudio(url);
  }

  stopProgram() {
    this.tv = [{ T: 'c10', V: '1' }];
    this.srv.getdata('stop', this.tv).subscribe({

    })
  }

  loadCurrentProgram(): void {
    this.isLoading = true;
    this.noProgram = false;
    this.tv = [{ T: 'c10', V: '13' }];
    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        this.isMediaTransitionLoading = false;
        const data = r?.Data?.[0];
        if (!data || !Array.isArray(data) || data.length === 0) {

          this.programDetails = null;
          this.noProgram = true;
          this.isAudio = false;
          this.showVideo = false;

          this.audio.pause();
          this.audio.currentTime = 0;

          this.isLoading = false;
          this.cdr.detectChanges();

          return;
        }

        this.programDetails = data[0];
        this.noProgram = false;
        const bytes = Number(this.programDetails?.size || 0);

        this.mb = (bytes / (1024 * 1024)).toFixed(2);

        const url = this.programDetails?._url;

        this.audio.pause();
        this.audio.currentTime = 0;
        this.hasSeeked = false;

        if (url) {
          this.handleMedia(url);
        } else {
          this.noProgram = true;
        }

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        this.isMediaTransitionLoading = false;
        console.error(err);

        this.programDetails = null;
        this.noProgram = true;
        this.isAudio = false;
        this.showVideo = false;

        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  ngOnChanges(): void {
    if (!this.publishInfo?.isPublish) return;
    this.loadCurrentProgram();
    const url = this.publishInfo.url;
    this.handleMedia(url);

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        this.programDetails = r?.Data?.[0]?.[0];
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
    if (this.isAdvertisementAudio) {
      this.audio.play()
        .then(() => this.isPlaying = true)
        .catch(err => console.error(err));
    }
  }

  // toggleAudio() {

  //   if (this.audio.paused) {

  //     this.audio.currentTime = Number(this.programDetails?.SeekTime || 0);

  //     this.audio.play().then(() => {
  //       this.isPlaying = true;
  //       this.cdr.detectChanges();
  //     });

  //   } else {

  //     this.audio.pause();
  //     this.isPlaying = false;
  //     this.cdr.detectChanges();

  //   }
  // }

  toggleAudio(): void {

    if (this.isAdvertisementAudio) {
      return;
    }

    if (this.audio.paused) {

      this.audio.play();
      this.isPlaying = true;

    } else {

      this.audio.pause();
      this.isPlaying = false;

    }
  }

  onSeek(event: any) {

    if (this.isAdvertisementAudio) {
      return;
    }

    const value = event.target.value;

    if (this.duration) {
      this.audio.currentTime = (value / 100) * this.duration;
    }
  }
  // 🎚️ SEEK
  // onSeek(event: any) {
  //   const value = event.target.value;
  //   if (this.duration) {
  //     this.audio.currentTime = (value / 100) * this.duration;
  //   }
  // }

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
    // console.log('Play Ad clicked');
  }

  onGoToFacebook() {
    window.open(this.facebookUrl, '_blank');
  }

  navigateToAD() {
    this.router.navigate(['/advertisements']);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // Audio mute
    this.audio.muted = this.isMuted;
  }

  onVideoLoaded(): void {
    this.isVideoLoading = false;
  }

  onVideoEnded(): void {


  }

  loadNextAdvertisement(): void {
    const tags = [{ T: 'c10', V: '10' }];
    this.srv.getdata('advertisement', tags).subscribe({
      next: (res) => {

        const nextAd = res?.Data?.[0]?.[0];

        if (nextAd && nextAd._url) {

          this.noProgram = false;
          this.isMediaTransitionLoading = false;

          this.programDetails = nextAd;

          this.isAdvertisement =
            nextAd?.IsAdvertisement === 1 ||
            nextAd?.CategoryName === 'AdvertisementVideo' ||
            nextAd?.CategoryName === 'AdvertisementAudio';

          this.audio.pause();
          this.audio.currentTime = 0;
          this.hasSeeked = false;

          this.handleMedia(nextAd._url);
        } else {

          this.isAdvertisement = false;
          this.isMediaTransitionLoading = false;

          this.autoPlayAfterAd = true;

          this.loadCurrentProgram();
        }
      }
    });
  }
}

