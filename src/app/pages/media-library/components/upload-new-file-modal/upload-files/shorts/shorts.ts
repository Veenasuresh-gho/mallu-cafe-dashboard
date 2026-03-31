import { Component } from '@angular/core';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../../../components/dialog-form/form-input/form-input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shorts',
  imports: [StepBadge,FormInput, MatRadioButton,MatRadioGroup,FormsModule],
  templateUrl: './shorts.html',
  styleUrl: './shorts.css',
})
export class Shorts {
    typedText: string = '';
  selectedType: string = ''; // default selected  


onTextChange(event: any) {
  this.typedText = event.target.innerText;
  console.log('Full value:', 'ProgramName//' + this.typedText);
}
}
