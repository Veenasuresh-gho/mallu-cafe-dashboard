
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AddTeamMember } from './components/add-team-member/add-team-member';
import { MatDialog } from '@angular/material/dialog';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { SelectDropDown } from '../../components/select-drop-down/select-drop-down';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CustomFilterCalender } from '../../components/custom-filter-calender/custom-filter-calender';


@Component({
  selector: 'app-team-member',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule,
    FormsModule, PrimaryButton, SelectDropDown, MatProgressSpinnerModule, CustomFilterCalender],
  templateUrl: './team-member.html',
  styleUrl: './team-member.css',
})
export class TeamMember implements OnInit {

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef, private router: Router) { }

  loading = false;
  ds: [] = [];
  programList: [] = [];
  programOptions: any[] = [];

  canUploadMedia = false;
  canManageAds = false;
  canManagePrograms = false;
  canManageMembers = false;

  openModal() {
    const dialogRef = this.dialog.open(AddTeamMember, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getTeamMemberList();
      }
    });
  }

  searchText = '';
  roles = 'all';
  programs = 'all';

  columns: string[] = [
    'team-members',
    'role',
    'assignedPrograms',
    'mobile',
    'email'
  ];

  ngOnInit(): void {
    this.getTeamMemberList()
    this.getProgramList()
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

  programsDropdown: string = 'all';
  tempProgramSelection: string = 'all';
  isCalendarOpen: boolean = false;

  onProgramChange(value: any) {
    if (value === 'date') {
      this.isCalendarOpen = true;
      this.tempProgramSelection = value;
    } else {
      this.programs = value; // IMPORTANT
      this.programsDropdown = value;
      this.tempProgramSelection = value;
      this.isCalendarOpen = false;
      this.applyFilters();
    }
  }

  onFilterApplied(data: any) {
    this.programsDropdown = this.tempProgramSelection;
    this.isCalendarOpen = false;
  }



  getTeamMemberList(): void {
    this.loading = true;
    this.tv = [{ T: 'c10', V: '3' }];
    this.srv.getdata('teammember', this.tv)
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

  applyFilters(): void {
    const tags: any[] = [
      { T: 'dk1', V: '0' },
      { T: 'dk2', V: this.searchText || '' },
      {
        T: 'c2',
        V:
          this.roles === 'admin'
            ? '1'
            : this.roles === 'rj'
              ? '2'
              : ''
      },
      {
        T: 'c3',
        V: this.programs !== 'all' ? this.programs : ''
      }, // Program
      { T: 'c10', V: '3' }
    ];

    this.loading = true;

    this.srv.getdata('teammember', tags).subscribe({
      next: (r) => {
        this.ds = r.Data[0];
        this.dataSource.data = this.ds;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.roles = 'all';
    this.programs = 'all';

    this.getTeamMemberList();
  }

  get showPaginator(): boolean {
    return this.dataSource.data.length > 7;
  }


  getProgramList(): void {
    this.tv = [{ T: 'c10', V: '3' }];
    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          this.programList = r.Data[0];
          this.programOptions = [
            { label: 'All Programs', value: 'all' },
            ...this.programList.map((program: any) => ({
              label: program.Title,
              value: program.id
            }))
          ];
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  goToMemberDetails(row: any) {
    this.router.navigate(['/team-members', row.id]);
  }
}
