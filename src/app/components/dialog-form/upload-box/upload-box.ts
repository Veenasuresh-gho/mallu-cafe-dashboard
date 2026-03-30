import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload-box',
  imports: [],
  templateUrl: './upload-box.html',
  styleUrl: './upload-box.css',
})
export class UploadBox {
   /** Main text above the upload */
  @Input() uploadText: string = 'Upload File';

  /** Subtext below the main text */
  @Input() subText: string = 'Drag & drop your file here, or click to browse';

  /** Allowed file types e.g., "audio/mp3, video/mp4" */
  @Input() accept: string = '*';

  /** Max size description text */
  @Input() sizeText: string = 'MP3, MP4 • Max size: 1.5 GB';

  /** Event emitted when a file is selected */
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileSelected.emit(file);
    }
  }
}
