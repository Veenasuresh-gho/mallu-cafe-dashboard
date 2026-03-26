import { Component } from '@angular/core';
import { UploadNewFileModal } from './components/upload-new-file-modal/upload-new-file-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-media-library',
  imports: [],
  templateUrl: './media-library.html',
  styleUrl: './media-library.css',
})
export class MediaLibrary {

    constructor(private dialog: MatDialog) {} 

  openModal() {
    this.dialog.open(UploadNewFileModal, {
      //  width: '700px',
      disableClose: true
    });
  }
}
