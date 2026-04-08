import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-set-new-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatIconModule,MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,],
  templateUrl: './set-new-password.html',
  styleUrl: './set-new-password.css',
})
export class SetNewPassword {
  passwordForm: FormGroup;
  submitted = false;
  hidePassword = true;
  hideConfirm = true;

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  resetPassword() {
    this.submitted = true;

    if (this.passwordForm.invalid) return;

    const password = this.passwordForm.get('password')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Call your API to reset password here
  }
}