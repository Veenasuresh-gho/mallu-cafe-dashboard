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
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

@Component({
  selector: 'app-view-file',
  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    PrimaryButton
  ],

  templateUrl: './view-file.html',

  styleUrls: ['./view-file.css']
})

export class ViewFile implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  toast = inject(ToastService);
  cdr = inject(ChangeDetectorRef);
  dialogRef = inject(MatDialogRef<ViewFile>);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  deleteLoading = false;
  ds: any = null;

  isPlaying = false;

currentTime = 0;

duration = 0;

  constructor(@Inject(MAT_DIALOG_DATA)public data: any) { }

  ngOnInit(): void {

    this.getMediaLibrary();

  }


  toggleAudio(audio: HTMLAudioElement): void {

  if (audio.paused) {

    audio.play();

    this.isPlaying = true;

  } else {

    audio.pause();

    this.isPlaying = false;

  }

}

onTimeUpdate(audio: HTMLAudioElement): void {

  this.currentTime = audio.currentTime;

  const slider = document.querySelector('.progress-bar') as HTMLInputElement;

  if (slider) {

    this.updateProgressBar(slider);

  }

}

onLoadedMetadata(audio: HTMLAudioElement): void {

  this.duration = audio.duration;

}

seekAudio(event: any, audio: HTMLAudioElement): void {

  const value = event.target.value;

  audio.currentTime = value;

  this.currentTime = value;

  this.updateProgressBar(event.target);

}

updateProgressBar(slider: HTMLInputElement): void {

  const percentage = (Number(slider.value) / Number(slider.max)) * 100;

  slider.style.background = `
    linear-gradient(
      to right,
      #e11d1d 0%,
      #e11d1d ${percentage}%,
      #e5e5e5 ${percentage}%,
      #e5e5e5 100%
    )
  `;

}

onAudioEnded(): void {

  this.isPlaying = false;

}

formatTime(seconds: number): string {

  if (!seconds) return '00:00';

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs < 10 ? '0' + secs : secs}`;

}

getProgressBackground(): string {

  const percentage = (this.currentTime / this.duration) * 100;

  return `linear-gradient(
    to right,
    #e11d1d 0%,
    #e11d1d ${percentage}%,
    #e5e5e5 ${percentage}%,
    #e5e5e5 100%
  )`;

}

  close(): void {
    this.dialogRef.close(false);
  }

  getMediaLibrary(): void {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: this.data?.id },
      { T: 'c10', V: '15' }
    ];
    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r: any) => {
          this.ds = r?.Data?.[0]?.[0] || null;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('API Error:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  isImageType(): boolean {
    if (!this.ds?.FileName) return false;
    return /\.(jpg|jpeg|png|gif|webp)$/i
      .test(this.ds.FileName);
  }

  isVideoType(): boolean {
    if (!this.ds?.FileName) return false;
    return /\.(mp4|mov|webm|mkv|ogg)$/i
      .test(this.ds.FileName);
  }

  isAudioType(): boolean {

    if (!this.ds?.FileName) return false;

    return /\.(mp3|wav|aac|ogg)$/i
      .test(this.ds.FileName);

  }

  formatFileSize(bytes: number | string): string {

    const size = Number(bytes);

    if (!size) return '0 Bytes';

    const units = [
      'Bytes',
      'KB',
      'MB', 'GB'
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

  addPublish(id: any) {

    this.loading = true;
    this.tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '14' }
    ];
    this.srv.getdata('podcast', this.tv)
      .subscribe({
        next: (r: any) => {
          this.loading = false;
          if (r.Status === 1) {
            this.toast.show({
              title: 'Published successfully! 🎉',
              description: '',
              variant: 'success',
              position: 'toast-bottom-center'
            });
            this.dialogRef.close(true);

          } else {
            this.toast.show({
              title: 'Failed to publish',
              description: 'Please try again',
              variant: 'error',
              position: 'toast-bottom-center'
            });
          }

        },

        error: (err) => {
          this.loading = false;
          console.error('API Error:', err);
          this.toast.show({
            title: 'Error publishing file',
            description: 'Please try again later',
            variant: 'error',
            position: 'toast-bottom-center'
          });

        }

      });
  }


  deleteMediaLibrary(id: any) {
    if (!id) return;
    this.deleteLoading = true;
    this.tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '24' }
    ];
    this.srv.getdata('program', this.tv).subscribe({
      next: (r: any) => {
        if (r.Status === 1) {
          this.toast.show({
            title: 'File deleted successfully! 🎉',
            description: '',
            variant: 'success',
            position: 'toast-bottom-center'
          });
          this.dialogRef.close(true);
        } else {
          const apiMsg = r.Data?.[0]?.[0]?.msg || 'Please try again';
          this.toast.show({
            title: 'Failed to delete file',
            description: apiMsg,
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.toast.show({
          title: 'Error deleting file',
          description: 'Please try again later',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
  }

}