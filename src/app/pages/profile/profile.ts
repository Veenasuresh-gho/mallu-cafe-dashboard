import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { ProfileInfo } from './components/profile-info/profile-info';
import { AssignedPrgm } from './components/assigned-prgm/assigned-prgm';
import { Perfomance } from './components/perfomance/perfomance';
import { MediaContribution } from './components/media-contribution/media-contribution';
import { Settings } from './components/settings/settings';
import { Permission } from './components/permission/permission';
import { MatDialog } from '@angular/material/dialog';
import { ManageMember } from './components/manage-member/manage-member';
import { DeleteMember } from './components/delete-member/delete-member';
import { FooterButton } from '../../components/dialog-form/footer-button/footer-button';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toastService';
// import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDividerModule, ProfileInfo, AssignedPrgm, Perfomance, MediaContribution, Settings,
    Permission, FooterButton, FormsModule, MatDivider, CommonModule,],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

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
  id: any = ''
  toast = inject(ToastService);
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef,private cd: ChangeDetectorRef) { }

  openModal() {
    this.dialog.open(ManageMember, {
      width: '620px',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
    });
  }
  openModalDeleteMember() {
    this.dialog.open(DeleteMember, {
      width: '600px',
      maxHeight: '269px',
      disableClose: true
    });
  }


  ngOnInit(): void {
    this.getProfile();
  }


  getProfile(): void {
    this.loading = true;

    const userId = this.srv.getsession('id');

    const tv = [
      { T: 'dk1', V: userId },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('teammember', tv)
      .subscribe({
        next: (r) => {

          const data = r.Data;

          this.profile = data[0]?.[0] || {};
          console.log('profile', this.profile);

          this.assignedPrograms = data[1] || [];

          this.performance = data[2] || [];

          this.media = data[3] || [];
          this.cdr.detectChanges();
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
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
      const userId = this.srv.getsession('id');
      const success = await this.srv.handleFileUpload(
        this.id,
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
          position: 'toast-bottom-center'
        });
      } else {
        this.toast.show({
          title: 'Upload failed ❌',
          description: 'Unable to upload profile picture',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }

    } catch (error) {
      this.toast.show({
        title: 'Something went wrong ❌',
        description: 'Please try again',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }
  }

  deleteProfilePic(fileUploadID: any) {
  console.log('🚀 deleteUpload called with fileUploadID:', fileUploadID);
  if (!fileUploadID) return;
  this.loading = true;
  this.cd.detectChanges(); 

  const userId = this.srv.getsession('id');

  this.tv = [
    { T: 'dk1', V: userId },
    { T: 'dk2', V: '9' },
    { T: 'c1', V: fileUploadID },
    { T: 'c10', V: '4' }
  ];

  this.srv.getdata('fileupload', this.tv).subscribe({
    next: (r: any) => {
      console.log('✅ API Response:', r);

      this.loading = false;
      this.cd.detectChanges(); 

      if (r.Status === 1) {
        this.getProfile()
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

}
