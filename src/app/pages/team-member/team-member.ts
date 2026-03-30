
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AddTeamMember } from './components/add-team-member/add-team-member';
import { MatDialog } from '@angular/material/dialog';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { SelectDropDown } from '../../components/select-drop-down/select-drop-down';

@Component({
  selector: 'app-team-member',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, PrimaryButton,SelectDropDown],
  templateUrl: './team-member.html',
  styleUrl: './team-member.css',
})
export class TeamMember {

  constructor(private dialog: MatDialog) { }

openModal() {
  this.dialog.open(AddTeamMember, {
    width: '90%',
    maxWidth: '600px',
    maxHeight: '94vh',
    disableClose: true,
  });
}

  searchText = '';
  roles = 'all';
  programs = 'all';

  columns: string[] = [
    'team-members',
    'role',
    'assignedPrograms',
    'mobile',
    'email'
  ];

  dataSource = [
    {
      name: 'Anjali',
      avatar: '/main/rj1.png',
      role: "RJ",
      assignedPrograms: "Om Shanti Om, Studio Conversations",
      mobile: "+1 202 555 0143",
      email: "rjanjali@gmail.com"
    },
    {
      name: 'Priyanka',
      avatar: '/main/rj2.png',
      role: "RJ",
      assignedPrograms: "Bollywood Rewind",
      mobile: "+1 212 555 0187",
      email: "rjpriyanka@gmail.com"
    },
    {
      name: 'Shijo',
      avatar: '/main/user-image.png',
      role: "RJ",
      assignedPrograms: "Hungama Radio",
      mobile: "+1 305 555 0129",
      email: "rjshijo@gmail.com"
    },
    {
      name: 'Reeva',
      avatar: '/main/rj3.png',
      role: "RJ",
      assignedPrograms: "Indo American News",
      mobile: "+1 415 555 0192",
      email: "rjreeva@gmail.com"
    },
    {
      name: 'Neena',
      avatar: '/main/rj4.png',
      role: "RJ",
      assignedPrograms: "Talk with Stars",
      mobile: "+1 646 555 0135",
      email: "rjneena@gmail.com"
    },
    {
      name: 'Shibi Roy',
      avatar: '/main/rj5.png',
      role: "RJ",
      assignedPrograms: "Morning Masala, Chai & Chat",
      mobile: "+1 408 555 0116",
      email: "rjshibi@gmail.com"
    },
    {
      name: 'Resh',
      avatar: '/main/rj6.png',
      role: "RJ",
      assignedPrograms: "Retro Beats",
      mobile: "+1 503 555 0158",
      email: "rjresh@gmail.com"
    }
  ];
}
