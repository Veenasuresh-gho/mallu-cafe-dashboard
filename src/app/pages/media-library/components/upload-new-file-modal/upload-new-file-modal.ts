import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AddPodcast } from '../add-podcast/add-podcast';
import { MatSelect } from '@angular/material/select';
import { SelectDropDown } from '../../../../components/select-drop-down/select-drop-down';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { FormCategory } from '../../../../components/dialog-form/form-category/form-category';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { Default } from './upload-files/default/default';
import { PreScheduled } from './upload-files/pre-scheduled/pre-scheduled';
import { Shorts } from './upload-files/shorts/shorts';
import { PodcastFile } from './upload-files/podcast-file/podcast-file';
import { VideoFile } from './upload-files/video-file/video-file';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
import { ToastService } from '../../../../services/toastService';

@Component({
  selector: 'app-upload-new-file-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, SelectDropDown,
    FormsModule, MatSelect,
    MatDialogContent,
    MatRadioGroup, StepBadge, FormSelect,
    MatRadioButton, UploadBox, FormCategory, FormInput, Default, PreScheduled,
    Shorts, VideoFile, PodcastFile, PrimaryButton
  ],
  templateUrl: './upload-new-file-modal.html',
  styleUrl: './upload-new-file-modal.css',
})
export class UploadNewFileModal implements OnInit {
  constructor(private dialogRef: MatDialogRef<UploadNewFileModal>, private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  programId: string = '';
  id: string = '';
  userId: string = '';
  finalfileName: string = '';
  loading = false;
  isPreScheduledValid = false;

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id') || '';
    this.getMediaTypes();
  }


  close() {
    this.dialogRef.close();
  }
  fileName: string = '';
  fileSize: string = '';
  fileType = '';
  dimension: string = '';
  status = 'all';
  selectedMediaType: string = '';
  selectedType: string = '';
  fileSelectedName: string = '';
  fileDetails: any = null;
  extension: string = '';
  selectedProgramId: string = '';
  selectedProgramName: string = '';
  selectedProgramData: any = null;
  selectedFile: File | null = null;
  originalFileName: string = '';
  selectedCategoryId: string = '';
  errors: any = {};
  title: string = '';
  subtitle: string = '';


  typedText: string = '';
  mediaTypeOptions: any[] = [];
  programList: any[] = [];
  toast = inject(ToastService);
  maxSize = 1.5 * 1024 * 1024 * 1024;
  validateForm(): boolean {
    this.errors = {};

    if (!this.selectedFile) {
      this.errors.file = 'Please upload a media file';
    }

    if (!this.selectedMediaType) {
      this.errors.type = 'Please select media type';
    }

    return Object.keys(this.errors).length === 0;
  }

  get isDisabled(): boolean {
    return !this.fileName || !this.selectedMediaType;
  }
  onTextChange(event: any) {
    this.typedText = event.target.innerText;
  }


  renameFile() {
    if (!this.selectedFile || !this.finalfileName) return;

    if (this.selectedFile.name === this.finalfileName) return;

    this.selectedFile = new File(
      [this.selectedFile],
      this.finalfileName,
      { type: this.selectedFile.type }
    );
  }
  updateFileName() {
    this.fileName =
      this.finalfileName ||
      this.selectedFile?.name ||
      '';
  }

  onProgramSelected(data: any) {
    this.selectedProgramId = data.programId;
    this.selectedProgramName = data.programName;
    this.selectedProgramData = data.fullData;
    this.selectedCategoryId = data.categoryId;
    this.programId = data?.programId;

    this.title = data.title;
    this.subtitle = data.subtitle;


    this.finalfileName = data?.fileName || '';

    if (this.selectedFile && this.finalfileName) {
      this.renameFile();
    }

    this.updateFileName();

  }

  onFileSelected(file: File) {
    if (!file) return;

    if (file.size > this.maxSize) {
      this.errors.file = 'File size should be less than 1.5 GB';

      return;
    }

    if (this.errors.file) delete this.errors.file;

    this.selectedFile = file;
    this.originalFileName = file.name;

    if (this.finalfileName) {
      this.renameFile();
    }

    this.updateFileName();

    this.fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
    this.fileType = file.type;
    this.extension = file.name.split('.').pop()?.toLowerCase() || '';

    this.dimension = '';

    const isVideo = file.type.startsWith('video');
    const media = document.createElement(isVideo ? 'video' : 'audio');
    const url = URL.createObjectURL(file);

    media.onloadedmetadata = () => {
      const duration = Math.floor(media.duration) + ' sec';

      if (isVideo) {
        const width = (media as HTMLVideoElement).videoWidth;
        const height = (media as HTMLVideoElement).videoHeight;
        this.dimension = `${width} x ${height} • ${duration}`;
      } else {
        this.dimension = duration;
      }

      URL.revokeObjectURL(url);
      this.cdr.markForCheck();
    };

    media.src = url;
  }
  uploadFile() {
    if (!this.validateForm()) return;

    if (this.selectedMediaType === "1") {
      this.addmediaPre();
    } else if (this.selectedMediaType === '2') {
      this.addmediaPodcast();
    }
  }

  addmediaPre(): void {
    if (!this.selectedFile) return;

    const file = this.selectedFile;

    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.programId },
      { T: 'c10', V: '10' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {

          if (r.Status === 1 && r.Data?.length) {
            this.id = r.Data[0]?.[0]?.ID || this.programId;

            const success = await this.srv.handleFileUpload(
              this.id,
              this.userId,
              file,
              '5'
            );

            this.loading = false;
            if (success) {
              this.toast.show({
                title: 'Podcast media uploaded! 🎉',
                description: 'Podcast media added successfully',
                variant: 'success',
                position: 'toast-bottom-right'
              });

              this.dialogRef.close(true);
            } else {
              this.toast.show({
                title: 'Upload failed ❌',
                description: 'File upload failed',
                variant: 'error',
                position: 'toast-bottom-right'
              });
            }
            this.cdr.detectChanges();
          }


        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  addmediaPodcast(): void {
    if (!this.selectedFile) return;

    const file = this.selectedFile;

    this.loading = true;
    console.log(this.selectedCategoryId)
    this.tv = [
      { T: 'dk1', V: this.programId },
      { T: 'dk2', V: this.selectedCategoryId },
      { T: 'c1', V: this.title },
      { T: 'c2', V: this.subtitle },
      { T: 'c10', V: '20' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {
          if (r.Status === 1 && r.Data?.length) {
            this.id = r.Data[0]?.[0]?.EpisodeID || this.programId;

            const success = await this.srv.handleFileUpload(
              this.id,
              this.userId,
              file,
              '6'
            );

            this.loading = false;
            if (success) {
              this.toast.show({
                title: 'Podcast Program media uploaded! 🎉',
                description: 'media added successfully',
                variant: 'success',
                position: 'toast-bottom-right'
              });

              this.dialogRef.close(true);
            } else {
              this.toast.show({
                title: 'Upload failed ❌',
                description: 'File upload failed',
                variant: 'error',
                position: 'toast-bottom-right'
              });
            }
            this.cdr.detectChanges();
          }


        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  addPublish() {
    this.tv = [
      { T: 'dk1', V: this.programId },
      { T: 'c10', V: '14' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
        },
        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }


  openModalAddPodcast() {
    this.dialog.open(AddPodcast, {
      width: '90%',
      maxWidth: '600px',
      disableClose: true
    });
  }
  inputValue = '';

  onInput(event: any) {
    this.inputValue = event.target.value;

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
        { T: 'c10', V: '5' }
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
}
