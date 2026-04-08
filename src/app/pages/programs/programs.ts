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

@Component({
  selector: 'app-programs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, PrimaryButton, SelectDropDown, MatProgressSpinnerModule,CustomFilterCalender],
  templateUrl: './programs.html',
  styleUrl: './programs.css',
})
export class Programs implements OnInit {

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) { }
  loading = false;
  ds: [] = [];


    openModal() {
      const dialogRef = this.dialog.open(AddNewProgram, {
        width: '90%',
        maxWidth: '600px',
        maxHeight: '95vh',
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.getProgramList();
        }
      });
    }

    

  ngOnInit(): void {
    this.getProgramList();
  }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();


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
          console.log(this.ds)
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

  get showPaginator(): boolean {
    return this.dataSource.data.length > 7;
  }

  searchText = '';
  status = 'all';
  category = 'all';
  host = 'all';
  program = 'all';

  columns: string[] = [
    'program',
    'category',
    'host',
    'duration',
    'dayTime',
    'interaction'
  ];

  programsDropdown: string = 'all';
tempProgramSelection: string = 'all'; 
isCalendarOpen: boolean = false;

onProgramChange(value: string) {
  if (value === 'date') {
    this.isCalendarOpen = true;

    // store temporarily, DON'T apply yet
    this.tempProgramSelection = value;
  } else {
    this.programsDropdown = value;
    this.tempProgramSelection = value;
    this.isCalendarOpen = false;
  }
}

onFilterApplied(data: any) {
  console.log('Final Filter:', data);

  // ✅ Now confirm selection
  this.programsDropdown = this.tempProgramSelection;

  this.isCalendarOpen = false;
}
}