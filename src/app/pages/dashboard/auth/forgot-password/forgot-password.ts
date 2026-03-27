import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GHOService } from '../../../../services/ghosrvs';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { GHOUtitity } from '../../../../services/utilities';
import { catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnDestroy {

  loginForm: FormGroup;
  submitted = false;
  isOtpScreen = false;

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  snack = inject(MatSnackBar);
  otpId: string = '';
  private cdr = inject(ChangeDetectorRef);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  constructor(
    private fb: FormBuilder,
    private router: Router, private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ================= OTP =================
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
        this.cdr.detectChanges(); // 🔥 FIX TIMER UI
      } else {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  resendCode() {
    if (this.timer > 0) return;
    console.log('Resend OTP API call');
    this.startTimer();
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
      this.toastr.warning('Please enter a valid email');
      return;
    }

    this.srv.clearsession();

    const { email } = this.loginForm.value;

    this.tv = [
      { T: 'dk1', V: email },
      { T: 'c10', V: '6' },
    ];

    this.srv.getdata('teammember', this.tv).pipe(
      catchError(err => {
        this.toastr.error('Something went wrong!');
        return of(null);
      })

    ).subscribe((r: any) => {

      if (!r) return; // stop if error

      if (r.Status === 1) {

        const u = r.Data[0][0];
        this.otpId = u.id;

        this.toastr.success('OTP sent successfully!');

        this.isOtpScreen = true;
        this.startTimer();

        this.cdr.detectChanges();

      } else {
        this.toastr.error(r.Info || 'Failed to send OTP');
      }
    });
  }


verifyOtp() {

  const otp = this.otpValues.join('');
  if (otp.length !== 6) {
    this.toastr.warning('Enter complete OTP');
    return;
  }

  this.tv = [
    { T: 'dk1', V: this.otpId },
    { T: 'dk2', V: otp },
    { T: 'c10', V: '7' }
  ];

  this.srv.getdata('teammember', this.tv).pipe(
    catchError(err => {
      this.toastr.error('Something went wrong!');
      return of(null);
    })

  ).subscribe((r: any) => {

    if (!r) return;

    if (r.Status === 1) {

      this.toastr.success('OTP verified successfully!');

      this.router.navigate(['/set-new-password']);

    } else {
      this.toastr.error(r.Info || 'Invalid OTP');
    }
  });
}

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}