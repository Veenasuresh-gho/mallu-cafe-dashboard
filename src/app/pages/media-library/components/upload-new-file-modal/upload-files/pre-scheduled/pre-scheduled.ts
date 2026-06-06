import { Component, EventEmitter, inject, Input, OnChanges, SimpleChanges, Output, OnInit } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { GHOService } from '../../../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../../../services/utilities';
import { ghoresult, tags } from '../../../../../../../model/ghomodel';
import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-pre-scheduled',
  standalone: true,
  imports: [CommonModule, FormSelect, StepBadge, MatRadioModule, FormsModule, JsonPipe],
  templateUrl: './pre-scheduled.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './pre-scheduled.css',
})
export class PreScheduled implements OnInit, OnChanges {

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
  @Input() editData: any = null;
  @Input() programData: any;
  @Input() selectedDate: string = '';

  typedText: string = '';
  selectedType: string = '';
  thumbnailFile: File | null = null;
  fileSelectedName: string = '';
  thumbnailPreview: string = '';
  @Input() prefillData: any;
  @Input() prefillDate: string = '';
  @Input() readOnly: boolean = false;

  // ✅ track if prefill has been applied to avoid re-applying on every change
  private prefillApplied = false;

  async ngOnInit(): Promise<void> {
    if (this.prefillDate) {
      this.typedText = this.prefillDate;
    }

    if (this.editData) {
      this.patchEditData();
      return;
    }

    // ✅ Apply prefill in ngOnInit if programList is already available
    if (this.prefillData && this.programList?.length) {
      this.applyPrefill();
    }
  }

ngOnChanges(changes: SimpleChanges) {

  if (changes['prefillDate']?.currentValue) {
    this.typedText = changes['prefillDate'].currentValue;
  }

  if (
    !this.prefillApplied &&
    this.prefillData &&
    this.programList?.length
  ) {
    this.applyPrefill();
  }

  if (changes['fileType']?.currentValue) {
    this.emitData();
  }

  this.cdr.detectChanges();
}

  // ✅ Single method that reliably patches all prefill fields
  private applyPrefill(): void {
    this.prefillApplied = true;

    const data = this.prefillData;

    // Match program from list
    const selected = this.programList.find(
      p => p.DataValue == data.ProgramID
    );

    if (selected) {
      this.selectedProgramId = selected.DataValue;
      this.selectedProgramName = selected.DisplayText;
      this.programId = selected.ProgramID;
    }

    // Date
    if (this.prefillDate) {
      this.typedText = this.prefillDate;
    }

    // Thumbnail type
    this.selectedType = data.ThumbnailURL || data.TeamUrl
      ? 'program'
      : 'custom';

    // Thumbnail preview
    this.thumbnailPreview = data.ThumbnailURL || data.TeamUrl || '';

    // Load program thumbnail if using program type
    if (this.selectedType === 'program' && this.programId) {
      this.getProgramDetails();
    }

    this.cdr.detectChanges();
    this.emitData();
  }

  patchEditData(): void {
    this.selectedProgramId = this.editData?.ProgramID || '';
    this.selectedProgramName = this.editData?.Name || '';
    this.typedText = this.extractDate(this.editData?.FileName || '');
    this.thumbnailPreview = this.editData?.ThumbnailUrl || '';
    this.selectedType = this.editData?.ThumbnailUrl ? 'custom' : 'program';

    const selected = this.programList.find(
      p => p.DataValue == this.selectedProgramId
    );
    this.programId = selected?.ProgramID || '';

    if (this.selectedType === 'program' && this.programId) {
      this.getProgramDetails();
    }

    this.cdr.detectChanges();
    this.emitData();
  }

  extractDate(fileName: string): string {
    const match = fileName.match(/(\d{6})(?=\.[^.]+$)/);
    if (!match) return '';
    const rawDate = match[1];
    return `${rawDate.slice(0, 2)}/${rawDate.slice(2, 4)}/${rawDate.slice(4, 6)}`;
  }

  onDateChange(value: string) {
    if (this.readOnly) return;

    let cleaned = value.replace(/\D/g, '').slice(0, 6);

    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
    }

    this.typedText = cleaned;
    this.emitData();
  }

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
    if (type === 'custom') {
      this.programDetails = {};
    }

    this.cdr.detectChanges();
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

    this.cdr.markForCheck();
    this.emitData();
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

    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '/' + value.slice(5);

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

  onThumbnailChange(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    this.thumbnailFile = file;
    this.fileSelectedName = file.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailPreview = reader.result as string;
      this.emitData();
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  emitData() {
    const isValid = this.validateForm();

    const cleanDate = this.typedText.replace(/\//g, '');

    const cleanProgramName = this.selectedProgramName
      .trim()
      .replace(/\s+/g, '');

    let fileName = '';

    if (cleanProgramName && cleanDate && this.fileType) {
      fileName = `${cleanProgramName}${cleanDate}.${this.fileType}`;
    }

    this.programSelected.emit({
      programId: this.programId,
      programName: cleanProgramName,
      typedText: this.typedText,
      fileName,
      thumbnailType: this.selectedType,
      thumbnailFile: this.thumbnailFile,
      fullData: this.programList.find(
        p => p.DataValue == this.selectedProgramId
      ),
      isValid
    });
  }
}