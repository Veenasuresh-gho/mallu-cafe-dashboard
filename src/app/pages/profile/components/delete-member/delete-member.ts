
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';


@Component({
  selector: 'app-delete-member',
  imports: [MatDialogContent,MatDialogActions,MatDialogClose,FormsModule,CommonModule,
    MatFormField,MatLabel,MatSelect,MatOption,MatSelectTrigger,MatChipsModule,MatSlideToggle,
  CancelButton],
  templateUrl: './delete-member.html',
  styleUrl: './delete-member.css',
})
export class DeleteMember {

      constructor(private dialogRef: MatDialogRef<DeleteMember>) {}

      onClose() {
    this.dialogRef.close();
  }
}

