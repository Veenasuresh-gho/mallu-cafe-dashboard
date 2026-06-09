import { Component } from '@angular/core';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePrivacyPolicy } from './update-privacy-policy/update-privacy-policy';

@Component({
  selector: 'app-settings',
  imports: [PrimaryButton],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  constructor(private dialog: MatDialog) { }


  openUpdatePolicy(): void {
    this.dialog.open(UpdatePrivacyPolicy, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true
    });
  }
}
