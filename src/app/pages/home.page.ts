import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AlertController,
  IonContent,
  IonModal,
  PopoverController,
} from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {
  minDate: any;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonModal) modal: IonModal;
  @ViewChild(QuillEditorComponent) editor: QuillEditorComponent;
  url: any = environment.url;
  setSize = 'large';
  setCount = 0;
  news: any = [];
  searchText: any;
  htmlContent = '*';
  symbolName = 'SPX';
  timeSlot = [
    {
      name: 'Live',
      color: false,
      value: 1,
      slot: '1min',
    },
    {
      name: '1h',
      color: false,
      value: 1,
      slot: '1min',
    },
    {
      name: '1d',
      color: false,
      value: 1,
      slot: '5min',
    },
    {
      name: '1w',
      color: false,
      value: 7,
      slot: '2h',
    },
    {
      name: '3m',
      color: true,
      value: 90,
      slot: '2h',
    },
  ];
  duration: any = 90;
  timeslots = '1h';
  symbolState: any;
  symbolData: any = [];
  darktheme = false;
  vestLogin: any;
  isFileUpload = false;
  file_name: any = '';
  file_type: any = '';
  privacy: any = 'public';
  isExpandMenu = true;
  menuSize = '2';
  contentSize = '6';
  public getScreenWidth: any;
  isMobile = false;
  isTab = false;
  title: any;
  favorites: any = [];
  stocks: any = [];
  crypto: any = [];
  searchItem: any;
  currentUrl: any;
  public data = [];
  isModalOpen = false;
  public results = [...this.data];
  isPosted = false;
  deskMenu = [
    {
      name: 'Feed',
      icon: 'assets/icons/1.svg',
      link: '/app/feed',
    },
    {
      name: 'Explore',
      icon: 'assets/icons/7.svg',
      link: '/app/explore',
    },
    {
      name: 'News',
      icon: 'assets/icons/3.svg',
      link: '/app/news',
    },
    {
      name: 'Markets',
      icon: 'assets/icons/2.svg',
      link: '/app/markets',
    },

    {
      name: 'Rooms',
      icon: 'assets/icons/4.svg',
      link: '/app/rooms',
    },
    // {
    //   name: 'Messages',
    //   icon: 'assets/icons/5.svg',
    //   link: '/app/messages',
    // },
    {
      name: 'Home',
      icon: 'assets/icons/6.svg',
      link: '/app/home',
    },
    // {
    //   name: 'Profile',
    //   icon: 'assets/icons/person-circle-outline.svg',
    //   link: '/app/profile',
    // },
    // {
    //   name: "Notifications",
    //   icon: "assets/icons/notifications-outline.svg",
    //   link: "/app/notifications",
    // },
  ];
  socket;
  userMessage = false;
  currentURL: string = '';
  count: any;
  maxDate: any;
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth < 1024) {
      this.isMobile = true;
      if (this.getScreenWidth < 768) {
        this.isTab = true;
      } else {
        this.isTab = false;
      }
    } else {
      this.isMobile = false;
      this.isTab = false;
    }
  }
  @ViewChild('popover') popover;

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  constructor(
    public router: Router,
    public model: ModelService,
    public alertController: AlertController,
    public popoverController: PopoverController,
    public route: ActivatedRoute,
    private elementRef: ElementRef
  ) {
    this.onWindowResize();
    this.minDate = new Date().toISOString();
    const maxD = new Date();
    this.maxDate = maxD.setMonth(maxD.getMonth() + 1);
    this.maxDate = new Date(this.maxDate).toISOString();
    this.currentURL = router.url;
    // setTimeout(() => {
    //   console.log("times up");
    //   this.content.scrollToTop(100);
    // }, 10000);
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.searchItem = event.target.value;
    //console.log(this.searchItem);
    this.model
      .common_api(
        'global-search',
        {
          keyword: query,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.status == 1) {
          this.results = data.data;
        }
      });
    // this.results = this.data.filter((d) => d.toLowerCase().indexOf(query) > -1);
    // //console.log(this.results);
  }
  getMoverData(symbol) {
    this.symbolData = [];
    var s = new Date();
    var ss = s.setDate(s.getDate() - this.duration);
    var start_date = this.formatDate2(ss);
    var url = '';
    var e = new Date();
    var end_date = this.formatDate2(e);
    url =
      'https://api.twelvedata.com/time_series?symbol=' +
      symbol +
      '&interval=' +
      this.timeslots +
      '&apikey=1056c69761fe4804a57ae7863552b96d&start_date=' +
      start_date +
      '&end_date=' +
      end_date;
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        if (data.values) {
          var revMyArr = [].concat(data.values).reverse();
          this.symbolData = revMyArr;
        }
      }
    });
  }
  formatDate2(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  cancel() {
    this.isModalOpen = false;
    this.modal.dismiss(null, 'cancel');
    // if (this.htmlContent) {
    //   this.draftShow();
    // }
  }
  async draftShow() {
    const alert = await this.alertController.create({
      header: 'Alert!',
      subHeader: 'Do you want to save this post in draft',
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
            this.onsubmit('draft');
          },
        },
      ],
    });

    await alert.present();
  }
  goToDetails() {
    if (this.searchItem) {
      this.router.navigateByUrl('/app/market-detail/' + this.searchItem);
      this.searchItem = '';
    }
  }
  goToDetails2(data, type) {
    if (type == 'user') {
      this.router.navigateByUrl('/app/profile/' + data.user_uid);
    }
    if (type == 'stock') {
      this.router.navigateByUrl('/app/market-detail/' + data.symbol);
    }
    if (type == 'post') {
      this.router.navigateByUrl('/app/post-detail/' + data.post_uid);
    }
    if (type == 'room') {
      localStorage.setItem('tem_room', data.room_uid);
      this.router.navigateByUrl('/app/rooms');
    }
    this.searchItem = '';
  }
  widgetData() {
    this.model
      .common_api(
        'user/market/widget-data',
        {
          user_uid: this.vestLogin.user_uid,
          size: 4,
        },
        this.vestLogin.token
      )
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.favorites = data.data;
          this.crypto = data.crypto_data;
          // this.stocks = data.data;
        }
      });
  }
  getFollowStock() {
    this.model
      .common_api(
        'user/stock/list-by-user',
        {
          user_uid: this.vestLogin.user_uid,
          stock_type: 'stock',
          page: '0',
          size: '4',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.stocks = [];
          if (data.status == 1) {
            for (let i = 0; i < data.data.length; i++) {
              this.getSymbolProfile(data.data[i].stock_name);
            }
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getSymbolProfile(symbol) {
    var url =
      'https://api.twelvedata.com/quote?symbol=' +
      symbol +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        this.stocks.push(data);
        //console.log(this.stocks);
      }
    });
  }
  goMarketDetails(id) {
    if (this.vestLogin) {
      this.router.navigateByUrl('/app/market-detail/' + id);
    } else {
      this.router.navigateByUrl('/home/market-detail/' + id);
    }
  }
  widgetData2() {
    this.model
      .common_api(
        'user/market/widget-data',
        {
          user_uid: this.vestLogin.user_uid,
          size: 100,
        },
        this.vestLogin.token
      )
      .subscribe((data: any) => {
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            this.data.push(data.data[index].symbol);
          }
        }
      });
  }
  getFollowPercentage(item) {
    if (item) {
      const values = ((item.open - item.close) / item.open) * 100;
      if (values >= 0) {
        return { value: values, key: true };
      } else {
        return { value: values, key: false };
      }
    } else {
      return {};
    }
  }
  getPercentage(item) {
    const values = ((item.OpenPrice - item.VWAP) / item.OpenPrice) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
  getPercentage2(item) {
    const values = ((item.Open - item.VWAP) / item.Open) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
  setOpenprivacy(isOpen, privacy) {
    this.privacy = privacy;
    this.popoverController.dismiss();
  }
  setMenu() {
    this.isExpandMenu = !this.isExpandMenu;
    if (this.isExpandMenu) {
      this.menuSize = '2';
      this.contentSize = '6';
    } else {
      this.menuSize = '1';
      this.contentSize = '6';
    }
  }
  onsubmit(action) {
    if (this.htmlContent) {
      var content = this.htmlContent.replace(/temp/g, 'post/images');
      this.isPosted = true;
      if (this.privacy == 'Select privacy') {
        this.privacy = '';
      }
      this.model
        .common_api(
          'user/add-post',
          {
            user_uid: this.vestLogin.user_uid,
            text: content,
            file_name: this.file_name,
            file_type: this.file_type,
            privacy: this.privacy,
            action: action,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.isPosted = false;
            console.log(data);
            // this.model.hidespinner();
            if (data.status == 1) {
              this.htmlContent = '';
              this.isModalOpen = false;
              this.modal.dismiss(null, 'cancel');
              setTimeout(() => {
                this.htmlContent = '*';
              }, 1000);
              if (action == 'live') {
                localStorage.setItem('isLoadPost', JSON.stringify(data.data));
                localStorage.setItem('setindex', '0');
              }
              if (action == 'draft') {
                localStorage.setItem('isLoadPost1', JSON.stringify(data.data));
                localStorage.setItem('setindex1', '0');
              }

              this.model.alertsuccess(data.message);
            } else {
              this.model.alerterror(data.message);
            }
          },
          (err: any) => {
            this.isPosted = false;
            // this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.model.alerterror('Please insert text here.');
    }
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }
  editorInstance: any;
  setFocus(e, editor) {
    this.editorInstance = e;
    let toolbar = e.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
    editor.quillEditor.formatText(this.setCount, 1, 'size', this.setSize);
    editor.quillEditor.focus();
    editor.quillEditor.deleteText(0, 1);
    editor.onContentChanged.subscribe((content: ContentChange) => {
      if (this.htmlContent) {
        editor.quillEditor.formatText(
          this.setCount,
          this.htmlContent.length - 1,
          'size',
          this.setSize
        );
      }
    });
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
  setValue(e: any) {
    this.setSize = e.target.value;
    if (this.htmlContent) {
      this.setCount = this.htmlContent.length;
    }
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth < 1024) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.getFollowStock();
    this.widgetData();
    this.getSymbolProfile2(this.symbolName);
    this.getMoverData(this.symbolName);
    this.getUnreadMessageCount();
    setInterval(() => {
      const messageCount = localStorage.getItem('messageCount');
      if (messageCount) {
        this.getUnreadMessageCount();
        localStorage.removeItem('messageCount');
      }
    }, 500);
    setInterval(() => {
      this.widgetData();
    }, 5000);
    // this.widgetData2();
    const theme = localStorage.getItem('user-theme');
    if (theme) {
      if (theme === 'dark') {
        this.darktheme = true;
        document.body.setAttribute('color-theme', 'dark');
      } else {
        this.darktheme = false;
        document.body.setAttribute('color-theme', 'light');
      }
    } else {
      this.darktheme = false;
      document.body.setAttribute('color-theme', 'light');
    }
    this.getHomeNews();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = io(environment.SOCKET_ENDPOINT);
      this.setupSocketConnection();
    }
    if (!this.socket) {
      this.socket = io(environment.SOCKET_ENDPOINT);
      this.setupSocketConnection();
    }

    setInterval(() => {
      const newMessage = localStorage.getItem('newMessage');
      if (newMessage) {
        this.userMessage = true;
      } else {
        this.userMessage = false;
      }
    }, 1000);
  }
  getSymbolProfile2(symbol) {
    var ss = symbol.replace(/\/USD/g, '');
    var url =
      'https://api.twelvedata.com/quote?symbol=' +
      ss +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        this.symbolState = data;
        console.log(this.symbolState);
      }
    });
  }
  changeAmount(e) {
    this.symbolState = e;
  }
  getGraph(value, i) {
    for (let index = 0; index < this.timeSlot.length; index++) {
      this.timeSlot[index].color = false;
    }
    this.timeSlot[i].color = true;
    this.timeslots = value.slot;
    this.duration = value.value;
    this.getMoverData(this.symbolName);
    //console.log(value);
  }
  getUnreadMessageCount() {
    this.model
      .common_api(
        'user/message/unread-message-count',
        {
          user_uid: this.vestLogin.user_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.count = data.data.count;
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
  }
  setupSocketConnection() {
    this.socket.on('chat_msg_to_client_new_message', (message) => {
      //console.log(message);
      if (message == this.vestLogin.user_uid) {
        localStorage.setItem('newMessage', message);
      }
    });
  }
  getHomeNews() {
    // this.model
    //   .getAllNews(
    //     'https://api.nytimes.com/svc/topstories/v2/us.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw'
    //   )
    //   .subscribe((data) => {
    //     this.news = [];
    //     if (data.status == 'OK') {
    //       for (let index = 0; index < data.results.length; index++) {
    //         if (index < 5) {
    //           this.news.push(data.results[index]);
    //         }
    //       }
    //     }
    //   });
    this.model
      .common_api(
        'user/news/trending-headline',
        '',
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data) => {
        console.log(data);
        this.news = [];
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            // if (index < 15) {
            this.news.push(data.data[index]);
            this.news[index].readmore = false;
            // }
          }
        }
      });
  }
  openUrl(url) {
    window.open(url, '_blank');
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
  viewMode(e) {
    var aa = this.cutFirst(e, '@');
    var aa2 = this.hasWhiteSpace(aa[1]);

    var html = aa[1];
    // if (aa2) {
    //   document.getElementById("demo").remove();
    // }
    if (html) {
      var div = document.createElement('div');
      div.id = 'demo;';
      div.innerHTML = html;
      this.searchText = div.textContent || div.innerText || '';
      if (this.searchText) {
        console.log(this.searchText);
      }
    }

    // document.execCommand("createlink", true, "https://google.com");
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }
  cutFirst(str, token) {
    var arr = str.split(token);
    var fst = arr.splice(0, 1);
    return [fst.join(''), arr.join(token)];
  }
  toggle(e) {
    if (e === 'light') {
      this.darktheme = true;
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('user-theme', 'dark');
    } else {
      this.darktheme = false;
      document.body.setAttribute('color-theme', 'light');
      localStorage.setItem('user-theme', 'light');
    }
  }
  logout() {
    localStorage.removeItem('vest_login');
    localStorage.removeItem('user-theme');
    window.location.assign('/');
  }
  formatDate(value: any) {
    this.popoverController.dismiss();
    console.log(format(parseISO(value), 'yyyy-MM-dd'));
  }
}
