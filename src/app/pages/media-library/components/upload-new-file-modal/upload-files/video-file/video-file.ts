import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../../../components/dialog-form/form-input/form-input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FileUpload } from '../../../../../../components/dialog-form/file-upload/file-upload';
import { GHOService } from '../../../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../../../services/utilities';
import { ghoresult, tags } from '../../../../../../../model/ghomodel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-file',
  imports: [CommonModule, StepBadge, FormInput, MatRadioButton, MatRadioGroup, FormsModule, FileUpload],
  templateUrl: './video-file.html',
  styleUrl: './video-file.css',
})
export class VideoFile implements OnChanges {
  typedText: string = '';
  selectedType: string = '';
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  catogories: any[] = [];
  selectedCatogory: any = {};
  programId: string = '';
  selectedProgramId: any = null;
  selectedProgramName: string = '';
  errors: any = {};
  selectedCategoryId: string = '';
  title: string = '';
  subtitle: string = '';
  originalFileName: string = '';
  selectedFile: File | null = null;
  thumbnailPreview: string = '';
  fileSelectedName: string = '';

  @Input() programList: any[] = [];
  @Input() fileType: string = '';
  @Input() fileName: string = '';
  @Input() disabled: boolean = false;
  @Output() programSelected = new EventEmitter<any>();
  @Input() editData: any = null;

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['fileName'] && this.fileName && !this.originalFileName) {
  //     this.originalFileName = this.fileName;
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['fileName'] && this.fileName && !this.originalFileName) {
      this.originalFileName = this.fileName;
    }

    if (changes['editData'] && this.editData) {
      this.patchEditData();
    }
  }

  getBaseName(name: string): string {
    if (!name) return '';

    const lastDotIndex = name.lastIndexOf('.');
    const base = lastDotIndex !== -1
      ? name.substring(0, lastDotIndex)
      : name;

    return base.replace(/\s+/g, '');
  }
  onTitleChange(value: string) {
    this.title = value;
    this.emitData();
  }

  onSubtitleChange(value: string) {
    this.subtitle = value;
    this.emitData();
  }


  emitData() {

    const cleanDate = this.typedText.replace(/\//g, '');
    const baseName = this.getBaseName(this.originalFileName);
    let fileName = '';

    if (baseName && cleanDate && this.fileType) {
      fileName = `${baseName}${cleanDate}.${this.fileType}`;
    }

    this.programSelected.emit({
      programId: this.programId,
      programName: baseName,
      categoryId: this.selectedCategoryId,
      typedText: this.typedText,
      fileName: fileName,

      title: this.title,
      subtitle: this.subtitle,

      fullData: this.programList.find(p => p.ProgramID === this.programId),

      thumbnailFile: this.selectedFile
    });

  }

  patchEditData(): void {

    console.log('video edit', this.editData);

    this.title =
      this.editData?.Title || '';

    this.subtitle =
      this.editData?.Subtitle || '';

    this.thumbnailPreview =
      this.editData?.ThumbnailUrl || '';

    this.fileSelectedName =
      this.editData?.ThumbnailUrl
        ? 'Current thumbnail'
        : '';

    this.typedText =
      this.extractDate(
        this.editData?.FileName || ''
      );

    this.originalFileName =
      this.getBaseName(
        this.editData?.FileName || ''
      );

    this.emitData();
  }

  extractDate(fileName: string): string {
    const match =
      fileName.match(/(\d{6})(?=\.[^.]+$)/);
    if (!match) return '';
    const rawDate = match[1];

    return `${rawDate.slice(0, 2)}/${rawDate.slice(2, 4)}/${rawDate.slice(4, 6)}`;
  }

  onTextChange(event: any) {
    const el = event.target;

    let value = el.innerText.replace(/\D/g, '').slice(0, 6);

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    el.innerText = value;

    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);

    this.typedText = value;
    this.emitData();
  }

  onDateChange(value: string) {

  let cleaned =
    value.replace(/\D/g, '').slice(0, 6);

  if (cleaned.length > 2) {
    cleaned =
      cleaned.slice(0, 2) + '/' + cleaned.slice(2);
  }

  if (cleaned.length > 5) {
    cleaned =
      cleaned.slice(0, 5) + '/' + cleaned.slice(5);
  }

  this.typedText = cleaned;

  this.emitData();
}
  //  onFileSelected(file: File) {
  //   this.selectedFile = file;
  //   this.emitData(); 
  // }

  onFileSelected(file: File) {

    if (!file) return;

    this.selectedFile = file;

    this.fileSelectedName = file.name;

    const reader = new FileReader();

    reader.onload = () => {

      this.thumbnailPreview = reader.result as string;

      this.emitData();
    };

    reader.readAsDataURL(file);
  }

}
