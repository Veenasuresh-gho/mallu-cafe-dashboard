import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileInfo } from './components/profile-info/profile-info';
import { AssignedPrgm } from './components/assigned-prgm/assigned-prgm';
import { Perfomance } from './components/perfomance/perfomance';
import { MediaContribution } from './components/media-contribution/media-contribution';
import { Settings } from './components/settings/settings';
import { Permission } from './components/permission/permission';
import { MatDialog } from '@angular/material/dialog';
import { ManageMember } from './components/manage-member/manage-member';
// import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  imports: [MatDividerModule,ProfileInfo,AssignedPrgm,Perfomance,MediaContribution,Settings,Permission],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

    constructor(private dialog: MatDialog) { }

  openModal() {
    this.dialog.open(ManageMember, {
      width: '800px',
      disableClose: true
    });
  }

}
