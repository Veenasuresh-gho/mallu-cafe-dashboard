import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-permission',
  imports: [MatDivider],
  templateUrl: './permission.html',
  styleUrl: './permission.css',
})
export class Permission {

 permissions = [
  {
    icon: 'check',
    name: 'Media Upload'
  },
  {
    icon: 'check',
    name: 'Ad Management'
  },
  {
    icon: 'check',
    name: 'Program Management'
  },
  {
    icon: 'check',
    name: 'Member Management'
  }
];
}
