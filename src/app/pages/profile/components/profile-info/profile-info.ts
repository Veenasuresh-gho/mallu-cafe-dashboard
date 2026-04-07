import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

@Component({
  selector: 'app-profile-info',
  standalone: true, // ✅ ADD THIS (VERY IMPORTANT)
  imports: [MatDivider, CommonModule, FormsModule,PrimaryButton],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css',
})
export class ProfileInfo {

  @Input() profile: any = {};
  isEditing: boolean = false;


  enableEdit() {
  this.isEditing = true;
}
}
