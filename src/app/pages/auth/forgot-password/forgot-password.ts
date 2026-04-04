import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';
import { ToastService } from '../../../services/toastService';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule, MatIconModule, MatButtonModule, MatInputModule,MatProgressSpinnerModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnDestroy {

  loginForm: FormGroup;
  passwordForm: FormGroup;
  submitted = false;
  isOtpScreen = false;
  isOtpVerified = false;
  hidePassword = true;
  hideConfirmPassword = true;
  hideConfirm = true;

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  snack = inject(MatSnackBar);
  otpId: string = '';
   otpToken: string = '';
  private cdr = inject(ChangeDetectorRef);

  tv: tags[] = [];
  loading = false;
  res: ghoresult = new ghoresult();
  toast = inject(ToastService);
  testOtp: number | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router, private toastr: ToastrService,

  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  otpArray = Array(6).fill(0);
  otpValues: string[] = ['', '', '', '', '', ''];

  timer: number = 30;
  intervalId: any;

  startTimer() {
    this.timer = 30;
    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.cdr.detectChanges(); 
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  resendCode() {
    if (this.timer > 0) return;
    console.log('Resend OTP API call');

  const { email } = this.loginForm.value;

  this.tv = [
    { T: 'dk1', V: email },
    { T: 'c10', V: '9' },
  ];

  this.srv.getdata('teammember', this.tv).pipe(
    catchError(err => {
      this.toast.show({
        title: 'Error ❌',
        description: 'Something went wrong!',
        variant: 'error',
        position: 'toast-bottom-center'
      });
      return of(null);
    })
  ).subscribe((r: any) => {

    if (!r) return; 

    if (r.Status === 1) {

      const u = r.Data[0][0];
     
       this.testOtp = u.otp;
      this.toast.show({
        title: 'OTP resent successfully 🎉',
        description: 'OTP resent successfully!',
        variant: 'success',
        position: 'toast-bottom-center'
      });

      this.startTimer();
      this.cdr.detectChanges();

    } else {
      this.toast.show({
        title: 'Failed ❌',
        description: r.Info || 'Failed to resend OTP',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }
  });
  }

  formatTime(sec: number): string {
    return `00:${sec < 10 ? '0' + sec : sec}`;
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (!/^[0-9]$/.test(value)) {
      input.value = '';
      this.otpValues[index] = '';
      return;
    }
    this.otpValues[index] = value;

    const next = input.nextElementSibling as HTMLInputElement;
    if (next) next.focus();
  }
  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      this.otpValues[index] = '';
      input.value = '';

      const prev = input.previousElementSibling as HTMLInputElement;
      if (prev) prev.focus();
    }
  }




  verifyEmail(): void {
  this.submitted = true;
  if (this.loginForm.invalid) {
    this.toast.show({
      title: 'Warning ⚠️',
      description: 'Please enter a valid email',
      variant: 'warning',
      position: 'toast-bottom-center'
    });
    return;
  }
  this.loading = true;
  this.cdr.detectChanges();
  this.srv.clearsession();
  const { email } = this.loginForm.value;
  this.tv = [
    { T: 'dk1', V: email },
    { T: 'c10', V: '6' },
  ];
  this.srv.getdata('teammember', this.tv).pipe(
    catchError(err => {
      this.loading = false;
      this.cdr.detectChanges();
      this.toast.show({
        title: 'Error ❌',
        description: 'Something went wrong!',
        variant: 'error',
        position: 'toast-bottom-center'
      });
      return of(null);
    })
  ).subscribe((r: any) => {
    this.loading = false;
    this.cdr.detectChanges();

    if (!r) return; 

    if (r.Status === 1) {

      const u = r.Data[0][0];
      this.otpId = u.id;
     
       this.testOtp = u.msg;

      this.toast.show({
        title: 'OTP Sent 🎉',
        description: 'OTP sent successfully!',
        variant: 'success',
        position: 'toast-bottom-center'
      });

      this.isOtpScreen = true;
      this.startTimer();

      this.cdr.detectChanges();

    } else {
      this.loading = false;
      this.cdr.detectChanges();
      this.toast.show({
        title: 'Failed ❌',
        description: r.Info || 'Failed to send OTP',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }
  });
}

verifyOtp() {
  const otp = this.otpValues.join('');

  if (otp.length !== 6) {
    this.toast.show({
      title: 'Warning ⚠️',
      description: 'Enter complete OTP',
      variant: 'warning',
      position: 'toast-bottom-center'
    });
    return;
  }

  this.loading = true;
  this.cdr.detectChanges(); 

  this.tv = [
    { T: 'dk1', V: this.otpId },
    { T: 'dk2', V: otp },
    { T: 'c10', V: '7' }
  ];

  this.srv.getdata('teammember', this.tv).pipe(
    catchError(err => {
      this.loading = false;
      this.cdr.detectChanges();

      this.toast.show({
        title: 'Error ❌',
        description: 'Something went wrong!',
        variant: 'error',
        position: 'toast-bottom-center'
      });

      return of(null);
    })
  ).subscribe((r: any) => {
    this.loading = false;
    this.cdr.detectChanges(); 

    if (!r) return;

    if (r.Status === 1) {
      const u = r.Data[0][0];
      this.otpToken = u.Token;

      this.toast.show({
        title: 'OTP Verified 🎉',
        description: 'OTP verified successfully!',
        variant: 'success',
        position: 'toast-bottom-center'
      });

      this.isOtpVerified = true;

    } else {
      this.toast.show({
        title: 'Failed ❌',
        description: r.Info || 'Invalid OTP',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }
  });
}


resetPassword() {
  this.submitted = true;
  if (this.passwordForm.invalid) return;

  const password = this.passwordForm.get('password')?.value;
  const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    this.toast.show({
      title: 'Warning ⚠️',
      description: 'Passwords do not match!',
      variant: 'warning',
      position: 'toast-bottom-center'
    });
    return;
  }

  this.loading = true;
  this.cdr.detectChanges(); 

  this.tv = [
    { T: 'dk1', V: this.otpToken },
    { T: 'dk2', V: password },
    { T: 'c10', V: '8' }
  ];

  this.srv.getdata('teammember', this.tv).pipe(
    catchError(err => {
      this.loading = false;                
      this.cdr.detectChanges();           

      this.toast.show({
        title: 'Error ❌',
        description: 'Something went wrong!',
        variant: 'error',
        position: 'toast-bottom-center'
      });

      return of(null);
    })
  ).subscribe((r: any) => {
    this.loading = false;
    this.cdr.detectChanges();  

    if (!r) return;

    if (r.Status === 1) {
      this.toast.show({
        title: 'Password Reset Successful! 🎉',
        description: 'You can now log in with your new password',
        variant: 'success',
        position: 'toast-bottom-center'
      });

      this.router.navigate(['/sign-in']); // no need detectChanges after this
    } else {
      this.loading = false;                
      this.cdr.detectChanges(); 
      this.toast.show({
        title: 'Failed ❌',
        description: r.Info || 'Reset failed',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }
  });
}

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}