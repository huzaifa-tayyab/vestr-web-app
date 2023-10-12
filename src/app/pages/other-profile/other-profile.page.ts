import { Component, ElementRef, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { AlertController, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.page.html',
  styleUrls: ['./other-profile.page.scss'],
})
export class OtherProfilePage implements OnInit {
  vestLogin: any;
  items: any = [];
  isFileUpload = false;
  isExpand = false;
  post_uid: any;
  file_path: any;
  profile_image_path: any;
  profileType = 'general';
  constructor(
    public popoverController: PopoverController,
    public model: ModelService,
    private alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router,
    private elementRef: ElementRef
  ) {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
        this.user_uid = params['id'];
        this.getAllPost();
        this.getUserDetail();
      }
    });
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  isModalOpen = false;
  isModalOpen2 = false;
  postDetailsData: any;
  userDetail: any;
  cover_img_path: any;
  profile_img_path: any;
  follow_to: any;
  followed_by: any;
  user_uid: any;
  is_followed_by_loggedin_user = 1;
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  changeProfile() {
    if (this.vestLogin) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/follow-user',
          {
            user_uid: this.vestLogin.user_uid,
            follow_to_user_uid: this.user_uid,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            //console.log(data);
            this.model.hidespinner();
            if (data.status == 1) {
              this.getUserDetail();
            } else {
              this.model.alerterror(data.message);
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.presentAlertLogin();
    }
  }
  goDetailsProfile(uid) {
    if (this.vestLogin) {
      this.router.navigateByUrl('/app/messages/' + uid);
    } else {
      // this.router.navigateByUrl("/home/profile/" + uid);
      this.presentAlertLogin();
    }
  }
  async presentAlertLogin() {
    const alert = await this.alertController.create({
      header: 'Alert!',
      subHeader: 'Login or Signup to explore the app',
      mode: 'ios',
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/login']);
          },
        },
        {
          text: 'Signup',
          handler: () => {
            this.router.navigate(['/signup']);
          },
        },
      ],
    });

    await alert.present();
  }
  ngOnInit() {
    const interval = setInterval(() => {
      if (localStorage.getItem('isLoadPost')) {
        this.getAllPost();
        localStorage.removeItem('isLoadPost');
      }
    }, 1000);
  }
  postDetails(e) {
    const post_uid = e.post_uid;
    const i = e.i;
    for (const key in this.items) {
      this.items[key].isMessage = false;
      this.items[key].isComment = false;
    }
    this.items[i].isMessage = !this.items[i].isMessage;
    this.items[i].isComment = !this.items[i].isComment;
    if (this.items[i].isMessage) {
      this.model
        .common_api(
          'user/post-details',
          {
            user_uid: this.vestLogin?.user_uid,
            post_uid: post_uid,
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe(
          (data: any) => {
            this.postDetailsData = null;
            if (data.status == 1) {
              this.postDetailsData = data.data;
              for (
                let key = 0;
                key < this.postDetailsData.comments.length;
                key++
              ) {
                if (key > 3) {
                  this.postDetailsData.comments.splice(key, 1);
                  return;
                }
                // for edit comment
                this.postDetailsData.comments[key].isMessage = false;
                this.postDetailsData.comments[key].message = '';
                // for add new comment
                this.postDetailsData.comments[key].isNewMessage = false;
                this.postDetailsData.comments[key].isNewComment = false;
                for (const j in this.postDetailsData.comments[key]
                  .child_comments.length) {
                  this.postDetailsData.comments[key].child_comments[
                    j
                  ].isMessage = false;
                  this.postDetailsData.comments[key].child_comments[
                    j
                  ].isNewComment = false;
                  this.postDetailsData.comments[key].child_comments[j].message =
                    '';
                  if (
                    this.postDetailsData.comments[key].child_comments[j]
                      .comments
                  ) {
                    for (const k in this.postDetailsData.comments[key]
                      .child_comments[j].comments.length) {
                      this.postDetailsData.comments[key].child_comments[
                        j
                      ].comments[k].isMessage = false;
                      this.postDetailsData.comments[key].child_comments[
                        j
                      ].comments[k].isNewComment = false;
                      this.postDetailsData.comments[key].child_comments[
                        j
                      ].comments[k].message = '';
                    }
                  }
                }
              }

              //console.log(this.postDetailsData);
            } else {
              this.model.alerterror(data.message);
            }
          },
          (err: any) => {
            this.model.alerterror('System generated errors');
          }
        );
    }
  }
  setVote(e) {
    const post_uid = e.post_uid;
    const type = e.type;
    const item = e.item;
    const i = e.index;
    this.model
      .common_api(
        'user/vote-post',
        {
          user_uid: this.vestLogin?.user_uid,
          post_uid: post_uid,
          vote_type: type,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.items[i].total_up_vote = data.up_vote;
            this.items[i].total_down_vote = data.down_vote;
            if (type == 'up') {
              this.items[i].post_votes[0].vote_type = 1;
            }
            if (type == 'down') {
              this.items[i].post_votes[0].vote_type = 2;
            }
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getUserDetail() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/get-user-profile',
        {
          user_uid: this.vestLogin?.user_uid,
          profile_user_uid: this.user_uid,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            console.log(data);
            this.is_followed_by_loggedin_user =
              data.is_followed_by_loggedin_user;
            this.userDetail = data.data;
            this.profile_img_path = data.profile_img_path;
            this.cover_img_path = data.cover_img_path;
            if (data.followed_by) {
              this.followed_by = data.followed_by;
            }
            if (data.follow_to) {
              this.follow_to = data.follow_to;
            }

            if (!this.userDetail.cover_image) {
              this.userDetail.cover_image = '/1.jpeg';
            } else {
              this.userDetail.cover_image = '/' + this.userDetail.cover_image;
            }
            if (!this.userDetail.profile_image) {
              this.userDetail.profile_image = '/2.svg';
            } else {
              this.userDetail.profile_image =
                '/' + this.userDetail.profile_image;
            }
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
  getAllPost() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/feed-by-user',
        {
          user_uid: this.vestLogin?.user_uid,
          profile_user_uid: this.user_uid,
          page: '0',
          is_personal: '1',
          size: '100',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          this.items = [];
          if (data.status == 1) {
            this.items = data.data;
            this.profile_image_path = data.profile_image_path;
            //console.log(data);
            this.file_path = data.file_path;
            for (const key in this.items) {
              this.items[key].isMessage = false;
              this.items[key].isComment = false;
              this.items[key].message = '';
              if (this.items[key].post_votes.length == 0) {
                this.items[key].post_votes.push({ vote_type: 0 });
              }
            }
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
