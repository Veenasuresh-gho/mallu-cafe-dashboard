import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';

import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';

@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    DialogHeaderComponent,
    FormInput
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private dialogRef: MatDialogRef<ChangePassword>) {}

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Password updated');

    this.dialogRef.close();
  }
}