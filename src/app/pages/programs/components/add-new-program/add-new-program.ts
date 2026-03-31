import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup, MatRadioModule } from '@angular/material/radio';
import { DialogHeaderComponent } from '../../../../components/dialog-form/dialog-header/dialog-header-component';
import { FormInput } from '../../../../components/dialog-form/form-input/form-input';
import { FormSelect } from '../../../../components/dialog-form/form-select/form-select';
import { SchedulePicker } from '../../../../components/dialog-form/schedule-picker/schedule-picker';
import { FooterButton } from '../../../../components/dialog-form/footer-button/footer-button';
import { CancelButton } from '../../../../components/dialog-form/cancel-button/cancel-button';
import { GHOService } from '../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../services/utilities';
import { ghoresult, tags } from '../../../../../model/ghomodel';

@Component({
  selector: 'app-add-new-program',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatRadioModule,
    MatDialogModule, MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, FormInput,
    MatButtonModule, DialogHeaderComponent, FormSelect, SchedulePicker,
    FooterButton, CancelButton
  ],
  templateUrl: './add-new-program.html',
  styleUrl: './add-new-program.css',
})
export class AddNewProgram {
  constructor(private dialogRef: MatDialogRef<AddNewProgram>) { }

  loading = false;
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  addProgram(): void {
    this.loading = true;

    this.tv = [{ T: 'c10', V: '3' }];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {

        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }



  close() {
    this.dialogRef.close();
  }
  selectedHost: string = '';
  selectedCategory: string = '';

  selectedType: string = '';



}