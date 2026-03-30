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
@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, PrimaryButton, SelectDropDown],
  templateUrl: './programs.html',
  styleUrl: './programs.css',
})
export class Programs implements OnInit,AfterViewInit {

  constructor(private dialog: MatDialog) { }

  openModal() {
    this.dialog.open(AddNewProgram, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true
    });
  }

  ngOnInit(): void {
    this.getProgramList();
  }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

getProgramList(): void {
  this.tv = [{ T: 'c10', V: '3' }];

  this.srv.getdata('program', this.tv)
    .subscribe({
      next: (r) => {
        const rawData = r.Data?.[0] || [];

        this.dataSource.data = rawData.map((item: any) => ({
          name: item.Title,
          avatar: '/main/no-image.png',
          category: item.CategoryName,
          categoryClass:
            item.CategoryName === 'Podcast'
              ? 'podcast'
              : item.CategoryName === 'Live'
              ? 'live'
              : 'pre',
          host: item.HostName,
          duration: item.Duration,
          dayTime: `${item.DayRange}, ${item.TimeRange}`,
          interaction: item.IsCallAllowed
            ? 'Allow Calls'
            : 'Disabled Calls',
          interactionClass: item.IsCallAllowed
            ? 'allow'
            : 'disabled'
        }));

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      },
      error: (err) => {
        console.error('API Error:', err);
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

}