import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import {
  AlertController,
  IonModal,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.page.html',
  styleUrls: ['./rooms.page.scss'],
})
export class RoomsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  segmentValue = 'hot';
  roomDetails: any = [];
  index: any;
  isMobile = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  isShowMore = false;
  sort_by = 'recent';
  roomPath: any;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    var element = document.getElementById('header1');
    var element2 = document.getElementById('header3');
    var element3 = document.getElementById('header2');
    var element4 = document.getElementById('header4');
    if (this.getScreenWidth < 768) {
      this.isMobile = true;
      element3.style.display = 'block';
      element4.style.display = 'block';
      element.style.borderRight = 'none';
      element2.style.borderRight = 'none';
      element.style.borderRight = 'solid 0.1px lightgray';
      element2.style.borderRight = 'solid 0.1px lightgray';
    } else {
      this.isMobile = false;
      element3.style.display = 'none';
      element4.style.display = 'none';
      element.style.borderRight = '0.1px solid rgb(179, 179, 179);';
      element2.style.borderRight = '0.1px solid rgb(179, 179, 179);';
    }
  }
  faAdd = faAdd;
  isHeaderOne = false;
  vestLogin: any;
  profile_image_path: any;
  room_image_path: any;
  items: any = [];
  isSelected = false;
  itemsDetails: any = [];
  room_post_path: any;
  url: any = environment.url;
  seeUser = false;
  currentRoomUid: any;
  privacy: any = '';
  is_joined: any = 0;
  currentUserid: any;
  todaysPost: any = [];
  constructor(
    private alertController: AlertController,
    public popoverController: PopoverController,
    public model: ModelService,
    private toastController: ToastController,
    public route: ActivatedRoute,
    public router: Router,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ionViewDidEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.onWindowResize();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        localStorage.setItem('tem_room', params['id']);
        this.checkRoomDetails(params['id']);
      } else {
        this.getRoomList();
      }
    });
  }
  checkRoomDetails(room_uid) {
    this.model
      .common_api(
        'user/room/details',
        {
          user_uid: this.vestLogin?.user_uid,
          room_uid: room_uid,
          sort_by: this.sort_by,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            if (data.is_joined == 1) {
              this.getJoinRoomList();
            }
            if (data.is_joined == 0) {
              this.getRoomList();
            }
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  ngOnInit() {}
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  copyMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.presentToast(this.roomPath);
  }
  async presentToast(e) {
    const toast = await this.toastController.create({
      message: 'Copy ' + e,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  setVote(rp_uid, type, item, i) {
    this.model
      .common_api(
        'user/room/post-vote',
        {
          user_uid: this.vestLogin?.user_uid,
          room_uid: this.currentRoomUid,
          post_uid: rp_uid,
          vote_type: type,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          if (data.status == 1) {
            this.roomDetails[i].total_up_vote = data.up_vote;
            this.roomDetails[i].total_down_vote = data.down_vote;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  async removeUser(post_uid, i) {
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
                'user/room/delete-post',
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
                    this.roomDetails.splice(i, 1);
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
  setOpen(uid) {
    this.popoverController.dismiss();
    this.router.navigateByUrl('/app/create-room/' + uid);
    this.cancel();
  }
  getJoinRoomList() {
    this.items = [];
    this.segmentValue = 'joined';
    this.model
      .common_api(
        'user/room/joined-rooms',
        { user_uid: this.vestLogin.user_uid },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.items = [];
          this.model.hidespinner();
          if (data.status == 1) {
            this.profile_image_path = data.profile_image_path;
            this.room_image_path = data.room_image_path;
            this.room_post_path = data.room_post_path;
            this.items = data.data;
            for (const key in this.items) {
              this.items[key].isSelected = false;
            }
            const tem_room = localStorage.getItem('tem_room');
            if (tem_room) {
              console.log('object');
              for (const key in this.items) {
                if (tem_room == this.items[key].room.room_uid) {
                  this.setHeaderClass2(
                    key,
                    this.items[key].room.room_uid,
                    this.items[key].room.user.user_uid
                  );
                  localStorage.removeItem('tem_room');
                }
              }
            }
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  getRoomList() {
    this.items = [];
    var token = '';
    if (this.vestLogin) {
      token = this.vestLogin.token;
    } else {
      token = 'am9obkBleGFtcGxlLmNvbTphYmMxMjM';
    }
    this.segmentValue = 'hot';
    this.model
      .common_api(
        'user/room/popular-rooms',
        {
          user_uid: this.vestLogin?.user_uid,
        },
        token
      )
      .subscribe(
        (data: any) => {
          console.log(data);

          this.model.hidespinner();
          if (data.status == 1) {
            this.profile_image_path = data.profile_image_path;
            this.room_image_path = data.room_image_path;
            this.room_post_path = data.room_post_path;
            this.items = data.data;
            for (const key in this.items) {
              this.items[key].isSelected = false;
            }
            const tem_room = localStorage.getItem('tem_room');
            if (tem_room) {
              for (const key in this.items) {
                if (tem_room == this.items[key].room_uid) {
                  this.setHeaderClass2(key, this.items[key].room_uid, '');
                  localStorage.removeItem('tem_room');
                }
              }
            }
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  setOpen1(isOpen: boolean) {
    this.isShowMore = isOpen;
  }
  cancel() {
    this.isShowMore = false;
    this.modal.dismiss(null, 'cancel');
  }
  async presentAlert(room_uid) {
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
                'user/room/update-status',
                {
                  user_uid: this.vestLogin.user_uid,
                  room_uid: room_uid,
                  action: 'delete',
                },
                this.vestLogin.token
              )
              .subscribe(
                (data: any) => {
                  this.model.hidespinner();
                  if (data.status == 1) {
                    this.popoverController.dismiss();
                    this.model.alertsuccess(data.message);
                    this.ionViewDidEnter();
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
  remoPop() {
    this.popoverController.dismiss();
  }

  setHeaderClass() {
    if (this.isMobile) {
      if (!this.isHeaderOne) {
        this.isHeaderOne = true;
        var element = document.getElementById('header1');
        var element2 = document.getElementById('header2');
        element.classList.add('ion-hide-sm-down');
        element2.classList.remove('ion-hide-sm-down');
        var element3 = document.getElementById('header3');
        var element4 = document.getElementById('header4');
        element3.classList.add('ion-hide-sm-down');
        element4.classList.remove('ion-hide-sm-down');
      } else {
        this.isHeaderOne = false;
        var element = document.getElementById('header1');
        var element2 = document.getElementById('header2');
        element.classList.remove('ion-hide-sm-down');
        element2.classList.add('ion-hide-sm-down');

        var element3 = document.getElementById('header3');
        var element4 = document.getElementById('header4');
        element3.classList.remove('ion-hide-sm-down');
        element4.classList.add('ion-hide-sm-down');
      }
    }
  }
  setHeaderClass2(i, room_uid, user_uid) {
    this.currentRoomUid = room_uid;
    this.currentUserid = user_uid;
    this.index = i;
    if (this.isMobile) {
      if (!this.isHeaderOne) {
        this.model
          .common_api(
            'user/room/details',
            {
              user_uid: this.vestLogin?.user_uid,
              room_uid: room_uid,
              sort_by: this.sort_by,
            },
            'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
          )
          .subscribe(
            (data: any) => {
              console.log(data);
              this.model.hidespinner();
              if (data.status == 1) {
                this.itemsDetails = data.data;
                if (this.vestLogin) {
                  this.roomPath =
                    window.location.origin +
                    '/home/rooms/' +
                    this.itemsDetails.room_uid;
                } else {
                  this.roomPath =
                    window.location.origin +
                    '/home/rooms/' +
                    this.itemsDetails.room_uid;
                }
                this.roomDetails = data.data.room_post;
                this.is_joined = data.is_joined;
                this.isHeaderOne = true;
                var element = document.getElementById('header1');
                var element2 = document.getElementById('header2');
                element.classList.add('ion-hide-sm-down');
                element2.classList.remove('ion-hide-sm-down');
                var element3 = document.getElementById('header3');
                var element4 = document.getElementById('header4');
                element3.classList.add('ion-hide-sm-down');
                element4.classList.remove('ion-hide-sm-down');
                element4.style.borderLeft = 'solid 0.1px lightgray';
              }
            },
            (err: any) => {
              this.model.hidespinner();
              this.model.presentAlert('System generated errors', 'Error');
            }
          );
      } else {
        this.isHeaderOne = false;
        var element = document.getElementById('header1');
        var element2 = document.getElementById('header2');
        element.classList.remove('ion-hide-sm-down');
        element2.classList.add('ion-hide-sm-down');

        var element3 = document.getElementById('header3');
        var element4 = document.getElementById('header4');
        element3.classList.remove('ion-hide-sm-down');
        element4.classList.add('ion-hide-sm-down');
      }
    } else {
      this.checkRooms(i, room_uid);
    }
  }
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  checkRooms(i, room_uid) {
    this.model
      .common_api(
        'user/room/details',
        {
          room_uid: room_uid,
          user_uid: this.vestLogin?.user_uid,
          sort_by: this.sort_by,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.model.hidespinner();
          this.todaysPost = [];
          if (data.status == 1) {
            this.itemsDetails = data.data;
            if (this.vestLogin) {
              this.roomPath =
                window.location.origin +
                '/home/rooms/' +
                this.itemsDetails.room_uid;
            } else {
              this.roomPath =
                window.location.origin +
                '/home/rooms/' +
                this.itemsDetails.room_uid;
            }

            this.roomDetails = data.data.room_post;
            this.is_joined = data.is_joined;
            var element3 = document.getElementById('header2');
            var element4 = document.getElementById('header4');
            if (this.items[i].isSelected) {
              element3.style.display = 'none';
              element4.style.display = 'none';
              for (const key in this.items) {
                this.items[key].isSelected = false;
              }
            } else {
              for (const key in this.items) {
                this.items[key].isSelected = false;
              }
              this.items[i].isSelected = true;
              element3.style.display = 'block';
              element4.style.display = 'block';
            }
            var d = new Date();
            // d.setDate(d.getDate() - 2);
            const newDate = this.formatDate(d);
            //console.log(newDate);
            for (let index = 0; i < this.roomDetails.length; i++) {
              const tempDate = this.formatDate(
                this.roomDetails[index].modified_date
              );
              //console.log(tempDate);
              if (newDate == tempDate) {
                this.todaysPost.push(this.roomDetails[index]);
              }
            }
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  checkRooms1(room_uid) {
    this.model
      .common_api(
        'user/room/details',
        {
          room_uid: room_uid,
          user_uid: this.vestLogin?.user_uid,
          sort_by: this.sort_by,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.itemsDetails = data.data;
            if (this.vestLogin) {
              this.roomPath =
                window.location.origin +
                '/home/rooms/' +
                this.itemsDetails.room_uid;
            } else {
              this.roomPath =
                window.location.origin +
                '/home/rooms/' +
                this.itemsDetails.room_uid;
            }
            this.is_joined = data.is_joined;
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  joinRoom(room_uid) {
    //console.log(room_uid);
    if (this.vestLogin) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/room/join',
          {
            user_uid: this.vestLogin.user_uid,
            room_uid: room_uid,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.model.hidespinner();
            //console.log(data);
            this.checkRooms1(room_uid);
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
      subHeader: 'Login or Signup to explore more',
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
}
