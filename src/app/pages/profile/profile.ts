import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileInfo } from './components/profile-info/profile-info';
// import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  imports: [MatDividerModule,ProfileInfo],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

}
