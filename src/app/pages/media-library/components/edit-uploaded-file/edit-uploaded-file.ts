// import { CommonModule } from '@angular/common';
// import {
//   ChangeDetectionStrategy,
//   ChangeDetectorRef,
//   Component,
//   Inject,
//   inject,
//   OnInit
// } from '@angular/core';

// import { FormsModule } from '@angular/forms';
// import {
//   MAT_DIALOG_DATA,
//   MatDialogContent,
//   MatDialogRef
// } from '@angular/material/dialog';

// import { MatSelect } from '@angular/material/select';

// import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
// import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
// import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
// import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
// import { PrimaryButton } from '../../../../components/primary-button/primary-button';

// import { GHOService } from '../../../../services/ghosrvs';
// import { GHOUtitity } from '../../../../services/utilities';
// import { ToastService } from '../../../../services/toastService';

// import { ghoresult, tags } from '../../../../../model/ghomodel';
// import { PreScheduled } from '../upload-new-file-modal/upload-files/pre-scheduled/pre-scheduled';
// import { PodcastFile } from '../upload-new-file-modal/upload-files/podcast-file/podcast-file';
// import { Shorts } from '../upload-new-file-modal/upload-files/shorts/shorts';
// import { VideoFile } from '../upload-new-file-modal/upload-files/video-file/video-file';

// @Component({
//   selector: 'app-edit-uploaded-file',
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush,

//   imports: [
//     CommonModule,
//     FormsModule,
//     MatDialogContent,
//     MatSelect,
//     StepBadge,
//     UploadBox,
//     FormSelect,
//     FormInput,
//     PrimaryButton,
//     PreScheduled,
//     PodcastFile,Shorts,VideoFile
//   ],

//   templateUrl: './edit-uploaded-file.html',
//   styleUrl: './edit-uploaded-file.css',
// })

// export class EditUploadedFile implements OnInit {

//   constructor(@Inject(MAT_DIALOG_DATA)public data: any,
//   private dialogRef: MatDialogRef<EditUploadedFile>,private cdr: ChangeDetectorRef
//   ) { }



//   srv = inject(GHOService);
//   utl = inject(GHOUtitity);
//   toast = inject(ToastService);

//   tv: tags[] = [];
//   res: ghoresult = new ghoresult();

//   loading = false;

//   userId: string = '';
//   id: string = '';
//   programId: string = '';

//   fileName: string = '';
//   fileSize: string = '';
//   fileType: string = '';
//   previewUrl: string = '';
//   extension: string = '';
//   dimension: string = '';

//   title: string = '';
//   subtitle: string = '';

//   selectedFile: File | null = null;
//   thumbnailFile: File | null = null;

//   selectedMediaType: string = '';
//   selectedCategoryId: string = '';
//   selectedProgramId: string = '';
//   selectedProgramName: string = '';
//   selectedProgramData: any = null;

//   mediaTypeOptions: any[] = [];
//   programList: any[] = [];
//   ds: any = null;
//   errors: any = {};

//   maxSize = 1.5 * 1024 * 1024 * 1024;

//   ngOnInit(): void {

//     const storedId = sessionStorage.getItem('id');
//     this.userId = storedId
//       ? JSON.parse(storedId)
//       : '';
//     this.getMediaTypes();
//     this.getMediaLibrary()
//   }

//   close() {
//     this.dialogRef.close();
//   }


//     getMediaLibrary(): void {
//     this.loading = true;
//     this.tv = [
//       { T: 'dk1', V: this.data?.id },
//       { T: 'c10', V: '15' }
//     ];
//     this.srv.getdata('program', this.tv)
//       .subscribe({
//         next: (r: any) => {
//           console.log('FULL RESPONSE:', r);
//           this.ds = r?.Data?.[0]?.[0] || null;
//           console.log('Media Details:', this.ds);
//           this.loading = false;
//           this.cdr.detectChanges();
//         },
//         error: (err: any) => {
//           console.error('API Error:', err);
//           this.loading = false;
//           this.cdr.detectChanges();
//         }
//       });
//   }

//   getMediaTypes(): void {
//     this.tv = [
//       { T: 'dk1', V: 'MEDIATYPES' },
//       { T: 'c10', V: '3' }
//     ];

//     this.srv.getdata('lists', this.tv)
//       .subscribe({
//         next: (r) => {
//           this.mediaTypeOptions = r.Data[0];
//           this.cdr.detectChanges();
//         }
//       });
//   }

//   onMediaTypeChange(value: string) {
//     this.selectedMediaType = value;
//     if (!value) return;
//     this.getProgramList();
//   }

