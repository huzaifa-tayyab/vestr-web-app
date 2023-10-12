import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"],
})
export class NewsComponent implements OnInit {
  @Input() news: any;
  constructor() {}

  ngOnInit() {
    //console.log(this.news)
  }
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  openUrl(url) {
    window.open(url, "_blank");
  }
}
