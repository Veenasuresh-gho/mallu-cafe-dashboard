import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy implements OnInit {

  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  policyContent = '';
  isLoading = true;

  ngOnInit(): void {
    this.getPrivacyPolicy()
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
}
