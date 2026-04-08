import { ChangeDetectorRef, Component, Inject, inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { SchedulePicker } from '../../../../components/dialog-form/schedule-picker/schedule-picker';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ToastService } from '../../../../services/toastService';

import { ghoresult, tags } from '../../../../../model/ghomodel';

import { MatIconModule } from '@angular/material/icon';
import { InputTime } from '../../../../components/dialog/input-time/input-time';

@Component({
  selector: 'app-add-new-program',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatRadioModule,
    MatDialogModule, MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    DialogHeaderComponent,
    FormInput,
    FormSelect,
    SchedulePicker,
    FooterButton,
    CancelButton,
    PrimaryButton,
    MatIconModule,
    InputTime
  ],
  templateUrl: './add-new-program.html',
  styleUrls: ['./add-new-program.css'],
})
export class AddNewProgram implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddNewProgram>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) { }
  loading = false;
  initialLoading = false;

  toast = inject(ToastService);
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  isEditMode = false;
  categoryList: any[] = [];
  categoryOptions: any[] = [];
  hosts: any[] = [];
  programID: string = '';
  programTitle: string = '';
  selectedHost: string = '';
  selectedCategory: string = '';
  selectedSchedule: any = {};
  selectedType: string = '';

  selectedFile!: File;
  fileName: string = '';
  existingImageUrl: string = '';
  userId: string = '';
  id: string = '';
  fid: string = '';

  errors: any = {};
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  timeModel = {
    fromTime: '',
    toTime: ''
  };


  clearError(field: string) {
    if (this.errors[field]) delete this.errors[field];
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.programTitle?.trim()) this.errors.programTitle = 'Program title is required';
    if (!this.selectedHost) this.errors.host = 'Please select a host / RJ';
    if (!this.selectedCategory) this.errors.category = 'Please select a program category';
    if (!this.selectedType) this.errors.type = 'Please choose a call option';
    return Object.keys(this.errors).length === 0;
  }


  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id') || '';
    this.getInitialData().then(() => {
      if (this.data?.mode === 'edit') {
        this.isEditMode = true;
        setTimeout(() => {
          this.populateForm(this.data.program);
          this.cdr.detectChanges();
        });
      }
    });
  }

  populateForm(program: any) {
    this.programTitle = program?.Title || '';
    const selectedHostObj = this.hosts.find(
      h => h.DisplayText === program.HostName
    );
    this.selectedHost = selectedHostObj?.DataValue || '';

    const selectedCategoryObj = this.categoryOptions.find(
      c => c.DisplyText === program.CategoryName
    );
    this.selectedCategory = selectedCategoryObj?.DataValue || '';

    const dayMap: any = {
      Mon: '1',
      Tue: '2',
      Wed: '3',
      Thu: '4',
      Fri: '5',
      Sat: '6',
      Sun: '7'
    };

    let fromDay = '';
    let toDay = '';

    if (program?.DayRange) {
      const [from, to] = program.DayRange.split(' - ');
      fromDay = dayMap[from] || '';
      toDay = dayMap[to] || '';
    }

    let fromTime = '';
    let toTime = '';

    if (program?.TimeRange) {
      const [fromT, toT] = program.TimeRange.split(' - ');
      fromTime = fromT || '';
      toTime = toT || '';
    }

    this.selectedSchedule = {
      fromDay,
      toDay,
      fromTime,
      toTime
    };
    this.fid = program.fid;
    this.programID = program.ProgramID
    this.selectedType = program?.IsCallAllowed ? 'allow' : 'disable';
    this.id = program?.id || '';
    this.existingImageUrl = program?._url || '';
    this.fileName = program?.filename || '';
    this.cdr.detectChanges();
  }

  getInitialData(): Promise<void> {
    this.initialLoading = true;

    return Promise.all([
      this.getProgramTypeList(),
      this.getTeamMemberList()
    ]).then(() => {
      this.initialLoading = false;
    });
  }

  getTeamMemberList(): Promise<void> {
    return new Promise((resolve) => {
      this.tv = [{ T: 'c10', V: '3' }];

      this.srv.getdata('teammember', this.tv)
        .subscribe({
          next: (r) => {
            const data = r.Data[0];
            this.hosts = data.map((item: any) => ({
              DisplayText: item.FullName,
              DataValue: item.MemberID
            }));
            resolve();
          },
          error: () => resolve()
        });
    });
  }

  getProgramTypeList(): Promise<void> {
    return new Promise((resolve) => {
      this.tv = [
        { T: 'dk1', V: 'PROGRAMCATEGORY' },
        { T: 'c10', V: '3' },
      ];

      this.srv.getdata('lists', this.tv)
        .subscribe({
          next: (r) => {
            this.categoryOptions = r.Data[0];
            resolve();
          },
          error: () => resolve()
        });
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errors.file = 'Only image files allowed';
      return;
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9._]/g, '');
    this.selectedFile = new File([file], cleanName, {
      type: file.type
    });

    this.fileName = cleanName;

    this.clearError('file');
  }
  addProgram(): void {
    if (!this.validateForm()) return;

    this.loading = true;
    this.cdr.detectChanges();

    const payload = {
      Title: this.programTitle,
      CategoryID: this.selectedCategory,
      ScheduleStartDay: this.selectedSchedule.fromDay,
      ScheduleEndDay: this.selectedSchedule.toDay,
      StartTime: this.selectedSchedule.fromTime,
      EndTime: this.selectedSchedule.toTime,
      HostID: this.selectedHost,
      IsCallAllowed: this.selectedType === "allow" ? 1 : 0
    };

    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('program', this.tv).subscribe({
      next: async (r) => {
        if (r.Status !== 1) {
          this.loading = false;
          this.cdr.detectChanges();
          this.toast.show({
            title: r.Info || 'Failed to create program ❌',
            description: r.Info || 'Please check your inputs',
            variant: 'error',
            position: 'toast-bottom-right'
          });

          return;
        }

        const program = r?.Data?.[0]?.[0];
        this.id = program.id;

        let success = true;

        if (this.selectedFile) {
          success = await this.srv.handleFileUpload(
            this.id,
            this.userId,
            this.selectedFile,
            '2'
          );
        }

        if (success) {
          this.toast.show({
            title: `${program?.msg || 'Program created successfully'} 🎉`,
            description: 'Program created successfully',
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

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);

        this.loading = false;
        this.cdr.detectChanges();

        this.toast.show({
          title: 'Something went wrong ❌',
          description: 'Please try again',
          variant: 'error',
          position: 'toast-bottom-right'
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  updateProgram(): void {
    if (!this.validateForm()) return;
    this.loading = true;
    this.cdr.detectChanges();
    const payload = {
      Title: this.programTitle,
      CategoryID: this.selectedCategory,
      ScheduleStartDay: this.selectedSchedule.fromDay,
      ScheduleEndDay: this.selectedSchedule.toDay,
      StartTime: this.selectedSchedule.fromTime,
      EndTime: this.selectedSchedule.toTime,
      HostID: this.selectedHost,
      IsCallAllowed: this.selectedType === "allow" ? 1 : 0
    };


    this.tv = [
      { T: 'dk1', V: this.id },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];

    this.srv.getdata('program', this.tv).subscribe({
      next: async (r) => {
        this.loading = false;
        this.cdr.detectChanges();
        if (r.Status !== 1) {
          this.toast.show({
            title: 'Update failed ❌',
            description: r?.Info || 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-right'
          });
          return;
        }
        const program = r?.Data?.[0]?.[0];
        this.id = program?.id;

        let uploadSuccess = true;

        if (this.selectedFile) {
          uploadSuccess = await this.srv.handleFileUpload(
            this.id,
            this.userId,
            this.selectedFile,
            '2'
          );
        }

        if (!this.selectedFile && !this.existingImageUrl) {
          // Optional API call if backend supports delete
          // await this.srv.deleteFile(this.id);
        }

        if (uploadSuccess) {
          this.toast.show({
            title: `${program?.msg || 'Program updated successfully'} 🎉`,
            description: 'Program updated successfully',
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
      },

      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.show({
          title: 'Something went wrong ❌',
          description: 'Please try again',
          variant: 'error',
          position: 'toast-bottom-right'
        });
      }
    });
  }

  deleteUpload(fileUploadID: any) {
    if (!fileUploadID) return;
    this.loading = true;
    this.cdr.detectChanges();
    const userId = this.srv.getsession('id');
    this.tv = [
      { T: 'dk1', V: userId },
      { T: 'dk2', V: '2' },
      { T: 'c1', V: this.fid },
      { T: 'c3', V: this.programID },
      { T: 'c10', V: '4' }
    ];
    this.srv.getdata('fileupload', this.tv).subscribe({
      next: (r: any) => {
        this.loading = false;
        this.cdr.detectChanges();
        if (r.Status === 1) {
          this.toast.show({
            title: 'File deleted successfully! 🎉',
            description: '',
            variant: 'success',
            position: 'toast-bottom-right'
          });
          this.selectedFile = undefined as any;
          this.fileName = '';
          this.fid = '';
          this.cdr.detectChanges();
        } else {
          const apiMsg = r.Data?.[0]?.[0]?.msg || 'Please try again';
          this.toast.show({
            title: 'Failed to delete file',
            description: apiMsg,
            variant: 'error',
            position: 'toast-bottom-right'
          });
        }
      },
      error: (err) => {
        console.error('💥 Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
        this.toast.show({
          title: 'Error deleting file',
          description: 'Please try again later',
          variant: 'error',
          position: 'toast-bottom-right'
        });
      }
    });
  }

  removeExistingImage() {
    this.existingImageUrl = '';
    this.fileName = '';
  }

}