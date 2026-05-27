
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { UploadNewFileModal } from './components/upload-new-file-modal/upload-new-file-modal';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ToastService } from '../../services/toastService';
import { EditUploadedFile } from './components/edit-uploaded-file/edit-uploaded-file';
import { ViewFile } from './components/view-file/view-file';

@Component({
  selector: 'app-media-library',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule,
    FormsModule, PrimaryButton, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './media-library.html',
  styleUrl: './media-library.css',
})
export class MediaLibrary implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  ds: [] = [];
  toast = inject(ToastService);

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) set matPaginator(p: MatPaginator) {
    if (p) {
      this.dataSource.paginator = p;
    }
  }
  ngOnInit(): void {
    this.getMediaLibrary();
  }
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ViewFileModal(id: string) {
    const dialogRef = this.dialog.open(ViewFile, {
      width: '90%',
      maxWidth: '650px',
      maxHeight: '95vh',
      disableClose: true,
      data: {
        id: id
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMediaLibrary();
      }
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(UploadNewFileModal, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMediaLibrary();
      }
    });
  }

  openUpdateMediaLibraryModal(id: string) {
  const dialogRef = this.dialog.open(EditUploadedFile, {
    width: '90%',
    maxWidth: '600px',
    maxHeight: '95vh',
    disableClose: true,
    data: {
      id: id
    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.getMediaLibrary();
    }

  });
}

  searchText = '';
  status = 'all';
  category = 'all';
  members = 'all';
  period = 'all';

  columns: string[] = [
    'media',
    'category',
    'member',
    'likes',
    'status',
    'actions'
  ];

  addPublish(library: any) {
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: library?.AltID },
      { T: 'c10', V: '14' }
    ];

    this.srv.getdata('podcast', this.tv)
      .subscribe({
        next: (r: any) => {
          this.loading = false;
          console.log(r);
          if (r.Status === 1) {
            this.toast.show({
              title: 'File published successfully! 🎉',
              description: '',
              variant: 'success',
              position: 'toast-bottom-center'
            });
            this.getMediaLibrary();
          } else {
            this.toast.show({
              title: 'Failed to publish file',
              description: 'Please try again',
              variant: 'error',
              position: 'toast-bottom-center'
            });
          }
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
          this.toast.show({
            title: 'Error publishing file',
            description: 'Please try again later',
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      });
  }



  getMediaLibrary(): void {
    this.loading = true;
    this.tv = [{ T: 'c10', V: '15' }];
    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          this.ds = r.Data[0];
          this.dataSource.data = this.ds;
          this.dataSource._updateChangeSubscription();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }


  deleteMediaLibrary(row: any) {
    if (!row.id) return;
    this.loading = true;
    this.tv = [
      { T: 'dk1', V: row?.id },
      { T: 'c10', V: '24' }
    ];
    this.srv.getdata('program', this.tv).subscribe({
      next: (r: any) => {

        if (r.Status === 1) {
          this.getMediaLibrary()
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
