import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'music-player',
  imports: [MatSliderModule,MatSlideToggleModule],
  templateUrl: './music-player.html',
  styleUrl: './music-player.css',
})
export class MusicPlayer {}
