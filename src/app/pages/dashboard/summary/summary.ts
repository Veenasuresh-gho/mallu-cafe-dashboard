import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';

@Component({
  selector: 'app-summary',
  imports: [MatCardModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class Summary implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);

  count: any;
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  summary: any[] = [
    {
      show: "tick",
      color: "#4375FF",
      image: "/main/radio.png",
      title: "Programs",
      statistics: `0 <span>Scheduled | 0</span>`,
      info: `<span>0</span> Program Missing Audio File`
    },
    {
      show: "",
      color: "#F37127",
      image: "/main/folder-open.png",
      title: "Upload Readiness",
      statistics: `0 <span>of</span> 0 <span>Files Uploaded</span>`,
      info: `<span>0</span> Upload Pending`
    },
    {
      show: "",
      color: "var(--success)",
      image: "/main/headphone.png",
      title: "Ads Overview",
      statistics: `0 <span>Scheduled Today</span>`,
      info: `<span>0</span> Ad Files Not Uploaded`
    },
    {
      show: "",
      color: "#B52626",
      image: "/main/video-play.png",
      title: "Videos Uploaded",
      statistics: `0 <span>Videos Uploaded</span>`,
      info: ""
    }
  ];

  ngOnInit(): void {
    this.getCount();
  }

  getCount(): void {
    this.tv = [
      { T: 'c10', V: '26' }
    ];

    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {

        const data = r.Data?.[0]?.[0];

        if (!data) {
          return;
        }

        const scheduledPrograms = data.ScheduledPrograms ?? 0;
        const completedPrograms = data.CompletedPrograms ?? 0;
        const uploadedPrograms = data.UploadedPrograms ?? 0;
        const pendingUploads = data.PendingUploads ?? 0;
        const scheduledAds = data.ScheduledAds ?? 0;
        const missingAdFiles = data.MissingAdFiles ?? 0;
        const videosUploaded = data.VideosUploaded ?? 0;

        this.summary = [
          {
            show: "tick",
            color: "#4375FF",
            image: "/main/radio.png",
            title: "Programs",
            statistics: `${scheduledPrograms} <span>Scheduled | ${completedPrograms}</span>`,
            info: `<span>${scheduledPrograms - uploadedPrograms}</span> Program Missing Audio File`
          },
          {
            show: "",
            color: "#F37127",
            image: "/main/folder-open.png",
            title: "Upload Readiness",
            statistics: `${uploadedPrograms} <span>of</span> ${scheduledPrograms} <span>Files Uploaded</span>`,
            info: `<span>${pendingUploads}</span> Upload Pending`
          },
          {
            show: "",
            color: "var(--success)",
            image: "/main/headphone.png",
            title: "Ads Overview",
            statistics: `${scheduledAds} <span>Scheduled Today</span>`,
            info: `<span>${missingAdFiles}</span> Ad Files Not Uploaded`
          },
          {
            show: "",
            color: "#B52626",
            image: "/main/video-play.png",
            title: "Videos Uploaded",
            statistics: `${videosUploaded} <span>Videos Uploaded</span>`,
            info: ""
          }
        ];
      },
      error: (err) => {
        console.error('Failed to load summary', err);
      }
    });
  }
}