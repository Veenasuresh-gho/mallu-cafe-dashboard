import { Component, EventEmitter, inject, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { GHOService } from '../../../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../../../services/utilities';
import { ghoresult, tags } from '../../../../../../../model/ghomodel';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-pre-scheduled',
  standalone: true,
  imports: [FormSelect, StepBadge, MatRadioModule, FormsModule, JsonPipe],
  templateUrl: './pre-scheduled.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pre-scheduled.css',
})
export class PreScheduled implements OnChanges {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  cdr = inject(ChangeDetectorRef)

  selectedProgramId: any = null;
  selectedProgramName: string = '';
  programId: string = '';
  errors: any = {};
  programDetails: any = {};

  @Input() programList: any[] = [];
  @Input() fileType: string = '';
  @Input() disabled: boolean = false;
  @Output() programSelected = new EventEmitter<any>();
  @Output() validationChange = new EventEmitter<boolean>();


  typedText: string = '';
  selectedType: string = '';

  validateForm(): boolean {
    this.errors = {};

    if (!this.fileType?.trim()) {
      this.errors.category = 'File type is required';
    }

    if (!this.selectedProgramId) {
      this.errors.program = 'Please select a program';
    }

    if (!this.typedText || this.typedText.length !== 8) {
      this.errors.date = 'Enter valid date (DD/MM/YY)';
    }

    if (!this.selectedType) {
      this.errors.type = 'Please choose thumbnail type';
    }

    return Object.keys(this.errors).length === 0;
  }

  onThumbnailTypeChange(type: string) {
    this.selectedType = type;

    if (type === 'program' && this.programId) {
      this.getProgramDetails();
    }

    this.cdr.markForCheck();

    this.emitData();
  }
  
  onProgramChange(value: any) {
    this.selectedProgramId = value;

    const selected = this.programList.find(p => p.DataValue === value);

    this.selectedProgramName = selected?.DisplayText || '';
    this.programId = selected?.ProgramID || '';

    if (this.selectedType === 'program' && this.programId) {
      this.getProgramDetails();
    }

    this.cdr.markForCheck(); // ✅ for OnPush

    this.emitData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['programList']) {
    }
  }

  getProgramDetails(): void {
    this.tv = [
      { T: 'dk1', V: this.programId },
      { T: 'c10', V: '3' }
    ];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          if (r.Status === 1) {
            this.programDetails = r.Data[0][0];
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  onTextChange(event: any) {
    const el = event.target;

    let value = el.innerText.replace(/\D/g, '').slice(0, 6);

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '/' + value.slice(5);
    }

    el.innerText = value;

    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);

    this.typedText = value;

    this.emitData();
  }

  emitData() {
    const isValid = this.validateForm();

    const cleanDate = this.typedText.replace(/\//g, '');
    const cleanProgramName = this.selectedProgramName.replace(/\s+/g, '');

    let fileName = '';

    if (cleanProgramName && cleanDate && this.fileType) {
      fileName = `${cleanProgramName}${cleanDate}.${this.fileType}`;
    }

    this.programSelected.emit({
      programId: this.programId,
      programName: cleanProgramName,
      typedText: this.typedText,
      fileName,
      fullData: this.programList.find(p => p.ProgramID === this.programId),
      isValid
    });

    this.validationChange.emit(isValid);
  }
}