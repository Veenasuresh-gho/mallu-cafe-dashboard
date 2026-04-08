import { Component, inject } from '@angular/core';
import { ghoresult, tags } from '../../../model/ghomodel';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';

@Component({
  selector: 'app-navbar',
  imports: [],
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

  currentSong = {
    title: 'Om Shanti Om',
    status: 'On Air'
  };

  nextSong = {
    title: 'Bollywood Rewind',
    status: 'Next'
  };
  ngOnInit(): void {
    this.getProfile();
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
          console.log('profile-navbar', this.profile);

          
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }
}
