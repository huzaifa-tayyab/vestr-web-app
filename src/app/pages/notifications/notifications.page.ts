import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  segmentValue = 'all';
  items = [
    {
      name: 'All',
      value: 'all',
    },
    // {
    //   name: "Likes",
    //   value: "like",
    // },
    {
      name: 'Reposts',
      value: 'repost',
    },
    {
      name: 'Replies',
      value: 'replies',
    },
    // {
    //   name: "Follows",
    //   value: "follow",
    // },
    // {
    //   name: "Purchases",
    //   value: "purchase",
    // },
  ];
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
}
