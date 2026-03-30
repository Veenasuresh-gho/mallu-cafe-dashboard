import { Component } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';

@Component({
  selector: 'app-add-podcast',
  imports: [MatDialogContent,DialogHeaderComponent,FormInput,CancelButton,FooterButton],
  templateUrl: './add-podcast.html',
  styleUrl: './add-podcast.css',
})
export class AddPodcast {
      constructor(private dialogRef: MatDialogRef<AddPodcast>) {}

       close() {
    this.dialogRef.close();
  }
}
