import { Component } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-podcast',
  imports: [MatDialogContent],
  templateUrl: './add-podcast.html',
  styleUrl: './add-podcast.css',
})
export class AddPodcast {
      constructor(private dialogRef: MatDialogRef<AddPodcast>) {}

       close() {
    this.dialogRef.close();
  }
}
