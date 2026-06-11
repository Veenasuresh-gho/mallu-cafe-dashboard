import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class Summary implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  cdr = inject(ChangeDetectorRef);

  count: any;
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  loading = true;

  // IMPORTANT: Start empty
  summary: any[] = [];

  ngOnInit(): void {
    this.getCount();
  }

  getCount(): void {

    this.loading = true;

    this.tv = [
      { T: 'c10', V: '26' }
    ];

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {

        const data = r?.Data?.[0]?.[0];

        if (!data) {
          this.summary = [];
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const scheduledPrograms = Number(data.ScheduledPrograms ?? 0);
        const completedPrograms = Number(data.CompletedPrograms ?? 0);
        const uploadedPrograms = Number(data.UploadedPrograms ?? 0);
        const pendingUploads = Number(data.PendingUploads ?? 0);
        const scheduledAds = Number(data.ScheduledAds ?? 0);
        const missingAdFiles = Number(data.MissingAdFiles ?? 0);
        const videosUploaded = Number(data.VideosUploaded ?? 0);

        this.summary = [
          // {
          //   show: 'tick',
          //   color: '#4375FF',
          //   image: '/main/radio.png',
          //   title: 'Programs',
          //   statistics: `${scheduledPrograms} <span>Scheduled | ${completedPrograms}</span>`,
          //   info: `<span>${Math.max(
          //     scheduledPrograms - uploadedPrograms,
          //     0
          //   )}</span> Program Missing Audio File`
          // },
          {
            show: 'tick',
            color: '#4375FF',
            image: '/main/radio.png',
            title: 'Programs',
            statistics: `
    ${scheduledPrograms}
    <span>
      Scheduled | ${completedPrograms}
      ${completedPrograms > 0
                ? '<img src="/main/tick-circle.svg" class="completed-icon" alt="completed">'
                : ''}
    </span>
  `,
            info: `<span>${Math.max(
              scheduledPrograms - uploadedPrograms,
              0
            )}</span> Program Missing Audio File`
          },
          {
            show: '',
            color: '#F37127',
            image: '/main/folder-open.png',
            title: 'Upload Readiness',
            statistics: `${uploadedPrograms} <span>of</span> ${scheduledPrograms} <span>Files Uploaded</span>`,
            info: `<span>${pendingUploads}</span> Upload Pending`
          },
          {
            show: '',
            color: 'var(--success)',
            image: '/main/headphone.png',
            title: 'Ads Overview',
            statistics: `${scheduledAds} <span>Scheduled Today</span>`,
            info: `<span>${missingAdFiles}</span> Ad Files Not Uploaded`
          },
          {
            show: '',
            color: '#B52626',
            image: '/main/video-play.png',
            title: 'Videos Uploaded',
            statistics: `${videosUploaded} <span>Videos Uploaded</span>`,
            info: ''
          }
        ];

        this.loading = false;

        // Force immediate render
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Failed to load summary', err);

        this.summary = [];
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }
}