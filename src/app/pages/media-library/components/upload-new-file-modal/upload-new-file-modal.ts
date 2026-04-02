import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AddPodcast } from '../add-podcast/add-podcast';
import { MatSelect } from '@angular/material/select';
import { SelectDropDown } from '../../../../components/select-drop-down/select-drop-down';
import { StepBadge } from '../../../../components/dialog-form/step-badge/step-badge';
import { UploadBox } from '../../../../components/dialog-form/upload-box/upload-box';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { FormCategory } from '../../../../components/dialog-form/form-category/form-category';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { Default } from './upload-files/default/default';
import { PreScheduled } from './upload-files/pre-scheduled/pre-scheduled';
import { Shorts } from './upload-files/shorts/shorts';
import { PodcastFile } from './upload-files/podcast-file/podcast-file';
import { VideoFile } from './upload-files/video-file/video-file';

@Component({
  selector: 'app-upload-new-file-modal',
  standalone: true,
  imports: [
    CommonModule, SelectDropDown,
    FormsModule, MatSelect,
    MatDialogContent,
    MatRadioGroup, StepBadge, FormSelect,
    MatRadioButton, UploadBox, FormCategory, FormInput, Default, PreScheduled,
    Shorts, VideoFile, PodcastFile
  ],
  templateUrl: './upload-new-file-modal.html',
  styleUrl: './upload-new-file-modal.css',
})
export class UploadNewFileModal {
  constructor(private dialogRef: MatDialogRef<UploadNewFileModal>, private dialog: MatDialog) { }

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

  typedText: string = '';

  onTextChange(event: any) {
    this.typedText = event.target.innerText;
    console.log('Full value:', 'ProgramName//' + this.typedText);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
    }
  }
  openModalAddPodcast() {
    this.dialog.open(AddPodcast, {
      width: '90%',
      maxWidth: '600px',
      disableClose: true
    });
  }
  inputValue = '';

  onInput(event: any) {
    this.inputValue = event.target.value;
  }

  programCategories = [
    { value: 'pre', label: 'Pre - Scheduled' },
    { value: 'shorts', label: 'Shorts' },
    { value: 'featured', label: 'Videos' },
    { value: 'podcast', label: 'Podcast' }
  ];


}
