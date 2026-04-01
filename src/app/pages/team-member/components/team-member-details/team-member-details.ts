import { Component } from '@angular/core';
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

@Component({
  selector: 'app-team-member-details',
  imports: [ProfileInfo,AssignedPrgm,MediaContribution,Perfomance,Permission,Settings,
    MatDivider,FooterButton
  ],
  templateUrl: './team-member-details.html',
  styleUrl: './team-member-details.css',
})
export class TeamMemberDetails {

      constructor(private dialog: MatDialog) { }

  openModal() {
    this.dialog.open(ManageMember, {
      width:'620px' ,
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
}
