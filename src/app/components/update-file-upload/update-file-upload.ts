import {
  Component,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimaryButton } from '../primary-button/primary-button';
import { MutedButton } from '../muted-button/muted-button';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';
import { ToastService } from '../../services/toastService';

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

  loading = false;

  isUploading = false;
  uploadProgress = 0;

  fileBaseName = '';
  fileDate = '';

  selectedFile!: File;

  radius = 50;
  circumference = 2 * Math.PI * this.radius;

  srv = inject(GHOService);

  utl = inject(GHOUtitity);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  toast = inject(ToastService);


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

      // store selected file
      this.selectedFile = file;

      const finalName =
        this.item?.FileName?.trim()
          ? this.item.FileName
          : `${this.item?.Title}.mp3`;

      const nameWithoutExt = finalName.replace(/\.[^/.]+$/, "");

      this.fileBaseName = nameWithoutExt;

      this.isUploading = true;

      this.startUpload(file);

      console.log('Selected file:', file);
      console.log('Final filename:', finalName);
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


  async finishUpload() {

    if (!this.selectedFile) {
      console.error('No file selected');
      return;
    }

    const finalFileName =
      this.item?.FileName?.trim()
        ? this.item.FileName
        : `${this.item?.Title}.mp3`;

    const renamedFile = new File(
      [this.selectedFile],
      finalFileName,
      { type: this.selectedFile.type }
    );

    console.log('Renamed File:', renamedFile);

    const success = await this.srv.handleFileUpload(
      this.item?.ProgramID,
      this.srv.getsession('id'),
      renamedFile,
      this.getDeleteType()
    );
    if (success) {
      this.toast.show({
        title: 'File Replaced successfully! ',
        description: 'File has been successfully replaced',
        variant: 'success',
        position: 'toast-bottom-center'
      });
    } else {
      this.toast.show({
        title: 'Failed to replace file ❌ ',
        description: 'Something went wrong',
        variant: 'error',
        position: 'toast-bottom-center'
      });
    }

  }

  getDeleteType(): string {
    switch (this.item?.CategoryName?.toLowerCase()) {
      case 'podcast':
        return '6';
      case 'prescheduled':
        return '5';
      case 'shorts':
        return '4';
      default:
        return '6';
    }
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