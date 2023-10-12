import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { IonSelect, PopoverController } from '@ionic/angular';
@Component({
  selector: 'app-draft',
  templateUrl: './draft.page.html',
  styleUrls: ['./draft.page.scss'],
})
export class DraftPage implements OnInit {
  @ViewChild('mySelect', { static: false }) selectRef: IonSelect;
  @ViewChild('mySelect2', { static: false }) selectRef2: IonSelect;
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
    setInterval(() => {
      this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    }, 500);
    this.getAllPost();
    const interval = setInterval(() => {
      const isLoadPost = JSON.parse(localStorage.getItem('isLoadPost1'));
      if (isLoadPost) {
        console.log(isLoadPost);
        this.pageSize = 0;
        this.getAllPost();
        // const setindex = localStorage.getItem("setindex1");
        // this.items.unshift(isLoadPost);
        // this.items[setindex].isMessage = false;
        // this.items[setindex].isComment = false;
        // this.items[setindex].message = "";
        // if (this.items[setindex].post_votes.length == 0) {
        //   this.items[setindex].post_votes.push({ vote_type: 0 });
        // }
        localStorage.removeItem('isLoadPost1');
        // localStorage.removeItem("setindex1");
      }
    }, 1000);
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
    this.getAllPost();
  }
  getFeedData(e) {
    console.log(e.detail.value);
    if (e.detail.value == 'today') {
      this.post_date_name = 'today';
    }
    if (e.detail.value == '1_month') {
      this.post_date_name = '1 month';
    }
    if (e.detail.value == '1_year') {
      this.post_date_name = 'all time';
    }
    this.pageSize = 0;
    this.getAllPost();
  }
  replaceString(e) {
    return e.replace(/_/g, ' ');
  }
  onIonInfinite() {
    this.getAllPost();
  }
  setItem() {
    this.selectRef.open();
  }
  setItem2() {
    this.selectRef2.open();
  }
  getAllPost() {
    // this.model.showspinner();
    this.model
      .common_api(
        'user/post/draft/list',
        {
          user_uid: this.vestLogin.user_uid,
          sort_by: this.sort_by,
          post_date_filter: this.post_date_filter,
          page: this.pageSize,
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
            this.file_path = data.file_path;
            for (const key in this.items) {
              this.items[key].isMessage = false;
              this.items[key].isComment = false;
              this.items[key].message = '';
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
