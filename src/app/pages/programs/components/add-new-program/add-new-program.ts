import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-program',
  imports: [MatDialogRef],
  standalone:true,
  templateUrl: './add-new-program.html',
  styleUrl: './add-new-program.css',
})
export class AddNewProgram {
   constructor(private dialogRef: MatDialogRef<AddNewProgram>) {}

   close() {
    this.dialogRef.close();
  }
}
