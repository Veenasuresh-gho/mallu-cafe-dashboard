import { Component } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pre-scheduled',
  imports: [FormSelect,StepBadge,MatRadioButton,MatRadioGroup,
    FormsModule
  ],
  templateUrl: './pre-scheduled.html',
  styleUrl: './pre-scheduled.css',
})
export class PreScheduled {

  typedText: string = '';
  selectedType: string = ''; // default selected  


onTextChange(event: any) {
  this.typedText = event.target.innerText;
  console.log('Full value:', 'ProgramName//' + this.typedText);
}

}
