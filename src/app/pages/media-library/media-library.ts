
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

@Component({
  selector: 'app-media-library',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule,
     FormsModule, PrimaryButton, MatButtonModule, MatMenuModule,MatDividerModule],
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

  // openModal() {
  //   this.dialog.open(UploadNewFileModal, {
  //     width: '90%',
  //     maxWidth: '600px',
  //     maxHeight: '95vh',
  //     disableClose: true,
  //   });
  // }


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
    openUpdateMediaLibraryModal() {
    this.dialog.open(EditUploadedFile, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
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
    this.tv = [
      { T: 'dk1', V: library?.id },
      { T: 'c10', V: '14' }
    ];

    this.srv.getdata('podcast', this.tv)
      .subscribe({
        next: (r) => {
          console.log(r)
         
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
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
  if (!row.fid) return;
  this.loading = true;
  // this.cd.detectChanges(); 

  const userId = this.srv.getsession('id');

  this.tv = [
    { T: 'dk1', V: userId },
    { T: 'dk2', V: row.DocumentTypeID },
    { T: 'c1', V: row.fid },
    { T: 'c10', V: '4' }
  ];

  this.srv.getdata('fileupload', this.tv).subscribe({
    next: (r: any) => {
      // this.loading = false;
      // this.cd.detectChanges(); 

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
      console.error('💥 Error:', err);

      // this.loading = false;
      // this.cd.detectChanges(); // 🔥 FIX

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
