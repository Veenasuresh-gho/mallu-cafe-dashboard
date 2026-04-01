import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatOption, MatSelect } from '@angular/material/select';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { TimeSchedulePicker } from '../../../../components/dialog-form/time-schedule-picker/time-schedule-picker';
import { SchedulePicker } from '../../../../components/dialog-form/schedule-picker/schedule-picker';
import { Checkbox } from '../../../../components/dialog-form/checkbox/checkbox';
import { ScheduleDateRange } from '../../../../components/dialog-form/schedule-date-range/schedule-date-range';

@Component({
  selector: 'app-upload-ad-file',
  standalone:true,
  imports: [MatDialogContent,MatRadioGroup, FormsModule,MatRadioButton,MatFormField,MatSelect,MatOption,MatIcon,
    StepBadge,FormInput,UploadBox,FormSelect,SchedulePicker,Checkbox,ScheduleDateRange
  ],
  templateUrl: './upload-ad-file.html',
  styleUrl: './upload-ad-file.css',
})
export class UploadAdFile {
        constructor(private dialogRef: MatDialogRef<UploadAdFile>) {}
fileName = '';
  status = 'all';
    selectedStatus: string = 'active'; // or 'waiting'
  playsPerDay: number = 5;
  adsEnabled: boolean = false;
  promotionsEnabled: boolean = false;

scheduleModel: any = {};

   times = ['2:00 PM', '3:00 PM', '5:00 PM'];

   fromDate: string = '';
toDate: string = '';

  fromTime: string = '';
  toTime: string = '';

  isOpenFrom: boolean = false;
  isOpenTo: boolean = false;

  toggleDropdown(type: 'fromTime' | 'toTime') {
    if (type === 'fromTime') this.isOpenFrom = !this.isOpenFrom;
    else this.isOpenTo = !this.isOpenTo;
  }

  selectTime(type: 'fromTime' | 'toTime', value: string) {
    if (type === 'fromTime') this.fromTime = value;
    else this.toTime = value;

    // Close dropdown after selection
    if (type === 'fromTime') this.isOpenFrom = false;
    else this.isOpenTo = false;
  }

  incrementPlays() {
    this.playsPerDay++;
  }
  decrementPlays() {
    if (this.playsPerDay > 0) {
      this.playsPerDay--;
    }
  }
  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.fileName = file.name;
  }
}
selectedDate: Date | null = null;
  close() {
    this.dialogRef.close();
  }
}
