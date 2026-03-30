import { Component } from '@angular/core';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../../../components/dialog-form/form-input/form-input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FileUpload } from '../../../../../../components/dialog-form/file-upload/file-upload';

@Component({
  selector: 'app-video-file',
  imports: [StepBadge,FormInput, MatRadioButton,MatRadioGroup,FormsModule,FileUpload],
  templateUrl: './video-file.html',
  styleUrl: './video-file.css',
})
export class VideoFile {
      typedText: string = '';
  selectedType: string = ''; // default selected  
subtitle:string ='';

onTextChange(event: any) {
  this.typedText = event.target.innerText;
  console.log('Full value:', 'ProgramName//' + this.typedText);
}
onFileSelected(file: File) {
  console.log('Selected file:', file);
}
}
