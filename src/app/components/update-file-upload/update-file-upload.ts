import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButton } from '../primary-button/primary-button';
import { MutedButton } from '../muted-button/muted-button';

@Component({
  selector: 'app-update-file-upload',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    PrimaryButton,
    MutedButton
  ],
  templateUrl: './update-file-upload.html',
  styleUrl: './update-file-upload.css',
})
export class UpdateFileUpload {

  @Input() item: any;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  constructor(private cdr: ChangeDetectorRef) { }

  @Output()
  close = new EventEmitter<void>();

  isUploading = false;
  uploadProgress = 0;

  fileBaseName = '';
  fileDate = '';

  radius = 50;
  circumference = 2 * Math.PI * this.radius;

  get progressOffset() {
    return this.circumference -
      (this.uploadProgress / 100) * this.circumference;
  }

  startUpload(file: File) {
    this.uploadProgress = 0;

    const interval = setInterval(() => {

      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
      } else {
        this.uploadProgress += 10;
      }

      this.cdr.detectChanges();

    }, 500);
  }

  get isCompleted(): boolean {
    return this.uploadProgress >= 100;
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      const file = input.files[0];

      this.fileBaseName = `${this.item?.Title || 'File'}_`;
      this.fileDate = this.getTodayDate();

      // show progress screen immediately
      this.isUploading = true;

      this.startUpload(file);
    }
  }

  cancelUpload() {
    this.isUploading = false;
    this.uploadProgress = 0;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteFile() {
    this.uploadProgress = 0;
    this.isUploading = false;
    this.fileBaseName = '';
    this.fileDate = '';

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  finishUpload() {
    const fileName =
      `${this.fileBaseName}${this.fileDate}.mp3`;

    console.log('Uploaded:', fileName);

    this.close.emit();
  }

  getTodayDate(): string {
    const d = new Date();

    return `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')
      }${String(d.getFullYear()).slice(-2)}`;
  }

  onCancel() {
    this.close.emit();
  }
}