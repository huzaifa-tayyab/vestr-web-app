import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { IonSelect, PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  post_genre = 'all_post';
  @ViewChild('mySelect', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelect2', { static: false }) selectRef2: IonSelect;
  @ViewChild('mySelect3', { static: false }) selectRef3: IonSelect;
  count = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  vestLogin: any;
  items: any = [];
  post_uid: any;
  file_path: any;
  darktheme = false;
  sort_by = 'most_recent';
  post_date_filter = '1_year';
  post_date_name = 'all time';
  pageSize = 0;
  allComments: any;
  feedType = 'Following';
  constructor(
    public popoverController: PopoverController,
    public model: ModelService,
    private elementRef: ElementRef
  ) {
    setInterval(() => {
      this.getTheme();
      this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    }, 500);
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }

  isModalOpen = false;
  isModalOpen2 = false;
  postDetailsData: any;
  profile_image_path: any;
  getTheme() {
    const theme = localStorage.getItem('user-theme');
    if (theme) {
      if (theme === 'dark') {
        this.darktheme = true;
      } else {
        this.darktheme = false;
      }
    } else {
      this.darktheme = false;
    }
  }
  ionViewWillEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    if (localStorage.getItem('feedType')) {
      this.feedType = localStorage.getItem('feedType');
      if (this.feedType == 'Everything') {
        this.getAllPost2();
        const interval = setInterval(() => {
          const isLoadPost = JSON.parse(localStorage.getItem('isLoadPost'));

          if (isLoadPost) {
            this.pageSize = 0;
            this.getAllPost2();
            localStorage.removeItem('isLoadPost');
          }
        }, 1000);
      } else {
        this.getAllPost();
        const interval = setInterval(() => {
          const isLoadPost = JSON.parse(localStorage.getItem('isLoadPost'));

          if (isLoadPost) {
            this.pageSize = 0;
            this.getAllPost();
            localStorage.removeItem('isLoadPost');
          }
        }, 1000);
      }
    } else {
      this.getAllPost();
      const interval = setInterval(() => {
        const isLoadPost = JSON.parse(localStorage.getItem('isLoadPost'));

        if (isLoadPost) {
          this.pageSize = 0;
          this.getAllPost();
          localStorage.removeItem('isLoadPost');
        }
      }, 1000);
    }
    setInterval(() => {
      this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    }, 500);
  }
  removeItem(e) {
    this.items.splice(e.id, 1);
  }
  ngOnInit() {}
  postDetails(e) {
    const post_uid = e.post_uid;
    const i = e.i;
    console.log(e);
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
  getFeedData2(e) {
    this.pageSize = 0;
    this.items = [];
    if (this.feedType == 'Following') {
      this.getAllPost();
    } else {
      this.getAllPost2();
    }
  }
  getFeedData(e) {
    this.pageSize = 0;
    this.items = [];
    if (this.feedType == 'Following') {
      this.getAllPost();
    } else {
      this.getAllPost2();
    }
  }
  replaceString(e) {
    return e.replace(/_/g, ' ');
  }
  onIonInfinite() {
    if (this.feedType == 'Following') {
      this.getAllPost();
    } else {
      this.getAllPost2();
    }
  }
  setItem() {
    this.selectRef.open();
  }
  setItem2() {
    this.selectRef2.open();
  }
  setItem3() {
    this.selectRef3.open();
  }
  getFollow(type) {
    localStorage.setItem('feedType', type);
    this.feedType = type;
    this.pageSize = 0;
    this.items = [];
    if (this.feedType == 'Following') {
      this.getAllPost();
    } else {
      this.getAllPost2();
    }
  }
  genre(e) {
    this.pageSize = 0;
    this.items = [];
    if (this.feedType == 'Following') {
      this.getAllPost();
    } else {
      this.getAllPost2();
    }
  }
  getAllPost() {
    // this.model.showspinner();
    this.model
      .common_api(
        'user/feed',
        {
          user_uid: this.vestLogin?.user_uid,
          sort_by: this.sort_by,
          post_date_filter: this.post_date_filter,
          page: this.pageSize,
          post_genre: this.post_genre,
          size: '20',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          console.log(data);
          if (data.status == 1) {
            if (this.pageSize == 0) {
              this.pageSize = data.currentPage + 1;
              this.items = [];
              this.items = data.data;
            } else {
              this.pageSize = data.currentPage + 1;
              for (let index = 0; index < data.data.length; index++) {
                this.items.push(data.data[index]);
              }
            }

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
            this.items = [];
            this.pageSize = 0;
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
  }
  getAllPost2() {
    // this.model.showspinner();
    this.model
      .common_api(
        'user/feed-everything',
        {
          user_uid: '',
          sort_by: this.sort_by,
          post_date_filter: this.post_date_filter,
          page: this.pageSize,
          post_genre: this.post_genre,
          size: '20',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          console.log(data);
          if (data.status == 1) {
            if (this.pageSize == 0) {
              this.pageSize = data.currentPage + 1;
              this.items = [];
              this.items = data.data;
            } else {
              this.pageSize = data.currentPage + 1;
              for (let index = 0; index < data.data.length; index++) {
                this.items.push(data.data[index]);
              }
            }

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
            this.items = [];
            this.pageSize = 0;
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
