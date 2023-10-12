import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit {
  darktheme = false;
  vestLogin: any;
  isExpandMenu = true;
  menuSize = '2';
  symbolState: any;
  duration: any = 90;
  timeslots = '1h';
  contentSize = '6';
  public getScreenWidth: any;
  isMobile = false;
  symbolData: any = [];
  isTab = false;
  title: any;
  favorites: any = [];
  // stocks: any = [];
  // crypto: any = [];
  searchItem: any;
  currentUrl: any;
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
  public data = [];
  deskMenu = [
    {
      name: 'Feed',
      icon: 'assets/icons/1.svg',
      link: '/home/feed',
    },
    {
      name: 'Explore',
      icon: 'assets/icons/7.svg',
      link: '/home/explore',
    },
    {
      name: 'News',
      icon: 'assets/icons/3.svg',
      link: '/home/news',
    },
    {
      name: 'Markets',
      icon: 'assets/icons/2.svg',
      link: '/home/markets',
    },

    {
      name: 'Rooms',
      icon: 'assets/icons/4.svg',
      link: '/home/rooms',
    },
    // {
    //   name: 'Messages',
    //   icon: 'assets/icons/5.svg',
    //   link: '/app/click',
    // },
    {
      name: 'Home',
      icon: 'assets/icons/6.svg',
      link: '/home/home',
    },
    // {
    //   name: 'Sign In',
    //   icon: 'assets/icons/person-circle-outline.svg',
    //   link: '/login',
    // },
    // {
    //   name: 'Notifications',
    //   icon: 'assets/icons/notifications-outline.svg',
    //   link: '/app/click',
    // },
  ];
  cryptoSymbol = [
    {
      symbol: 'USDC/BTC',
    },
    {
      symbol: 'ETH/BTC',
    },
    {
      symbol: 'MATIC/BTC',
    },
    {
      symbol: 'LINK/BTC',
    },
    {
      symbol: 'PEPE/USD',
    },
  ];
  stocksSymbols = [
    {
      symbol: 'AAPL',
    },
    {
      symbol: 'MSFT',
    },
    {
      symbol: 'GOOG',
    },
    {
      symbol: 'COIN',
    },
  ];
  news: any = [];
  crypto: any = [];
  stock: any = [];
  public results = [...this.data];

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
  constructor(
    public alertController: AlertController,
    public router: Router,
    public model: ModelService,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ionViewDidEnter() {
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
    this.onWindowResize();
    this.getSymbolProfile2(this.symbolName);
    this.getMoverData(this.symbolName);
    this.crypto = [];
    this.stock = [];
    this.getHomeNews();
    for (let index = 0; index < this.cryptoSymbol.length; index++) {
      this.getSymbolProfile(this.cryptoSymbol[index].symbol, 'crypto');
    }
    for (let index = 0; index < this.stocksSymbols.length; index++) {
      this.getSymbolProfile(this.stocksSymbols[index].symbol, 'stock');
    }
  }
  getMoverData(symbol) {
    this.symbolData = [];
    var s = new Date();
    var ss = s.setDate(s.getDate() - this.duration);
    var start_date = this.formatDate(ss);
    var url = '';
    var e = new Date();
    var end_date = this.formatDate(e);
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
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  handleChange(event) {
    const query = event.target.value.toLowerCase();
    this.searchItem = event.target.value;
    this.model
      .common_api(
        'global-search',
        {
          keyword: query,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        //console.log(data);
        if (data.status == 1) {
          this.results = data.data;
        }
      });
  }
  goToDetails2(data, type) {
    if (type == 'user') {
      // this.router.navigateByUrl("/home/profile/" + data.user_uid);
      this.presentAlert();
    }
    if (type == 'stock') {
      this.router.navigateByUrl('/home/market-detail/' + data.symbol);
    }
    if (type == 'post') {
      this.router.navigateByUrl('/home/post-detail/' + data.post_uid);
    }
    if (type == 'room') {
      localStorage.setItem('tem_room', data.room_uid);
      this.router.navigateByUrl('/home/rooms');
    }
    this.searchItem = '';
  }
  getSymbolProfile(symbol, type) {
    var url =
      'https://api.twelvedata.com/quote?symbol=' +
      symbol +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        if (type == 'crypto') {
          this.crypto.push(data);
        }
        if (type == 'stock') {
          console.log(this.stock);
          this.stock.push(data);
        }
      }
    });
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
  changeAmount(e) {
    this.symbolState = e;
  }
  getPercentage(item) {
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
  ngOnInit() {}
  openUrl(url) {
    window.open(url, '_blank');
  }
  getFollowPercentage(item) {
    const values = ((item.open - item.close) / item.open) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Login or Signup to explore more',
      mode: 'ios',
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/home/login']);
          },
        },
        {
          text: 'Signup',

          handler: () => {
            this.router.navigate(['/home/signup']);
          },
        },
      ],
    });

    await alert.present();
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
}
