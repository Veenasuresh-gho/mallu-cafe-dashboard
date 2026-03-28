
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { UploadNewFileModal } from '../media-library/components/upload-new-file-modal/upload-new-file-modal';
import { UploadAdFile } from './components/upload-ad-file/upload-ad-file';

@Component({
  selector: 'app-advertisements',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, MatButtonModule, MatMenuModule],
  templateUrl: './advertisements.html',
  styleUrl: './advertisements.css',
})
export class Advertisements {

  constructor(private dialog: MatDialog) { }

openModal() {
  this.dialog.open(UploadAdFile, {
    width: '600px',
    disableClose: true,
    panelClass: 'custom-dialog-container'
  });
}

  searchText = '';
  status = '';
  category = '';
  day = '';

  columns: string[] = [
    'advertisements',
    'advertiser',
    'adType',
    'adPlayCount',
    'adStatus',
    'actions'
  ];

  getAdTypeIcon(type: string): string {
    switch (type) {
      case 'audio':
        return '/main/audio.svg';
      case 'video':
        return '/main/video.svg';
      case 'image':
        return '/main/image.svg';
      default:
        return '/main/image.svg';
    }
  }

  dataSource = [
    {
      name: 'kerala_spice_restaurant_ad.mp3',
      avatar: '/main/rj1.png',
      advertiser: "Kerala Spice Restaurant",
      adType: "Audio",
      adTypeClass: "audio",
      adPlayCount: "8 plays / 2 days",
      adStatus: 'Active',
      adStatusClass: 'active'
    },
    {
      name: 'abc_supermarket_weekend_sale.mp4',
      avatar: '/main/rj2.png',
      advertiser: "ABC Supermarket",
      adType: "Image",
      adTypeClass: "image",
      adPlayCount: "10 plays / 3 days",
      adStatus: 'Active',
      adStatusClass: 'active'
    },
    {
      name: 'taste_of_kerala_summer_offer.mp3',
      avatar: '/main/user-image.png',
      advertiser: "Taste of Kerala",
      adType: "Audio",
      adTypeClass: "audio",
      adPlayCount: "6 plays / 2 days",
      adStatus: 'Active',
      adStatusClass: 'active'
    },
    {
      name: 'wellness_spa_relax_package.jpg',
      avatar: '/main/rj3.png',
      advertiser: "Wellness Spa Center",
      adType: "Video",
      adTypeClass: "video",
      adPlayCount: "5 plays / 2 days",
      adStatus: 'Waiting List',
      adStatusClass: 'waiting'
    },
    {
      name: 'emerald_hotels_promo_video.mp4',
      avatar: '/main/rj4.png',
      advertiser: "Emerald Hotels",
      adType: "Video",
      adTypeClass: "video",
      adPlayCount: "7 plays / 3 days",
      adStatus: 'Waiting List',
      adStatusClass: 'waiting'
    },
    {
      name: 'dhaba_king_special_combo.mp3',
      avatar: '/main/rj1.png',
      advertiser: "Dhaba King Restaurant",
      adType: "Audio",
      adTypeClass: "audio",
      adPlayCount: "6 plays / 2 days",
      adStatus: 'Published',
      adStatusClass: 'published'
    },
    {
      name: 'metro_dental_clinic_offer.mp3',
      avatar: '/main/no-image.png',
      advertiser: "Metro Dental Clinic",
      adType: "Audio",
      adTypeClass: "audio",
      adPlayCount: "4 plays / 1 day",
      adStatus: 'Expired',
      adStatusClass: 'expired'
    },
    {
      name: 'gulf_travel_agency_ad.mp3',
      avatar: '/main/no-image.png',
      advertiser: "Gulf Travel Agency",
      adType: "Audio",
      adTypeClass: "audio",
      adPlayCount: "4 plays / 1 day",
      adStatus: 'Expired',
      adStatusClass: 'expired'
    }
  ];
}