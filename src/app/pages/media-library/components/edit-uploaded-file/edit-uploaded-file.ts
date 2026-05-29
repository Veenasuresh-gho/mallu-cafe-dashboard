

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
    private cdr: ChangeDetectorRef, private cd: ChangeDetectorRef
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
  fileID: string = '';

  selectedFile: File | null = null;

  thumbnailFile: any = null;

  selectedMediaType: string = '';
  selectedProgramName: string = '';
  selectedType: string = 'program';

  mediaTypeOptions: any[] = [];
  programList: any[] = [];

  ds: any = null;

  errors: any = {};

  maxSize = 1.5 * 1024 * 1024 * 1024;
  podcastData: any = {};
  preScheduleData: any = {};
  videoData: any = {};
  shortsData: any = {};


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
            this.fileName = this.ds.FileName || '';
            this.fileID = this.ds.fid || '';
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
    const normalized =
      category
        ?.toLowerCase()
        .trim();
    switch (normalized) {
      case 'pre-scheduled':
      case 'pre scheduled':
      case 'prescheduled':
        return '1';

      case 'podcast':
        return '2';

      case 'featured videos':
      case 'featured video':
      case 'video':
      case 'videos':
        return '3';

      case 'shorts':
      case 'short':
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
        {T: 'dk1',V: this.selectedMediaType},
        { T: 'c10', V: '23'}
      ];
      this.srv.getdata('program', this.tv)
        .subscribe({
          next: (r) => {
            const data = r.Data[0];
            this.programList =
              data.map((item: any) => ({
                DisplayText: item.Title,
                DataValue:item.ProgramID,
                ProgramID:item.id
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

  deleteFile(fileUploadID: any) {
    if (!fileUploadID) return;
    this.loading = true;
    this.cd.detectChanges();
    const userId = this.srv.getsession('id');
    const deleteType = this.getDeleteType();
    this.tv = [
      { T: 'dk1', V: userId },
      { T: 'dk2', V: deleteType },
      { T: 'c1', V: fileUploadID },
      { T: 'c10', V: '4' }
    ];
    this.srv.getdata('fileupload', this.tv).subscribe({
      next: (r: any) => {
        this.cd.detectChanges();
        if (r.Status === 1) {
          this.getMediaLibrary();
          this.toast.show({
            title: 'File deleted successfully! 🎉',
            description: '',
            variant: 'success',
            position: 'toast-bottom-center'
          });
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
        console.error('💥 Error:', err);
        this.cd.detectChanges();
        this.toast.show({
          title: 'Error deleting file',
          description: 'Please try again later',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
  }

  getDeleteType(): string {
    switch (this.ds?.CategoryName?.toLowerCase()) {
      case 'podcast':
        return '6';
      case 'prescheduled':
        return '5';
      case 'shorts':
        return '4';
      default:
        return '6';
    }
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
  if (this.selectedMediaType === '1') {
    this.updatePreScheduled();

  } else if (this.selectedMediaType === '2') {

    this.updatePodcast();

  } else if (this.selectedMediaType === '3') {

    this.updateVideos();

  } else if (this.selectedMediaType === '4') {

    this.updateShorts();

  }
}

  updatePreScheduled(): void {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: this.ds?.id },
      { T: 'c1', V: this.ds?.Name || '' },
      { T: 'c2', V: '' },
      { T: 'c3', V: this.preScheduleData?.typedText || '' },
      { T: 'c4', V: this.preScheduleData?.fileName || '' },
      { T: 'c10', V: '25' }

    ];
    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {
          if (r.Status === 1) {
            if (this.selectedFile instanceof File) {
              const renamedFile = new File(
                [this.selectedFile],
                this.preScheduleData?.fileName,
                {
                  type: this.selectedFile.type
                }
              )
              const videoUploadSuccess =
                await this.srv.handleFileUpload(
                  this.ds?.id,
                  this.userId,
                  renamedFile,
                  '5'
                );
              if (!videoUploadSuccess) {
                this.loading = false;
                this.toast.show({
                  title: 'Video upload failed ❌',
                  description: 'Unable to upload media file',
                  variant: 'error',
                  position: 'toast-bottom-right'
                });
                this.cdr.detectChanges();
                return;
              }
            }
            if (
              this.preScheduleData?.thumbnailType === 'custom' &&
              this.preScheduleData?.thumbnailFile instanceof File
            ) {
              const thumbnailUploadSuccess =
                await this.srv.handleFileUpload(
                  this.ds?.id,
                  this.userId,
                  this.preScheduleData.thumbnailFile,
                  '12'
                );

              if (thumbnailUploadSuccess === false) {
                this.loading = false;
                this.toast.show({
                  title: 'Thumbnail upload failed ❌',
                  description: 'Unable to upload thumbnail',
                  variant: 'error',
                  position: 'toast-bottom-right'
                });
                this.cdr.detectChanges();
                return;
              }
            }
            this.loading = false;
            this.toast.show({
              title: 'Updated Successfully 🎉',
              description: 'Pre-scheduled file updated',
              variant: 'success',
              position: 'toast-bottom-right'
            });

            this.dialogRef.close(true);
            this.cdr.detectChanges();
          }
        },

        error: () => {
          this.loading = false;
          this.toast.show({
            title: 'Update failed ❌',
            description: 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-right'
          });

          this.cdr.detectChanges();
        }
      });
  }


  updatePodcast(): void {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: this.ds?.id },
      { T: 'c1', V: this.ds?.Title || '' },
      { T: 'c2', V: this.podcastData?.subtitle || '' },
      { T: 'c3', V: this.podcastData?.typedText || '' },
      { T: 'c4', V: this.podcastData?.fileName || '' },
      { T: 'c10', V: '25' }
    ];
    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {
          if (r.Status === 1) {
            if (this.selectedFile instanceof File) {
              const renamedFile = new File(
                [this.selectedFile],
                this.podcastData?.fileName,
                {
                  type: this.selectedFile.type
                }
              );
              await this.srv.handleFileUpload(
                this.ds?.id,
                this.userId,
                renamedFile,
                '6'
              );
            }
            if (
              this.podcastData?.thumbnailType === 'custom' &&
              this.podcastData?.thumbnailFile instanceof File
            ) {
              await this.srv.handleFileUpload(
                this.ds?.id,
                this.userId,
                this.podcastData.thumbnailFile,
                '11'
              );
            }
            this.loading = false;
            this.toast.show({
              title: 'Podcast Updated 🎉',
              description: 'Podcast updated successfully',
              variant: 'success',
              position: 'toast-bottom-right'
            });
            this.dialogRef.close(true);
            this.cdr.detectChanges();
          }
        },
        error: () => {
          this.loading = false;
          this.toast.show({
            title: 'Update failed ❌',
            description: 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-right'
          });

          this.cdr.detectChanges();
        }
      });
  }

  updateVideos(): void {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: this.ds?.id },
      { T: 'c1', V: this.videoData?.title || '' },
      { T: 'c2', V: this.videoData?.subtitle || '' },
      { T: 'c3', V: this.videoData?.typedText || '' },
      { T: 'c4', V: this.videoData?.fileName || '' },
      { T: 'c10', V: '25' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {
          if (r.Status === 1) {
            if (this.selectedFile instanceof File) {

              const renamedFile = new File(
                [this.selectedFile],
                this.videoData?.fileName,
                {
                  type: this.selectedFile.type
                }
              );

              await this.srv.handleFileUpload(
                this.ds?.id,
                this.userId,
                renamedFile,
                '4'
              );
            }

            // upload thumbnail
            if (this.videoData?.thumbnailFile instanceof File) {
              await this.srv.handleFileUpload(
                this.ds?.id,
                this.userId,
                this.videoData.thumbnailFile,
                '3'
              );
            }

            this.loading = false;
            this.toast.show({
              title: 'Video Updated 🎉',
              description: 'Video updated successfully',
              variant: 'success',
              position: 'toast-bottom-right'
            });

            this.dialogRef.close(true);

            this.cdr.detectChanges();
          }
        },

        error: () => {
          this.loading = false;
          this.toast.show({
            title: 'Update failed ❌',
            description: 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-right'
          });

          this.cdr.detectChanges();
        }
      });
  }


    updateShorts(): void {
    this.loading = true;
    console.log('shortsData',this.shortsData);
    this.tv = [
      { T: 'dk1', V: this.ds?.id },
      { T: 'c1', V: this.shortsData?.title || ''},
      { T: 'c2', V: this.ds?.Subtitle || '' },
      { T: 'c3', V: this.shortsData?.typedText || '' },
      { T: 'c4', V: this.shortsData?.fileName || '' },
      { T: 'c10', V: '25' }
    ];
    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {
          if (r.Status === 1) {
            if (this.selectedFile instanceof File) {
              const renamedFile = new File(
                [this.selectedFile],
                this.shortsData?.fileName,
                {
                  type: this.selectedFile.type
                }
              );

              await this.srv.handleFileUpload(
                this.ds?.id,
                this.userId,
                renamedFile,
                '4'
              );
            }

            // upload thumbnail
            if (this.shortsData?.thumbnailFile instanceof File) {
              await this.srv.handleFileUpload(
                this.ds?.id,
                this.userId,
                this.shortsData.thumbnailFile,
                '3'
              );
            }

            this.loading = false;
            this.toast.show({
              title: 'Video Updated 🎉',
              description: 'Video updated successfully',
              variant: 'success',
              position: 'toast-bottom-right'
            });

            this.dialogRef.close(true);

            this.cdr.detectChanges();
          }
        },

        error: () => {

          this.loading = false;

          this.toast.show({
            title: 'Update failed ❌',
            description: 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-right'
          });

          this.cdr.detectChanges();
        }
      });
  }

}