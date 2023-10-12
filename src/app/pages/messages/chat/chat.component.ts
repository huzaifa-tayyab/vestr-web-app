import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  InfiniteScrollCustomEvent,
  IonContent,
  PopoverController,
} from "@ionic/angular";
import { io } from "socket.io-client";
import { ModelService } from "src/app/services/model.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class ChatComponent implements OnInit {
  @Input() currentUser: any;
  socket;
  @Input() profile_image_path: any;
  @ViewChild(IonContent) content: IonContent;
  isMobile = false;
  text: any;
  public getScreenWidth: any;
  public getScreenHeight: any;
  items: any = [];
  @Input() userListMessage: any = [];
  @HostListener("window:resize", ["$event"])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.getScreenHeight = window.innerHeight;
    var element = document.getElementById("footer");
    if (this.getScreenWidth < 765) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
      element.style.marginLeft = "0px";
    }
  }

  connection: any;
  vestLogin: any;
  message_file_path: any;
  page = 0;
  constructor(
    public model: ModelService,
    public popoverController: PopoverController
  ) {}
  remoPop() {
    this.popoverController.dismiss();
  }
  onIonInfinite(ev) {
    //console.log(ev);
    this.getUserListMeesage();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  async presentAlert(message_uid) {
    this.model.showspinner();
    this.model
      .common_api(
        "user/message/delete-message",
        {
          user_uid: this.vestLogin.user_uid,
          message_uid: message_uid,
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
          this.model.alerterror("System generated errors");
        }
      );
  }
  getUserListMeesage() {
    this.page += 1;
    this.model
      .common_api(
        "user/message/list",
        {
          user_uid: this.vestLogin.user_uid,
          to_user_uid: this.currentUser.user.user_uid,
          page: this.page,
          size: "10",
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          if (data.status == 1) {
            for (const key in data.data) {
              this.userListMessage.unshift(data.data[key]);
            }
            setTimeout(() => {
              this.content.scrollToBottom(200);
            }, 500);
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror("System generated errors");
        }
      );
  }
  ngOnChanges(): void {
    //console.log('object');
    localStorage.removeItem("newMessage");
    const chatID = localStorage.getItem("currentChatID");
    if (chatID) {
      if (this.currentUser.user.user_uid !== chatID) {
        localStorage.setItem("currentChatID", this.currentUser.user.user_uid);
        this.ngOnInit();
      }
    } else {
      localStorage.setItem("currentChatID", this.currentUser.user.user_uid);
      this.ngOnInit();
    }
  }
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem("vest_login"));
    this.onWindowResize();
    //console.log(this.profile_image_path);
    // this.socket = io(environment.SOCKET_ENDPOINT);
    if (this.socket) {
      this.socket.disconnect();
      this.socket = io(environment.SOCKET_ENDPOINT);
      this.setupSocketConnection();
    }
    this.userListMessage = [];
    if (!this.socket) {
      this.socket = io(environment.SOCKET_ENDPOINT);
      this.setupSocketConnection();
    }

    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 1000);
  }

  setupSocketConnection() {
    this.socket.emit("join_personal_chat", {
      to_user_uid: this.currentUser.user.user_uid,
      user_uid: this.vestLogin.user_uid,
    });
    this.socket.on("chat_msg_to_client", (message) => {
      //console.log(message);
      localStorage.removeItem("newMessage");
      // if(this.currentUser.user.user_uid==message.data.to_user.user_uid){
      this.userListMessage.push(message.data);
      setTimeout(() => {
        this.content.scrollToBottom(200);
      }, 500);
      // }
    });
  }
  onsubmit() {
    if (this.text) {
      this.socket.emit("chat_msg_to_server", {
        to_user_uid: this.currentUser.user.user_uid,
        user_uid: this.vestLogin.user_uid,
        message: this.text,
      });
      this.text = "";
    } else {
      this.model.alerterror("Please insert text here.");
    }
  }
}
