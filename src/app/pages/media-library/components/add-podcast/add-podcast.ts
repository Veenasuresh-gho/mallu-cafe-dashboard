import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { ToastService } from '../../../../services/toastService';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

@Component({
  selector: 'app-add-podcast',
  imports: [MatDialogContent, DialogHeaderComponent, FormInput, CancelButton, FooterButton,
    FileUpload, CommonModule, PrimaryButton
  ],
  templateUrl: './add-podcast.html',
  styleUrl: './add-podcast.css',
})
export class AddPodcast implements OnInit {
  categoryName: string = '';
  loading = false;
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  id: string = '';
  userId: string = '';
  errors: any = {};
  selectedFile!: File;
  fileName: string = '';
  toast = inject(ToastService);

  constructor(private dialogRef: MatDialogRef<AddPodcast>) { }

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id') || '';
  }

  addCategory() {
    this.loading = true;

    this.tv = [
      { T: 'dk1', V: this.categoryName },
      { T: 'c10', V: '7' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: async (r) => {
          const data = r.Data[0][0];
          this.id = data.id;

          if (r.Status === 1) {

            this.id = r.Data[0][0].id;
            console.log(this.id)

            const success = await this.srv.handleFileUpload(
              this.id,
              this.userId,
              this.selectedFile,
              '10'
            );

            this.loading = false;

            if (success) {
              this.toast.show({
                title: 'Podcast category added successfully! 🎉',
                description: 'Podcast category added successfully!',
                variant: 'success',
                position: 'toast-bottom-right'
              });

              this.dialogRef.close(true);
            } else {
              this.toast.show({
                title: 'Upload failed ❌',
                description: 'File upload failed',
                variant: 'error',
                position: 'toast-bottom-right'
              });
            }
          }

        },
        error: (err) => {
          console.error('API error:', err);
        }
      });
  }
  close() {
    this.dialogRef.close();
  }

  clearError(field: string) {
    if (this.errors[field]) delete this.errors[field];
  }
  onFileSelected(file: File) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errors.file = 'Only image files allowed';
      return;
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9._]/g, '');

    this.selectedFile = new File([file], cleanName, {
      type: file.type
    });

    this.fileName = cleanName;

    this.clearError('file');

  }
}
