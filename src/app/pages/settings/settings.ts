import { ChangeDetectorRef, Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { MatDialog } from '@angular/material/dialog';
import { UpdatePrivacyPolicy } from './update-privacy-policy/update-privacy-policy';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';

@Component({
  selector: 'app-settings',
  imports: [PrimaryButton, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  encapsulation: ViewEncapsulation.None
})
export class Settings implements OnInit {
  constructor(
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  policyContent = '';
  isLoading = true;

  ngOnInit(): void {
    this.getPrivacyPolicy();
  }

  getPrivacyPolicy(): void {
    this.tv = [{ T: 'c10', V: '14' }];
    this.srv.getdata('teammember', this.tv)
      .subscribe({
        next: (r) => {
          this.policyContent = r?.Data?.[0]?.[0]?.Content ?? '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('API Error:', err);
          this.isLoading = false;
        }
      });
  }

  openUpdatePolicy(): void {
    const ref = this.dialog.open(UpdatePrivacyPolicy, {
      width: '900px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'policy-dialog',
      data: { content: this.policyContent }
    });

    ref.afterClosed().subscribe((updatedContent: string) => {
      if (updatedContent) {
        this.policyContent = updatedContent;
        this.getPrivacyPolicy();
      }
    });
  }
}