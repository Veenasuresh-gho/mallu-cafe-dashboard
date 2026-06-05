import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AddNewProgram } from './components/add-new-program/add-new-program';
import { MatDialog } from '@angular/material/dialog';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { SelectDropDown } from '../../components/select-drop-down/select-drop-down';
import { ghoresult, tags } from '../../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { MatTableDataSource } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CustomFilterCalender } from '../../components/custom-filter-calender/custom-filter-calender';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../services/toastService';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-programs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule,
    MatInputModule, MatSelectModule, FormsModule, PrimaryButton, SelectDropDown,
    MatProgressSpinnerModule, CustomFilterCalender, MatMenuModule, MatDividerModule, MatButtonModule,MatTooltipModule],
  templateUrl: './programs.html',
  styleUrl: './programs.css',
})
export class Programs implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  searchText = '';
  status = 'all';
  category = 'all';
  host = 'all';
  program = 'all';
  dayLabel = 'Today';
  fromDate = '';
  toDate = '';

  loading = false;
  ds: [] = [];
  toast = inject(ToastService);
  hosts: any[] = [];
  hostOptions: any[] = [];

    columns: string[] = [
    'program',
    'category',
    'host',
    'duration',
    'dayTime',
    'interaction',
    'actions'
  ];

  programsDropdown: string = 'all';
  tempProgramSelection: string = 'all';
  isCalendarOpen: boolean = false;

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) { }



  openModal() {
    const dialogRef = this.dialog.open(AddNewProgram, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getProgramList();
      }
    });
  }


  applyFilters(): void {
  const tags: any[] = [
    { T: 'dk1', V: '0' },

    // Search Text
    {
      T: 'dk2',
      V: this.searchText || ''
    },

    // Category
    {
      T: 'c2',
      V:
        this.category === 'pre_scheduled'
          ? '1'
          : this.category === 'podcast'
          ? '2'
          : this.category === 'live'
          ? '3'
          : ''
    },

    // Host
    {
      T: 'c3',
      V: this.host !== 'all' ? this.host : ''
    },
    {
      T: 'c4',
      V:
        this.program === 'today'
          ? '1'
          : this.program === 'tomorrow'
          ? '2'
          : this.program === 'date'
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
    { T: 'c10', V: '3' }
  ];
  this.loading = true;
  this.srv.getdata('program', tags).subscribe({
    next: (r) => {
      let data = r.Data[0] || [];
      if (this.status !== 'all') {
        data = data.filter((item: any) => {
          switch (this.status) {
            case 'active':
              return item.IsActive;

            case 'completed':
              return item.IsCompleted;

            case 'upcoming':
              return !item.IsCompleted;

            default:
              return true;
          }
        });
      }
      this.ds = data;
      this.dataSource.data = data;
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

  editProgram(row: any) {
    this.dialog.open(AddNewProgram, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
      data: {
        mode: 'edit',
        // program: row
        id: row.id
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.getProgramList();
      }
    });
  }
  ngOnInit(): void {
    this.getProgramList();
    this.getTeamMemberList()
  }


  @ViewChild(MatPaginator) set matPaginator(p: MatPaginator) {
    if (p) {
      this.dataSource.paginator = p;
    }
  }
  dataSource = new MatTableDataSource<any>([]);


  getProgramList(): void {
    this.loading = true;
    this.tv = [{ T: 'c10', V: '3' }];
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

  getHostDisplay(hosts: string): string {
  if (!hosts) return '';
  const hostArray = hosts.split(',').map(h => h.trim());
  if (hostArray.length <= 1) {
    return hostArray[0];
  }
  return `${hostArray[0]}, +${hostArray.length - 1}`;
}
  get showPaginator(): boolean {
    return this.dataSource.data.length > 7;
  }



  // onProgramChange(value: string) {
  //   if (value === 'date') {
  //     this.isCalendarOpen = true;
  //     // store temporarily, DON'T apply yet
  //     this.tempProgramSelection = value;
  //   } else {
  //     this.programsDropdown = value;
  //     this.tempProgramSelection = value;
  //     this.isCalendarOpen = false;
  //   }
  // }

  onProgramChange(value: string) {
  if (value === 'date') {
    this.isCalendarOpen = true;
    this.tempProgramSelection = value;
  } else {
    this.program = value;
    this.programsDropdown = value;
    this.tempProgramSelection = value;
    this.isCalendarOpen = false;
    this.fromDate = '';
    this.toDate = '';

    this.applyFilters();
  }
}


  
// onFilterApplied(data: any) {
//   this.isCalendarOpen = false;
//   if (data.type === 'single') {
//     const date = new Date(data.value);
//     this.dayLabel =
//       date.toLocaleDateString('en-GB');
//     this.program = this.dayLabel;
//   }
// }

// onFilterApplied(data: any) {
//   this.isCalendarOpen = false;
//   if (data.type === 'single') {
//     const selectedDate = new Date(data.value);
//     this.program = 'date';
//     this.fromDate = selectedDate.toISOString().split('T')[0];
//     this.toDate = selectedDate.toISOString().split('T')[0];
//     this.dayLabel = selectedDate.toLocaleDateString('en-GB');
//     this.applyFilters();
//   }
// }

onFilterApplied(data: any) {
  console.log('Received Calendar Data:', data);

  this.isCalendarOpen = false;
  this.program = 'date';

  if (data.type === 'weekday') {
    const selectedDate = new Date(data.value);

    this.fromDate = selectedDate.toISOString().split('T')[0];
    this.toDate = selectedDate.toISOString().split('T')[0];

    this.dayLabel = selectedDate.toLocaleDateString('en-GB');
  }
  else if (data.type === 'single') {
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

  console.log('c5 (fromDate):', this.fromDate);
  console.log('c6 (toDate):', this.toDate);

  this.applyFilters();
}

clearFilters(): void {
  this.searchText = '';
  this.status = 'all';
  this.category = 'all';
  this.host = 'all';
  this.program = 'all';
  this.fromDate = '';
  this.toDate = '';
  this.dayLabel = 'Today';
  this.getProgramList();
}

  deleteProgram(id: any) {
    this.loading = true;
    const tv = [
      { T: 'dk1', V: id },
      { T: 'c10', V: '4' }
    ];
    this.srv.getdata('program', tv).subscribe({
      next: (r: any) => {
        this.loading = false;
        if (r && r.Status === 1) {
          this.toast.show({
            title: 'Program deleted successfully! ',
            description: 'Program has been successfully deleted',
            variant: 'success',
            position: 'toast-bottom-center'
          });
          this.getProgramList();
        } else {
          this.toast.show({
            title: 'Failed to delete Program ❌',
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
          description: 'Server error while deleting Program',
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