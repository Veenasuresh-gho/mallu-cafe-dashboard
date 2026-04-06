import { Component, inject, OnInit } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { FileUpload } from '../../../../components/dialog-form/file-upload/file-upload';
import { CommonModule } from '@angular/common';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';

@Component({
  selector: 'app-add-podcast',
  imports: [MatDialogContent, DialogHeaderComponent, FormInput, CancelButton, FooterButton,
    FileUpload, CommonModule
  ],
  templateUrl: './add-podcast.html',
  styleUrl: './add-podcast.css',
})
export class AddPodcast {
  categoryName: string = '';
  loading = false;
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  constructor(private dialogRef: MatDialogRef<AddPodcast>) { }
  addCategory() {
    this.loading = true;

    this.tv = [
      { T: 'c1', V: this.categoryName },
      { T: 'c10', V: '7' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {
          const data = r.Data[0];        
        },
      });
  }
  close() {
    this.dialogRef.close();
  }
  onFileSelected(file: File) {
    console.log('Selected file:', file);
  }
}
