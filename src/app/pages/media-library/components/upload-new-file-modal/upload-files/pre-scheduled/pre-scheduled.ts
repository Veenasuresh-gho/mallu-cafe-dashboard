import { Component, EventEmitter, inject, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { GHOService } from '../../../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../../../services/utilities';
import { ghoresult, tags } from '../../../../../../../model/ghomodel';

@Component({
  selector: 'app-pre-scheduled',
  standalone: true,
  imports: [FormSelect, StepBadge, MatRadioModule, FormsModule],
  templateUrl: './pre-scheduled.html',
  styleUrl: './pre-scheduled.css',
})
export class PreScheduled implements OnChanges {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  selectedProgramId: any = null;
  selectedProgramName: string = '';
  programId: string = '';

  @Input() programList: any[] = [];
  @Input() fileType: string = '';
  @Input() disabled: boolean = false;
  @Output() programSelected = new EventEmitter<any>();

  typedText: string = '';
  selectedType: string = '';

  onThumbnailTypeChange(type: string) {
    this.selectedType = type;

    if (type === 'program') {
      this.getProgramDetails();
    }
  }

  onProgramChange(value: any) {
    this.selectedProgramId = value;

    const selected = this.programList.find(p => p.DataValue === value);

    this.selectedProgramName = selected?.DisplayText || '';
    this.programId = selected?.ProgramID || '';

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
          // this.ds = r.Data[0];
          // this.dataSource.data = this.ds;
          // this.dataSource._updateChangeSubscription();
          // this.loading = false;
          // this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('API Error:', err);
          // this.loading = false;
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
  const cleanDate = this.typedText.replace(/\//g, '');
  const cleanProgramName = this.selectedProgramName.replace(/\s+/g, '');

  var fileName = '';

  if (cleanProgramName && cleanDate && this.fileType) {
    fileName = `${cleanProgramName}${cleanDate}.${this.fileType}`;
  }

  this.programSelected.emit({
    programId: this.programId,
    programName: cleanProgramName,
    typedText: this.typedText,
    fileName: fileName,
    fullData: this.programList.find(p => p.ProgramID === this.programId)
  });
}
}