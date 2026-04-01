
import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { UploadAdFile } from './components/upload-ad-file/upload-ad-file';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-advertisements',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule,
     MatInputModule, MatSelectModule, FormsModule, MatButtonModule, MatMenuModule,
      PrimaryButton,MatProgressSpinnerModule],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements {

  constructor(private dialog: MatDialog) { }

  openModal() {
    this.dialog.open(UploadAdFile, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
    });
  }

  searchText = '';
  status = '';
  category = '';
  day = '';

  columns: string[] = [
    'advertisements',
    'advertiser',
    'adType',
    'adPlayCount',
    'adStatus',
    'actions'
  ];

getAdTypeIcon(type: string): string {
  switch (type?.toLowerCase()) {
    case 'audio':
      return '/main/audio.svg';
    case 'video':
      return '/main/video.svg';
    case 'image':
      return '/main/image.svg';
    default:
      return '/main/image.svg';
  }
}

  
getStatusClass(status: string): string {
  switch (status) {
    case 'Active': return 'active';
    case 'Waiting List': return 'waiting';
    case 'Published': return 'published';
    case 'Expired': return 'expired';
    default: return '';
  }
}


  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  ds: [] = [];

    @ViewChild(MatPaginator) set matPaginator(p: MatPaginator) {
    if (p) {
      this.dataSource.paginator = p;
    }
  } 
   dataSource = new MatTableDataSource<any>([]);

     ngOnInit(): void {
    this.getAdvertisements();
  }

getAdvertisements(): void {
  this.loading = true;
  this.tv = [{ T: 'c10', V: '3' }];

  this.srv.getdata('advertisement', this.tv)
    .subscribe({
      next: (r) => {

        this.ds = r.Data[0].map((item: any) => ({
          ...item,
          adStatusClass: this.getStatusClass(item.Status)
        }));

        this.dataSource.data = this.ds;
        this.dataSource._updateChangeSubscription();
        this.loading = false;

      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    });
}
}