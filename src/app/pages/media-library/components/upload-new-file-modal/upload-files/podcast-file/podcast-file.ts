import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-podcast-file',
  standalone: true,
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

  catogories: any[] = [];
  selectedCatogory: any = {};

  selectType(type: string) {
    this.selectedType = type;
  }

  ngOnInit(): void {
    this.getPodcastCategory()
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

  openModalAddPodcast() {
    this.dialog.open(AddPodcast, {
      width: '90%',
      maxWidth: '600px',
      disableClose: true
    });
  }

  onTextChange(event: any) {
    this.typedText = event.target.innerText;
    console.log('Full value:', 'ProgramName//' + this.typedText);
  }

}
