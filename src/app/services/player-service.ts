import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  videoUrl: string | null = null; 
  platform: string = '';
  isPlaying: boolean = false;

  setPlayer(data: {
    videoUrl: string,
    platform: string
  }) {
    this.videoUrl = data.videoUrl;
    this.platform = data.platform;
    this.isPlaying = true;
  }

  getPlayer() {
    return {
      videoUrl: this.videoUrl,
      platform: this.platform,
      isPlaying: this.isPlaying
    };
  }

  clear() {
    this.videoUrl = null;
    this.platform = '';
    this.isPlaying = false;
  }
}