
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
import { ToastService } from '../../services/toastService';
import { MatDividerModule } from '@angular/material/divider';
import { SelectDropDown } from '../../components/select-drop-down/select-drop-down';
import { CustomFilterCalender } from '../../components/custom-filter-calender/custom-filter-calender';

@Component({
  selector: 'app-advertisements',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule,
    MatInputModule, MatSelectModule, FormsModule, MatButtonModule, MatMenuModule,
    PrimaryButton, MatProgressSpinnerModule, MatDividerModule, SelectDropDown, CustomFilterCalender],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements {

  status = 'allStatus';
  category = 'all';
  day = 'all';
  constructor(private dialog: MatDialog) { }

  toast = inject(ToastService);
  openModal() {
    const dialogRef = this.dialog.open(UploadAdFile, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.getAdvertisements();
      }
    });
  }

  editAdvertisement(row: any) {
    this.dialog.open(UploadAdFile, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      data: {
        mode: 'edit',
        advertisement: row
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.getAdvertisements(); // refresh table
      }
    });
  }

  // programsDropdown: string = 'all';
  // tempProgramSelection: string = 'all';
  // isCalendarOpen: boolean = false;

  programsDropdown: string = 'today';
  tempProgramSelection: string = 'today';
  isCalendarOpen: boolean = false;
  dayLabel = 'Today';
  searchText = '';

  onProgramChange(value: string) {
  if (value === 'date') {
    this.isCalendarOpen = true;
    this.tempProgramSelection = value;
  } else {
    this.programsDropdown = value;
    this.tempProgramSelection = value;
    this.isCalendarOpen = false;
  }
}

onFilterApplied(data: any) {
  this.isCalendarOpen = false;

  if (data.type === 'single') {
    const date = new Date(data.value);

    this.dayLabel =
      date.toLocaleDateString('en-GB');

    this.day = this.dayLabel;
  }
}

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

  isImage(url: string): boolean {
    return url?.toLowerCase().includes('.jpg') ||
      url?.toLowerCase().includes('.jpeg') ||
      url?.toLowerCase().includes('.png') ||
      url?.toLowerCase().includes('.webp');
  }

  isVideo(url: string): boolean {
    return url?.toLowerCase().includes('.mp4');
  }

  isAudio(url: string): boolean {
    return url?.toLowerCase().includes('.mp3');
  }

  onImgError(event: any) {
    event.target.src = '/assets/file-icon.svg';
  }

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

  publishAdvertisement(id: any) {
    const tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '5' }
    ];
    this.srv.getdata('advertisement', tv).subscribe({
      next: (r: any) => {
        if (r && r.Status === 1) {
          this.toast.show({
            title: 'Advertisement published successfully! ',
            description: 'Advertisement has been successfully published',
            variant: 'success',
            position: 'toast-bottom-center'
          });
          this.getAdvertisements();
        } else {
          this.toast.show({
            title: 'Failed to publish advertisement ❌',
            description: r?.Info || 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.toast.show({
          title: 'Error ❌',
          description: 'Server error while publishing advertisement',
          variant: 'error',
          position: 'toast-bottom-center'
        });

      }
    });
  }

  closeAdvertisement(id: any) {
    const tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '6' }
    ];
    this.srv.getdata('advertisement', tv).subscribe({
      next: (r: any) => {
        if (r && r.Status === 1) {
          this.toast.show({
            title: 'Advertisement closed successfully! ',
            description: 'Advertisement has been successfully closed',
            variant: 'success',
            position: 'toast-bottom-center'
          });
          this.getAdvertisements();
        } else {
          this.toast.show({
            title: 'Failed to close advertisement ❌',
            description: r?.Info || 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      },
      error: () => {
        this.loading = false;
        this.toast.show({
          title: 'Error ❌',
          description: 'Server error while closing advertisement',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
  }

  deleteAdvertisement(id: any) {
    this.loading = true;
    const tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '4' }
    ];

    this.srv.getdata('advertisement', tv).subscribe({
      next: (r: any) => {

        this.loading = false;

        if (r && r.Status === 1) {

          this.toast.show({
            title: 'Advertisement deleted successfully! ',
            description: 'Advertisement has been successfully deleted',
            variant: 'success',
            position: 'toast-bottom-center'
          });

          this.getAdvertisements();

        } else {

          this.toast.show({
            title: 'Failed to delete advertisement ❌',
            description: r?.Info || 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-center'
          });

        }
      },

      error: () => {
        this.loading = false;

        this.toast.show({
          title: 'Error ❌',
          description: 'Server error while deleting advertisement',
          variant: 'error',
          position: 'toast-bottom-center'
        });

      }
    });
  }
}