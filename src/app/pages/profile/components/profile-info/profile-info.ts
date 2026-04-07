import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';

@Component({
  selector: 'app-profile-info',
  standalone: true, // ✅ ADD THIS (VERY IMPORTANT)
  imports: [MatDivider, CommonModule, FormsModule],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css',
})
export class ProfileInfo {

  @Input() profile: any = {};


}
