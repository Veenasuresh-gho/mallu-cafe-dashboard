import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { FormSelect } from '../../../../../../components/dialog-form/form-select/form-select';
import { StepBadge } from '../../../../../../components/dialog-form/step-badge/step-badge';
import { FormInput } from '../../../../../../components/dialog-form/form-input/form-input';

import { AddPodcast } from '../../../add-podcast/add-podcast';

import { GHOService } from '../../../../../../services/ghosrvs';
import { GHOUtitity } from '../../../../../../services/utilities';

import { ghoresult, tags } from '../../../../../../../model/ghomodel';

@Component({
  selector: 'app-podcast-file',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormSelect,
    FormInput,
    StepBadge,
    MatRadioButton,
    MatRadioGroup,
    FormsModule
  ],
  templateUrl: './podcast-file.html',
  styleUrls: ['./podcast-file.css'],
})
export class PodcastFile implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PodcastFile>,
    private dialog: MatDialog
  ) { }

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  cdr = inject(ChangeDetectorRef);

  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  @Input() prefillData: any;
  @Input() prefillDate: string = '';
  @Input() editData: any = null;
  @Input() programList: any[] = [];
  @Input() fileType: string = '';
  @Input() disabled: boolean = false;
  @Input() programData: any;
  @Input() selectedDate: string = '';
  @Output() programSelected = new EventEmitter<any>();
  @Input() readOnly: boolean = false;
  
  typedText: string = '';
  selectedType: string = '';
  subtitle: string = '';

  catogories: any[] = [];
  selectedCatogory: any = {};

  programId: string = '';
  selectedProgramId: string = '';
  selectedProgramName: string = '';

  errors: any = {};

  selectedCategoryId: string = '';

  title: string = '';

  programDetails: any = {};

  thumbnailFile: File | null = null;
  thumbnailPreview: string = '';

  poadcastProgramList: any[] = [];

  async ngOnInit(): Promise<void> {

    await this.getPodcastCategory();

    if (this.editData) {
      await this.patchEditData();
      return;
    }

    if (this.prefillData) {
      // category
      this.selectedCategoryId =
        this.prefillData?.PodcastCategoryID?.toString() || '';

      // load program dropdown first
      await this.getPodcastProgramList();

      // selected program
      this.selectedProgramId =
        this.prefillData?.ProgramID?.toString() || '';

      this.selectedProgramName =
        this.prefillData?.Title || '';

      // subtitle
      this.subtitle =
        this.prefillData?.HostName || '';

      if (this.prefillDate) {
        this.typedText = this.prefillDate;
      }
      // thumbnail
      this.thumbnailPreview =
        this.prefillData?.TeamUrl || '';

      this.selectedType =
        this.prefillData?.TeamUrl
          ? 'program'
          : 'custom';

      // get full program details
      const selected =
        this.poadcastProgramList.find(
          p => p.DataValue == this.selectedProgramId
        );

      this.programId =
        selected?.ProgramID || '';

      if (this.programId) {
        this.getProgramDetails();
      }



      this.cdr.detectChanges();

      this.emitData();
    }
  }

  async patchEditData(): Promise<void> {
    this.selectedCategoryId =
      this.editData?.PodcastCategoryid?.toString() || '';

    await this.getPodcastProgramList();

    this.selectedProgramId =
      this.editData?.ProgramID?.toString() || '';

    const selectedProgram =
      this.poadcastProgramList.find(
        p => p.DataValue === this.selectedProgramId
      );

    this.selectedProgramName =
      selectedProgram?.DisplayText || '';

    this.programId =
      selectedProgram?.ProgramID || '';

    this.subtitle =
      this.editData?.Subtitle || '';

    const fileName =
      this.editData?.FileName || '';

    const match =
      fileName.match(/(\d{6})(?=\.[^.]+$)/);

    if (match) {

      const rawDate = match[1];

      this.typedText =
        `${rawDate.slice(0, 2)}/${rawDate.slice(2, 4)}/${rawDate.slice(4, 6)}`;

    } else {

      this.typedText = '';
    }

    this.thumbnailPreview =
      this.editData?.ThumbnailUrl || '';

    this.selectedType =
      this.editData?.ThumbnailUrl
        ? 'custom'
        : 'program';

    if (this.programId) {
      this.getProgramDetails();
    }

    this.cdr.detectChanges();

    this.emitData();
  }

  selectType(type: string) {
    this.selectedType = type;
  }

  onDateChange(value: string) {

    let cleaned =
      value.replace(/\D/g, '').slice(0, 6);

    if (cleaned.length > 2) {
      cleaned =
        cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length > 5) {
      cleaned =
        cleaned.slice(0, 5) + '/' + cleaned.slice(5);
    }
    this.typedText = cleaned;
    this.emitData();
  }

  onProgramChange(value: any) {

    this.selectedProgramId = value?.toString();

    const selected =
      this.poadcastProgramList.find(
        p => p.DataValue === this.selectedProgramId
      );

    this.selectedProgramName =
      selected?.DisplayText || '';

    this.programId =
      selected?.ProgramID || '';

    if (this.programId) {
      this.getProgramDetails();
    }

    this.emitData();
  }

  async onCategoryChange(value: any) {

    this.selectedCategoryId = value?.toString();

    this.selectedProgramId = '';
    this.selectedProgramName = '';
    this.programId = '';

    await this.getPodcastProgramList();

    this.emitData();
  }

  getPodcastProgramList(): Promise<void> {

    return new Promise((resolve) => {

      this.tv = [
        { T: 'dk2', V: this.selectedCategoryId },
        { T: 'c10', V: '11' }
      ];
      this.srv.getdata('program', this.tv)
        .subscribe({

          next: (r) => {

            const data = r.Data[0] || [];

            this.poadcastProgramList =
              data.map((item: any) => ({
                DisplayText: item.Title,
                DataValue: item.ProgramID.toString(),
                ProgramID: item.id
              }));

            this.cdr.markForCheck();

            resolve();
          },

          error: () => resolve()
        });
    });
  }

  emitData() {

    const cleanDate =
      this.typedText.replace(/\//g, '');

    const cleanProgramName =
      this.selectedProgramName.replace(/\s+/g, '');

    let fileName = '';

    if (
      cleanProgramName &&
      cleanDate &&
      this.fileType
    ) {
      fileName =
        `${cleanProgramName}${cleanDate}.${this.fileType}`;
    }

    this.programSelected.emit({

      programId: this.programId,

      programName: cleanProgramName,

      categoryId: this.selectedCategoryId,

      typedText: this.typedText,

      fileName: fileName,

      title: this.title,

      subtitle: this.subtitle,

      thumbnailFile: this.thumbnailFile,

      thumbnailType: this.selectedType,

      fullData: this.poadcastProgramList.find(
        p => p.ProgramID === this.programId
      ),
    });
  }

  getPodcastCategory(): Promise<void> {
    return new Promise((resolve) => {

      this.tv = [
        { T: 'c10', V: '4' }
      ];

      this.srv.getdata('lists', this.tv)
        .subscribe({
          next: (r) => {

            const data = r.Data[0] || [];

            this.catogories =
              data.map((item: any) => ({
                DisplayText: item.Name,
                DataValue: item.PodcastcategoryID.toString()
              }));

            this.cdr.markForCheck();
            resolve();
          },

          error: () => resolve()
        });
    });
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

    if (
      type === 'program' &&
      this.programId
    ) {
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

            this.programDetails =
              r.Data[0][0];

            this.cdr.markForCheck();
          }
        },

        error: (err) => {
          console.error('API Error:', err);
        }
      });
  }

  onThumbnailChange(event: any): void {

    const file =
      event.target.files?.[0];

    if (!file) return;
    this.thumbnailFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.thumbnailPreview =
        reader.result as string;

      this.cdr.detectChanges();

      this.emitData();
    };

    reader.readAsDataURL(file);
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

    let value =
      el.innerText.replace(/\D/g, '').slice(0, 6);

    if (value.length > 2) {
      value =
        value.slice(0, 2) + '/' + value.slice(2);
    }

    if (value.length > 5) {
      value =
        value.slice(0, 5) + '/' + value.slice(5);
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