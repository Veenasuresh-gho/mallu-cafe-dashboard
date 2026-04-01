import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css',
})
export class FileUpload {
  @Input() label: string = 'Upload Image';
  @Input() accept: string = ''; // e.g. "image/*"
  @Input() fileText: string = '- No file uploaded -';

  @Output() fileSelected = new EventEmitter<File>();

  fileName: string = '';

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.fileSelected.emit(file);
    }
  }
}
