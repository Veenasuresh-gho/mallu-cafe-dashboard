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

  ds: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {

    this.getMediaLibrary();

  }

  close(): void {

    this.dialogRef.close();

  }

  getMediaLibrary(): void {

    this.loading = true;

    this.tv = [
      {
        T: 'dk1',
        V: this.data?.id
      },
      {
        T: 'c10',
        V: '15'
      }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({

        next: (r: any) => {

          console.log('FULL RESPONSE:', r);

          this.ds = r?.Data?.[0]?.[0] || null;

          console.log('Media Details:', this.ds);

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