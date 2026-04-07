import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ToastService } from '../../../../services/toastService';

@Component({
  selector: 'app-profile-info',
  standalone: true, // ✅ ADD THIS (VERY IMPORTANT)
  imports: [MatDivider, CommonModule, FormsModule, PrimaryButton],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.css',
})
export class ProfileInfo {

  @Input() profile: any = {};
  isEditing: boolean = false;
  loading = false;
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  toast = inject(ToastService);
  roles: any[] = [];

  constructor(private cdr: ChangeDetectorRef) { }

  enableEdit() {
    this.isEditing = true;
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile']) {
      console.log('📦 Profile data received:', this.profile);
    }
  }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {

    this.tv = [
      { T: 'dk1', V: "ROLES" },
      { T: 'c10', V: '3' }
    ];
    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {
          this.roles = r.Data[0] || [];
          console.log('roles', this.roles);
          if (this.profile?.Role && this.roles.length) {
            const match = this.roles.find(
              role => role.DisplyText === this.profile.Role
            );

            if (match) {
              this.profile = {
                ...this.profile,
                Role: match.DisplyText
              };
            }
          }
          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  editProfileDetails(): void {
    if (!this.profile?.FullName || !this.profile?.Email) {
      this.toast.show({
        title: 'Missing fields ⚠️',
        description: 'Name and Email are required',
        variant: 'warning',
        position: 'toast-bottom-center'
      });
      return;
    }
    const selectedRole = this.roles.find(
      r => r.DisplyText === this.profile.Role
    );
    const payload = {
      FullName: this.profile.FullName,
      Role: selectedRole ? selectedRole.DataValue : null,
      Phone: this.profile.Phone,
      Email: this.profile.Email,
      CountryID: this.profile.CountryID
    };
    this.loading = true;
    this.cdr.markForCheck();
    this.tv = [
      { T: 'dk1', V: this.profile.id },
      { T: 'c1', V: JSON.stringify(payload) },
      { T: 'c10', V: '2' }
    ];

    this.srv.getdata('teammember', this.tv).subscribe({
      next: (r) => {
        this.loading = false;
        this.cdr.markForCheck();

        if (r.Status == 1) {
          this.toast.show({
            title: 'Profile updated ✅',
            description: 'Changes saved successfully',
            variant: 'success',
            position: 'toast-bottom-center'
          });

          this.isEditing = false;
        } else {
          this.toast.show({
            title: 'Update failed ❌',
            description: r?.Info || 'Something went wrong',
            variant: 'error',
            position: 'toast-bottom-center'
          });
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.cdr.markForCheck();

        this.toast.show({
          title: 'Server error 🚨',
          description: 'Please try again later',
          variant: 'error',
          position: 'toast-bottom-center'
        });
      }
    });
  }

}
