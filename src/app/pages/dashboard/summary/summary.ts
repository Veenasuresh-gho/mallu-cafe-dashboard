import { Component } from '@angular/core';

@Component({
  selector: 'app-summary',
  imports: [],
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
      statistics: "14",
      content: "Scheduled | 9",
      info: "1 Program Missing Audio File"
    },
    {
      show: "",
      color: "#F37127",
      image: "/main/folder-open.png",
      title: "Upload Readiness",
      statistics: "<p>13 <span>of</span> 14 <span>Files Uploaded</span>",
      content: "",
      info: "1 Upload Pending"
    },
    {
      show: "",
      color: "#00AA45",
      image: "/main/headphone.png",
      title: "Ads Overview",
      statistics: "22",
      content: "Scheduled Today",
      info: "2 Ad Files Not Uploaded"
    },
    {
      show: "",
      color: "#B52626",
      image: "/main/video-play.png",
      title: "Videos Uploaded",
      statistics: "10",
      content: "Videos Uploaded",
      info: ""
    },

  ]
}
