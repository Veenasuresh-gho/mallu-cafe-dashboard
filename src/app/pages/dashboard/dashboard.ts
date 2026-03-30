import { Component } from '@angular/core';
import { TodayScheduleSection } from './today-schedule-section/today-schedule-section';
import { MusicPlayer } from './music-player/music-player';
import { Summary } from './summary/summary';
import { CustomCalendar } from '../../components/custom-calendar/custom-calendar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TodayScheduleSection, Summary, MusicPlayer],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard { }
