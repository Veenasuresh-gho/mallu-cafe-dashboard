import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { FileUpload } from '../../../../components/dialog-form/file-upload/file-upload';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

import { ghoresult, tags } from '../../../../../model/ghomodel';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ToastService } from '../../../../services/toastService';

@Component({
  selector: 'app-edit-poadcast',
  standalone: true,
  imports: [
    CommonModule,
    FormInput,
    CancelButton,
    FileUpload,
    PrimaryButton,
  ],
  templateUrl: './edit-poadcast.html',
  styleUrl: './edit-poadcast.css',
})
export class EditPoadcast implements OnInit {

  categoryName: string = '';
  loading = false;

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  toast = inject(ToastService);

  errors: any = {};

  selectedFile!: File;

  fileName: string = '';
  imageUrl: string = '';

  id: string = '';
  userId: string = '';

  fid: number | null = null;

  catogories: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditPoadcast>,
    private cdr: ChangeDetectorRef,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) { }

  ngOnInit(): void {

    this.userId = (sessionStorage.getItem('id') || '')
      .replace(/"/g, '');
    if (this.data) {

      this.categoryName = this.data.DisplayText || '';
      this.id = this.data.DataValue || '';

      this.getPodcastCategoryDetails();
    }
  }

  getPodcastCategoryDetails() {
    this.tv = [
      { T: 'dk1', V: this.id },
      { T: 'c10', V: '4' }
    ];
    this.srv.getdata('lists', this.tv)
      .subscribe({

        next: (r) => {
          const data = r?.Data?.[0] || [];

          this.catogories = data.map((item: any) => ({
            DisplayText: item.Name,
            DataValue: item.PodcastcategoryID,
            fid: item.fid,
            url: item._url
          }));
          if (data.length > 0) {

            const item = data[0];

            this.categoryName = item.Name || '';

            this.imageUrl = item._url || '';

            this.fileName =
              item._url?.split('/').pop() || 'Category Icon';

            this.fid = item.fid || null;

            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error(err);
          this.toast.show({
            title: 'Error ❌',
            description: 'Failed to load category details',
            variant: 'error',
            position: 'toast-bottom-right'
          });
        }
      });
  }

  updateCategory() {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: this.id },
      { T: 'c1', V: this.categoryName },
      { T: 'c10', V: '6' }
    ];

    this.srv.getdata('lists', this.tv)
      .subscribe({

        next: async (r) => {

          if (r.Status === 1) {

            if (this.selectedFile) {

              await this.srv.handleFileUpload(
                this.id,
                this.userId,
                this.selectedFile,
                '10'
              );
            }

            this.loading = false;

            this.toast.show({
              title: 'Podcast category updated 🎉',
              description: 'Podcast category updated successfully!',
              variant: 'success',
              position: 'toast-bottom-right'
            });

            this.dialogRef.close(true);

          } else {

            this.loading = false;

            this.toast.show({
              title: 'Update failed ❌',
              description: 'Something went wrong',
              variant: 'error',
              position: 'toast-bottom-right'
            });
          }
        },

        error: (err) => {

          this.loading = false;
          console.error(err);

          this.toast.show({
            title: 'Error ❌',
            description: 'Server error',
            variant: 'error',
            position: 'toast-bottom-right'
          });
        }
      });
  }

  onFileSelected(file: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.errors.file = 'Only image files allowed';
      return;
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9._]/g, '');

    this.selectedFile = new File(
      [file],
      cleanName,
      { type: file.type }
    );

    this.fileName = cleanName;

    // hide old image block
    this.imageUrl = '';

    this.clearError('file');
  }

  removeImage() {

    this.imageUrl = '';
    this.fileName = '';
    this.fid = null;
  }

  clearError(field: string) {

    if (this.errors[field]) {
      delete this.errors[field];
    }
  }

  close() {
    this.dialogRef.close();
  }


  deleteCategoryIcon(fileUploadID: any) {
    if (!fileUploadID) return;
    this.cd.detectChanges();
    const userId = this.srv.getsession('id');

    this.tv = [
      { T: 'dk1', V: userId },
      { T: 'dk2', V: '10' },
      { T: 'c1', V: fileUploadID },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('fileupload', this.tv).subscribe({
      next: (r: any) => {
        this.cd.detectChanges();
        if (r.Status === 1) {
          this.getPodcastCategoryDetails()
          this.toast.show({
            title: 'File deleted successfully! 🎉',
            description: '',
            variant: 'success',
            position: 'toast-bottom-center'
          });
        } else {
          const apiMsg = r.Data?.[0]?.[0]?.msg || 'Please try again';
          this.toast.show({
            title: 'Failed to delete file',
            description: apiMsg,
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.cd.detectChanges();
        this.toast.show({
          title: 'Error deleting file',
          description: 'Please try again later',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
  }
}