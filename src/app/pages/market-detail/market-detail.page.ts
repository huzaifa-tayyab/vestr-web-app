import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { AlertController, PopoverController } from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-market-detail',
  templateUrl: './market-detail.page.html',
  styleUrls: ['./market-detail.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MarketDetailPage implements OnInit {
  slotName = 'past year';
  duration: any = 365;
  timeslots = '2h';
  timeSlot = [
    {
      name: 'Live',
      name2: '',
      color: false,
      value: 1,
      slot: '1min',
    },
    {
      name: '1h',
      name2: 'past hour',
      color: false,
      value: 1,
      slot: '1min',
    },
    {
      name: '1d',
      name2: 'today',
      color: false,
      value: 1,
      slot: '5min',
    },
    {
      name: '1w',
      name2: 'past 7 days',
      color: false,
      value: 7,
      slot: '2h',
    },
    {
      name: '3m',
      name2: 'last 3 months',
      color: false,
      value: 90,
      slot: '2h',
    },
    {
      name: '1y',
      name2: '1 year',
      color: true,
      value: 365,
      slot: '2h',
    },
    {
      name: 'all',
      name2: 'all time',
      color: false,
      value: 1500,
      slot: '2h',
    },
  ];
  faArrowUpFromBracket = faArrowUpFromBracket;
  faEllipsis = faEllipsis;
  faCirclePlus = faCirclePlus;
  profileType = 'general';
  vestLogin: any;
  allTrendingData: any;
  symbolName: any;
  getGraphData: any = [];
  rating = '';
  title = '';
  symbolData: any = [];
  symbolDetails: any;
  symbolState: any;
  cryptoNews: any = [];
  userCreateList: any = [];
  symbolNews: any = [];
  constructor(
    public popoverController: PopoverController,
    public model: ModelService,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public router: Router,
    private _location: Location,
    private elementRef: ElementRef
  ) {}
  ionViewDidEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.symbolName = params['id'];
        this.onItemSelect(this.symbolName);
        this.getMoverData(this.symbolName);
        this.getSymbolProfile(this.symbolName);
        this.getAllPost(params['id']);
        this.getCryptoNews(this.symbolName);
        // this.getSymbolProfile2(this.symbolName);
        if (this.vestLogin) {
          this.getUserCreateList();
        }
      }
    });
  }
  openUrl(url) {
    window.open(url, '_blank');
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  backClicked() {
    this._location.back();
  }
  onItemSelect(symbol) {
    this.model
      .common_api(
        'user/news/get-by-symbol',
        {
          symbol: symbol,
          size: '15',
          page: '1',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data) => {
        this.symbolNews = [];
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            if (index < 10) {
              this.symbolNews.push(data.data[index]);
            }
          }
        }
      });
  }
  addStocksUserList(list_uid) {
    this.model
      .common_api(
        'user/lists/add-item',
        {
          user_uid: this.vestLogin.user_uid,
          stock_name: this.symbolName,
          stock_type: 'stock',
          list_uid: list_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.popoverController.dismiss();
            this.model.alertsuccess(data.message);
          } else {
            this.popoverController.dismiss();
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getUserCreateList() {
    this.model
      .common_api(
        'user/lists/list',
        {
          user_uid: this.vestLogin.user_uid,
          page: '0',
          size: '5',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data.status == 1) {
            this.userCreateList = data.data;
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getSymbolProfile2(symbol) {
    var url =
      'https://api.twelvedata.com/quote?symbol=' +
      symbol +
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
  getCryptoNews(symbol) {
    var ss = symbol.replace(/\/USD/g, '');
    var url =
      'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=' +
      ss +
      '&apikey=RLZWBOETGC5BXMRH';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      //console.log(data);
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        this.cryptoNews = data;
      }
    });
  }
  getSymbolProfile(symbol) {
    var url =
      'https://api.twelvedata.com/profile?symbol=' +
      symbol +
      '&interval=' +
      this.timeslots +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      //console.log(data);
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        this.symbolDetails = data;
      }
    });
  }
  getMoverData(symbol) {
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
      //console.log(data);

      if (data.status == 'error') {
        this.symbolData = [];
        // this.model.alerterror(data.message)
      } else {
        this.symbolData = [];
        this.symbolData = '';
        var revMyArr = [].concat(data.values).reverse();
        this.symbolData = revMyArr;
        this.symbolState = this.symbolData[this.symbolData.length - 1];
      }
    });
  }
  async presentAlert() {
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
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  ngOnInit() {}
  getPercentageRating(e: number) {
    var result = (e / 10000) * 100;
    return result;
  }
  getPercentageRating2(e: number, ee: number) {
    if (e == ee) {
      return 0.5;
    } else {
      var result2 = (e / (ee + e)) * 100;
      var result = (result2 / 100) * 100;
      return result;
    }
  }
  getPercentageVote(up: number, down: number) {
    if (up == down) {
      return 0.5;
    } else {
      var result2 = (up / (down + up)) * 100;
      var result = (result2 / 10000) * 100;
      return result;
    }
  }
  getGraph(value, i) {
    for (let index = 0; index < this.timeSlot.length; index++) {
      this.timeSlot[index].color = false;
    }
    this.timeSlot[i].color = true;
    this.timeslots = value.slot;
    this.duration = value.value;
    this.slotName = value.name2;
    //console.log(value);
    // this.getSymbolProfile2(this.symbolName);
    this.getMoverData(this.symbolName);
  }
  getMaximumRated() {
    var a = parseFloat(this.allTrendingData.strong_buy_rating_percent);
    var b = parseFloat(this.allTrendingData.buy_rating_percent);
    var c = parseFloat(this.allTrendingData.hold_rating_percent);
    var d = parseFloat(this.allTrendingData.sell_rating_percent);
    var f = parseFloat(this.allTrendingData.strong_sell_percent);
    if (a >= b && a >= c && a >= d && a >= f) {
      this.title = 'Strong Buy';
    } else if (b >= a && b >= c && b >= d && b >= f) {
      this.title = 'Buy';
    } else if (c >= a && c >= b && c >= d && c >= f) {
      this.title = 'Hold';
    } else if (d >= a && d >= c && d >= b && d >= f) {
      this.title = 'Sell';
    } else {
      this.title = 'Strong Sell';
    }
  }
  voteStock(vote) {
    if (this.vestLogin) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/stock/vote',
          {
            user_uid: this.vestLogin.user_uid,
            stock_type: 'stock',
            stock_name: this.symbolName,
            vote: vote,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.model.hidespinner();
            //console.log(data);
            if (data.status == 1) {
              this.ionViewDidEnter();
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.presentAlert();
    }
  }
  rateStock() {
    if (this.vestLogin) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/stock/rate',
          {
            user_uid: this.vestLogin.user_uid,
            stock_type: 'stock',
            stock_name: this.symbolName,
            rating: this.rating,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.model.hidespinner();
            //console.log(data);
            if (data.status == 1) {
              this.ionViewDidEnter();
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.presentAlert();
    }
  }
  folloStock() {
    if (this.vestLogin) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/stock/follow',
          {
            user_uid: this.vestLogin.user_uid,
            stock_type: 'stock',
            stock_name: this.symbolName,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.model.hidespinner();
            if (data.status == 1) {
              this.ionViewDidEnter();
            } else {
              this.allTrendingData = 0;
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.presentAlert();
    }
  }
  likeStock() {
    if (this.vestLogin) {
      this.model.showspinner();
      this.model
        .common_api(
          'user/stock/like',
          {
            user_uid: this.vestLogin.user_uid,
            stock_type: 'stock',
            stock_name: this.symbolName,
          },
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            this.model.hidespinner();
            if (data.status == 1) {
              this.ionViewDidEnter();
              this.popoverController.dismiss();
            } else {
              this.allTrendingData = 0;
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.alerterror('System generated errors');
          }
        );
    } else {
      this.presentAlert();
    }
  }
  graphStock() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/stock/add-to-graph',
        {
          user_uid: this.vestLogin.user_uid,
          stock_type: 'stock',
          stock_name: this.symbolName,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            this.ionViewDidEnter();
          } else {
            this.allTrendingData = 0;
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
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
    const values = ((item.open - item.close) / item.open) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
  changeAmount(e) {
    this.symbolState = e;
  }
  getAllPost(symbol) {
    this.model.showspinner();
    this.model
      .common_api(
        'user/market/symbol-details',
        {
          symbol: symbol,
          user_uid: this.vestLogin?.user_uid,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          this.allTrendingData = '';
          console.log(data);
          if (data.status == 1) {
            this.allTrendingData = data.data;
            this.getMaximumRated();
            if (data.data.graph_data.length > 0) {
              this.getGraphData = data.data.graph_data;
            }
          } else {
            this.allTrendingData = 0;
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
  }
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
}
