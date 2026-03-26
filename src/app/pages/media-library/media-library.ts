
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-media-library',
  imports: [MatPaginatorModule, MatTableModule, CommonModule, MatIconModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './media-library.html',
  styleUrl: './media-library.css',
})
export class MediaLibrary {

  constructor(private dialog: MatDialog) { }

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

  dataSource = [
    {
      name: 'OmShantiOm_230326.mp3',
      mediaSize: "56:43 sec  • 108 MB",
      avatar: '/main/rj1.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      member: 'RJ Anjali',
      likes: '287',
      time: '3 min ago',
      uploadStatus: 'Published',
      statusClass: 'published'
    },
    {
      name: 'BollywoodRewind_230326.mp3',
      mediaSize: "56:43 sec  • 108 MB",
      avatar: '/main/rj2.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      member: 'RJ Priyanka',
      likes: '169',
      time: '15 min ago',
      uploadStatus: 'Published',
      statusClass: 'published'
    },
    {
      name: 'HungamaRadio_230326.mp3',
      mediaSize: "56:43 sec  • 108 MB",
      avatar: '/main/user-image.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      member: 'RJ Shijo',
      likes: '88',
      time: '28 min ago',
      uploadStatus: 'Published',
      statusClass: 'published'
    },
    {
      name: 'IndoAmericanNews_230326.mp3',
      mediaSize: "56:43 sec  • 108 MB",
      avatar: '/main/rj3.png',
      category: 'Pre-Scheduled',
      categoryClass: 'pre',
      member: 'RJ Reeva',
      likes: '0',
      time: '1 Mar 26 • 06:34 PM',
      uploadStatus: 'Published',
      statusClass: 'published'
    },
    {
      name: 'Shorts_230326.mp4',
      mediaSize: '56:43 sec  • 23 MB',
      avatar: '/main/shorts.jpg',
      category: 'Shorts',
      categoryClass: 'shorts',
      member: 'RJ Neena',
      likes: '0',
      time: '1 Mar 26 • 06:34 PM',
      uploadStatus: 'Draft',
      statusClass: 'draft'
    },
    {
      name: 'StudioConversations_230326.mp3',
      mediaSize: "56:43 sec  • 108 MB",
      avatar: '/main/rj1.png',
      category: 'Podcast',
      categoryClass: 'podcast',
      member: 'RJ Anjali',
      likes: '0',
      time: '1 Mar 26 • 11:17 AM',
      uploadStatus: 'Draft',
      statusClass: 'draft'
    },
    {
      name: 'Video_230326.mp4',
      mediaSize: '56:43 sec • 229 MB',
      avatar: '/main/video1.jpg',
      category: 'Featured',
      categoryClass: 'featured',
      member: 'RJ Anjali',
      likes: '0',
      time: '1 Mar 26 • 11:17 AM',
      uploadStatus: 'Draft',
      statusClass: 'draft'
    },
    {
      name: 'Video_220326.mp4',
      mediaSize: '56:43 sec • 229 MB',
      avatar: '/main/video2.jpg',
      category: 'Featured',
      categoryClass: 'featured',
      member: 'RJ Anjali',
      likes: '0',
      time: '1 Mar 26 • 11:17 AM',
      uploadStatus: 'Draft',
      statusClass: 'draft'
    }
  ];
} 
