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

  // currentSong = {
  //   title: 'Om Shanti Om',
  //   status: 'On Air'
  // };

  // nextSong = {
  //   title: 'Bollywood Rewind',
  //   status: 'Next'
  // };

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

          console.log('Songs API:', res);

          const songData = res.Data?.[0]?.[2];
         
         this.nextSong = {
            title: songData.Title
          };

          this.currentSong =
            songData.IsStreaming === 1
              ? { title: songData.Title }
              : null;

          console.log('FINAL:', {
            next: this.nextSong,
            current: this.currentSong
          });
        },

        error: (err) => {
          console.error('Song API Error:', err);
        }
      });
  }

}