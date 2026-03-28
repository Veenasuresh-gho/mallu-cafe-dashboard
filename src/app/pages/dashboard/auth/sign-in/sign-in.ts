import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule
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

  constructor(private fb: FormBuilder,private router: Router,private toastr: ToastrService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  

loginclick(): void {
  this.submitted = true;

  if (this.loginForm.invalid) {
    this.toastr.warning('Please fill all required fields');
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

  this.srv.getdata('teammember', this.tv).pipe(
    catchError(err => {
      this.loading = false;

      this.toastr.error('Something went wrong!');
      throw err;
    })
  ).subscribe(r => {

    this.loading = false;

    if (r.Status === 1) {
      const u = r.Data[0][0];

      this.srv.setsession('tkn', u['Token']);
      this.srv.setsession('id', u['ID']);

      this.toastr.success('Login successful! ');

      this.router.navigate(['/dashboard']);

    } else {
       this.loading = false;
      this.toastr.error(r.Info || 'Login failed');
    }
  });
}


}