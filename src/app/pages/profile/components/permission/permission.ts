import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permission',
  imports: [CommonModule],
  templateUrl: './permission.html',
  styleUrl: './permission.css',
})
export class Permission implements OnChanges {

  @Input() profile: any = {};

  permissions: any[] = [];

  ngOnChanges() {
    this.permissions = [
      {
        icon: 'check',
        name: 'Media Upload',
        checked: !!this.profile?.MediaUploadPermission
      },
      {
        icon: 'check',
        name: 'Ad Management',
        checked: !!this.profile?.AdManagementPermission
      },
      {
        icon: 'check',
        name: 'Program Management',
        checked: !!this.profile?.ProgramManagementPermission
      },
      {
        icon: 'check',
        name: 'Member Management',
        checked: !!this.profile?.MemberManagementPermission
      }
    ];
  }
}