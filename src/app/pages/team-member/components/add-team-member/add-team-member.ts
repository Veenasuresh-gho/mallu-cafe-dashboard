import { Component } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';

@Component({
  selector: 'app-add-team-member',
  imports: [MatDialogContent,MatDialogActions,MatDialogClose,
    MatFormField ,MatLabel,MatSelect,MatOption,MatSelectTrigger,MatChipsModule,
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

remove(item: any) {
  this.selectedPrograms = this.selectedPrograms.filter(p => p !== item);
}

  close() {
    this.dialogRef.close();
  }
}
