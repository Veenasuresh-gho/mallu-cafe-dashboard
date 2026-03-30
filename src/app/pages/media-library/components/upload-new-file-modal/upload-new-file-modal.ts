import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AddPodcast } from '../add-podcast/add-podcast';
import { MatSelect } from '@angular/material/select';
import { SelectDropDown } from '../../../../components/select-drop-down/select-drop-down';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { FormCategory } from '../../../../components/dialog-form/form-category/form-category';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';

@Component({
  selector: 'app-upload-new-file-modal',
  standalone: true,
  imports: [
    CommonModule,SelectDropDown,
    FormsModule,MatSelect,
    MatDialogContent,
    MatRadioGroup,StepBadge,FormSelect,
    MatRadioButton,UploadBox,FormCategory,FormInput
  ],
  templateUrl: './upload-new-file-modal.html',
  styleUrl: './upload-new-file-modal.css',
})
export class UploadNewFileModal {
    constructor(private dialogRef: MatDialogRef<UploadNewFileModal>,private dialog: MatDialog) {}

    ngOnChanges() {
  console.log('Selected program category:', this.selectedProgramCategory);
}

  close() {
    this.dialogRef.close();
  }
  fileName = '';
  status = 'all';
  selectedProgramCategory: string = '';
selectedType: string = ''; // default selected  
fileSelectedName: string = '';


onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.fileName = file.name;
  }
}
openModalAddPodcast() {
    this.dialog.open(AddPodcast, {
       width: '600px',
      disableClose: true
    });
  }
  inputValue = '';

onInput(event: any) {
  this.inputValue = event.target.value;
}

programCategories = [
  { value: 'pre', label: 'Pre - Scheduled' },
  { value: 'featured', label: 'Featured Videos' },
  { value: 'shorts', label: 'Shorts' },
  { value: 'podcast', label: 'Podcast' }
];


}
