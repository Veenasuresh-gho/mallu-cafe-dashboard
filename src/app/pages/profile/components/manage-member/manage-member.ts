import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DeleteProgram } from '../delete-program/delete-program';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';

@Component({
  selector: 'app-manage-member',
  imports: [MatDialogContent,MatDialogActions,MatDialogClose,FormsModule,CommonModule,
    MatFormField,MatLabel,MatSelect,MatOption,MatSelectTrigger,MatChipsModule,MatSlideToggle,
  DialogHeaderComponent,StepBadge,FormInput,FormSelect],
  templateUrl: './manage-member.html',
  styleUrl: './manage-member.css',
})
export class ManageMember {

  constructor(private dialogRef: MatDialogRef<ManageMember>,private dialog: MatDialog ) {}
  


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
  { name: 'Media Upload', checked: true },
  { name: 'Ad Management', checked: false },
  { name: 'Program Management', checked: true },
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

  close() {
    this.dialogRef.close();
  }
  openModalDelete(){
       this.dialog.open(DeleteProgram, {
      width: '600px',
      disableClose: true
    });
  }

}