//   getProgramList(): Promise<void> {
//     return new Promise((resolve) => {
//       this.tv = [
//         { T: 'dk1', V: this.selectedMediaType },
//         { T: 'c10', V: '23' }
//       ];
//       this.srv.getdata('program', this.tv)
//         .subscribe({
//           next: (r) => {
//             const data = r.Data[0];
//             this.programList = data.map((item: any) => ({
//               DisplayText: item.Title,
//               DataValue: item.ProgramID,
//               ProgramID: item.id
//             }));
//             this.cdr.markForCheck();
//             resolve();
//           },
//           error: () => resolve()
//         });
//     });
//   }

//   onFileSelected(file: File) {

//     if (!file) return;
//     if (file.size > this.maxSize) {
//       this.errors.file = 'File size should be less than 1.5 GB';
//       return;
//     }

//     if (this.errors.file) {
//       delete this.errors.file;
//     }

//     this.selectedFile = file;
//     this.fileName = file.name;
//     this.fileSize =
//       (file.size / 1024 / 1024).toFixed(2) + ' MB';
//     this.fileType = file.type;
//     this.extension =
//       file.name.split('.').pop()?.toLowerCase() || '';
//     this.previewUrl = URL.createObjectURL(file);
//     this.dimension = '';
//     const isVideo = file.type.startsWith('video');
//     const media = document.createElement(
//       isVideo ? 'video' : 'audio'
//     );

//     const url = URL.createObjectURL(file);

//     media.onloadedmetadata = () => {

//       const duration =
//         Math.floor(media.duration) + ' sec';

//       if (isVideo) {
//         const width =
//           (media as HTMLVideoElement).videoWidth;

//         const height =
//           (media as HTMLVideoElement).videoHeight;

//         this.dimension =
//           `${width} x ${height} • ${duration}`;

//       } else {

//         this.dimension = duration;
//       }

//       URL.revokeObjectURL(url);

//       this.cdr.markForCheck();
//     };

//     media.src = url;
//   }

//   removeFile() {

//     if (this.previewUrl) {

//       URL.revokeObjectURL(this.previewUrl);
//     }

//     this.fileName = '';
//     this.fileSize = '';
//     this.fileType = '';
//     this.previewUrl = '';
//     this.selectedFile = null;
//   }

//   isImageType(): boolean {

//     return this.fileType.startsWith('image');
//   }

//   isVideoType(): boolean {

//     return this.fileType.startsWith('video');
//   }

//   validateForm(): boolean {

//     this.errors = {};

//     if (!this.selectedMediaType) {

//       this.errors.type = 'Please select media type';
//     }

//     return Object.keys(this.errors).length === 0;
//   }

//   saveChanges() {

//     if (!this.validateForm()) return;

//     this.loading = true;

//     setTimeout(() => {

//       this.loading = false;

//       this.toast.show({
//         title: 'Updated Successfully 🎉',
//         description: 'Media details updated successfully',
//         variant: 'success',
//         position: 'toast-bottom-right'
//       });

//       this.dialogRef.close(true);

//       this.cdr.detectChanges();

//     }, 1500);
//   }
// }

import { CommonModule } from '@angular/common';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';

import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ToastService } from '../../../../services/toastService';

import {
  ghoresult,
  tags
} from '../../../../../model/ghomodel';

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
    MatSelectModule,
    MatIconModule,

    StepBadge,
    UploadBox,
    FormSelect,
    FormInput,
    PrimaryButton,

    PreScheduled,
    PodcastFile,
    Shorts,
    VideoFile
  ],

  templateUrl: './edit-uploaded-file.html',
  styleUrl: './edit-uploaded-file.css',
})

