import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ghoresult, tags } from '../../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,MatMenuModule,MatDividerModule,MatBadgeModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {

  srv = inject(GHOService);
  cdr = inject(ChangeDetectorRef);

  tv: tags[] = [];
  loading = false;
  ds: [] = [];
  profile: any = {};
  assignedPrograms: any[] = [];
  performance: any = {};
  media: any = {};
  selectedFile!: File;
  fileName: string = '';
  errors: any = {};
  id: any = '';
  notifications: any[] = [];
  showAllNotifications = false;

  currentSong: any = null;
  nextSong: any = null;

  private songsInterval: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getProfile();
    this.getSongs();
    this.getNotifications()

    this.songsInterval = setInterval(() => {
      this.getSongs();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.songsInterval) {
      clearInterval(this.songsInterval);
    }
  }

  getProfile(): void {
    this.loading = true;

    const userId = this.srv.getsession('id');

    const tv = [
      { T: 'dk1', V: userId },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('teammember', tv)
      .subscribe({
        next: (r) => {
          const data = r.Data;
          this.profile = data[0]?.[0] || {};
          this.loading = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  getSongs(): void {

    const tv = [
      { T: 'dk2', V: '' },
      { T: 'c10', V: '12' }
    ];

    this.srv.getdata('teammember', tv)
      .subscribe({
        next: (res) => {

          const list = res?.Data?.[0] || [];

          if (!list.length) {
            this.currentSong = null;
            this.nextSong = null;
            this.cdr.detectChanges();
            return;
          }

          const currentIndex = list.findIndex(
            (item: any) => Number(item.IsStreaming) === 1
          );

          if (currentIndex >= 0) {

            const current = list[currentIndex];

            this.currentSong = {
              title: current.Title
            };

            const next = list
              .slice(currentIndex + 1)
              .find((item: any) => Number(item.IsStreaming) !== 1);

            this.nextSong = next
              ? {
                  title: next.Title
                }
              : null;

          } else {

            this.currentSong = null;

            this.nextSong = {
              title: list[0].Title
            };
          }

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Song API Error:', err);

          this.currentSong = null;
          this.nextSong = null;

          this.cdr.detectChanges();
        }
      });
  }

getNotifications(): void {
  const userId = this.srv.getsession('id');
  const tv = [
    { T: 'dk1', V: userId },
    { T: 'c10', V: '2' }
  ];
  this.srv.getdata('notification', tv).subscribe({
    next: (r) => {
      this.notifications = r.Data?.[0] || [];
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

get displayedNotifications() {
  return this.showAllNotifications
    ? this.notifications
    : this.notifications.slice(0, 3);
}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }


}