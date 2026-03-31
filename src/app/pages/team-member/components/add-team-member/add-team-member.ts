import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-team-member',
  imports: [MatDialogContent,MatDialogActions,MatDialogClose,FormsModule,CommonModule,
    MatFormField ,MatLabel,MatSelect,MatOption,MatSelectTrigger,MatChipsModule,MatSlideToggle,PrimaryButton,
    FormInput,FormSelect,CancelButton,FooterButton
  ],
  templateUrl: './add-team-member.html',
  styleUrl: './add-team-member.css',
})
export class AddTeamMember {
      constructor(private dialogRef: MatDialogRef<AddTeamMember>) {}

programs = [
  { program: 'Om Shanti Om' },
  { program: 'Bollywood Rewind' },
  { program: 'Hungama Radio' },
  { program: 'Indo American News' },
  { program: 'Talk with Stars' },
  { program: 'Studio Conversations' },
  { program: 'Dial In & Speak Out' }
];

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
