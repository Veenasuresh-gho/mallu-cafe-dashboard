
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

@Component({
  selector: 'app-team-member',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, PrimaryButton, SelectDropDown, MatProgressSpinnerModule],
  templateUrl: './team-member.html',
  styleUrl: './team-member.css',
})
export class TeamMember implements OnInit {

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  loading = false;
  ds: [] = [];

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
  get showPaginator(): boolean {
    return this.dataSource.data.length > 7;
  }
}
