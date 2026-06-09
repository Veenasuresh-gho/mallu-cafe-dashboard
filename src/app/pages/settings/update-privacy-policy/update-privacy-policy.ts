import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PrimaryButton } from '../../../components/primary-button/primary-button';
import Quill from 'quill';

const Font = Quill.import('formats/font') as any;
const Size = Quill.import('attributors/style/size') as any;

Font.whitelist = ['inter', 'poppins', 'arial', 'times-new-roman'];
Size.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '20px'];

Quill.register(Font, true);
Quill.register(Size, true);

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

  content = '';
  quillEditor: any;

  htmlContent = '';
  subtitle = "Mallu Cafe's Privacy Policy";

  editorModules = {
    toolbar: [
      ['italic', 'bold', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }]
    ]
  };

  constructor(
    private dialogRef: MatDialogRef<UpdatePrivacyPolicy>,
    @Inject(MAT_DIALOG_DATA) public data: { content?: string; subtitle?: string }
  ) {
    this.content = data?.content ?? this.defaultContent();
    this.subtitle = data?.subtitle ?? "Mallu Cafe's Privacy Policy";
    this.htmlContent = this.content;
  }

onEditorCreated(editor: any) {
  setTimeout(() => {
    editor.blur();
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

  private defaultContent(): string {
    return `<h2>Information We Collect</h2>
<p>We collect only the information required to create and manage your account:</p>
<ul>
  <li>Name</li>
  <li>Email address</li>
  <li>No other personal data.</li>
</ul>

<h2>How We Use Your Information</h2>
<p>Your information is used only to:</p>
<ul>
  <li>Create and manage your account</li>
  <li>Provide access to app features</li>
  <li>Communicate important updates if needed</li>
</ul>

<h2>No Data Selling or Sharing</h2>
<p>We do not sell, trade, or share your personal information with third parties.</p>

<h2>Data Security</h2>
<p>We take reasonable steps to protect your information and keep it secure.</p>

<h2>Your Control</h2>
<p>You can:</p>
<ul>
  <li>Update your profile information</li>
  <li>Request deletion of your account</li>
</ul>

<h2>Third-Party Services</h2>
<p>We may use third-party services that collect information used to identify you. These services have their own privacy policies.</p>`;
  }
}