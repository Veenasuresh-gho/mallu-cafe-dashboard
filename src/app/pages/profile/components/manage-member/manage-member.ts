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
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

@Component({
  selector: 'app-manage-member',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule, CommonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatSelectTrigger, MatChipsModule, MatSlideToggle,
    DialogHeaderComponent, StepBadge, FormInput, FormSelect, FormMultiSelect, PrimaryButton],
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
  filteredProgramList: any[] = [];
  isUploading = false;
  constructor(private dialogRef: MatDialogRef<ManageMember>,
     private dialog: MatDialog, private router: Router, 
     private cdr: ChangeDetectorRef, private cd: ChangeDetectorRef) { }

  selectedPrograms: any[] = [];

  permissions = [
    {
      name: 'Media Upload',
      key: 'IsMediaUploadPermission',
      checked: false
    },
    {
      name: 'Ad Management',
      key: 'IsAdManagePermission',
      checked: false
    },
    {
      name: 'Program Management',
      key: 'IsProgramManagePermission',
      checked: false
    },
    {
      name: 'Member Management',
      key: 'IsMemberManagePersmission',
      checked: false
    }
  ];

  setPermissions() {

    this.permissions = [

      {
        name: 'Media Upload',
        key: 'MediaUploadPermission',
        checked: !!this.profile?.MediaUploadPermission
      },

      {
        name: 'Ad Management',
        key: 'AdManagementPermission',
        checked: !!this.profile?.AdManagementPermission
      },

      {
        name: 'Program Management',
        key: 'ProgramManagementPermission',
        checked: !!this.profile?.ProgramManagementPermission
      },

      {
        name: 'Member Management',
        key: 'MemberManagementPermission',
        checked: !!this.profile?.MemberManagementPermission
      }

    ];

    // toggle ON only if all permissions are true
    this.isFullAccess = this.permissions.every(p => p.checked);
  }

  onPermissionChange() {
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
  this.tv = [
    { T: 'c1', V: this.id },
    { T: 'c10', V: '3' }];

  this.srv.getdata('program', this.tv)
    .subscribe({
      next: (r) => {

        const data = r.Data[0];
        this.loading = false;

        this.programList = data.map((item: any) => ({
          DisplayText: item.Title,
          DataValue: item.id,
          IsHostFull: item.IsHostFull

        }));

        this.updateFilteredPrograms();
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


  getProfileImage(url: string): string {
  return url ? encodeURI(url) : '/profile/profile-fallback-1.png';
}

updateFilteredPrograms(): void {
  const assignedIds = this.assignedPrograms.map(
    (p: any) => p.id1
  );
  this.filteredProgramList = this.programList
    .filter((program: any) => !assignedIds.includes(program.DataValue))
    .map((program: any) => ({
      ...program,
      // disable if host full
      disabled: program.IsHostFull === 1,

      // optional label
      DisplayText: program.IsHostFull === 1
        ? `${program.DisplayText} `
        : program.DisplayText

    }));

}

openModalDelete(programId: string) {
  const dialogRef = this.dialog.open(DeleteProgram, {
    width: '600px',
    disableClose: true,
    data: {
      memberId: this.id,
      programId: programId
    }
  });
  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.getProfile();
    }

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
          this.updateFilteredPrograms();
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

  // async onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //   if (!file.type.startsWith('image/')) {
  //     this.errors.file = 'Only images are allowed';
  //     return;
  //   }
  //   this.selectedFile = file;
  //   this.fileName = file.name;
  //   this.clearError('file');
  //   try {
  //     const userId = this.id;
  //     const success = await this.srv.handleFileUpload(
  //       this.profilePicID,
  //       userId,
  //       this.selectedFile,
  //       '9'
  //     );

  //     if (success) {
  //       this.toast.show({
  //         title: 'Profile picture uploaded successfully 🎉',
  //         description: '',
  //         variant: 'success',
  //         position: 'toast-bottom-right'
  //       });
  //        this.getProfile();
  //     } else {
  //       this.toast.show({
  //         title: 'Upload failed ❌',
  //         description: 'Unable to upload profile picture',
  //         variant: 'error',
  //         position: 'toast-bottom-right'
  //       });
  //     }

  //   } catch (error) {
  //     this.toast.show({
  //       title: 'Something went wrong ❌',
  //       description: 'Please try again',
  //       variant: 'error',
  //       position: 'toast-bottom-right'
  //     });
  //   }
  // }

  isLandscape = false;

  async onFileSelected(event: any) {
  const file = event.target.files[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    this.errors.file = 'Only images are allowed';
    return;
  }

    const img = new Image();

  img.onload = () => {
    this.isLandscape = img.width > img.height;
    this.cdr.detectChanges();
  };

  img.src = URL.createObjectURL(file);

  this.selectedFile = file;
  this.fileName = file.name;

  this.clearError('file');

  this.isUploading = true;
  
  try {
    const userId = this.id;

    const success = await this.srv.handleFileUpload(
      this.profilePicID,
      userId,
      this.selectedFile,
      '9'
    );

    if (success) {

      this.toast.show({
        title: 'Profile picture uploaded successfully 🎉',
        description: '',
        variant: 'success',
        position: 'toast-bottom-right'
      });
    
      this.getProfile();
       this.cdr.detectChanges();
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

  } finally {
     this.cdr.detectChanges();
    this.isUploading = false;
    event.target.value = '';

  }
}





editProfileDetails(): void {
  if (!this.profile?.FullName || !this.profile?.Email) {
    this.toast.show({
      title: 'Missing fields ⚠️',
      description: 'Name and Email are required',
      variant: 'warning',
      position: 'toast-bottom-center'
    });

    return;
  }

  const selectedRole = this.roles.find(
    r => r.DisplyText === this.profile.Role
  );

  const permissionPayload: any = {};
  this.permissions.forEach((p: any) => {
    permissionPayload[p.key] = p.checked ? '1' : '0';
  });

  // Main payload
  const payload = {

    FullName: this.profile.FullName,
    Role: selectedRole ? selectedRole.DataValue : null,
    Phone: this.profile.Phone,
    Email: this.profile.Email,
    CountryID: this.profile.CountryID,

    ...permissionPayload

  };


  // Separate programs payload
  const selectedPrograms = this.selectedPrograms
    .map((p: any) => p.DataValue)
    .join(',');

  this.loading = true;
  this.cdr.markForCheck();

  this.tv = [
    { T: 'dk1', V: this.profile.id },
    { T: 'c1', V: JSON.stringify(payload) },
    { T: 'c2', V: selectedPrograms },
    { T: 'c10', V: '2' }
  ];

  this.srv.getdata('teammember', this.tv).subscribe({

    next: (r) => {

      this.loading = false;
      this.cdr.markForCheck();

      if (r.Status == 1) {

        this.toast.show({
          title: 'Profile updated ✅',
          description: 'Changes saved successfully',
          variant: 'success',
          position: 'toast-bottom-center'
        });

        this.dialogRef.close(true);

      } else {

        this.toast.show({
          title: 'Update failed ❌',
          description: r?.Info || 'Something went wrong',
          variant: 'error',
          position: 'toast-bottom-right'
        });

      }

    },

    error: (err) => {
      console.error('API Error:', err);

      this.loading = false;
      this.cdr.markForCheck();
      this.toast.show({
        title: 'Server error 🚨',
        description: 'Please try again later',
        variant: 'error',
        position: 'toast-bottom-right'
      });

    }

  });

}

}
