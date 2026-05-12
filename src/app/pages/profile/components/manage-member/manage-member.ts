import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DeleteProgram } from '../delete-program/delete-program';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { FormMultiSelect } from '../../../../components/dialog-form/form-multiselect/form-multiselect';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ToastService } from '../../../../services/toastService';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manage-member',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule, CommonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatSelectTrigger, MatChipsModule, MatSlideToggle,
    DialogHeaderComponent, StepBadge, FormInput, FormSelect, FormMultiSelect],
  templateUrl: './manage-member.html',
  styleUrl: './manage-member.css',
})
export class ManageMember {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  ds: [] = [];
  profile: any = {};
  assignedPrograms: any[] = [];
  performance: any = {};
  media: any = {};
  selectedFile!: File;
  fileName: string = '';
  errors: any = {};
  id: any = '';
  profilePicID: any = ''
  toast = inject(ToastService);
  route = inject(ActivatedRoute);
  dialogData = inject(MAT_DIALOG_DATA);
  roles: any[] = [];
  programList: any[] = [];
  constructor(private dialogRef: MatDialogRef<ManageMember>, private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef, private cd: ChangeDetectorRef) { }

  programs = [
    { program: 'Om Shanti Om' },
    { program: 'Bollywood Rewind' },
    // { program: 'Hungama Radio' },
    // { program: 'Indo American News' },
    // { program: 'Talk with Stars' },
    // { program: 'Studio Conversations' },
    // { program: 'Dial In & Speak Out' }
  ];

  selectedPrograms: any[] = [];

  permissions: any[] = [];

  setPermissions() {
    this.permissions = [
      {
        name: 'Media Upload',
        checked: !!this.profile?.MediaUploadPermission
      },
      {
        name: 'Ad Management',
        checked: !!this.profile?.AdManagementPermission
      },
      {
        name: 'Program Management',
        checked: !!this.profile?.ProgramManagementPermission
      },
      {
        name: 'Member Management',
        checked: !!this.profile?.MemberManagementPermission
      }
    ];

    // toggle ON only if all permissions are true
    this.isFullAccess = this.permissions.every(p => p.checked);
  }

  isFullAccess = false;

  onToggleChange() {
    this.permissions.forEach(p => {
      p.checked = this.isFullAccess;
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
          this.roles = r.Data[0] || [];
          if (this.profile?.Role && this.roles.length) {
            const match = this.roles.find(
              role => role.DisplyText === this.profile.Role
            );

            if (match) {
              this.profile = {
                ...this.profile,
                Role: match.DisplyText
              };
            }
          }
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  getProgramList(): void {
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

  remove(item: any) {
    this.selectedPrograms = this.selectedPrograms.filter(p => p !== item);
  }

  close() {
    this.dialogRef.close();
  }
  openModalDelete() {
    this.dialog.open(DeleteProgram, {
      width: '600px',
      disableClose: true
    });
  }

  getProfile(): void {
    this.loading = true;
    const userId = this.id;
    const tv = [
      { T: 'dk1', V: userId },
      { T: 'c10', V: '3' }
    ];
    this.srv.getdata('teammember', tv)
      .subscribe({
        next: (r) => {
          const data = r.Data;
          this.profile = data[0]?.[0] || {};
          this.assignedPrograms = data[1] || [];
          this.performance = data[2] || [];
          this.media = data[3] || [];
          this.setPermissions();
          this.cdr.detectChanges();
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  ngOnInit(): void {
    this.id = this.dialogData.id;
    this.getProfile();
    this.getRoles();
    this.getProgramList();
  }

  clearError(field: string) {
    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.errors.file = 'Only images are allowed';
      return;
    }
    this.selectedFile = file;
    this.fileName = file.name;
    this.clearError('file');
    try {
      const userId = this.id;
      const success = await this.srv.handleFileUpload(
        this.profilePicID,
        userId,
        this.selectedFile,
        '9'
      );

      if (success) {
        this.getProfile();
        this.toast.show({
          title: 'Profile picture uploaded successfully 🎉',
          description: '',
          variant: 'success',
          position: 'toast-bottom-right'
        });
      } else {
        this.toast.show({
          title: 'Upload failed ❌',
          description: 'Unable to upload profile picture',
          variant: 'error',
          position: 'toast-bottom-right'
        });
      }

    } catch (error) {
      this.toast.show({
        title: 'Something went wrong ❌',
        description: 'Please try again',
        variant: 'error',
        position: 'toast-bottom-right'
      });
    }
  }

}
