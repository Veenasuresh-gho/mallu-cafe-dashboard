
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { UploadNewFileModal } from './components/upload-new-file-modal/upload-new-file-modal';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { GHOService } from '../../services/ghosrvs';
import { GHOUtitity } from '../../services/utilities';
import { ghoresult, tags } from '../../../model/ghomodel';

@Component({
  selector: 'app-media-library',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule, PrimaryButton],
  templateUrl: './media-library.html',
  styleUrl: './media-library.css',
})
export class MediaLibrary implements OnInit {

  srv = inject(GHOService);
  utl = inject(GHOUtitity);
  tv: tags[] = [];
  res: ghoresult = new ghoresult();
  loading = false;
  ds: [] = [];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) set matPaginator(p: MatPaginator) {
    if (p) {
      this.dataSource.paginator = p;
    }
  }
  ngOnInit(): void {
    this.getMediaLibrary();
  }
  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  openModal() {
    this.dialog.open(UploadNewFileModal, {
      width: '90%',
      maxWidth: '600px',
      maxHeight: '95vh',
      disableClose: true,
    });
  }

  searchText = '';
  status = 'all';
  category = 'all';
  members = 'all';
  period = 'all';

  columns: string[] = [
    'media',
    'category',
    'member',
    'likes',
    'status',
  ];

  getMediaLibrary(): void {
    this.loading = true;
    this.tv = [{ T: 'c10', V: '15' }];

    this.srv.getdata('program', this.tv)
      .subscribe({
        next: (r) => {
          console.log(r)
          this.ds = r.Data[0];
          this.dataSource.data = this.ds;
          this.dataSource._updateChangeSubscription();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('API Error:', err);
          this.loading = false;
        }
      });
  }

  // dataSource = [
  //   {
  //     name: 'OmShantiOm_230326.mp3',
  //     mediaSize: "56:43 sec  • 108 MB",
  //     avatar: '/main/rj1.png',
  //     category: 'Pre-Scheduled',
  //     categoryClass: 'pre',
  //     member: 'RJ Anjali',
  //     likes: '287',
  //     time: '3 min ago',
  //     uploadStatus: 'Published',
  //     statusClass: 'published'
  //   },
  //   {
  //     name: 'BollywoodRewind_230326.mp3',
  //     mediaSize: "56:43 sec  • 108 MB",
  //     avatar: '/main/rj2.png',
  //     category: 'Pre-Scheduled',
  //     categoryClass: 'pre',
  //     member: 'RJ Priyanka',
  //     likes: '169',
  //     time: '15 min ago',
  //     uploadStatus: 'Published',
  //     statusClass: 'published'
  //   },
  //   {
  //     name: 'HungamaRadio_230326.mp3',
  //     mediaSize: "56:43 sec  • 108 MB",
  //     avatar: '/main/user-image.png',
  //     category: 'Pre-Scheduled',
  //     categoryClass: 'pre',
  //     member: 'RJ Shijo',
  //     likes: '88',
  //     time: '28 min ago',
  //     uploadStatus: 'Published',
  //     statusClass: 'published'
  //   },
  //   {
  //     name: 'IndoAmericanNews_230326.mp3',
  //     mediaSize: "56:43 sec  • 108 MB",
  //     avatar: '/main/rj3.png',
  //     category: 'Pre-Scheduled',
  //     categoryClass: 'pre',
  //     member: 'RJ Reeva',
  //     likes: '0',
  //     time: '1 Mar 26 • 06:34 PM',
  //     uploadStatus: 'Published',
  //     statusClass: 'published'
  //   },
  //   {
  //     name: 'Shorts_230326.mp4',
  //     mediaSize: '56:43 sec  • 23 MB',
  //     avatar: '/main/shorts.jpg',
  //     category: 'Shorts',
  //     categoryClass: 'shorts',
  //     member: 'RJ Neena',
  //     likes: '0',
  //     time: '1 Mar 26 • 06:34 PM',
  //     uploadStatus: 'Draft',
  //     statusClass: 'draft'
  //   },
  //   {
  //     name: 'StudioConversations_230326.mp3',
  //     mediaSize: "56:43 sec  • 108 MB",
  //     avatar: '/main/rj1.png',
  //     category: 'Podcast',
  //     categoryClass: 'podcast',
  //     member: 'RJ Anjali',
  //     likes: '0',
  //     time: '1 Mar 26 • 11:17 AM',
  //     uploadStatus: 'Draft',
  //     statusClass: 'draft'
  //   },
  //   {
  //     name: 'Video_230326.mp4',
  //     mediaSize: '56:43 sec • 229 MB',
  //     avatar: '/main/video1.jpg',
  //     category: 'Featured',
  //     categoryClass: 'featured',
  //     member: 'RJ Anjali',
  //     likes: '0',
  //     time: '1 Mar 26 • 11:17 AM',
  //     uploadStatus: 'Draft',
  //     statusClass: 'draft'
  //   },
  //   {
  //     name: 'Video_220326.mp4',
  //     mediaSize: '56:43 sec • 229 MB',
  //     avatar: '/main/video2.jpg',
  //     category: 'Featured',
  //     categoryClass: 'featured',
  //     member: 'RJ Anjali',
  //     likes: '0',
  //     time: '1 Mar 26 • 11:17 AM',
  //     uploadStatus: 'Draft',
  //     statusClass: 'draft'
  //   }
  // ];
} 
