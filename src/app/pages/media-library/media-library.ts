
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
import { CustomFilterCalender } from '../../components/custom-filter-calender/custom-filter-calender';
import { SelectDropDown } from '../../components/select-drop-down/select-drop-down';

@Component({
  selector: 'app-media-library',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule,
    FormsModule, PrimaryButton, MatButtonModule, MatMenuModule, MatDividerModule, CustomFilterCalender, SelectDropDown],
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
  mediaCount: any = {};
  toast = inject(ToastService);

  host = 'all';
  day = 'all';
  hosts: any[] = [];
  hostOptions: any[] = [];

  canUploadMedia = false;
  canManageAds = false;
  canManagePrograms = false;
  canManageMembers = false;

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) set matPaginator(p: MatPaginator) {
    if (p) {
      this.dataSource.paginator = p;
    }
  }
  ngOnInit(): void {
    this.getMediaLibrary();
    this.getTeamMemberList()

    const permissions = JSON.parse(
      localStorage.getItem('permissions') || '{}'
    );

    this.canUploadMedia =
      permissions.MediaUploadPermission === 1;

    this.canManageAds =
      permissions.AdManagementPermission === 1;

    this.canManagePrograms =
      permissions.ProgramManagementPermission === 1;

    this.canManageMembers =
      permissions.MemberManagementPermission === 1;
  }
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) { }


  programsDropdown: string = 'today';
  tempProgramSelection: string = 'today';
  isCalendarOpen: boolean = false;
  dayLabel = 'Today';
  // searchText = '';


  onProgramChange(value: string) {
    if (value === 'date') {
      this.isCalendarOpen = true;
    } else {
      this.day = value;
      this.isCalendarOpen = false;

      this.fromDate = '';
      this.toDate = '';

      this.applyFilters();
    }
  }

  onFilterApplied(data: any) {
    this.isCalendarOpen = false;
    this.day = 'date';

    if (data.type === 'weekday' || data.type === 'single') {
      const selectedDate = new Date(data.value);
      this.fromDate = selectedDate.toISOString().split('T')[0];
      this.toDate = selectedDate.toISOString().split('T')[0];
      this.dayLabel = selectedDate.toLocaleDateString('en-GB');
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


  applyFilters() {
    const tags = [
      { T: 'dk1', V: '0' },

      // Search
      {
        T: 'dk2',
        V: this.searchText || ''
      },

      // Publish Status
      {
        T: 'c1',
        V:
          this.status === 'published'
            ? '1'
            : this.status === 'draft'
              ? '2'
              : ''
      },

      // Category
      {
        T: 'c2',
        V:
          this.category === 'pre-Scheduled'
            ? '1'
            : this.category === 'poadcast'
              ? '2'
              : this.category === 'Featured'
                ? '3'
                : this.category === 'shorts'
                  ? '4'
                  : ''
      },

      // Host
      {
        T: 'c3',
        V: this.host !== 'all'
          ? this.host
          : ''
      },

      // Date Filter
      {
        T: 'c4',
        V:
          this.day === 'today'
            ? '1'
            : this.day === 'tomorrow'
              ? '2'
              : this.day === 'date'
                ? '3'
                : ''
      },

      {
        T: 'c5',
        V: this.fromDate || ''
      },

      {
        T: 'c6',
        V: this.toDate || ''
      },

      {
        T: 'c10',
        V: '15'
      }
    ];

    this.loading = true;

    this.srv.getdata('program', tags)
      .subscribe({
        next: (r) => {

          this.ds = r.Data[0] || [];

          this.dataSource.data = this.ds;
          this.dataSource._updateChangeSubscription();

          this.loading = false;
          this.cdr.markForCheck();
        },

        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  clearFilters() {
    this.searchText = '';
    this.status = 'all';
    this.category = 'all';
    this.host = 'all';
    this.day = 'all';
    this.fromDate = '';
    this.toDate = '';
    this.dayLabel = 'All Media';
    this.getMediaLibrary();
  }

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
  fromDate = '';
  toDate = '';


  columns: string[] = [
    'media',
    'category',
    'member',
    'likes',
    'status',
    'actions'
  ];

  closeCalendar() {
    this.isCalendarOpen = false;
    this.day = 'all';
  }


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
          this.mediaCount = r.Data[1]?.[0] || {};
          this.dataSource.data = this.ds;
          this.dataSource._updateChangeSubscription();
          this.loading = false;
          this.cdr.markForCheck();
          console.log('mediaCount',this.mediaCount);
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

  getTeamMemberList(): Promise<void> {
    return new Promise((resolve) => {
      this.tv = [
        { T: 'c10', V: '3' }
      ];
      this.srv.getdata('teammember', this.tv)
        .subscribe({
          next: (r) => {
            const data = r.Data[0];
            this.hostOptions = [
              { label: 'All Host', value: 'all' },
              ...data.map((item: any) => ({
                label: item.FullName,
                value: item.id
              }))
            ];

            resolve();
          },
          error: () => resolve()
        });
    });
  }
} 
