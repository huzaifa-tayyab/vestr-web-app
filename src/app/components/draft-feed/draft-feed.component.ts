import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { ModelService } from 'src/app/services/model.service';
import { AlertController, IonModal, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { QuillEditorComponent } from 'ngx-quill';
import { debounceTime } from 'rxjs';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-draft-feed',
  templateUrl: './draft-feed.component.html',
  styleUrls: ['./draft-feed.component.scss'],
})
export class DraftFeedComponent implements OnInit {
  @ViewChild('popover') popover;
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;
  isPosted = false;
  isOpen = false;

  @Input() item: any;
  @Input() index: any;
  @Input() profile_image_path: any;
  @Input() vestLogin: any;
  @Input() file_path: any;
  @Input() postDetailsData: any;
  @Input() readmore: boolean;
  @Output() postDetails = new EventEmitter<any>();
  @Output() setVote = new EventEmitter<any>();
  @Output() removeItem = new EventEmitter<any>();

  @ViewChild(IonModal) modal: IonModal;

  faThumbsUp = faThumbsUp;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faRetweet = faRetweet;
  faComment = faComment;

  darktheme = false;
  isModalOpen = false;
  isModalOpen2 = false;
  privacy: any = 'public';
  post_uid: any;
  htmlContent = '';
  isFileUpload = false;
  file_name: any = '';
  file_type: any = '';
  share_text: any = '';
  sharePostDetails: any;
  isShareEdit = false;
  massTimingsHtml: any;
  minDate: any;
  maxDate: any;
  constructor(
    private alertController: AlertController,
    public popoverController: PopoverController,
    public model: ModelService,
    private domSanitizer: DomSanitizer,
    public router: Router
  ) {
    this.minDate = new Date().toISOString();
    const maxD = new Date();
    this.maxDate = maxD.setMonth(maxD.getMonth() + 1);
    this.maxDate = new Date(this.maxDate).toISOString();
    setInterval(() => {
      this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
      // //console.log(this.vestLogin)
    }, 500);
  }

  goDetailsPost(uid, useruid, type, e) {
    e.stopPropagation();
    console.log(uid);
    if (type == 'profile') {
      this.goDetailsProfile(useruid);
    }
    if (type == 'setopen') {
      this.presentPopover(e);
    }
    if (type == 'post') {
      if (this.vestLogin) {
        this.router.navigateByUrl('/app/post-detail/' + uid);
      } else {
        this.router.navigateByUrl('/home/post-detail/' + uid);
      }
    }
  }
  goDetailsProfile(uid) {
    if (this.vestLogin) {
      this.router.navigateByUrl('/app/profile/' + uid);
    } else {
      this.router.navigateByUrl('/home/profile/' + uid);
      // this.presentAlertLogin();
    }
  }

