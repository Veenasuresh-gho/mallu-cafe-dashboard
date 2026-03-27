import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';

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
export class ForgotPassword {

  loginForm;
  submitted = false;
  isOtpScreen = false;

  constructor(private fb: FormBuilder, private zone: NgZone,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  otpArray = new Array(6);
  otpValues: string[] = ['', '', '', '', '', ''];

onOtpInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Only allow single digit numbers
  if (!/^[0-9]$/.test(value)) {
    input.value = '';
    this.otpValues[index] = '';
    return;
  }

  this.otpValues[index] = value;

  // Move focus to next input if it exists
  const nextInput = input.nextElementSibling as HTMLInputElement | null;
  if (nextInput) nextInput.focus();
}

onKeyDown(event: KeyboardEvent, index: number) {
  const input = event.target as HTMLInputElement;

  if (event.key === 'Backspace') {
    // Clear current input first
    this.otpValues[index] = '';
    input.value = '';

    // Move focus to previous input if it exists
    const prevInput = input.previousElementSibling as HTMLInputElement | null;
    if (prevInput) {
      prevInput.focus();
    }
  }
}

  timer: number = 30;
  timerSub!: Subscription;

  startTimer() {
    if (this.timerSub) this.timerSub.unsubscribe();
    this.timer = 30;

    this.timerSub = interval(1000)
      .pipe(take(30))
      .subscribe(() => {
        // ✅ run inside Angular zone so UI updates
        this.zone.run(() => {
          this.timer--;
        });
      });
  }

  resendCode() {
    if (this.timer > 0) return;
    console.log('Resend OTP API call');
    this.startTimer();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;
    console.log(this.loginForm.value);
    this.isOtpScreen = true;
    this.startTimer();
  }

  verifyOtp() {
    const otp = this.otpValues.join('');
    console.log('OTP submitted:', otp);
     this.router.navigate(['/set-new-password']);
  }
}