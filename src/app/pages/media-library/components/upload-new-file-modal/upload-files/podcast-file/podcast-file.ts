import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FormInput } from '../../../../../../components/dialog-form/form-input/form-input';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddPodcast } from '../../../add-podcast/add-podcast';
import { GHOService } from '../../../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../../../services/utilities';
import { ghoresult, tags } from '../../../../../../../model/ghomodel';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-podcast-file',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormSelect, FormInput, StepBadge, MatRadioButton, MatRadioGroup, FormsModule],
  templateUrl: './podcast-file.html',
  styleUrls: ['./podcast-file.css'],
})
export class PodcastFile implements OnInit {
  constructor(private dialogRef: MatDialogRef<PodcastFile>, private dialog: MatDialog) { }

  typedText: string = '';
  selectedType: string = '';
  subtitle: string = '';
  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  cdr = inject(ChangeDetectorRef)


  catogories: any[] = [];
  selectedCatogory: any = {};
  programId: string = '';
  selectedProgramId: any = null;
  selectedProgramName: string = '';
  errors: any = {};
  selectedCategoryId: string = '';
  title: string = '';
  programDetails: any = {};

  @Input() programList: any[] = [];
  @Input() fileType: string = '';
  @Input() disabled: boolean = false;
  @Output() programSelected = new EventEmitter<any>();

  selectType(type: string) {
    this.selectedType = type;
  }

  ngOnInit(): void {
    this.getPodcastCategory()
  }

  onProgramChange(value: any) {
    this.selectedProgramId = value;

    const selected = this.programList.find(p => p.DataValue === value);

    this.selectedProgramName = selected?.DisplayText || '';
    this.programId = selected?.ProgramID || '';

    this.emitData();
  }

  onCategoryChange(value: any) {
    this.selectedCategoryId = value;
    console.log(this.selectedCategoryId)
    this.emitData();
  }


  emitData() {

    const cleanDate = this.typedText.replace(/\//g, '');
    const cleanProgramName = this.selectedProgramName.replace(/\s+/g, '');

    let fileName = '';

    if (cleanProgramName && cleanDate && this.fileType) {
      fileName = `${cleanProgramName}${cleanDate}.${this.fileType}`;
    }

    this.programSelected.emit({
      programId: this.programId,
      programName: cleanProgramName,
      categoryId: this.selectedCategoryId,
      typedText: this.typedText,
      fileName: fileName,

      title: this.title,
      subtitle: this.subtitle,

      fullData: this.programList.find(p => p.ProgramID === this.programId),

    });

  }
  getPodcastCategory() {
    this.tv = [{ T: 'c10', V: '4' }];
    this.srv.getdata('lists', this.tv)
      .subscribe({
        next: (r) => {
          const data = r.Data[0];
          this.catogories = data.map((item: any) => ({
            DisplayText: item.Name,
            DataValue: item.PodcastcategoryID
          }));
        }
      })
  }

  onTitleChange(value: string) {
    this.title = value;
    this.emitData();
  }

  onSubtitleChange(value: string) {
    this.subtitle = value;
    this.emitData();
  }
  onThumbnailTypeChange(type: string) {
    this.selectedType = type;

    if (type === 'program' && this.programId) {
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


  openModalAddPodcast() {
    const dialogRef = this.dialog.open(AddPodcast, {
      width: '90%',
      maxWidth: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getPodcastCategory();
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

}
