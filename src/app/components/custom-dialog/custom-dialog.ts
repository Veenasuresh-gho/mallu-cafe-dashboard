import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-dialog',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './custom-dialog.html',
  styleUrls: ['./custom-dialog.css'] 
})
export class CustomDialog {

  title: string = '';
  width?: string;
  height?: string;
  padding?: string;

  constructor(
    private dialogRef: MatDialogRef<CustomDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data?.title || '';
    this.width = data?.width;
    this.height = data?.height;
    this.padding = data?.padding || '16px';
  }

  onClose() {
    this.dialogRef.close();
  }
}