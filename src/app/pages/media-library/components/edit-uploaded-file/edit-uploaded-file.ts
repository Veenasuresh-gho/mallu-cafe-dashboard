import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import {
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

import { MatSelect } from '@angular/material/select';

import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ToastService } from '../../../../services/toastService';

import { ghoresult, tags } from '../../../../../model/ghomodel';
import { PreScheduled } from '../upload-new-file-modal/upload-files/pre-scheduled/pre-scheduled';
import { PodcastFile } from '../upload-new-file-modal/upload-files/podcast-file/podcast-file';
import { Shorts } from '../upload-new-file-modal/upload-files/shorts/shorts';
import { VideoFile } from '../upload-new-file-modal/upload-files/video-file/video-file';

@Component({
  selector: 'app-edit-uploaded-file',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,

  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatSelect,
    StepBadge,
    UploadBox,
    FormSelect,
    FormInput,
    PrimaryButton,
    PreScheduled,
    PodcastFile,Shorts,VideoFile
  ],

  templateUrl: './edit-uploaded-file.html',
  styleUrl: './edit-uploaded-file.css',
})

export class EditUploadedFile implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditUploadedFile>,
    private cdr: ChangeDetectorRef
  ) { }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  toast = inject(ToastService);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  loading = false;

  userId: string = '';
  id: string = '';
  programId: string = '';

  fileName: string = '';
  fileSize: string = '';
  fileType: string = '';
  previewUrl: string = '';
  extension: string = '';
  dimension: string = '';

  title: string = '';
  subtitle: string = '';

  selectedFile: File | null = null;
  thumbnailFile: File | null = null;

  selectedMediaType: string = '';
  selectedCategoryId: string = '';
  selectedProgramId: string = '';
  selectedProgramName: string = '';
  selectedProgramData: any = null;

  mediaTypeOptions: any[] = [];
  programList: any[] = [];

  errors: any = {};

  maxSize = 1.5 * 1024 * 1024 * 1024;

  ngOnInit(): void {

    const storedId = sessionStorage.getItem('id');

    this.userId = storedId
      ? JSON.parse(storedId)
      : '';

    this.getMediaTypes();
  }

  close() {
    this.dialogRef.close();
  }

  getMediaTypes(): void {

    this.tv = [
      { T: 'dk1', V: 'MEDIATYPES' },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {

          this.mediaTypeOptions = r.Data[0];

          this.cdr.detectChanges();
        }
      });
  }

  onMediaTypeChange(value: string) {

    this.selectedMediaType = value;

    if (!value) return;

    this.getProgramList();
  }

  getProgramList(): Promise<void> {

    return new Promise((resolve) => {

      this.tv = [
        { T: 'dk1', V: this.selectedMediaType },
        { T: 'c10', V: '23' }
      ];

      this.srv.getdata('program', this.tv)
        .subscribe({

          next: (r) => {

            const data = r.Data[0];

            this.programList = data.map((item: any) => ({

              DisplayText: item.Title,
              DataValue: item.ProgramID,
              ProgramID: item.id

            }));

            this.cdr.markForCheck();

            resolve();
          },

          error: () => resolve()
        });
    });
  }

  onFileSelected(file: File) {

    if (!file) return;

    if (file.size > this.maxSize) {

      this.errors.file = 'File size should be less than 1.5 GB';

      return;
    }

    if (this.errors.file) {
      delete this.errors.file;
    }

    this.selectedFile = file;

    this.fileName = file.name;

    this.fileSize =
      (file.size / 1024 / 1024).toFixed(2) + ' MB';

    this.fileType = file.type;

    this.extension =
      file.name.split('.').pop()?.toLowerCase() || '';

    this.previewUrl = URL.createObjectURL(file);

    this.dimension = '';

    const isVideo = file.type.startsWith('video');

    const media = document.createElement(
      isVideo ? 'video' : 'audio'
    );

    const url = URL.createObjectURL(file);

    media.onloadedmetadata = () => {

      const duration =
        Math.floor(media.duration) + ' sec';

      if (isVideo) {

        const width =
          (media as HTMLVideoElement).videoWidth;

        const height =
          (media as HTMLVideoElement).videoHeight;

        this.dimension =
          `${width} x ${height} • ${duration}`;

      } else {

        this.dimension = duration;
      }

      URL.revokeObjectURL(url);

      this.cdr.markForCheck();
    };

    media.src = url;
  }

  removeFile() {

    if (this.previewUrl) {

      URL.revokeObjectURL(this.previewUrl);
    }

    this.fileName = '';
    this.fileSize = '';
    this.fileType = '';
    this.previewUrl = '';
    this.selectedFile = null;
  }

  isImageType(): boolean {

    return this.fileType.startsWith('image');
  }

  isVideoType(): boolean {

    return this.fileType.startsWith('video');
  }

  validateForm(): boolean {

    this.errors = {};

    if (!this.selectedMediaType) {

      this.errors.type = 'Please select media type';
    }

    return Object.keys(this.errors).length === 0;
  }

  saveChanges() {

    if (!this.validateForm()) return;

    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      this.toast.show({
        title: 'Updated Successfully 🎉',
        description: 'Media details updated successfully',
        variant: 'success',
        position: 'toast-bottom-right'
      });

      this.dialogRef.close(true);

      this.cdr.detectChanges();

    }, 1500);
  }
}