import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  currentSong = {
    title: 'Om Shanti Om',
    status: 'On Air'
  };

  nextSong = {
    title: 'Bollywood Rewind',
    status: 'Next'
  };
}
