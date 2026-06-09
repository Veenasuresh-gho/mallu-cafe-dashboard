import { Component, ViewEncapsulation, Inject, inject } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PrimaryButton } from '../../../components/primary-button/primary-button';
import { GHOService } from '../../../services/ghosrvs';
import { GHOUtitity } from '../../../services/utilities';
import { ghoresult, tags } from '../../../../model/ghomodel';




@Component({
  selector: 'app-update-privacy-policy',
  standalone: true,
  imports: [
    QuillModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    PrimaryButton
  ],
  templateUrl: './update-privacy-policy.html',
  styleUrl: './update-privacy-policy.css',
  encapsulation: ViewEncapsulation.None
})
export class UpdatePrivacyPolicy {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();

  content = '';
  quillEditor: any;

  htmlContent = '';
  subtitle = "Mallu Cafe's Privacy Policy";

  editorModules = {
    toolbar: [
      ['italic', 'bold', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
    ]
  };

  isSaving = false;


  updatePrivacyPolicy(): void {
    this.isSaving = true;
    this.tv = [
      { T: 'c1', V: this.htmlContent },
      { T: 'c10', V: '13' }
    ];
    this.srv.getdata('teammember', this.tv)
      .subscribe({
        next: (r) => {
          this.isSaving = false;
          this.dialogRef.close(this.htmlContent);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('API Error:', err);
        }
      });
  }

  constructor(
    private dialogRef: MatDialogRef<UpdatePrivacyPolicy>,
    @Inject(MAT_DIALOG_DATA) public data: { content?: string; subtitle?: string }
  ) {
    this.content = data?.content ?? '';
    this.subtitle = data?.subtitle ?? "Mallu Cafe's Privacy Policy";
    this.htmlContent = this.content;
  }

  onEditorCreated(editor: any) {
    this.quillEditor = editor;

    // Reposition tooltip above selected text
    editor.on('selection-change', (range: any) => {
      if (range && range.length > 0) {
        setTimeout(() => {
          const tooltip = document.querySelector('.ql-bubble .ql-tooltip') as HTMLElement;
          if (!tooltip) return;

          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return;

          const rect = selection.getRangeAt(0).getBoundingClientRect();

          const tooltipWidth = tooltip.offsetWidth;
          const tooltipHeight = tooltip.offsetHeight;

          let top = rect.top - tooltipHeight - 10;  // 10px above selection
          let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);  // centered

          // Prevent going off screen left/right
          if (left < 8) left = 8;
          if (left + tooltipWidth > window.innerWidth - 8) {
            left = window.innerWidth - tooltipWidth - 8;
          }

          // If not enough space above, show below
          if (top < 8) {
            top = rect.bottom + 10;
          }

          tooltip.style.top = `${top}px`;
          tooltip.style.left = `${left}px`;
        }, 10);
      }
    });
  }
  onContentChanged(event: any) {
    this.htmlContent = event.html ?? '';
  }

  save() {
    this.dialogRef.close(this.htmlContent);
  }

  close() {
    this.dialogRef.close();
  }

}