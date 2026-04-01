import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-file-upload',
  imports: [
    FormsModule ,CommonModule  // ✅ ADD THIS
  ],
  templateUrl: './update-file-upload.html',
  styleUrl: './update-file-upload.css',
})
export class UpdateFileUpload {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() close = new EventEmitter<void>();

  // 🔥 NEW STATES
  isUploading = false;
  uploadProgress = 0;

  fileBaseName = '';
  fileDate = '';

  // circle progress helpers
  radius = 50;
  circumference = 2 * Math.PI * this.radius;

  get progressOffset() {
    return this.circumference - (this.uploadProgress / 100) * this.circumference;
  }

  // =========================
  // EXISTING
  // =========================
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  // =========================
  // 🔥 UPDATED
  // =========================
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);

      // ✅ Extract filename (without extension)
      const nameWithoutExt = file.name.split('.')[0];

      this.fileBaseName = nameWithoutExt + '_';
      this.fileDate = this.getTodayDate();

      // 🔥 SWITCH UI
      this.isUploading = true;

      // 🔥 START UPLOAD (mock / replace later with API)
      this.startUpload(file);
    }
  }

  // =========================
  // Upload Simulation (replace with API later)
  // =========================
  startUpload(file: File) {
    this.uploadProgress = 0;

    const interval = setInterval(() => {
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      } else {
        this.uploadProgress += 10;
      }
    }, 300);
  }

  // =========================
  // Cancel Upload
  // =========================
  cancelUpload() {
    this.isUploading = false;
    this.uploadProgress = 0;
  }

  // =========================
  // Finish Upload
  // =========================
  finishUpload() {
    const finalFileName = `${this.fileBaseName}${this.fileDate}.mp3`;
    console.log('Final File Name:', finalFileName);

    this.close.emit();
  }

  // =========================
  // Date Helper
  // =========================
  getTodayDate(): string {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}${month}${year}`;
  }

  
  get isCompleted() {
  return this.uploadProgress === 100;
}

deleteFile(){
  
}
  onCancel() {
    this.close.emit();
  }
}