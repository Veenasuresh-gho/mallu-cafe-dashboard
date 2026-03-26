import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTeamMember } from './components/add-team-member/add-team-member';

@Component({
  selector: 'app-team-member',
  imports: [],
  templateUrl: './team-member.html',
  styleUrl: './team-member.css',
})
export class TeamMember {
      constructor(private dialog: MatDialog) {} 

    openModal() {
      this.dialog.open(AddTeamMember, {
         width: '800px',
        
        disableClose: true
      });
    }
}
