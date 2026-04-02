import { Component, inject, OnInit } from '@angular/core';
import { CustomCalendar } from '../../../components/custom-calendar/custom-calendar';
import { UpdateFileUpload } from '../../../components/update-file-upload/update-file-upload';
import { CommonModule } from '@angular/common';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Skelton } from '../../../components/skelton/skelton';

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
}

@Component({
  selector: 'today-schedule-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CustomCalendar, UpdateFileUpload, CommonModule, Skelton],
  templateUrl: './today-schedule-section.html',
  styleUrl: './today-schedule-section.css',
})
export class TodayScheduleSection implements OnInit {

  constructor(private cdr: ChangeDetectorRef) { }


  srv = inject(GHOService);
  utl = inject(GHOUtitity);

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

    // 🔥 NOT TODAY → reset everything
    if (!isToday) {
      this.currentProgram = null;

      this.schedules = this.schedules.map(item => ({
        ...item,
        status: 'past' // or undefined if you don’t want status at all
      }));

      return;
    }

    const currentMin = now.getHours() * 60 + now.getMinutes();

    this.currentProgram = null;

    let nextProgram: Schedule | null = null;
    let minDiff = Infinity;

    // 🔥 PASS 1 → find live + next
    for (let item of this.schedules) {

      if (!item.TimeRange || !item.TimeRange.includes(' - ')) continue;

      const [start, end] = item.TimeRange.split(' - ');

      const startMin = this.getMinutes(start);
      let endMin = this.getMinutes(end);

      if (endMin === 0) endMin = 1440;

      // LIVE
      if (currentMin >= startMin && currentMin < endMin) {
        this.currentProgram = item;
      }

      // NEXT
      if (startMin > currentMin) {
        const diff = startMin - currentMin;

        if (diff < minDiff) {
          minDiff = diff;
          nextProgram = item;
        }
      }
    }

    this.schedules = this.schedules.map(item => {

      let status: 'live' | 'next' | 'past' = 'past';

      if (this.currentProgram && item.id === this.currentProgram.id) {
        status = 'live';
      } else if (nextProgram && item.id === nextProgram.id) {
        status = 'next';
      }

      return { ...item, status };
    });
  }
}