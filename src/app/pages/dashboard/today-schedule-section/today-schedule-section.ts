import { Component } from '@angular/core';

@Component({
  selector: 'today-schedule-section',
  imports: [],
  templateUrl: './today-schedule-section.html',
  styleUrl: './today-schedule-section.css',
})
export class TodayScheduleSection {
  schedules = [
    {
      status: "next",
      song: "Bollywood Rewind",
      image: "/main/rj2.png",
      time: "10:00 am - 12:00  pm",
      name: "RJ Anjali",
    },
    {
      status: "",
      song: "Hungama Radio",
      image: "/main/user-image.png",
      time: "12:00 pm - 02:00 pm",
      name: "RJ Shijo",
    },
    {
      status: "",
      song: "Indo American News",
      image: "/main/rj3.png",
      time: "03:00 pm - 05:00 pm",
      name: "RJ Reeva",
    },
    {
      status: "",
      song: "Talk with Stars",
      image: "/main/rj4.png",
      time: "05:00 pm - 08:00 pm",
      name: "RJ Neena",
    },
    {
      status: "",
      song: "Talk with Stars",
      image: "/main/rj4.png",
      time: "05:00 pm - 08:00 pm",
      name: "RJ Neena",
    }


  ]
}
