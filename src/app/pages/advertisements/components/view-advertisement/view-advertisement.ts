import {
  Component,
  Inject,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';

import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ToastService } from '../../../../services/toastService';

import {
  ghoresult,
  tags
} from '../../../../../model/ghomodel';

@Component({
  selector: 'app-view-advertisement',
  standalone: true,

  imports: [
    CommonModule,
    MatIconModule
  ],

  templateUrl: './view-advertisement.html',
  styleUrls: ['./view-advertisement.css']
})
export class ViewAdvertisement implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);

  dialogRef = inject(
    MatDialogRef<ViewAdvertisement>
  );

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  loading = false;
  ds: any = null;

  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  ngOnInit(): void {

    this.getAdvertisement();

  }

  close(): void {

    this.dialogRef.close(false);

  }

  getAdvertisement(): void {

    this.loading = true;

    this.tv = [
      {
        T: 'c4',
        V: this.data?.id
      },
      {
        T: 'c10',
        V: '3'
      }
    ];

    this.srv.getdata(
      'advertisement',
      this.tv
    ).subscribe({

      next: (r: any) => {

        this.ds =
          r?.Data?.[0]?.[0] || null;

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: () => {

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

  isImageType(): boolean {

    return (
      this.ds?.AdType?.toLowerCase() === 'image'
    );

  }

  isVideoType(): boolean {

    return (
      this.ds?.AdType?.toLowerCase() === 'video'
    );

  }

  isAudioType(): boolean {

    return (
      this.ds?.AdType?.toLowerCase() === 'audio'
    );

  }

  getProgressPercentage(): number {
    if (!this.duration) {
      return 0;
    }

    return (this.currentTime / this.duration) * 100;
  }

  toggleAudio(
    audio: HTMLAudioElement
  ): void {

    if (audio.paused) {

      audio.play();

      this.isPlaying = true;

    } else {

      audio.pause();

      this.isPlaying = false;

    }

  }

  onTimeUpdate(
    audio: HTMLAudioElement
  ): void {

    this.currentTime =
      audio.currentTime;

  }

  onLoadedMetadata(
    audio: HTMLAudioElement
  ): void {

    this.duration =
      audio.duration;

  }

seekAudio(event: Event, audio: HTMLAudioElement): void {

  const value = +(event.target as HTMLInputElement).value;

  audio.currentTime = value;

  // Update UI instantly
  this.currentTime = value;
}

  onAudioEnded(): void {

    this.isPlaying = false;

  }

  formatTime(seconds: number): string {

    if (!seconds || isNaN(seconds)) {
      return '00:00';
    }

    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {

      return `${hrs
        .toString()
        .padStart(2, '0')}:${mins
          .toString()
          .padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;

    }

    return `${mins
      .toString()
      .padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
  }

  

  formatFileSize(
    bytes: number | string
  ): string {

    const size = Number(bytes);

    if (!size) {

      return '0 Bytes';

    }

    const units = [
      'Bytes',
      'KB',
      'MB',
      'GB'
    ];

    let index = 0;

    let formattedSize = size;

    while (
      formattedSize >= 1024 &&
      index < units.length - 1
    ) {

      formattedSize /= 1024;

      index++;

    }

    return `${formattedSize.toFixed(1)} ${units[index]}`;

  }



}

