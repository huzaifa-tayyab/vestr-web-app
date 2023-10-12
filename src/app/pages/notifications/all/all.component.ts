import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModelService } from "src/app/services/model.service";

@Component({
  selector: "app-all",
  templateUrl: "./all.component.html",
  styleUrls: ["./all.component.scss"],
})
export class AllComponent implements OnInit {
  @Input() segmentValue: any;
  vestLogin: any;
  notificationList: any = [];
  profile_image_path: any;
  pageSize = 0;
  isData = false;
  constructor(public model: ModelService, public router: Router) {}
  ngOnInit(): void {
    this.vestLogin = JSON.parse(localStorage.getItem("vest_login"));
    this.getFollowStock();
  }
  goDetailsProfile(uid) {
    if (this.vestLogin) {
      this.router.navigateByUrl("/app/profile/" + uid);
    } else {
      this.router.navigateByUrl("/home/profile/" + uid);
      // this.presentAlertLogin();
    }
  }
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  getFollowStock() {
    this.model
      .common_api(
        "user/notification/list",
        {
          user_uid: this.vestLogin.user_uid,
          page: this.pageSize,
          size: "10",
          read_status: "unread",
          type: this.segmentValue,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.pageSize = data.currentPage;

          if (data.status == 1) {
            if (this.pageSize == 0) {
              this.notificationList = [];
              this.notificationList = data.data;
            } else {
              for (let index = 0; index < data.data.length; index++) {
                this.notificationList.push(data.data[index]);
              }
            }
            this.notificationList = data.data;
            if (this.notificationList.length > 10) {
              this.isData = true;
            } else {
              this.isData = false;
            }
            this.profile_image_path = data.profile_image_path;
          } else {
            this.notificationList = [];
          }
        },
        (err: any) => {
          this.model.alerterror("System generated errors");
        }
      );
  }
  onIonInfinite() {
    this.pageSize = this.pageSize + 1;
    this.getFollowStock();
  }
}
