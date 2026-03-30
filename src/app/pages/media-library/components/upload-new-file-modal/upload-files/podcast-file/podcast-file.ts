import { Component } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FormInput } from '../../../../../../components/dialog-form/form-input/form-input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddPodcast } from '../../../add-podcast/add-podcast';

@Component({
  selector: 'app-podcast-file',
  imports: [FormSelect,FormInput,StepBadge,MatRadioButton,MatRadioGroup,FormsModule],
  templateUrl: './podcast-file.html',
  styleUrl: './podcast-file.css',
})
export class PodcastFile {
      constructor(private dialogRef: MatDialogRef<PodcastFile>,private dialog: MatDialog) {}


  typedText: string = '';
  selectedType: string = ''; // default selected  
  subtitle: string = '';

  openModalAddPodcast() {
      this.dialog.open(AddPodcast, {
   width: '90%',         
      maxWidth: '600px',
            disableClose: true
      });
    }

onTextChange(event: any) {
  this.typedText = event.target.innerText;
  console.log('Full value:', 'ProgramName//' + this.typedText);
}

}
