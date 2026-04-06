import { Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
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
import { InputTime } from '../../components/dialog/input-time/input-time';
// import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatDividerModule, ProfileInfo, AssignedPrgm, Perfomance, MediaContribution, Settings,
    Permission, FooterButton,FormsModule,InputTime],
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
  performance: any[] = [];
  media: any = {};

  constructor(private dialog: MatDialog) { }

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
        console.log('profile',this.profile);

        this.assignedPrograms = data[1] || [];

        this.performance = data[2] || [];

        this.media = data[4] || [];

        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    });
}

}
