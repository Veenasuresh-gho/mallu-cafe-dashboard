import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-summary',
  imports: [MatCardModule],
  templateUrl: './summary.html',
  styleUrl: './summary.css',
})
export class Summary {
  summary = [
    {
      show: "tick",
      color: "#4375FF",
      image: "/main/radio.png",
      title: "Programs",
      statistics: "14 <span>Scheduled | 9</span>",
      info: "<span>1</span> Program Missing Audio File"
    },
    {
      show: "",
      color: "#F37127",
      image: "/main/folder-open.png",
      title: "Upload Readiness",
      statistics: "<p>13 <span>of</span> 14 <span>Files Uploaded</span>",
      info: "<span>1</span> Upload Pending"
    },
    {
      show: "",
      color: "#00AA45",
      image: "/main/headphone.png",
      title: "Ads Overview",
      statistics: "22 <span>Scheduled Today<span/>",
      info: "<span>2</span> Ad Files Not Uploaded"
    },
    {
      show: "",
      color: "#B52626",
      image: "/main/video-play.png",
      title: "Videos Uploaded",
      statistics: "10 <span>Videos Uploaded</span>",
      info: ""
    },

  ]
}
