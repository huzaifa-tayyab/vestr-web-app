import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { AlertController, PopoverController } from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  isMobile = false;
  public getScreenWidth: any;
  public getScreenHeight: any;
  segmentValue = 'recent';
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    var element = document.getElementById('header11');
    var element2 = document.getElementById('header31');
    if (this.getScreenWidth < 768) {
      this.isMobile = true;
      element.style.borderRight = 'solid 0.1px lightgray';
      element2.style.borderRight = 'solid 0.1px lightgray';
    } else {
      this.isMobile = false;
      // element.style.borderRight = 'none'
      // element2.style.borderRight = 'none'
      // element3.style.borderRight = 'none'
      // element3.style.borderLeft = 'none'
      // element4.style.borderRight = 'none'
    }
  }
  faAdd = faAdd;
  isHeaderOne = false;
  searchItem: any;
  public data = ['AAPL', 'MSFT', 'DKNG', 'PFE'];
  public results = [];
  userList: any = [];

  vestLogin: any;
  profile_image_path: any;
  message_file_path: any;
  currentUser?: any;
  userListMessage: any = [];
  isToggle = false;
  socket;
  userUID: any;
  constructor(
    private alertController: AlertController,
    public popoverController: PopoverController,
    public router: Router,
    public model: ModelService,
    public route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ionViewDidEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    localStorage.removeItem('newMessage');
    this.onWindowResize();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.userUID = params['id'];
        this.getUserList();
        if (this.socket) {
          this.socket.disconnect();
          this.socket = io(environment.SOCKET_ENDPOINT);
          this.setupSocketConnection();
        }
        if (!this.socket) {
          this.socket = io(environment.SOCKET_ENDPOINT);
          this.setupSocketConnection();
        }
      } else {
        this.getUserList();
        if (this.socket) {
          this.socket.disconnect();
          this.socket = io(environment.SOCKET_ENDPOINT);
          this.setupSocketConnection();
        }
        if (!this.socket) {
          this.socket = io(environment.SOCKET_ENDPOINT);
          this.setupSocketConnection();
        }
      }
    });
  }
  setupSocketConnection() {
    this.socket.on('chat_msg_to_client', (message) => {
      //console.log(message);
      this.userList.unshift(message);
      localStorage.removeItem('newMessage');
    });
  }
  ngOnInit() {}
  getUserList() {
    this.model
      .common_api(
        'user/message/user-list',
        {
          user_uid: this.vestLogin.user_uid,
          to_user_uid: this.vestLogin.user_uid,
          page: '0',
          size: '10',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.userList = data.data;
            this.profile_image_path = data.profile_image_path;
            this.message_file_path = data.message_file_path;
            if (this.userUID) {
              this.goToDetails({ user_uid: this.userUID });
              this.userUID = '';
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

  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.searchItem = event.target.value;
    this.model
      .common_api(
        'user/search',
        {
          user_uid: this.vestLogin.user_uid,
          keyword: query,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          if (data.status == 1) {
            this.results = data.data;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
    // this.results = this.data.filter(d => d.toLowerCase().indexOf(query) > -1);
  }
  goToDetails(item) {
    this.model
      .common_api(
        'user/message/to-user-details',
        {
          user_uid: this.vestLogin.user_uid,
          to_user_uid: item.user_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            const element1 = document.getElementById('chatdiv1');
            const element2 = document.getElementById('userheader1');
            const header2 = document.getElementById('header21');
            element1.style.display = 'block';
            element2.style.display = 'block';
            header2.style.borderBottom = '0.1px solid lightgray';
            this.currentUser = data.data;
            if (this.userList.length > 0) {
              const newData = this.userList.filter(
                (d) =>
                  d.user.user_uid
                    .toLowerCase()
                    .indexOf(data.data.user.user_uid) > -1
              );
              if (newData.length == 0) {
                this.userList.unshift(data.data);
              }
            } else {
              this.userList.unshift(data.data);
            }

            for (const i in this.userList) {
              if (i == '0') {
                this.userList[i].isSelected = true;
              } else {
                this.userList[i].isSelected = false;
              }
            }
            this.searchItem = '';
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  remoPop() {
    this.popoverController.dismiss();
  }
  async presentAlert(to_user_uid) {
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
                'user/message/delete-user-from-list',
                {
                  user_uid: this.vestLogin.user_uid,
                  to_user_uid: to_user_uid,
                },
                this.vestLogin.token
              )
              .subscribe(
                (data: any) => {
                  this.model.hidespinner();
                  if (data.status == 1) {
                    this.popoverController.dismiss();
                    this.model.alertsuccess(data.message);
                    window.location.reload();
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
  getUserListMeesage() {
    this.model
      .common_api(
        'user/message/list',
        {
          user_uid: this.vestLogin.user_uid,
          to_user_uid: this.currentUser.user.user_uid,
          page: '0',
          size: '10',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          if (data.status == 1) {
            this.profile_image_path = data.profile_image_path;
            this.message_file_path = data.message_file_path;
            this.userListMessage = data.data;
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  setHeaderClass2(item, i) {
    item.message_count = 0;
    setTimeout(() => {
      localStorage.setItem('messageCount', '1');
    }, 2000);

    this.currentUser = item;
    this.getUserListMeesage();
    if (this.isMobile) {
      if (!this.isHeaderOne) {
        this.isHeaderOne = true;
        var element = document.getElementById('header11');
        var element2 = document.getElementById('header21');
        element.classList.add('ion-hide-sm-down');
        element2.classList.remove('ion-hide-sm-down');
        element2.style.borderLeft = 'none';
        var element3 = document.getElementById('header31');
        var element4 = document.getElementById('header41');
        element3.classList.add('ion-hide-sm-down');
        element4.classList.remove('ion-hide-sm-down');
        element4.style.borderLeft = 'none';

        element2.style.borderRight = 'solid 0.1px lightgray';
        element2.style.borderLeft = 'solid 0.1px lightgray';
        element4.style.borderRight = 'solid 0.1px lightgray';
        element4.style.borderLeft = 'solid 0.1px lightgray';

        const elementn1 = document.getElementById('chatdiv1');
        const elementn2 = document.getElementById('userheader1');
        const headern2 = document.getElementById('header21');
        elementn1.style.display = 'block';
        elementn2.style.display = 'block';
        headern2.style.borderBottom = '0.1px solid #B3B3B3';
        this.currentUser = item;
      } else {
        this.isHeaderOne = false;
        var element = document.getElementById('header11');
        var element2 = document.getElementById('header21');
        element.classList.remove('ion-hide-sm-down');
        element2.classList.add('ion-hide-sm-down');
        element2.style.borderLeft = 'border: 0.1px solid #B3B3B3';

        var element3 = document.getElementById('header31');
        var element4 = document.getElementById('header41');
        element3.classList.remove('ion-hide-sm-down');
        element4.classList.add('ion-hide-sm-down');
        element4.style.borderLeft = 'border: 0.1px solid #B3B3B3';

        const elementn1 = document.getElementById('chatdiv1');
        const elementn2 = document.getElementById('userheader1');
        const headern2 = document.getElementById('header21');
        elementn1.style.display = 'block';
        elementn2.style.display = 'block';
        headern2.style.borderBottom = '0.1px solid #B3B3B3';
        this.currentUser = item;
      }
    } else {
      if (!this.userList[i].isSelected) {
        for (const key in this.userList) {
          this.userList[key].isSelected = false;
        }
        this.userList[i].isSelected = true;
        const element1 = document.getElementById('chatdiv1');
        const element2 = document.getElementById('userheader1');
        const header2 = document.getElementById('header21');
        const header3 = document.getElementById('header41');
        element1.style.display = 'block';
        element2.style.display = 'block';
        header2.style.borderBottom = '0.1px solid lightgray';
        header2.style.borderRight = '0.1px solid lightgray';
        header3.style.borderRight = '0.1px solid lightgray';
        this.currentUser = item;
      } else {
        this.userList[i].isSelected = false;
        for (const key in this.userList) {
          this.userList[key].isSelected = false;
        }
        const element1 = document.getElementById('chatdiv1');
        const element2 = document.getElementById('userheader1');
        const header2 = document.getElementById('header21');
        const header3 = document.getElementById('header41');
        element1.style.display = 'none';
        element2.style.display = 'none';
        header2.style.borderBottom = 'none';
        header2.style.borderRight = 'none';
        header3.style.borderRight = 'none';
        this.currentUser = item;
      }
    }
  }
  setHeaderClass() {
    if (this.isMobile) {
      if (!this.isHeaderOne) {
        this.isHeaderOne = true;
        var element = document.getElementById('header11');
        var element2 = document.getElementById('header21');
        element.classList.add('ion-hide-sm-down');
        element2.classList.remove('ion-hide-sm-down');
        element2.style.borderLeft = 'none';
        var element3 = document.getElementById('header31');
        var element4 = document.getElementById('header41');
        element3.classList.add('ion-hide-sm-down');
        element4.classList.remove('ion-hide-sm-down');
        element4.style.borderLeft = 'none';
      } else {
        this.isHeaderOne = false;
        var element = document.getElementById('header11');
        var element2 = document.getElementById('header21');
        element.classList.remove('ion-hide-sm-down');
        element2.classList.add('ion-hide-sm-down');
        element2.style.borderLeft = 'border: 0.1px solid #B3B3B3';

        var element3 = document.getElementById('header31');
        var element4 = document.getElementById('header41');
        element3.classList.remove('ion-hide-sm-down');
        element4.classList.add('ion-hide-sm-down');
        element4.style.borderLeft = 'border: 0.1px solid #B3B3B3';
      }
    }
  }
}
