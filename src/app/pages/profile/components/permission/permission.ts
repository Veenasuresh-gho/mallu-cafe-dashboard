// import { Component, Input } from '@angular/core';
// import { MatDivider } from '@angular/material/divider';
// import { Checkbox } from '../../../../components/dialog-form/checkbox/checkbox';

// @Component({
//   selector: 'app-permission',
//   imports: [MatDivider,Checkbox],
//   templateUrl: './permission.html',
//   styleUrl: './permission.css',
// })
// export class Permission {

//    @Input() profile: any = {};

//  permissions = [
//     { icon: 'check', name: 'Media Upload', checked: true },
//     { icon: 'check', name: 'Ad Management', checked: true },
//     { icon: 'check', name: 'Program Management', checked: true },
//     { icon: 'check', name: 'Member Management', checked: true }
//   ];
// }

import { Component, Input, OnChanges } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { Checkbox } from '../../../../components/dialog-form/checkbox/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permission',
  imports: [MatDivider, Checkbox,CommonModule],
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