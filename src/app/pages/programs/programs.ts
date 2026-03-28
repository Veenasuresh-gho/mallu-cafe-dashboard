import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AddNewProgram } from './components/add-new-program/add-new-program';
import { MatDialog } from '@angular/material/dialog';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { SelectDropDown } from '../../components/select-drop-down/select-drop-down';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, PrimaryButton, SelectDropDown],
  templateUrl: './programs.html',
  styleUrl: './programs.css',
})
export class Programs {

  constructor(private dialog: MatDialog) { }

  openModal() {
    this.dialog.open(AddNewProgram, {
      width: '600px',
      height: '644px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: true
    });
  }
  searchText = '';
  status = 'all';
  category = 'all';
  host = 'all';
  program = 'all';

  columns: string[] = [
    'program',
    'category',
    'host',
    'duration',
    'dayTime',
    'interaction'
  ];

  dataSource = [
    {
      name: 'Om Shanti Om',
      avatar: '/main/rj1.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      host: 'RJ Anjali',
      duration: '1 hr',
      dayTime: 'Mon - Fri, 9 - 10 am',
      interaction: 'Allow Calls',
      interactionClass: 'allow'
    },
    {
      name: 'Bollywood Rewind',
      avatar: '/main/rj2.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      host: 'RJ Priyanka',
      duration: '2 hr',
      dayTime: 'Mon - Fri, 10 am - 12 pm',
      interaction: 'Disabled Calls',
      interactionClass: 'disabled'
    },
    {
      name: 'Hungama Radio',
      avatar: '/main/user-image.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      host: 'RJ Shijo',
      duration: '2 hr',
      dayTime: 'Sat - Sun, 12 - 2 pm',
      interaction: 'Allow Calls',
      interactionClass: 'allow'
    },
    {
      name: 'Indo American News',
      avatar: '/main/rj3.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      host: 'RJ Reeva',
      duration: '3 hr',
      dayTime: 'Mon - Fri, 2 - 5 pm',
      interaction: 'Allow Calls',
      interactionClass: 'allow'
    },
    {
      name: 'Talk with Stars',
      avatar: '/main/rj4.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      host: 'RJ Neena',
      duration: '3 hr',
      dayTime: 'Fri, 5 - 8 pm',
      interaction: 'Disabled Calls',
      interactionClass: 'disabled'
    },
    {
      name: 'Studio Conversations',
      avatar: '/main/rj1.png',
      category: 'Podcast',
      categoryClass: 'podcast',
      host: 'RJ Anjali',
      duration: '1 hr',
      dayTime: 'Mon - Fri, 8 - 9 pm',
      interaction: 'Disabled Calls',
      interactionClass: 'disabled'
    },
    {
      name: 'Dial In & Speak Out',
      avatar: '/main/no-image.png',
      category: 'Live',
      categoryClass: 'live',
      host: 'RJ Ashwin',
      duration: '1 hr 30 min',
      dayTime: 'Sat - Sun, 9 - 10:30 pm',
      interaction: 'Allow Calls',
      interactionClass: 'allow'
    }
  ];
}