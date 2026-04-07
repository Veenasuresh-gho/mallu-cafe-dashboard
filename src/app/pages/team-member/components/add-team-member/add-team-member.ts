import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ChangeDetectorRef } from '@angular/core';
import { FormMultiSelect } from '../../../../components/dialog-form/form-multiselect/form-multiselect';
import { ToastService } from '../../../../services/toastService';


@Component({
  selector: 'app-add-team-member',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule, CommonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatSelectTrigger, MatChipsModule, MatSlideToggle, PrimaryButton,
    FormInput, FormSelect, CancelButton, FooterButton,FormMultiSelect
  ],
  templateUrl: './add-team-member.html',
  styleUrl: './add-team-member.css',
})
export class AddTeamMember implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddTeamMember>) { }

  fullName: string = '';
  role: string = '';
  phone: string = '';
  email: string = '';
  countryId: string = '233';
  loading = false;
  roles: any[] = [];
  programList: any[] = [];
  previewUrl: any;
  id: string = '';
  userId: string = '';
  selectedFile!: File;
  fileName: string = '';
  fileSize: string = '';
  fileUploadId: string = '';
  fileType: string = '';
  documentTypeId: string = '';
  cdr = inject(ChangeDetectorRef);
   toast = inject(ToastService);

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id') || '';
    this.getRoles();
    this.getProgramList();
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    this.fileName = file.name;
    this.fileSize = file.size;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  addTeamMember(): void {
  const permissionPayload: any = {};
  this.permissions.forEach(p => {
    permissionPayload[p.key] = p.checked ? '1' : '0';
  });
  const payload = {
    FullName: this.fullName,
    Role: this.role,
    Phone: this.phone,
    Email: this.email,
    CountryID: this.countryId,
    selectedPrograms: this.selectedPrograms.map(p => p.DataValue).join(','),
    ...permissionPayload
  };
  this.loading = true;
  this.tv = [
    { T: 'c1', V: JSON.stringify(payload) },
    { T: 'c10', V: '1' }
  ];

  this.srv.getdata('teammember', this.tv)
    .subscribe({
      next: (r) => {

        if (r.Status == 1) {
          this.id = r.Data[0][0].Id;

          this.loading = false;
          this.toast.show({
            title: 'Team member added 🎉',
            description: 'User created successfully',
            variant: 'success',
            position: 'toast-bottom-center'
          });

          this.dialogRef.close(true);
          if (this.selectedFile) {
            this.handleUpload(this.id);
          }
        }
      },

      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;

        this.toast.show({
          title: 'Server error 🚨',
          description: 'Please try again later',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
}

handleUpload(id: string) {
  this.srv.handleFileUpload(
    id,
    this.userId,
    this.selectedFile,
    '9'
  ).then((success: boolean) => {

    if (!success) {
      this.toast.show({
        title: 'Upload failed ❌',
        description: 'Profile upload failed',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }

  }).catch((err: any) => {
    console.error('Upload error:', err);
    this.toast.show({
      title: 'Upload error 🚨',
      description: 'Something went wrong while uploading',
      variant: 'error',
      position: 'toast-bottom-center'
    });
  });
}

  getRoles(): void {
    this.tv = [
      { T: 'dk1', V: "ROLES" },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {
          this.roles = r.Data[0];
        },
        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  onRoleChange(value: string) {
    this.role = value;

    if (value === '1') {
      this.isFullAccess = true;
      this.onToggleChange();
    } else {
      this.isFullAccess = false;
      this.onToggleChange();
    }
  }

  addTeamMemberClick() {
    this.addTeamMember();
  }
  getProgramList(): void {
    // this.loading = true;
    this.tv = [{ T: 'c10', V: '3' }];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          const data = r.Data[0];
          this.loading = false;

          this.programList = data.map((item: any) => ({
            DisplayText: item.Title,
            DataValue: item.ProgramID
          }));
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  selectedPrograms: any[] = [];

permissions = [
  { name: 'Media Upload', key: 'IsMediaUploadPermission', checked: false },
  { name: 'Ad Management', key: 'IsAdManagePermission', checked: false },
  { name: 'Program Management', key: 'IsProgramManagePermission', checked: false },
  { name: 'Member Management', key: 'IsMemberManagePersmission', checked: false }
];

  isFullAccess = false;

  onToggleChange() {
    this.permissions.forEach(p => {
      p.checked = this.isFullAccess;
    });
  }

  remove(item: any) {
    this.selectedPrograms = this.selectedPrograms.filter(p => p !== item);
  }
  isAutoPlay: boolean = true;

  close() {
    this.dialogRef.close();
  }
}