  ngOnInit() {
    setInterval(() => {
      this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
      // //console.log(this.vestLogin)
      const theme = localStorage.getItem('user-theme');
      //console.log(theme);
      if (theme) {
        if (theme === 'dark') {
          this.darktheme = true;
        } else {
          this.darktheme = false;
        }
      } else {
        this.darktheme = false;
      }
    }, 500);
    this.changeUserText();
  }
  isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
  getInnerHTMLValue() {
    return this.domSanitizer.bypassSecurityTrustHtml(this.item.text);
  }
  changeUserText() {
    var stocks = this.item.text.match(/\$\w+/g);
    var allstocks = [];
    if (stocks) {
      allstocks = stocks.map((x) => x.substr(1));
    }

    for (let index = 0; index < allstocks.length; index++) {
      if (!this.isNumeric(allstocks[index])) {
        // console.log(allstocks);
        if (this.vestLogin) {
          this.item.text = this.item.text.replaceAll(
            '$' + allstocks[index],
            "<a href='" +
              window.location.origin +
              '/app/market-detail/' +
              allstocks[index] +
              "' target='_self'>$" +
              allstocks[index] +
              '</a>'
          );
        } else {
          this.item.text = this.item.text.replaceAll(
            '$' + allstocks[index],
            "<a href='" +
              window.location.origin +
              '/home/market-detail/' +
              allstocks[index] +
              "' target='_self'>$" +
              allstocks[index] +
              '</a>'
          );
        }
      }
    }
    // end stocks in text show

    // start rooms in text show
    var room = this.item.text.match(/\/r\w+/g);
    var rooms = [];
    if (room) {
      rooms = room.map((x) => x.substr(2));
    }
    for (let index = 0; index < rooms.length; index++) {
      this.model
        .common_api(
          'user/room/details-by-username',
          {
            room_name: rooms[index],
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe(
          (data: any) => {
            if (data.status == 1) {
              console.log(data);
              if (this.vestLogin) {
                this.item.text = this.item.text.replaceAll(
                  '/r' + rooms[index],
                  "<a href='" +
                    window.location.origin +
                    '/app/rooms/' +
                    data.data.room_uid +
                    "' target='_self'>/r" +
                    rooms[index] +
                    '</a>'
                );
              } else {
                this.item.text = this.item.text.replaceAll(
                  '/r' + rooms[index],
                  "<a href='" +
                    window.location.origin +
                    '/home/rooms/' +
                    data.data.room_uid +
                    "' target='_self'>/r" +
                    rooms[index] +
                    '</a>'
                );
              }
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    }
    // end rooms in text show

    // start username in text show
    var arr = this.item.text.match(/@\w+/g);
    var usernames = [];
    if (arr) {
      usernames = arr.map((x) => x.substr(1));
    }
    for (let index = 0; index < usernames.length; index++) {
      this.model
        .common_api(
          'user/get-user-profile-by-username',
          {
            username: usernames[index],
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe(
          (data: any) => {
            if (data.status == 1) {
              // console.log(data);
              if (this.vestLogin) {
                this.item.text = this.item.text.replaceAll(
                  '@' + usernames[index],
                  "<a href='" +
                    window.location.origin +
                    '/app/profile/' +
                    data.data.user_uid +
                    "' target='_self'>@" +
                    usernames[index] +
                    '</a>'
                );
              } else {
                this.item.text = this.item.text.replaceAll(
                  '@' + usernames[index],
                  "<a href='" +
                    window.location.origin +
                    '/home/profile/' +
                    data.data.user_uid +
                    "' target='_self'>@" +
                    usernames[index] +
                    '</a>'
                );
              }
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    }
    // end username in text show
    setTimeout(() => {
      this.item.text = this.getInnerHTMLValue();
    }, 2000);
  }
  userCommentVote(post, index, vote_type) {
    console.log(post);

    this.model
      .common_api(
        'user/vote-comment',
        {
          user_uid: this.vestLogin?.user_uid,
          post_uid: this.postDetailsData.post.post_uid,
          comment_uid: post.comment_uid,
          vote_type: vote_type,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            console.log(data);
            post.total_up_vote = data.up_vote;
            post.total_down_vote = data.down_vote;
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
  async presentAlert(post_uid, i, e) {
    e.stopPropagation();
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
            this.model
              .common_api(
                'user/delete-draft-post',
                {
                  user_uid: this.vestLogin.user_uid,
                  post_uid: post_uid,
                },
                this.vestLogin.token
              )
              .subscribe(
                (data: any) => {
                  // this.model.hidespinner();
                  if (data.status == 1) {
                    this.popoverController.dismiss();
                    this.model.alertsuccess(data.message);
                    this.removeItem.emit({ id: i });
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
  async presentAlert2(post_uid, i) {
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
                    this.removeItem.emit({ id: i });
                    // window.location.reload();
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
  openShareModal(item) {
    this.sharePostDetails = item;
    this.isModalOpen2 = true;
  }
  openShareModal2(item, e) {
    console.log(item.text);
    e.stopPropagation();
    console.log(item);
    this.isShareEdit = true;
    if (item.privacy) {
      this.privacy = item.privacy;
    }

    this.htmlContent = item.text.changingThisBreaksApplicationSecurity;
    this.post_uid = item.post_uid;
    this.share_text = item.share_text;
    this.sharePostDetails = item;
    this.isModalOpen2 = true;
    this.popoverController.dismiss();
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  sharePost() {
    // this.model.showspinner();
    if (this.isShareEdit) {
      this.htmlContent = this.share_text;
      this.onsubmit('live');
    } else {
      this.isPosted = true;
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
            this.isPosted = false;
            this.model.hidespinner();
            if (data.status == 1) {
              this.model.alertsuccess(data.message);
              this.isModalOpen2 = false;
              if (this.isShareEdit) {
                this.item = data.data;
                this.item.isMessage = false;
                this.item.isComment = false;
                this.item.message = '';
                if (this.item.post_votes.length == 0) {
                  this.item.post_votes.push({ vote_type: 0 });
                }
                this.isShareEdit = false;
              } else {
                localStorage.setItem('setindex', '0');
                localStorage.setItem('isLoadPost', JSON.stringify(data.data));
              }

              // window.location.reload();
            } else {
              this.model.alerterror(data.message);
            }
          },
          (err: any) => {
            this.isPosted = false;
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    }
  }
  onsubmit(action) {
    if (this.htmlContent) {
      this.isPosted = true;
      var content = this.htmlContent.replace(/temp/g, 'post/images');
      if (this.privacy == 'Select privacy') {
        this.privacy = '';
      }
      // this.model.showspinner();
      this.model
        .common_api(
          'user/edit-draft-post',
          {
            user_uid: this.vestLogin.user_uid,
            text: content,
            file_name: this.file_name,
            file_type: this.file_type,
            share_text: this.share_text,
            post_uid: this.post_uid,
            privacy: this.privacy,
            save_as: action,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.isPosted = false;
            //console.log(data);
            this.model.hidespinner();
            if (data.status == 1) {
              this.htmlContent = '';
              this.isModalOpen = false;
              this.modal.dismiss(null, 'cancel');
              setTimeout(() => {
                this.htmlContent = '*';
              }, 1000);
              this.model.alertsuccess(data.message);
              this.item = data.data;
              this.item.isMessage = false;
              this.item.isComment = false;
              this.item.message = '';
              // if (this.item.post_votes.length == 0) {
              //   this.item.post_votes.push({ vote_type: 0 });
              // }
              this.isModalOpen2 = false;
              this.changeUserText();
              // localStorage.setItem("isLoadPost", JSON.stringify(data.data));
              // this.ngOnInit();
            } else {
              this.model.alerterror(data.message);
            }
          },
          (err: any) => {
            this.isPosted = false;
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.model.alerterror('Please insert text here.');
    }
  }
  openImages(e: any, type, name) {
    e.stopPropagation();
    window.open(this.file_path + type + 's/' + name, '_blank');
  }
  uploadFile(e: any) {
    if (e.target.files[0].size / 1024 / 1024 < 1) {
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
    } else {
      this.model.alerterror('Please upload image less than 1MB');
    }
  }
  setOpenprivacy(isOpen, privacy) {
    this.privacy = privacy;
    this.popoverController.dismiss();
  }
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  cancel() {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }
  onWillDismiss() {
    this.isModalOpen = false;
  }
  onWillDismiss2() {
    this.isModalOpen2 = false;
  }
  editorInstance: any;
  setFocus(e, editor) {
    this.editorInstance = e;
    let toolbar = e.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
    editor.quillEditor.focus();
  }
  imageHandler() {
    let data: any = this.editorInstance;
    if (this.editorInstance != null) {
      let range = this.editorInstance.getSelection();
      if (range != null) {
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', () => {
          if (input.files != null) {
            let file = input.files[0];
            if (file != null) {
              let dataFile = new FormData();
              dataFile.append('file', file);

              let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function () {
                if (reader.readyState == 2) {
                  let base64result = reader.result;
                  // data.insertEmbed(range.index, "image", reader.result);
                  // console.log(reader.result);
                }
              };
              this.isFileUpload = true;
              this.model.uploadFile(dataFile, this.vestLogin.token).subscribe(
                (data1) => {
                  this.model.hidespinner();
                  this.isFileUpload = false;
                  console.log(data1);
                  if (data1.status == 1) {
                    this.file_name += data1.filename + ',';
                    console.log(this.file_name);
                    this.file_type = data1.type;
                    data.insertEmbed(
                      range.index,
                      'image',
                      'https://vestr.io/api/uploads/temp/' + data1.filename
                    );
                  } else {
                    this.model.alerterror(data1.message);
                  }
                },
                (err) => {
                  this.model.hidespinner();
                  this.isFileUpload = false;
                  this.model.alerterror('System generated errors');
                }
              );
            }
          }
        });
        input.click();
      }
    }
  }
  setOpen(value: boolean, post_uid, text, privacy, e) {
    e.stopPropagation();
    if (privacy) {
      this.privacy = privacy;
    }

    this.popoverController.dismiss();
    // this.isModalOpen = value;
    this.htmlContent = text.changingThisBreaksApplicationSecurity;
    localStorage.setItem('editpost', JSON.stringify(this.htmlContent));
    this.post_uid = post_uid;
    this.router.navigateByUrl('/app/add-post/draft/' + post_uid);
  }
  postDetailsChild(post_uid, i) {
    this.postDetails.emit({ post_uid, i });
  }

  capitalizeFirstLetter(str) {
    const arr = str.split(' ');

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    return arr.join(' ');
  }
  setVoteChild(post_uid, type, item, i, type2) {
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
            this.item.total_up_vote = data.up_vote;
            this.item.total_down_vote = data.down_vote;
            if (type2 == 'up') {
              this.item.post_votes[0].vote_type = 1;
            }
            if (type2 == 'down') {
              this.item.post_votes[0].vote_type = 2;
            }
            if (type2 == 'demo') {
              this.item.post_votes[0].vote_type = 0;
            }
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
    // this.setVote.emit({post_uid, type, item, index});
  }
  setCommentOpen(post) {
    post.isMessage = true;
    this.popoverController.dismiss();
  }
  async removeRootComment(post_uid, comment_uid, post, index) {
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
                    post.splice(index, 1);
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
            this.item.message = '';
            this.postDetails.emit({ post_uid, i });
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
  cancelEditMessage(post) {
    post.isMessage = false;
  }
  cancelEditMessage2(post) {
    post.isNewMessage = false;
  }
  setNewCommentOpen(post) {
    post.isNewMessage = true;
    post.isNewComment = true;
  }
  setNewCommentOpen2(subpost, i) {
    console.log(subpost);
    // return;
    subpost.isNewMessage = true;
    subpost.isNewComment = true;
  }
  setChildCommentOpen(i, j) {
    this.postDetailsData.comments[i].child_comments[j].isMessage = true;
    this.popoverController.dismiss();
  }
  cancelEditMessage3(i, j) {
    this.postDetailsData.comments[i].child_comments[j].isMessage = false;
  }
  setSubChildCommentOpen(i, j, l) {
    this.postDetailsData.comments[i].child_comments[j].comments[l].isMessage =
      true;
    this.popoverController.dismiss();
  }
  cancelSubEditMessage3(i, j, l) {
    this.postDetailsData.comments[i].child_comments[j].comments[l].isMessage =
      false;
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
            this.item.message = '';
            this.postDetails.emit({ post_uid, i });
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
  sendMessage(item, index) {
    if (this.vestLogin) {
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
              item.message = '';
              const post_uid = item.post_uid;
              const i = 0;
              this.postDetails.emit({ post_uid, i });
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
  formatDate(value: any) {
    this.popoverController.dismiss();
    console.log(format(parseISO(value), 'yyyy-MM-dd'));
  }
}