export class EditUploadedFile implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
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

  fileName: string = '';
  fileSize: string = '';
  fileType: string = '';
  previewUrl: string = '';
  extension: string = '';
  dimension: string = '';

  selectedFile: File | null = null;

  thumbnailFile: any = null;

  selectedMediaType: string = '';
  selectedProgramName: string = '';

  mediaTypeOptions: any[] = [];
  programList: any[] = [];

  ds: any = null;

  errors: any = {};

  maxSize = 1.5 * 1024 * 1024 * 1024;

  ngOnInit(): void {

    const storedId =
      sessionStorage.getItem('id');

    this.userId =
      storedId
        ? JSON.parse(storedId)
        : '';

    this.getMediaTypes();

    this.getMediaLibrary();
  }

  close() {

    this.dialogRef.close();
  }

  getMediaLibrary(): void {

    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.data?.id },
      { T: 'c10', V: '15' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({

        next: async (r: any) => {

          this.ds =
            r?.Data?.[0]?.[0] || null;

          if (this.ds) {

            this.fileName =
              this.ds.FileName || '';

            this.fileSize =
              this.formatFileSize(
                Number(this.ds.Size || 0)
              );

            this.previewUrl =
              this.ds._url || '';

            this.fileType =
              this.getFileTypeFromUrl(
                this.ds._url || ''
              );

            this.extension =
              this.fileName
                .split('.')
                .pop()
                ?.toLowerCase() || '';

            // FIXED CATEGORY MAPPING
            this.selectedMediaType =
              this.mapCategoryToType(
                this.ds.CategoryName || ''
              );

            this.selectedProgramName =
              this.ds.Name || '';

            if (this.ds.ThumbnailUrl) {

              this.thumbnailFile =
                this.ds.ThumbnailUrl;
            }

            if (this.selectedMediaType) {

              await this.getProgramList();
            }
          }

          this.loading = false;

          this.cdr.markForCheck();
        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

          this.cdr.markForCheck();
        }
      });
  }

  mapCategoryToType(category: string): string {

    switch (category?.toLowerCase()) {

      case 'pre-scheduled':
        return '1';

      case 'podcast':
        return '2';

      case 'video':
        return '3';

      case 'shorts':
        return '4';

      default:
        return '';
    }
  }

  getMediaTypes(): void {

    this.tv = [
      { T: 'dk1', V: 'MEDIATYPES' },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({

        next: (r) => {

          this.mediaTypeOptions =
            r.Data[0];

          this.cdr.markForCheck();
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
        {
          T: 'dk1',
          V: this.selectedMediaType
        },
        {
          T: 'c10',
          V: '23'
        }
      ];

      this.srv.getdata('program', this.tv)
        .subscribe({

          next: (r) => {

            const data = r.Data[0];

            this.programList =
              data.map((item: any) => ({

                DisplayText:
                  item.Title,

                DataValue:
                  item.ProgramID,

                ProgramID:
                  item.id
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

      this.errors.file =
        'File size should be less than 1.5 GB';

      return;
    }

    this.selectedFile = file;

    this.fileName = file.name;

    this.fileSize =
      (file.size / 1024 / 1024)
        .toFixed(2) + ' MB';

    this.fileType = file.type;

    this.extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase() || '';

    this.previewUrl =
      URL.createObjectURL(file);

    this.cdr.markForCheck();
  }

  removeFile() {

    this.fileName = '';
    this.fileSize = '';
    this.fileType = '';
    this.previewUrl = '';

    this.selectedFile = null;

    this.cdr.markForCheck();
  }

  onThumbnailSelected(file: File) {

    if (!file) return;

    this.thumbnailFile = file;

    this.cdr.markForCheck();
  }

  removeThumbnail() {

    this.thumbnailFile = null;

    this.cdr.markForCheck();
  }

  getThumbnailName(
    thumbnail: any
  ): string {

    if (typeof thumbnail === 'string') {

      return (
        thumbnail
          .split('/')
          .pop() || 'thumbnail'
      );
    }

    return (
      thumbnail?.name || 'thumbnail'
    );
  }

  formatFileSize(bytes: number): string {

    if (!bytes) return '0 MB';

    return (
      bytes / 1024 / 1024
    ).toFixed(2) + ' MB';
  }

  getFileTypeFromUrl(
    url: string
  ): string {

    const extension =
      url
        .split('.')
        .pop()
        ?.toLowerCase();

    if (!extension) return '';

    if (
      ['mp4', 'mov', 'avi', 'webm']
        .includes(extension)
    ) {

      return 'video/mp4';
    }

    if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp']
        .includes(extension)
    ) {

      return 'image/jpeg';
    }

    if (
      ['mp3', 'wav', 'aac', 'm4a']
        .includes(extension)
    ) {

      return 'audio/mp3';
    }

    return '';
  }

  isImageType(): boolean {

    return this.fileType
      .startsWith('image');
  }

  isVideoType(): boolean {

    return this.fileType
      .startsWith('video');
  }

  isAudioType(): boolean {

    return this.fileType
      .startsWith('audio');
  }

  validateForm(): boolean {

    this.errors = {};

    if (!this.selectedMediaType) {

      this.errors.type =
        'Please select media type';
    }

    return (
      Object.keys(this.errors)
        .length === 0
    );
  }

  saveChanges() {

    if (!this.validateForm()) return;

    this.loading = true;

    setTimeout(() => {

      this.loading = false;

      this.toast.show({

        title:
          'Updated Successfully 🎉',

        description:
          'Media details updated successfully',

        variant: 'success',

        position:
          'toast-bottom-right'
      });

      this.dialogRef.close(true);

      this.cdr.markForCheck();

    }, 1500);
  }
}