import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

@Component({
  selector: 'app-upload-new-file-modal',
  standalone: true, // 🔥 THIS IS MISSING
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
    constructor(private dialogRef: MatDialogRef<UploadNewFileModal>) {}

  close() {
    this.dialogRef.close();
  }

selectedType: string = ''; // default selected  
selectedProgramCategory: string = '';
}
