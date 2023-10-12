import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { AlertController, IonModal, PopoverController } from '@ionic/angular';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  profile_image_path: any;
  faThumbsUp = faThumbsUp;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faRetweet = faRetweet;
  faComment = faComment;
  @ViewChild(IonModal) modal: IonModal;
  vestLogin: any;
  items: any = [];
  isFileUpload = false;
  file_name: any = '';
  file_type: any = '';
  htmlContent = '';

  post_uid: any;
  file_path: any;
  privacy: any = '';
  sharePostDetails: any;
  share_text: any = '';
  getpost_uid: any;
  constructor(
    public popoverController: PopoverController,
    public model: ModelService,
    private alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  isModalOpen = false;
  isModalOpen2 = false;
  postDetailsData: any;
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  setOpen(isOpen: boolean, uid, text, privacy) {
    this.privacy = privacy;
    this.htmlContent = text;
    this.post_uid = uid;
    this.popoverController.dismiss();
    this.isModalOpen = isOpen;
  }
  setCommentOpen(i) {
    this.postDetailsData.comments[i].isMessage = true;
    this.popoverController.dismiss();
  }
  cancelEditMessage(i) {
    this.postDetailsData.comments[i].isMessage = false;
  }
  cancelEditMessage2(i) {
    this.postDetailsData.comments[i].isNewMessage = false;
  }
  setNewCommentOpen(i) {
    this.postDetailsData.comments[i].isNewMessage = true;
  }
  setChildCommentOpen(i, j) {
    this.postDetailsData.comments[i].child_comments[j].isMessage = true;
    this.popoverController.dismiss();
  }
  cancelEditMessage3(i, j) {
    this.postDetailsData.comments[i].child_comments[j].isMessage = false;
  }

  openShareModal(item) {
    this.sharePostDetails = item;
    this.isModalOpen2 = true;
  }
  onWillDismiss2() {
    this.isModalOpen2 = false;
  }
  sharePost() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/share-post',
        {
          user_uid: this.vestLogin.user_uid,
          post_uid: this.sharePostDetails.post_uid,
          share_text: this.share_text,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            this.model.alertsuccess(data.message);
            this.isModalOpen2 = false;
            this.getAllPost();
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
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.getpost_uid = params['id'];
        this.getAllPost();
      }
    });

    // const interval = setInterval(() => {
    //   if (localStorage.getItem("isLoadPost")) {
    //     this.getAllPost();
    //     localStorage.removeItem("isLoadPost");
    //   }
    // }, 1000);
  }
  async presentAlert(post_uid) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      subHeader: 'Are you sure, you want to remove this.',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.popoverController.dismiss();
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.model.showspinner();
            this.model
              .common_api(
                'user/delete-post',
                {
                  user_uid: this.vestLogin.user_uid,
                  post_uid: post_uid,
                },
                this.vestLogin.token
              )
              .subscribe(
                (data: any) => {
                  this.model.hidespinner();
                  if (data.status == 1) {
                    this.popoverController.dismiss();
                    this.model.alertsuccess(data.message);
                    this.ngOnInit();
                  } else {
                    this.model.alerterror(data.message);
                  }
                },
                (err: any) => {
                  this.model.hidespinner();
                  this.model.alerterror('System generated errors');
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
  async presentAlert2(post_uid) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      subHeader: 'Are you sure, you want to remove this.',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.popoverController.dismiss();
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.model.showspinner();
            this.model
              .common_api(
                'user/remove-shared-post',
                {
                  user_uid: this.vestLogin.user_uid,
                  post_uid: post_uid,
                },
                this.vestLogin.token
              )
              .subscribe(
                (data: any) => {
                  this.model.hidespinner();
                  if (data.status == 1) {
                    this.popoverController.dismiss();
                    this.model.alertsuccess(data.message);
                    this.ngOnInit();
                  } else {
                    this.model.alerterror(data.message);
                  }
                },
                (err: any) => {
                  this.model.hidespinner();
                  this.model.alerterror('System generated errors');
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
  async removeRootComment(post_uid, comment_uid) {
    const alert = await this.alertController.create({
      header: 'Alert!',
      subHeader: 'Are you sure, you want to remove this.',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.popoverController.dismiss();
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.model.showspinner();
            this.model
              .common_api(
                'user/delete-comment',
                {
                  user_uid: this.vestLogin.user_uid,
                  post_uid: post_uid,
                  comment_uid: comment_uid,
                },
                this.vestLogin.token
              )
              .subscribe(
                (data: any) => {
                  this.model.hidespinner();
                  if (data.status == 1) {
                    this.popoverController.dismiss();
                    this.model.alertsuccess(data.message);
                    this.ngOnInit();
                  } else {
                    this.model.alerterror(data.message);
                  }
                },
                (err: any) => {
                  this.model.hidespinner();
                  this.model.alerterror('System generated errors');
                }
              );
          },
        },
      ],
    });

    await alert.present();
  }
  likeComment(item, post_uid, i) {
    this.model
      .common_api(
        'user/like-comment',
        {
          user_uid: this.vestLogin.user_uid,
          post_uid: post_uid,
          comment_uid: item.comment_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.postDetailsData.comments[i].total_like_count =
              data.total_likes;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  sublikeComment(item, post_uid, i, j) {
    this.model
      .common_api(
        'user/like-comment',
        {
          user_uid: this.vestLogin.user_uid,
          post_uid: post_uid,
          comment_uid: item.comment_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.postDetailsData.comments[i].child_comments[
              j
            ].total_like_count = data.total_likes;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  editMessage(item, i, post_uid) {
    this.model.showspinner();
    this.model
      .common_api(
        'user/edit-comment',
        {
          user_uid: this.vestLogin.user_uid,
          comment_uid: item.comment_uid,
          text: item.text,
          post_uid: post_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.postDetailsData.comments[i].isMessage = false;
            this.items[i].message = '';
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
  sendEditMessage(item, i, post_uid) {
    this.model.showspinner();
    this.model
      .common_api(
        'user/add-comment',
        {
          user_uid: this.vestLogin.user_uid,
          comment_uid: item.comment_uid,
          text: item.message,
          post_uid: post_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.postDetailsData.comments[i].isMessage = false;
            this.items[i].message = '';
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
  sendMessage(item, i) {
    this.model.showspinner();
    this.model
      .common_api(
        'user/add-comment',
        {
          user_uid: this.vestLogin.user_uid,
          comment_uid: '',
          text: item.message,
          post_uid: item.post_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.items[i].isMessage = false;
            this.items[i].message = '';
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
  sharePOst(item, i) {
    this.model.showspinner();
    this.model
      .common_api(
        'user/share-post',
        {
          user_uid: this.vestLogin.user_uid,
          share_text: item.message,
          post_uid: item.post_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
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
  removeItem(e) {
    this.items.splice(e.id, 1);
    this.router.navigateByUrl('/');
  }
  getAllPost() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/post-details',
        {
          // "user_uid":this.vestLogin.user_uid,
          post_uid: this.getpost_uid,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          this.items = [];
          if (data.status == 1) {
            this.items.push(data.data.post);
            this.profile_image_path = data.profile_img_path;
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
            const e = { post_uid: this.getpost_uid, i: 0 };
            this.postDetails(e);
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
  setOpenprivacy(isOpen, privacy) {
    this.privacy = privacy;
    this.popoverController.dismiss();
  }
  onsubmit() {
    if (this.htmlContent) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/edit-post',
          {
            user_uid: this.vestLogin.user_uid,
            text: this.htmlContent,
            file_name: this.file_name,
            file_type: this.file_type,
            post_uid: this.post_uid,
            privacy: this.privacy,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            //console.log(data);
            this.model.hidespinner();
            if (data.status == 1) {
              this.cancel();
              this.model.alertsuccess(data.message);
              this.ngOnInit();
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
      this.model.alerterror('Please insert text here.');
    }
  }
  cancel() {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }
  onWillDismiss() {
    this.isModalOpen = false;
  }
  uploadFile(e: any) {
    this.model.showspinner();
    this.isFileUpload = true;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    this.model.uploadFile(formData, this.vestLogin.token).subscribe(
      (data) => {
        this.model.hidespinner();
        this.isFileUpload = false;
        //console.log(data);
        if (data.status == 1) {
          this.file_name = data.filename;
          this.file_type = data.type;
        } else {
          this.model.alerterror(data.message);
        }
      },
      (err) => {
        this.model.hidespinner();
        this.isFileUpload = false;
        this.model.alerterror('System generated errors');
      }
    );
  }
  onSearchChange(e) {
    //console.log(e);
  }
  postDetails(e) {
    const post_uid = e.post_uid;
    const i = e.i;
    for (const key in this.items) {
      this.items[key].isMessage = false;
      this.items[key].isComment = false;
    }
    console.log(this.items[i].isMessage);
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
              console.log(this.postDetailsData);
              for (const key in this.postDetailsData.comments.length) {
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
              // const e = { post_uid: this.getpost_uid, i: 0 };
              // this.postDetails(e);
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
}
