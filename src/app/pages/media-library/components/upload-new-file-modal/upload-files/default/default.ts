import { Component } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-default',
  imports: [FormSelect,StepBadge,MatRadioButton,MatRadioGroup,
    FormsModule
  ],
  templateUrl: './default.html',
  styleUrl: './default.css',
})
export class Default {
  typedText: string = '';
  selectedType: string = ''; // default selected  


onTextChange(event: any) {
  this.typedText = event.target.innerText;
  console.log('Full value:', 'ProgramName//' + this.typedText);
}
}
