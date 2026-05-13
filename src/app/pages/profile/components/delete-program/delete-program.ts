import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';
import { ToastService } from '../../../../services/toastService';
import { PrimaryButton } from '../../../../components/primary-button/primary-button';

@Component({
  selector: 'app-delete-program',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, FormsModule, CommonModule,
    MatFormField, MatLabel, MatSelect, MatOption, MatSelectTrigger, MatChipsModule, MatSlideToggle,
    CancelButton, PrimaryButton, FooterButton],
  templateUrl: './delete-program.html',
  styleUrl: './delete-program.css',
})
export class DeleteProgram {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  toast = inject(ToastService);
  id: string = '';
  programId: string = '';
  memberId: string = '';
  constructor(private dialogRef: MatDialogRef<DeleteProgram>, private cdr: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

  onClose() {
    this.dialogRef.close();
  }
  deleteAssignedProgram(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.tv = [
      { T: 'dk1', V: this.programId },
      { T: 'dk2', V: this.memberId },
      { T: 'c10', V: '17' }
    ];
    this.srv.getdata('program', this.tv).subscribe({
      next: (r) => {
        this.loading = false;
        this.cdr.markForCheck();
        if (r.Status == 1) {
          this.toast.show({
            title: 'Program removed ✅',
            description: 'Assigned program deleted successfully',
            variant: 'success',
            position: 'toast-bottom-right'
          });
          this.dialogRef.close(true);
        } else {
          this.toast.show({
            title: 'Delete failed ❌',
            description: r?.Info || 'Unable to remove assigned program',
            variant: 'error',
            position: 'toast-bottom-right'
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
          position: 'toast-bottom-right'
        });
      }
    });

  }

  ngOnInit(): void {
    this.memberId = this.dialogData.memberId;
    this.programId = this.dialogData.programId;
  }
}
