import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-new-file-modal',
  imports: [],
  templateUrl: './upload-new-file-modal.html',
  styleUrl: './upload-new-file-modal.css',
})
export class UploadNewFileModal {
    constructor(private dialogRef: MatDialogRef<UploadNewFileModal>) {}

  close() {
    this.dialogRef.close();
  }
}
