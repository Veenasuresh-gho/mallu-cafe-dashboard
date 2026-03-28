import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-upload-ad-file',
  imports: [MatDialogContent,MatRadioGroup, FormsModule,MatRadioButton,MatFormField,MatSelect,MatOption,MatIcon],
  templateUrl: './upload-ad-file.html',
  styleUrl: './upload-ad-file.css',
})
export class UploadAdFile {
        constructor(private dialogRef: MatDialogRef<UploadAdFile>) {}

    selectedStatus: string = 'active'; // or 'waiting'
  playsPerDay: number = 5;
  incrementPlays() {
    this.playsPerDay++;
  }
  decrementPlays() {
    if (this.playsPerDay > 0) {
      this.playsPerDay--;
    }
  }
  
  close() {
    this.dialogRef.close();
  }
}
