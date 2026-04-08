import { Component, inject } from '@angular/core';
import { ghoresult, tags } from '../../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { CommonModule } from '@angular/common';

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

        console.log('API RESPONSE:', res);

        const list = res?.Data?.[0] || [];

        if (!list.length) {
          this.currentSong = null;
          this.nextSong = { title: '' };
          return;
        }

        //  Find current song index
        const currentIndex = list.findIndex(
          (item: any) => item.IsStreaming === 1
        );
        //  Current song
        const current =
          currentIndex !== -1 ? list[currentIndex] : null;

        //  Next song logic (with loop handling)
        let next;

        if (currentIndex !== -1) {
          // if current exists → next is next item or loop to first
          next =
            list[currentIndex + 1] || list[0];
        } else {
          // if no current → just show first as next
          next = list[0];
        }

        //  Assign values
        this.currentSong = current
          ? { title: current.Title }
          : null;

        this.nextSong = {
          title: next?.Title || 'No song available'
        };

        console.log('FINAL STATE:', {
          current: this.currentSong,
          next: this.nextSong
        });
      },

      error: (err) => {
        console.error('Song API Error:', err);

        this.currentSong = null;
        this.nextSong = { title: 'No song available' };
      }
    });
}

}