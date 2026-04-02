import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { SchedulePicker } from '../../../../components/dialog-form/schedule-picker/schedule-picker';
import { Checkbox } from '../../../../components/dialog-form/checkbox/checkbox';
import { ScheduleDateRange } from '../../../../components/dialog-form/schedule-date-range/schedule-date-range';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../services/toastService';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-upload-ad-file',
  standalone: true,
  imports: [
    MatDialogContent, MatRadioGroup, FormsModule, MatRadioButton,
    MatFormField, MatSelect, MatOption, MatIcon,
    StepBadge, FormInput, UploadBox, FormSelect,
    SchedulePicker, Checkbox, ScheduleDateRange,
    CommonModule, PrimaryButton, MatProgressSpinnerModule
  ],
  templateUrl: './upload-ad-file.html',
  styleUrl: './upload-ad-file.css',
})
export class UploadAdFile {

  constructor(private dialogRef: MatDialogRef<UploadAdFile>) { }

  toast = inject(ToastService);
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  programTitle: string = '';
  AdvertiserName: string = '';
  additionalNotes: string = '';

  fromDate: string = '';
  toDate: string = '';
  scheduleModel: any = {};

  playsPerDay: number = 5;
  selectedStatus: string = 'active';

  adsEnabled: boolean = false;
  promotionsEnabled: boolean = false;

  selectedFile!: File;
  fileName: string = '';

  loading = false;

  errors: any = {};

  id: string = '';

  statusMap: any = {
    active: 1,
    waiting: 2,
    published: 3,
    expired: 4
  };

  getStatusValue(): number {
    return this.statusMap[this.selectedStatus] || 0;
  }

  clearError(field: string) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  getFileType(file: File | null): string {
    if (!file) return '';
    if (file.type.startsWith('audio/')) return '1';
    if (file.type.startsWith('video/')) return '2';
    if (file.type.startsWith('image/')) return '3';
    return '';
  }


  getAdType(): number {
    if (this.adsEnabled && this.promotionsEnabled) return 3;
    if (this.adsEnabled) return 1;
    if (this.promotionsEnabled) return 2;
    return 0;
  }

  validateAdvertisementForm(): boolean {
    this.errors = {};

    if (!this.programTitle?.trim()) {
      this.errors.programTitle = 'Advertisement title is required';
    }

    if (!this.AdvertiserName?.trim()) {
      this.errors.AdvertiserName = 'Advertiser name is required';
    }

    if (!this.selectedFile) {
      this.errors.file = 'Please upload a file';
    }

    if (!this.fromDate) {
      this.errors.fromDate = 'Start date is required';
    }

    if (!this.toDate) {
      this.errors.toDate = 'End date is required';
    }

    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      this.errors.date = 'End date must be after start date';
    }



    if (!this.playsPerDay || this.playsPerDay <= 0) {
      this.errors.playsPerDay = 'Playback count must be greater than 0';
    }

    if (!this.selectedStatus) {
      this.errors.status = 'Please select status';
    }

    if (
      (this.scheduleModel?.fromTime && !this.scheduleModel?.toTime) ||
      (!this.scheduleModel?.fromTime && this.scheduleModel?.toTime)
    ) {
      this.errors.time = 'Please select both start and end time';
    }
    if (!this.adsEnabled && !this.promotionsEnabled) {
  this.errors.delivery = 'Please select at least one delivery option';
} else {
  delete this.errors.delivery;
}

    return Object.keys(this.errors).length === 0;
  }

  onFileSelected(file: File) {
    if (!file) return;

    if (
      !file.type.startsWith('image/') &&
      !file.type.startsWith('audio/') &&
      !file.type.startsWith('video/')
    ) {
      this.errors.file = 'Only image, audio, or video files are allowed';
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;

    this.clearError('file');
  }

  addAdvertisement(): void {
    if (!this.validateAdvertisementForm()) {
      return;
    }

    this.loading = true;

    const payload = {
      Title: this.programTitle,
      AdvertiserName: this.AdvertiserName,
      StartDate: this.fromDate,
      EndDate: this.toDate,
      PlaybackCount: this.playsPerDay,
      IsLatestPromotion: this.getAdType(),
      Notes: this.additionalNotes,
      Status: this.getStatusValue(),
      StartTime: this.scheduleModel?.fromTime || '',
      EndTime: this.scheduleModel?.toTime || '',
      AdType: this.getFileType(this.selectedFile)
    };

    console.log('payloaded', payload);

    const userId = this.srv.getsession('id');

    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('advertisement', this.tv)
      .subscribe({
        next: async (r) => {

          if (r.Status === 1) {
            this.id = r.Data[0][0].Id;

            const success = await this.srv.handleFileUpload(
              this.id,
              userId,
              this.selectedFile,
              '7'
            );

            this.loading = false;

            if (success) {
              this.toast.show({
                title: 'Advertisement created successfully! 🎉',
                description: 'Advertisement Published successfully',
                variant: 'success',
                position: 'toast-bottom-center'
              });

              this.dialogRef.close(true);
            } else {
              this.toast.show({
                title: 'Upload failed ❌',
                description: 'File upload failed',
                variant: 'error',
                position: 'toast-bottom-center'
              });
            }
          }
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  incrementPlays() {
    this.playsPerDay++;
    this.clearError('playsPerDay');
  }

  decrementPlays() {
    if (this.playsPerDay > 0) {
      this.playsPerDay--;
      this.clearError('playsPerDay');
    }
  }
}