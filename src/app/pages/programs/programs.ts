import { Component } from '@angular/core';
import { AddNewProgram } from './components/add-new-program/add-new-program';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './programs.html',
  styleUrl: './programs.css',
})
export class Programs {

  constructor(private dialog: MatDialog) {} 

  openModal() {
    this.dialog.open(AddNewProgram, {
       width: '600px',
  height: '644px',
  maxWidth: '90vw',   
  maxHeight: '90vh',
      disableClose: true
    });
  }
}