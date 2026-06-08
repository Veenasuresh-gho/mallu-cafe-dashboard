import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { tags } from '../../../../../model/ghomodel';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SelectDropDown } from '../../../../components/select-drop-down/select-drop-down';
import { CustomFilterCalender } from '../../../../components/custom-filter-calender/custom-filter-calender';
import { MatIconModule } from '@angular/material/icon';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
// import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-publish-ad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    SelectDropDown,
    CustomFilterCalender,
    MatIconModule,
    MatPaginatorModule,
    PrimaryButton
  ],
  templateUrl: './publish-ad.html',
  styleUrl: './publish-ad.css'
})
export class PublishAd implements OnInit {

  private srv = inject(GHOService);
  private utl = inject(GHOUtitity);

  loading = false;
  canManageAds = false;
  status = 'allStatus';
  category = 'all';
  day = 'all';
  searchText = '';
  fromDate = '';
  toDate = '';
  dayLabel = 'Today';
  selectedAd: any = null;
  programsDropdown: string = 'today';
  tempProgramSelection: string = 'today';
  isCalendarOpen: boolean = false;
  selectedAds: any[] = [];
  tv: tags[] = [];

  advertisements: any[] = [];


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>([]);

  columns: string[] = [
     'select',
    'advertisements',
    // 'advertiser',
    // 'adType',
    'adStatus'
  ];


  closeCalendar() {
    this.isCalendarOpen = false;
    this.day = 'all';
  }


  removeSelectedAd(ad: any): void {

  this.selectedAds = this.selectedAds.filter(
    item => item !== ad
  );

  ad.selected = false;

  this.dataSource._updateChangeSubscription();
}



onSelectAd(row: any, event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  row.selected = checked;

  if (checked) {

    if (!this.selectedAds.includes(row)) {
      this.selectedAds.push(row);
    }

  } else {

    this.selectedAds = this.selectedAds.filter(
      ad => ad !== row
    );

  }

  console.log('Selected Ads:', this.selectedAds);

  this.dataSource._updateChangeSubscription();
}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  displayedColumns: string[] = [
    'advertisements',
    'adStatus'
  ];

  onProgramChange(value: string) {
    if (value === 'date') {
      this.isCalendarOpen = true;
      this.tempProgramSelection = value;
    } else {
      this.day = value;
      this.isCalendarOpen = false;
      const today = new Date();
      if (value === 'today') {
        const date = today.toISOString().split('T')[0];
        this.fromDate = date;
        this.toDate = date;
      } else if (value === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const date = tomorrow.toISOString().split('T')[0];
        this.fromDate = date;
        this.toDate = date;
      } else {
        this.fromDate = '';
        this.toDate = '';
      }
      // this.applyFilters();
    }
  }

  onFilterApplied(data: any) {
    this.isCalendarOpen = false;
    if (data.type === 'single') {
      const selectedDate = new Date(data.value);
      this.fromDate = selectedDate.toISOString().split('T')[0];
      this.toDate = selectedDate.toISOString().split('T')[0];
      this.dayLabel =
        selectedDate.toLocaleDateString('en-GB');
    }

    else if (data.type === 'range') {
      const startDate = new Date(data.start);
      const endDate = new Date(data.end);

      this.fromDate = startDate.toISOString().split('T')[0];
      this.toDate = endDate.toISOString().split('T')[0];

      this.dayLabel =
        `${startDate.toLocaleDateString('en-GB')} - ${endDate.toLocaleDateString('en-GB')}`;
    }


    // this.applyFilters();
  }

  constructor(
    private dialogRef: MatDialogRef<PublishAd>,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAdvertisements();

    const permissions = JSON.parse(
      localStorage.getItem('permissions') || '{}'
    );

    this.canManageAds =
      permissions?.AdManagementPermission === 1;
  }

  // getAdvertisements(): void {
  //   this.loading = true;

  //   this.tv = [
  //     {
  //       T: 'c10',
  //       V: '3'
  //     }
  //   ];

  //   this.srv.getdata('advertisement', this.tv).subscribe({
  //     next: (response: any) => {

  //       this.advertisements = (response?.Data?.[0] || []).map(
  //         (item: any) => ({
  //           ...item,
  //           adStatusClass: this.getStatusClass(item.Status)
  //         })
  //       );

  //       this.dataSource.data = this.advertisements;

  //       this.loading = false;

  //     this.cdr.detectChanges();
  //     },
  //     error: (error) => {
  //       console.error('Advertisement API Error:', error);
  //       this.loading = false;
  //     }
  //   });
  // }

  getAdvertisements(): void {
  this.loading = true;

  this.tv = [{ T: 'c10', V: '3' }];

  this.srv.getdata('advertisement', this.tv).subscribe({
    next: (response: any) => {

      this.advertisements = (response?.Data?.[0] || []).map(
        (item: any) => ({
          ...item,
          adStatusClass: this.getStatusClass(item.Status)
        })
      );

      this.dataSource.data = this.advertisements;

      this.loading = false;

      this.cdr.detectChanges();

      console.log('Loading:', this.loading);
      console.log('Rows:', this.dataSource.data.length);
    },

    error: (err) => {
      console.error(err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'active';

      case 'Waiting List':
        return 'waiting';

      case 'Published':
        return 'published';

      case 'Expired':
        return 'expired';

      default:
        return '';
    }
  }

  isImage(url: string): boolean {
    if (!url) return false;

    const file = url.toLowerCase();

    return (
      file.includes('.jpg') ||
      file.includes('.jpeg') ||
      file.includes('.png') ||
      file.includes('.webp')
    );
  }

  isVideo(url: string): boolean {
    return !!url && url.toLowerCase().includes('.mp4');
  }

  isAudio(url: string): boolean {
    return !!url && url.toLowerCase().includes('.mp3');
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/file-icon.svg';
  }

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

  close(): void {
    this.dialogRef.close();
  }
}