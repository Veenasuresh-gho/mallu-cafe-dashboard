import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CustomCalendar } from '../../../components/custom-calendar/custom-calendar';
import { UpdateFileUpload } from '../../../components/update-file-upload/update-file-upload';
import { CommonModule } from '@angular/common';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Skelton } from '../../../components/skelton/skelton';
import { FormsModule } from '@angular/forms';
import { PrimaryButton } from '../../../components/primary-button/primary-button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ViewFile } from '../../media-library/components/view-file/view-file';
import { MatDialog } from '@angular/material/dialog';

export interface Schedule {
  id: string;
  ProgramID: number;
  Title: string;
  CategoryName: string;
  HostName: string;
  Duration: string;
  TimeRange: string;
  ThumbnailURL: string;
  fid: number;
  DayRange: string;
  IsCallAllowed: boolean;
  IsFileUploaded: boolean;
  IsStreaming: number;
  status?: 'live' | 'next' | 'past';

  urlValue?: string;
}

@Component({
  selector: 'today-schedule-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomCalendar, UpdateFileUpload, CommonModule, Skelton, FormsModule, PrimaryButton, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './today-schedule-section.html',
  styleUrl: './today-schedule-section.css',
})
export class TodayScheduleSection implements OnInit {

  constructor(private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  urlValue: string = '';
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  @Output() publishStatus = new EventEmitter<{ isPublic: boolean, url: string, isPublish: boolean }>();

  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  publishLoading = false;
  loading = false;
  schedules: Schedule[] = [];
  currentProgram: Schedule | null = null;
  streamingProgram: Schedule | null = null;
  selectedDate: Date = new Date();


  ViewFileModal(id: any) {
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
        // this.getMediaLibrary();
      }
    });
  }

  publishProgram(program: any) {

    this.publishLoading = true;

    this.tv = [
      { T: 'dk1', V: program.id },
      { T: 'c10', V: '14' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {

          this.getScheduleList();
          window.location.reload();

          this.publishStatus.emit({
            isPublic: true,
            url: program.urlValue || '',
            isPublish: true
          });

          this.publishLoading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('API Error:', err);
          this.publishLoading = false;
        }
      });
  }


  showDialog = false;

  ngOnInit(): void {
    this.getScheduleList();


    setInterval(() => {
      this.cdr.markForCheck();
    }, 60000);

  }

  addPublish(item: Schedule): void {

    const [start, end] = item.TimeRange.split(' - ');

    const payload = {
      ProgramID: item.ProgramID,
      StreamURL: item.urlValue || '',
      HostName: item.HostName,
      StartTime: start,
      EndTime: end,
      IsLive: '1'
    };

    this.publishLoading = true;

    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '7' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {

          if (r.Status === 1) {

            this.publishProgram(item);
            window.location.reload();

          }
        },
        error: (err) => {
          console.error(err);
          this.publishLoading = false;
        }
      });
  }

  onDateChange(date: Date) {
    this.selectedDate = date;

    this.getScheduleList();

    this.cdr.detectChanges();
  }

  openDialog() {
    this.showDialog = true;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getScheduleList(): void {
    this.loading = true;

    const formattedDate = this.formatDate(this.selectedDate);

    this.tv = [
      { T: 'dk2', V: formattedDate },
      { T: 'c10', V: '5' }
    ];

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const today = new Date();

        const isToday =
          this.selectedDate.toDateString() === today.toDateString();

        const isPastDate =
          this.selectedDate < new Date(today.setHours(0, 0, 0, 0));

        this.schedules = [...(r.Data[0] as Schedule[])].map(item => {
          if (isPastDate) {
            return { ...item, status: 'past' };
          }

          if (isToday) {
            const end = item.TimeRange.split(' - ')[1];
            const [h, m] = end.split(':').map(Number);
            const endMinutes = h * 60 + m;

            return {
              ...item,
              status: currentMinutes > endMinutes ? 'past' : undefined
            };
          }

          return { ...item };
        });
        this.streamingProgram = this.schedules.find(
          p => p.IsStreaming === 1) || null;
        this.currentProgram = this.streamingProgram;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

}