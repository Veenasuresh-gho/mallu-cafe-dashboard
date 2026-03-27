import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AddPodcast } from '../add-podcast/add-podcast';

@Component({
  selector: 'app-upload-new-file-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './upload-new-file-modal.html',
  styleUrl: './upload-new-file-modal.css',
})
export class UploadNewFileModal {
    constructor(private dialogRef: MatDialogRef<UploadNewFileModal>,private dialog: MatDialog) {}

  close() {
    this.dialogRef.close();
  }
  fileName = '';

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.fileName = file.name;
  }
}
openModalAddPodcast() {
    this.dialog.open(AddPodcast, {
       width: '600px',
       
      disableClose: true
    });
  }

selectedType: string = ''; // default selected  
selectedProgramCategory: string = '';


}
