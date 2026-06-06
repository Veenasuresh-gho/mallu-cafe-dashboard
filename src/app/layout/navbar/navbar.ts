import { Component, inject } from '@angular/core';
import { ghoresult, tags } from '../../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  srv = inject(GHOService);
  // utl = inject(GHOUtitity);
  tv: tags[] = [];
  // res: ghoresult = new ghoresult();
  loading = false;
  ds: [] = [];
  profile: any = {};
  assignedPrograms: any[] = [];
  performance: any = {};
  media: any = {};
  selectedFile!: File;
  fileName: string = '';
  errors: any = {};
  id: any = ''

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getProfile();
    this.getSongs();
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
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  currentSong: any = null;
  nextSong: any = null;

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
          return;
        }

        const currentIndex = list.findIndex(
          (item: any) => item.IsStreaming === 1
        );

        if (currentIndex !== -1) {
          const current = list[currentIndex];
          const next = list[currentIndex + 1];

          this.currentSong = {
            title: current.Title
          };

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
      },

      error: (err) => {
        console.error('Song API Error:', err);

        this.currentSong = null;
        this.nextSong = null;
      }
    });
}

    navigateToProfile() {
    this.router.navigate(['/profile']);
  }

}