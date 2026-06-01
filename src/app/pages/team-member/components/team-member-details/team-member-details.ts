import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ProfileInfo } from '../../../profile/components/profile-info/profile-info';
import { AssignedPrgm } from '../../../profile/components/assigned-prgm/assigned-prgm';
import { MediaContribution } from '../../../profile/components/media-contribution/media-contribution';
import { Perfomance } from '../../../profile/components/perfomance/perfomance';
import { Permission } from '../../../profile/components/permission/permission';
import { Settings } from '../../../profile/components/settings/settings';
import { MatDivider } from '@angular/material/divider';
import { ManageMember } from '../../../profile/components/manage-member/manage-member';
import { DeleteMember } from '../../../profile/components/delete-member/delete-member';
import { MatDialog } from '@angular/material/dialog';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { ActivatedRoute, Router } from '@angular/router';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ToastService } from '../../../../services/toastService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-member-details',
  imports: [ProfileInfo, AssignedPrgm, MediaContribution, Perfomance, Permission, Settings,
    MatDivider, FooterButton,CommonModule
  ],
  templateUrl: './team-member-details.html',
  styleUrl: './team-member-details.css',
})
export class TeamMemberDetails {

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
  isUploading = false;

  constructor(private dialog: MatDialog, private router: Router, private cdr: ChangeDetectorRef, private cd: ChangeDetectorRef) { }

  openModal() {
    const dialogRef = this.dialog.open(ManageMember, {
      width: '620px',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
      data: {
        id: this.id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getProfile();
      }

    });

  }
  openModalDeleteMember() {
    this.dialog.open(DeleteMember, {
      width: '600px',
      maxHeight: '269px',
      disableClose: true,
      data: {
        memberId: this.id,
      }
    });
  }

  goToTeamMemberList() {
    this.router.navigate(['/team-members']);
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
    this.id = this.route.snapshot.paramMap.get('id');
    this.getProfile();
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
  //       this.getProfile();
  //       this.toast.show({
  //         title: 'Profile picture uploaded successfully 🎉',
  //         description: '',
  //         variant: 'success',
  //         position: 'toast-bottom-center'
  //       });
  //     } else {
  //       this.toast.show({
  //         title: 'Upload failed ❌',
  //         description: 'Unable to upload profile picture',
  //         variant: 'error',
  //         position: 'toast-bottom-center'
  //       });
  //     }

  //   } catch (error) {
  //     this.toast.show({
  //       title: 'Something went wrong ❌',
  //       description: 'Please try again',
  //       variant: 'error',
  //       position: 'toast-bottom-center'
  //     });
  //   }
  // }

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
    this.isUploading = true;
    this.cdr.detectChanges();

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
    } finally {
      this.isUploading = false;
      this.cdr.detectChanges();
      event.target.value = '';
    }
  }


  deleteProfilePic(fileUploadID: any) {
    if (!fileUploadID) return;
    this.loading = true;
    this.cd.detectChanges();

    const userId = this.id;

    this.tv = [
      { T: 'dk1', V: userId },
      { T: 'dk2', V: '9' },
      { T: 'c1', V: fileUploadID },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('fileupload', this.tv).subscribe({
      next: (r: any) => {
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
}
