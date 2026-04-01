import { Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { Router } from '@angular/router';
import { GHOService } from '../../../../services/ghosrvs';
import { MatDialog } from '@angular/material/dialog';
import { ChangePassword } from '../change-password/change-password';

@Component({
  selector: 'app-settings',
  imports: [MatDivider],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  
  srv = inject(GHOService);
  isLogoutOpen = false;
  constructor(private router: Router,private dialog: MatDialog) {}

  openChangePassword() {
 this.dialog.open(ChangePassword, {
  width: '600px',
  maxWidth: '95vw',   // ✅ prevents overflow
  panelClass: 'custom-dialog-container',
  disableClose: true
});
}


  openLogoutDialog() {
  this.isLogoutOpen = true;
  }

  closeLogoutDialog() {
  this.isLogoutOpen = false;
   }

confirmLogout() {
  this.srv.clearsession(); 
  this.router.navigate(['/sign-in'], { replaceUrl: true });

  this.closeLogoutDialog();
}

}
