import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
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
import { InputTime } from '../../../../components/dialog/input-time/input-time';

@Component({
  selector: 'app-upload-ad-file',
  standalone: true,
  imports: [
    MatDialogContent, MatRadioGroup, FormsModule, MatRadioButton,
    MatFormField, MatSelect, MatOption, MatIcon,
    StepBadge, FormInput, UploadBox, FormSelect,
    SchedulePicker, Checkbox, ScheduleDateRange,
    CommonModule, PrimaryButton, MatProgressSpinnerModule,InputTime
  ],
  templateUrl: './upload-ad-file.html',
  styleUrl: './upload-ad-file.css',
})
export class UploadAdFile implements OnInit {

  constructor(private dialogRef: MatDialogRef<UploadAdFile>,@Inject(MAT_DIALOG_DATA) public data: any,private cd: ChangeDetectorRef) { }

  toast = inject(ToastService);
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

scheduleModel = {
  fromTime: '',
  toTime: ''
};

  programTitle: string = '';
  AdvertiserName: string = '';
  additionalNotes: string = '';

  fromDate: string = '';
  toDate: string = '';
  fromTime: string = '';
  toTime: string = '';
  // scheduleModel: any = {};

  playsPerDay: number = 5;
  selectedStatus: string = 'active';

  adsEnabled: boolean = false;
  promotionsEnabled: boolean = false;

  selectedFile!: File;
  fileName: string = '';
  fid: string = '';
  loading = false;
  errors: any = {};
  id: string = '';
  advertisementID:string="";
  isEditMode = false;

  statusMap: any = {
    active: 1,
    waiting: 2,
    published: 3,
    expired: 4
  };

  ngOnInit(): void {
  if (this.data?.mode === 'edit') {
    this.isEditMode = true;
    this.populateForm(this.data.advertisement);
     console.log('Advertisement Data:', this.data.advertisement);
  }
}

formatTimeForInput(time: string): string {
  if (!time) return '';
  return time.slice(0, 5); // "06:00:00" → "06:00"
}

populateForm(ad: any) {
  this.programTitle = ad.Title;
  this.AdvertiserName = ad.AdvertiserName;
  this.fromDate = ad.StartDate;
  this.toDate = ad.EndDate;
  this.playsPerDay = ad.PlaybackCount;
  this.additionalNotes = ad.Notes;
  this.selectedStatus = this.getStatusKey(ad.Status);
  this.scheduleModel = {
  fromTime: this.formatTimeForInput(ad.StartTime),
  toTime: this.formatTimeForInput(ad.EndTime),
};
  this.fid = ad.fid;

  // Optional preview
  this.fileName = ad.FileName;

  this.id = ad.ID;
  this.advertisementID=ad.id1
  // If you have delivery flags from API
  this.adsEnabled = ad.IsAudioVideoAd === 1 || ad.IsAudioVideoAd === 3;
  const promo = +ad.IsLatestPromotion;
this.adsEnabled = [1, 3].includes(promo);
this.promotionsEnabled = [2, 3].includes(promo);
}


getStatusKey(status: string): string {
  const map: any = {
    'Active': 'active',
    'Waiting List': 'waiting',
    'Published': 'published',
    'Expired': 'expired'
  };

  return map[status?.trim()] || 'active';
}

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

    if (!this.selectedFile && !this.isEditMode) {
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
    this.cd.detectChanges();
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
            this.cd.detectChanges();
            if (success) {
              this.toast.show({
                title: 'Advertisement created successfully! 🎉',
                description: 'Advertisement Published successfully',
                variant: 'success',
                position: 'toast-bottom-center'
              });

              this.dialogRef.close(true);
            } else {
               this.loading = false;
               this.cd.detectChanges();
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
      console.log('time is:',payload);
      
  }

  editAdvertisement(): void {
  if (!this.validateAdvertisementForm()) return;
  this.loading = true;
  this.cd.detectChanges();
  const payload: any = {
    Title: this.programTitle,
    AdvertiserName: this.AdvertiserName,
    StartDate: this.fromDate,
    EndDate: this.toDate,
    PlaybackCount: this.playsPerDay,
    IsLatestPromotion: this.getAdType(),
    Notes: this.additionalNotes,
    Status: this.getStatusValue(),
    StartTime: this.scheduleModel?.fromTime || '',
    EndTime: this.scheduleModel?.toTime || ''
  };
  if (this.selectedFile) {
    payload.AdType = this.getFileType(this.selectedFile);
  }

  const userId = this.srv.getsession('id');

  this.tv = [
    { T: 'dk1', V: this.id }, 
    { T: 'c1', V: JSON.stringify(payload) },
    { T: 'c10', V: '2' }
  ];

  this.srv.getdata('advertisement', this.tv).subscribe({
    next: async (r) => {
      if (r.Status === 1) {
        if (this.selectedFile) {
          const success = await this.srv.handleFileUpload(
            this.advertisementID,
            userId,
            this.selectedFile,
            '7'
          );
          if (!success) {
            this.loading = false;
             this.cd.detectChanges();
            return;
          }
        }

        this.loading = false;
        this.cd.detectChanges();
        this.toast.show({
          title: 'Advertisement updated successfully! 🎉',
          description: '',
          variant: 'success',
          position: 'toast-bottom-center'
        });

        this.dialogRef.close(true);
      }else {
        this.loading = false;
        this.toast.show({
          title: 'Failed to update advertisement ❌',
          description: r?.Info || 'Something went wrong',
          variant: 'error',
          position: 'toast-bottom-right'
        });
           this.cd.detectChanges();
      }
    },
    error: () => {
      this.loading = false;
       this.cd.detectChanges();
    }
  });
}


deleteUpload(fileUploadID: any) {
  console.log('🚀 deleteUpload called with fileUploadID:', fileUploadID);

  if (!fileUploadID) return;

  this.loading = true;
  this.cd.detectChanges(); 

  const userId = this.srv.getsession('id');

  this.tv = [
    { T: 'dk1', V: userId },
    { T: 'dk2', V: '7' },
    { T: 'c1', V: this.fid },
    { T: 'c3', V: this.id },
    { T: 'c10', V: '4' }
  ];

  this.srv.getdata('fileupload', this.tv).subscribe({
    next: (r: any) => {
      console.log('✅ API Response:', r);

      this.loading = false;
      this.cd.detectChanges(); // 🔥 FIX: update UI safely

      if (r.Status === 1) {
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

      this.loading = false;
      this.cd.detectChanges(); // 🔥 FIX

      this.toast.show({
        title: 'Error deleting file',
        description: 'Please try again later',
        variant: 'error',
        position: 'toast-bottom-center'
      });
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