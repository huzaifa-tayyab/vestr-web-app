import { Component, ElementRef, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  vestLogin: any;
  userDetail: any;
  cover_img_path: any;
  profile_img_path: any;
  follow_to: any;
  followed_by: any;
  isProfile = 'profile';
  constructor(public model: ModelService, private elementRef: ElementRef) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
  }
  getUserDetail() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/details',
        {
          user_uid: this.vestLogin.user_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            this.userDetail = data.data;
            this.profile_img_path = data.profile_img_path;
            this.cover_img_path = data.cover_img_path;
            this.followed_by = data.followed_by;
            this.follow_to = data.follow_to;
            if (!this.userDetail.cover_image) {
              this.userDetail.cover_image = '/1.jpeg';
            }
            if (!this.userDetail.profile_image) {
              this.userDetail.profile_image = '/2.svg';
            }
            //console.log(data)
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
  }
}
