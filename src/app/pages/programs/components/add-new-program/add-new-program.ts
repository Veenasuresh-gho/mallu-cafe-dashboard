import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
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
    private cdr: ChangeDetectorRef
  ) { }
  loading = false;
  initialLoading = false;

  toast = inject(ToastService);
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  categoryList: any[] = [];
  categoryOptions: any[] = [];
  hosts: any[] = [];

  programTitle: string = '';
  selectedHost: string = '';
  selectedCategory: string = '';
  selectedSchedule: any = {};
  selectedType: string = '';

  selectedFile!: File;
  fileName: string = '';

  userId: string = '';
  id: string = '';

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
    this.getInitialData();
  }

  onTimeChange(data: any) {
    console.log('time from child:', data);
    this.selectedSchedule = {
      ...this.selectedSchedule,
      fromTime: data.fromTime,
      toTime: data.toTime
    };
  }
  getInitialData() {
    this.initialLoading = true;

    Promise.all([
      this.getProgramTypeList(),
      this.getTeamMemberList()
    ]).finally(() => {
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
        if (r.Status === 1) {

          const program = r?.Data?.[0]?.[0];

          this.id = program.id;

          const success = await this.srv.handleFileUpload(
            this.id,
            this.userId,
            this.selectedFile,
            '2'
          );
console.log('add-program-data',payload);


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

        }


      },

      error: (err) => {
        console.error(err);

        this.loading = false;

        this.toast.show({
          title: 'Something went wrong ❌',
          description: 'Please try again',
          variant: 'error',
          position: 'toast-bottom-right'
        });

        this.cdr.detectChanges();
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}