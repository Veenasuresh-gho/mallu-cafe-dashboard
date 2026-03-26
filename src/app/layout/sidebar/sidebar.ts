import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  constructor(public router: Router) { }


  sidebarItems = [
    {
      title: "Dashboard",
      icon: "/main/sidebar/dashboard-muted.png",
      link: "/dashboard",
      activeIcon: "/main/sidebar/dashboard.png"
    },
    {
      title: "Programs",
      icon: "/main/sidebar/radio-muted.png",
      link: "/programs",
      activeIcon: "/main/sidebar/radio.png"
    },
    {
      title: "Media Library",
      icon: "/main/sidebar/video-play-muted.png",
      link: "/media-library",
      activeIcon: "/main/sidebar/video-play.png"
    },
    {
      title: "Team members",
      icon: "/main/sidebar/people-muted.png",
      link: "/team-members",
      activeIcon: "/main/sidebar/people.png"
    },
    {
      title: "Advertisements",
      icon: "/main/sidebar/headphone-muted.png",
      link: "#",
      activeIcon: "/main/sidebar/headphone.png"
    },
    {
      title: "Profile",
      icon: "/main/sidebar/user-muted.png",
      link: "/profile",
      activeIcon: "/main/sidebar/user.png"
    },
  ]

  sidebarBottomItems = [
    {
      title: "Settings",
      icon: "/main/sidebar/setting-muted.png",
      link: "#",
    },
    {
      title: "Help",
      icon: "/main/sidebar/info-circle-muted.png",
      link: "#",
    },
  ]

  isActive(link: string): boolean {
    return this.router.url === link;
  }

}
