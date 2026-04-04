import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { Checkbox } from '../../../../components/dialog-form/checkbox/checkbox';

@Component({
  selector: 'app-permission',
  imports: [MatDivider,Checkbox],
  templateUrl: './permission.html',
  styleUrl: './permission.css',
})
export class Permission {

 permissions = [
    { icon: 'check', name: 'Media Upload', checked: true },
    { icon: 'check', name: 'Ad Management', checked: true },
    { icon: 'check', name: 'Program Management', checked: true },
    { icon: 'check', name: 'Member Management', checked: true }
  ];
}
