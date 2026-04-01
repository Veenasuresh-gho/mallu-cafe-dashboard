import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-add-team-member',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule, CommonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatSelectTrigger, MatChipsModule, MatSlideToggle, PrimaryButton,
    FormInput, FormSelect, CancelButton, FooterButton
  ],
  templateUrl: './add-team-member.html',
  styleUrl: './add-team-member.css',
})
export class AddTeamMember implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddTeamMember>) { }

  fullName: string = '';
  role: string = '';
  phone: string = '';
  email: string = '';
  countryId: string = '233';
  loading = false;
  roles: any[] = [];
  programList: any[] = [];
  selectedPhoto!: File;
  previewUrl: any;
  cdr = inject(ChangeDetectorRef);


  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  ngOnInit(): void {
    this.getRoles();
    this.getProgramList();
  }

onPhotoSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedPhoto = file;

  const reader = new FileReader();
  reader.onload = () => {
    this.previewUrl = reader.result;
    this.cdr.detectChanges(); 
  };
  reader.readAsDataURL(file);
}

  addTeamMenber(): void {

    const payload = {
      FullName: this.fullName,
      Role: this.role,
      Phone: this.phone,
      Email: this.email,
      CountryID: this.countryId
    };

    this.loading = true;
    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('teammember', this.tv)
      .subscribe({
        next: (r) => {
          if (r.Status == 1) {

            this.loading = false;
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  getRoles(): void {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: "ROLES" },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {
          this.roles = r.Data[0];
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  onRoleChange(value: string) {
    this.role = value;

    if (value === '1') {
      this.isFullAccess = true;
      this.onToggleChange();
    } else {
      this.isFullAccess = false;
      this.onToggleChange();
    }
  }

  addTeamMemberClick() {
    this.addTeamMenber();
  }
  getProgramList(): void {
    this.loading = true;
    this.tv = [{ T: 'c10', V: '3' }];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          const data = r.Data[0];
          this.loading = false;

          this.programList = data.map((item: any) => ({
            DisplayText: item.Title,
            DataValue: item.ProgramID
          }));
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }
  // programs = [
  //   { program: 'Om Shanti Om' },
  //   { program: 'Bollywood Rewind' },
  //   { program: 'Hungama Radio' },
  //   { program: 'Indo American News' },
  //   { program: 'Talk with Stars' },
  //   { program: 'Studio Conversations' },
  //   { program: 'Dial In & Speak Out' }
  // ];

  selectedPrograms: any[] = [];

  permissions = [
    { name: 'Media Upload', checked: false },
    { name: 'Ad Management', checked: false },
    { name: 'Program Management', checked: false },
    { name: 'Member Management', checked: false }
  ];

  isFullAccess = false;

  onToggleChange() {
    this.permissions.forEach(p => {
      p.checked = this.isFullAccess;
    });
  }

  remove(item: any) {
    this.selectedPrograms = this.selectedPrograms.filter(p => p !== item);
  }
  isAutoPlay: boolean = true;

  close() {
    this.dialogRef.close();
  }
}
