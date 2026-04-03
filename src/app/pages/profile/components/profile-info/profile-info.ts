import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';

@Component({
  selector: 'app-profile-info',
  imports: [MatDivider,FormInput],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css',
})
export class ProfileInfo {
  fullName:string='';
  Designation:string='';
  email:string='';
}
