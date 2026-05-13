
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ToastService } from '../../../../services/toastService';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-delete-member',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule, CommonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatSelectTrigger, MatChipsModule, MatSlideToggle,
    CancelButton, PrimaryButton],
  templateUrl: './delete-member.html',
  styleUrl: './delete-member.css',
})
export class DeleteMember {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  toast = inject(ToastService);
  id: string = '';
  programId: string = '';
  memberId: string = '';

  constructor(private dialogRef: MatDialogRef<DeleteMember>, private cdr: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public dialogData: any, private router: Router) { }

  onClose() {
    this.dialogRef.close();
  }

  deleteMember(): void {

    this.loading = true;
    this.cdr.markForCheck();

    this.tv = [
      { T: 'dk1', V: this.memberId },
      { T: 'c10', V: '10' }
    ];

    this.srv.getdata('teammember', this.tv).subscribe({

      next: (r) => {
        this.loading = false;
        this.cdr.markForCheck();
        if (r.Status == 1) {
          this.toast.show({
            title: 'Team member deleted ✅',
            description: 'The team member was removed successfully',
            variant: 'success',
            position: 'toast-bottom-center'
          });
          this.dialogRef.close(true);
          this.router.navigate(['/team-members']);

        } else {
          this.toast.show({
            title: 'Delete failed ❌',
            description: r?.Info || 'Unable to delete team member',
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

  ngOnInit(): void {
    this.memberId = this.dialogData.memberId;
  }
}

