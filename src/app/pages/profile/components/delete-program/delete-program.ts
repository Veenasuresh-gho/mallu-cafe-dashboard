import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';

@Component({
  selector: 'app-delete-program',
  imports: [MatDialogContent,MatDialogActions,MatDialogClose,FormsModule,CommonModule,
    MatFormField,MatLabel,MatSelect,MatOption,MatSelectTrigger,MatChipsModule,MatSlideToggle,
    CancelButton,
  FooterButton],
  templateUrl: './delete-program.html',
  styleUrl: './delete-program.css',
})
export class DeleteProgram {
    constructor(private dialogRef: MatDialogRef<DeleteProgram>) {}

      onClose() {
    this.dialogRef.close();
  }
}
