import { Component } from '@angular/core';
import { TodayScheduleSection } from './today-schedule-section/today-schedule-section';
import { MusicPlayer } from './music-player/music-player';
import { Summary } from './summary/summary';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TodayScheduleSection, Summary, MusicPlayer], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'], // <-- plural
})
export class Dashboard {
  musicPublishInfo: { isPublic: boolean; url: string; isPublish: boolean } | null = null;

  onPublishStatus(event: { isPublic: boolean; url: string; isPublish: boolean }) {
    console.log('Publish info:', event);
    this.musicPublishInfo = event;
  }
}