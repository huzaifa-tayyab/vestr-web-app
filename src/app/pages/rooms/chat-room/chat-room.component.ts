import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonContent,
  IonModal,
  PopoverController,
} from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatRoomComponent implements OnInit {
  @Input() sort_by: any;
  @Input() is_joined: any;
  @Input() getScreenHeight: any;
  @Input() currentUserid: any;
  @Input() currentRoomUid: any;
  @Input() roomDetails: any = [];
  @Input() room_post_path: any;
  @Input() room_uid: any;
  @Input() profile_image_path: any;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(IonContent) content: IonContent;
  socket;
  url: any = environment.url;
  filter_date = 'today';
  htmlContent = '';
  isFileUpload = false;
  file_name: any = '';
  file_type: any = '';
  isModalOpen = false;
  privacy: any = '';
  vestLogin: any;
  constructor(
    private alertController: AlertController,
    public popoverController: PopoverController,
    public model: ModelService,
    public route: ActivatedRoute,
    public router: Router
  ) {}
  getFeedData(e) {
    this.checkRooms1();
  }
  checkRooms1() {
    this.model
      .common_api(
        'user/room/details',
        {
          room_uid: this.room_uid,
          user_uid: this.vestLogin?.user_uid,
          sort_by: this.sort_by,
          filter_date: this.filter_date,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.roomDetails = [];
          console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.roomDetails = data.data.room_post;
            this.is_joined = data.is_joined;
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
  ngOnChanges(): void {
    const chatID = localStorage.getItem('currentRoomID');
    if (chatID) {
      if (this.currentRoomUid !== chatID) {
        this.ngOnInit();
        localStorage.setItem('currentChatID', this.currentRoomUid);
      }
    } else {
      this.ngOnInit();
      localStorage.setItem('currentChatID', this.currentRoomUid);
    }
  }
  cancel() {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
  }
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    if (this.socket) {
      this.socket.disconnect();
      this.socket = io(environment.SOCKET_ENDPOINT);
      if (this.vestLogin) {
        this.setupSocketConnection();
      }
    }
    // this.roomDetails = []
    if (!this.socket) {
      this.socket = io(environment.SOCKET_ENDPOINT);
      if (this.vestLogin) {
        this.setupSocketConnection();
      }
    }
    // this.socket = io(environment.SOCKET_ENDPOINT);
    // if(this.currentRoomUid){
    //   this.socket.disconnect()
    //   this.socket = io(environment.SOCKET_ENDPOINT);
    // }
    setTimeout(() => {
      this.content.scrollToTop(200);
    }, 1000);
  }
  setupSocketConnection() {
    this.socket.emit('join_room', {
      user_uid: this.vestLogin.user_uid,
      room_uid: this.currentRoomUid,
    });
    this.socket.on('msg_to_client', (message) => {
      if (this.currentRoomUid == message.data.room_uid) {
        //console.log(message);
        this.roomDetails.unshift(message.data);
        setTimeout(() => {
          this.content.scrollToTop(200);
        }, 1000);
      }
    });
  }
  setOpen1(isOpen: boolean) {
    this.htmlContent = '';
    this.file_name = '';
    this.file_type = '';
    this.isModalOpen = isOpen;
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
  onsubmit() {
    if (this.htmlContent) {
      this.socket.emit('msg_to_server', {
        room_uid: this.currentRoomUid,
        user_uid: this.vestLogin.user_uid,
        message: this.htmlContent,
        type: this.file_type,
        filename: this.file_name,
      });
      this.htmlContent = '';
      this.file_name = '';
      this.file_type = '';
    } else {
      this.model.alerterror('Please insert text here.');
    }
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
  async presentAlert(post_uid, i) {
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
}
