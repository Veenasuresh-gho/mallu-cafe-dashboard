import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastService } from '../../../services/toastService';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  hide = true;
  submitted = false; 
  loading = false;
  snack = inject(MatSnackBar);
  loginForm!: FormGroup;
    toast = inject(ToastService);

  constructor(private fb: FormBuilder,private router: Router,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  

loginclick(): void {
  this.submitted = true;

  if (this.loginForm.invalid) {
    this.toast.show({
      title: 'Warning ⚠️',
      description: 'Please fill all required fields',
      variant: 'warning',
      position: 'toast-bottom-center'
    });
    return;
  }

  this.loading = true; 
  this.srv.clearsession();

  const { email, password } = this.loginForm.value;
  this.tv = [
    { T: 'dk1', V: email },
    { T: 'dk2', V: password },
    { T: 'c10', V: '5' },
  ];

  this.srv.getdata('teammember', this.tv)
    .subscribe({
      next: (r) => {
        this.loading = false; // stop spinner first

        if (r.Status === 1) {
          const u = r.Data[0][0];

          this.srv.setsession('tkn', u['Token']);
          this.srv.setsession('id', u['ID']);

          this.toast.show({
            title: 'Login successful! 🎉',
            description: 'You have successfully logged in',
            variant: 'success',
            position: 'toast-bottom-center'
          });

          this.router.navigate(['/dashboard']);
        } else {
          this.toast.show({
            title: 'Login failed ❌',
            description: r.Info || 'Invalid email or password',
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      },
      error: (err) => {
        console.error('Login API Error:', err);
        this.loading = false; // stop spinner even on error
        this.toast.show({
          title: 'Error ❌',
          description: 'Something went wrong!',
          variant: 'error',
          position: 'toast-bottom-center',
          
          
        });
      }
    });
}

}