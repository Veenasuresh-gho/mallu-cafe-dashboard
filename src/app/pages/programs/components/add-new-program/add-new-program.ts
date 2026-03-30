import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-new-program',
  standalone: true,
  imports: [
    CommonModule,FormsModule,
    MatRadioModule,
    MatDialogModule,MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,FormInput,
    MatButtonModule,DialogHeaderComponent,FormSelect,SchedulePicker,
    FooterButton,CancelButton
  ],
  templateUrl: './add-new-program.html',
  styleUrl: './add-new-program.css',
})
export class AddNewProgram {
  constructor(private dialogRef: MatDialogRef<AddNewProgram>) {}



  close() {
    this.dialogRef.close();
  }
  selectedHost: string = ''; 
  selectedCategory: string = ''; 
  
 selectedType:string = '';


  
}