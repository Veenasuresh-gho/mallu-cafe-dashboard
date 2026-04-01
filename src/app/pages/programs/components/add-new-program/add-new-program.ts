import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { SchedulePicker } from '../../../../components/dialog-form/schedule-picker/schedule-picker';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';

@Component({
  selector: 'app-add-new-program',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatRadioModule,
    MatDialogModule, MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, FormInput,
    MatButtonModule, DialogHeaderComponent, FormSelect, SchedulePicker,
    FooterButton, CancelButton
  ],
  templateUrl: './add-new-program.html',
  styleUrls: ['./add-new-program.css'],
})
export class AddNewProgram implements OnInit {
  constructor(private dialogRef: MatDialogRef<AddNewProgram>) { }

  loading = false;
  categoryList: any[] = [];
  categoryOptions: string[] = [];
  programTitle: string = '';
  selectedHost: string = '';
  selectedSchedule: any = {};
  hosts: any[] = [];

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  ngOnInit(): void {
    this.getProgramTypeList()
    this.getTeamMemberList()
  }

  getTeamMemberList(): void {
    this.loading = true;
    this.tv = [{ T: 'c10', V: '3' }];

    this.srv.getdata('teammember', this.tv)
      .subscribe({
        next: (r) => {
          const data = r.Data[0];
          this.loading = false;

          this.hosts = data.map((item: any) => ({
            DisplayText: item.FullName,
            DataValue: item.MemberID
          }));
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }
  getProgramTypeList(): void {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: 'PROGRAMCATEGORY' },
      { T: 'c10', V: '3' },
    ]

    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {
          this.categoryList = r.Data[0];
          this.categoryOptions = this.categoryList;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  addProgram(): void {
    this.loading = true;
    const payload = {
      Title: this.programTitle,
      CategoryID: this.selectedCategory,
      ScheduleStartDay: this.selectedSchedule.fromDay,
      ScheduleEndDay: this.selectedSchedule.toDay,
      StartTime: this.selectedSchedule.fromTime,
      EndTime: this.selectedSchedule.toTime,
      HostID: this.selectedHost,
      IsCallAllowed: this.selectedType === "allow" ? 1 : 0
    }
    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '1' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          if (r.Status === 1) {
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
  selectedCategory: string = '';

  selectedType: string = 'disable';



}