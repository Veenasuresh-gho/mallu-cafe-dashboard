import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';

import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { catchError, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    DialogHeaderComponent,
    FormInput,MatIconModule,MatInputModule
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {


  srv = inject(GHOService);
  utl = inject(GHOUtitity);


  newPassword = '';
  confirmPassword = '';

  constructor(private dialogRef: MatDialogRef<ChangePassword>, private toastr: ToastrService) { }

  close() {
    this.dialogRef.close();
  }






  resetPassword() {

    if (!this.newPassword || !this.confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    const userId = this.srv.getsession('id');

    if (!userId) {
      this.toastr.error('User not logged in');
      return;
    }

    const tv = [
      { T: 'dk1', V: userId },
      { T: 'c1', V: this.confirmPassword },
      { T: 'c2', V: this.newPassword },
      { T: 'c10', V: '11' }
    ];

    this.srv.getdata('teammember', tv).pipe(
      catchError(err => {
        console.error(err);
        this.toastr.error('Something went wrong!');
        return of(null);
      })
    ).subscribe((r: any) => {

      if (!r) return;

      if (r.Status === 1) {
        this.toastr.success('Password reset successful');
        this.dialogRef.close(true);
      } else {
        this.toastr.error(r.Info || 'Invalid current password');
      }

    });
  }
}