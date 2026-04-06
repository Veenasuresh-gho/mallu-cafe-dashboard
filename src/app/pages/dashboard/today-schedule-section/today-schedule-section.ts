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
  status?: 'live' | 'next' | 'past';

  urlValue?: string; // ✅ per-item input
}

@Component({
  selector: 'today-schedule-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomCalendar, UpdateFileUpload, CommonModule, Skelton, FormsModule, PrimaryButton],
  templateUrl: './today-schedule-section.html',
  styleUrl: './today-schedule-section.css',
})
export class TodayScheduleSection implements OnInit {

  constructor(private cdr: ChangeDetectorRef) { }

  urlValue: string = '';
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  @Output() publishStatus = new EventEmitter<{ isPublic: boolean, url: string, isPublish: boolean }>();

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  loading = false;
  schedules: Schedule[] = [];
  currentProgram: Schedule | null = null;
  selectedDate: Date = new Date();


  showDialog = false;

  ngOnInit(): void {
    this.getScheduleList();


    setInterval(() => {
      this.updateCurrentProgram();
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
    }

    this.loading = true;

    this.tv = [
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '7' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: async (r) => {
          if (r.Status === 1) {
            this.loading = false;
            const publishedUrl = this.urlValue;
            const isPublic = !!publishedUrl;

            this.tv = [
              { T: 'dk1', V: String(item.id) },
              { T: 'c10', V: '14' }
            ];
            this.srv.getdata('program', this.tv)
              .subscribe({
                next: async (r) => {
                  this.publishStatus.emit({
                    isPublic: isPublic,
                    url: publishedUrl,
                    isPublish: true
                  });
                }
              })
          }
        },
        error: () => {
          this.loading = false;
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
        this.schedules = [...(r.Data[0] as Schedule[])];
        this.updateCurrentProgram();
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

  private getMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  updateCurrentProgram() {
    const now = new Date();

    const isToday =
      this.selectedDate.toDateString() === now.toDateString();

    const currentMin = now.getHours() * 60 + now.getMinutes();

    this.currentProgram = null;

    let nextProgram: Schedule | null = null;
    let minDiff = Infinity;

    for (let item of this.schedules) {

      if (!item.TimeRange || !item.TimeRange.includes(' - ')) continue;

      const [start, end] = item.TimeRange.split(' - ');

      const startMin = this.getMinutes(start);
      let endMin = this.getMinutes(end);

      if (endMin === 0) endMin = 1440;

      if (isToday && currentMin >= startMin && currentMin < endMin) {
        this.currentProgram = item;
      }

      if (isToday && startMin > currentMin) {
        const diff = startMin - currentMin;

        if (diff < minDiff) {
          minDiff = diff;
          nextProgram = item;
        }
      }
    }

    this.schedules = this.schedules
      .map(item => {

        let status: 'live' | 'next' | 'past' | undefined = undefined;

        if (this.currentProgram && item.id === this.currentProgram.id) {
          status = 'live';
        } else if (nextProgram && item.id === nextProgram.id) {
          status = 'next';
        } else {
          const [start] = item.TimeRange.split(' - ');
          const startMin = this.getMinutes(start);

          if (
            (isToday && startMin < currentMin) ||
            (!isToday && this.selectedDate < new Date())
          ) {
            status = 'past';
          }
        }

        return { ...item, status };
      })
      .sort((a, b) => {
        const order: any = { live: 0, next: 1, past: 2, undefined: 1 };
        return order[a.status!] - order[b.status!];
      });
  }
}