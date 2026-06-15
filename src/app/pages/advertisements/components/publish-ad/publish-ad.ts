import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';
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
import { ToastService } from '../../../../services/toastService';

@Component({
  selector: 'app-publish-ad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  PublishADloading = false;
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
  ds: [] = [];
  advertisements: any[] = [];
  toast = inject(ToastService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);
  columns: string[] = [
    'select',
    'advertisements',
    'adStatus'
  ];

  constructor(
    private dialogRef: MatDialogRef<PublishAd>,
    private cdr: ChangeDetectorRef
  ) { }

  closeCalendar() {
    this.isCalendarOpen = false;
    this.day = 'all';
  }

      formatFileName(name: string, startLength = 15, endLength = 6): string {
    if (!name) return '';
    const extIndex = name.lastIndexOf('.');
    if (extIndex === -1) return name;
    const base = name.substring(0, extIndex);
    const ext = name.substring(extIndex);
    if (base.length <= startLength + endLength) {
      return name;
    }
    return (
      base.substring(0, startLength) +
      '...' +
      base.substring(base.length - endLength) +
      ext
    );
  }


  removeSelectedAd(ad: any): void {
    this.selectedAds = this.selectedAds.filter(
      item => item !== ad
    );
    ad.selected = false;
    this.dataSource._updateChangeSubscription();
  }

  // toggleSelection(row: any, checked: boolean): void {
  //   row.selected = checked;

  //   if (checked) {
  //     if (!this.selectedAds.includes(row)) {
  //       this.selectedAds.push(row);
  //     }
  //   } else {
  //     this.selectedAds = this.selectedAds.filter(
  //       ad => ad !== row
  //     );
  //   }

  //   this.dataSource._updateChangeSubscription();
  // }

  toggleSelection(row: any, checked: boolean): void {

  if (checked) {

    // Unselect all other ads
    this.dataSource.data.forEach((ad: any) => {
      ad.selected = false;
    });

    // Select current ad
    row.selected = true;

    // Keep only one selected ad
    this.selectedAds = [row];

  } else {

    row.selected = false;
    this.selectedAds = [];

  }

  this.dataSource._updateChangeSubscription();
}
  onSelectAd(row: any, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleSelection(row, checked);
  }

  toggleRowSelection(row: any): void {
    this.toggleSelection(row, !row.selected);
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
      this.applyFilters();
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

    this.applyFilters();
  }

  applyFilters(): void {
    const tags = [
      // Status
      {
        T: 'dk1',
        V:
          this.status === 'active'
            ? '1'
            : this.status === 'waiting-list'
              ? '2'
              : this.status === 'published'
                ? '3'
                : this.status === 'expired'
                  ? '4'
                  : ''
      },
      {
        T: 'dk2',
        V:
          this.category === 'audio'
            ? '1'
            : this.category === 'video'
              ? '2'
              : this.category === 'image'
                ? '3'
                : ''
      },
      // From Date
      {
        T: 'c1',
        V: this.fromDate || ''
      },
      // To Date
      {
        T: 'c2',
        V: this.toDate || ''
      },
         { T: 'c3', V: '1' },
      {
        T: 'c10',
        V: '3'
      }
    ];

    this.loading = true;
    this.srv.getdata('advertisement', tags).subscribe({
      next: (r) => {
        let data = (r.Data?.[0] || []).map((item: any) => ({
          ...item,
          adStatusClass: this.getStatusClass(item.Status)
        }));
        this.loading = false;
        this.cdr.detectChanges();
        // Local Search Filter
        if (this.searchText) {
          const search = this.searchText.toLowerCase();
          data = data.filter((item: any) =>
            item.FileName?.toLowerCase().includes(search) ||
            item.AdvertiserName?.toLowerCase().includes(search)
          );
        }
        this.ds = data;
        this.dataSource.data = data;
        this.dataSource._updateChangeSubscription();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }



  ngOnInit(): void {
    this.getAdvertisements();
    const permissions = JSON.parse(
      localStorage.getItem('permissions') || '{}'
    );

    this.canManageAds =
      permissions?.AdManagementPermission === 1;
  }

  getAdvertisements(): void {
    this.loading = true;
    this.tv = [
      { T: 'c3', V: '1' },
      { T: 'c10', V: '3' }
    ];
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

  publishAds(): void {
    if (this.selectedAds.length === 0) {
      alert('Please select at least one advertisement');
      return;
    }
    const selectedAdIds = this.selectedAds
      .map(ad => ad.AdvertisementID)
      .join(',');
    const teamMemberId = this.srv.getsession('id');
    const queueTags = [
      { T: 'dk1', V: '' },
      { T: 'dk2', V: teamMemberId },
      { T: 'c1', V: selectedAdIds },
      { T: 'c10', V: '7' }
    ];
    this.PublishADloading = true;
    this.cdr.detectChanges();
    // STEP 1 - Queue Advertisement
    this.srv.getdata('advertisement', queueTags).subscribe({
      next: (queueRes) => {
        const adBreak = queueRes?.Data?.[0]?.[0];
        if (!adBreak?.AdBreakIDAlt) {
          this.PublishADloading = false;
          this.cdr.detectChanges();
          this.toast.show({
            title: 'Publishing failed ❌',
            description: 'Ad Break ID not found',
            variant: 'error',
            position: 'toast-bottom-center'
          });

          return;
        }
        const publishTags = [
          {
            T: 'dk1',
            V: adBreak.AdBreakIDAlt
          },
          {
            T: 'c10',
            V: '9'
          }
        ];
        // STEP 2 - Publish Advertisement
        this.srv.getdata('advertisement', publishTags).subscribe({
          next: (publishRes) => {
            this.PublishADloading = false;
            this.cdr.detectChanges();
            if (publishRes?.Status === 1) {
              this.toast.show({
                title: 'Advertisement published successfully',
                description: 'Selected advertisements have been published successfully.',
                variant: 'success',
                position: 'toast-bottom-center'
              });
              this.dialogRef.close(true);
            } else {
              this.toast.show({
                title: 'Publishing failed ❌',
                description: publishRes?.Info || 'Unable to publish advertisements',
                variant: 'error',
                position: 'toast-bottom-center'
              });
            }
          },
          error: (err) => {
            this.PublishADloading = false;
            this.cdr.detectChanges();
            console.error('Publish API Failed', err);
            this.toast.show({
              title: 'Publishing failed ❌',
              description: 'Something went wrong while publishing advertisements.',
              variant: 'error',
              position: 'toast-bottom-center'
            });
          }
        });
      },
      error: (err) => {
        this.PublishADloading = false;
        this.cdr.detectChanges();
        console.error('Queue API Failed', err);
        this.toast.show({
          title: 'Queue creation failed ❌',
          description: 'Unable to create advertisement queue.',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
  }
}