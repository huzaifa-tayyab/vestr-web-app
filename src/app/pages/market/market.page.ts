import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class MarketPage implements OnInit {
  count = 0;
  sentiments_filter = 'today';
  public columns: Array<object>;
  vestLogin: any;
  trendingStocks: any = [];
  trendingStocks2: any = [];
  graphdata: any = [];
  alpaca: any;
  rows = [];
  temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  lastTradingArray = [];
  multiIndex: any = [];
  newStocks: any = [];
  biggerMoverStocks: any = [];
  stockCount = 0;
  symbols = [
    { name: 'Negative', symbol: 'SPX', color: '#ca222c', data: null },
    { name: 'sentiment_score', symbol: 'IXIC', color: '#fff', data: null },
    { name: 'Positive', symbol: 'DJI', color: '#1dcf5b', data: null },
    { name: 'Neutral', symbol: 'RUT', color: '#cbcf1d', data: null },
  ];
  colorTrue = true;
  timeSlot = [
    {
      name: 'Live',
      color: false,
      value: 'live',
    },
    {
      name: '1h',
      color: false,
      value: '1_hour',
    },
    {
      name: '1d',
      color: true,
      value: '1_day',
    },
    {
      name: '1w',
      color: false,
      value: '1_week',
    },
    {
      name: '3m',
      color: false,
      value: '3_month',
    },
    {
      name: '1y',
      color: false,
      value: '1_year',
    },
    {
      name: 'all',
      color: false,
      value: 'all_time',
    },
  ];
  duration: any = '1_day';
  higherDataArray = ['AAPL', 'TSLA', 'COIN', 'GME'];
  higherData: any = [];
  ketMetricSymbol = [
    {
      name: 'SP500',
      id: 'SPX',
      data: null,
    },
    {
      name: 'Dow Jones',
      id: 'DJI',
      data: null,
    },
    {
      name: 'Nasdaq',
      id: 'IXIC',
      data: null,
    },
    {
      name: 'Russell 2000',
      id: 'RUT',
      data: null,
    },
    {
      name: 'Crude Oil',
      id: 'OVX',
      data: null,
    },
    {
      name: 'Gold',
      id: 'XAU',
      data: null,
    },
  ];
  sentimentsScore: any;

  TotalNegative: any;
  TotalNeutral: any;
  TotalPositive: any;
  mentioned: any = [];
  filter = 'last7days';
  constructor(
    public model: ModelService,
    public router: Router,
    private elementRef: ElementRef
  ) {}
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    // this.ngOnInit();
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }

  ngOnInit() {
    this.higherData = [];
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    const swiperEl = document.querySelector('swiper-container');
    const buttonEl = document.getElementById('nextbtn');
    const buttonEl2 = document.getElementById('prebtn');
    // swiperEl.addEventListener('slidechange', (event) => {
    //   console.log(event);
    //   console.log('slide changed');
    // });
    buttonEl.addEventListener('click', () => {
      swiperEl.swiper.slideNext();
    });
    buttonEl2.addEventListener('click', () => {
      swiperEl.swiper.slidePrev();
    });
    const swiperEl2: any = document.getElementById('swiper2');
    const buttonEl3 = document.getElementById('nextbtn2');
    const buttonEl4 = document.getElementById('prebtn2');
    buttonEl3.addEventListener('click', () => {
      swiperEl2.swiper.slideNext();
    });
    buttonEl4.addEventListener('click', () => {
      swiperEl2.swiper.slidePrev();
    });
    this.columns = [
      // { prop: "", name: "", type: 'image', class: '', width: '50' },
      {
        prop: 'details.Symbol',
        name: 'Name',
        type: 'text',
        class: 's',
        width: '60',
      },
      {
        prop: 'details.Symbol',
        name: 'Symbol',
        type: 'text',
        class: 'p',
        width: '60',
      },
      {
        prop: 'details.VWAP',
        name: 'Price',
        type: 'currency',
        class: 's',
        width: '100',
      },
      {
        prop: 'details.Today',
        name: 'Today',
        type: 'function',
        class: 'p',
        width: '60',
      },
      {
        prop: 'details.Volume',
        name: 'Volume',
        type: 'm',
        class: 's',
        width: '100',
      },
      {
        prop: 'details.VWAP',
        name: 'Market cap',
        type: 'currency',
        class: 's',
        width: '100',
      },
    ];
    // this.widgetData();
    this.allWidgetData();
    this.getMultiHigh();
    this.getBiggestMover();
    this.getNewGraph();
    this.getmentioned();
    for (let index = 0; index < this.higherDataArray.length; index++) {
      this.getHigherData(this.higherDataArray[index]);
    }
    for (let index = 0; index < this.ketMetricSymbol.length; index++) {
      this.onItemSelect(this.ketMetricSymbol[index].id, index);
    }
  }
  changeMention(e) {
    this.filter = e;
    this.getmentioned();
  }
  getmentioned() {
    this.model
      .common_api(
        'user/market/top-mentioned',
        {
          filter: this.filter,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        this.mentioned = [];
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            if (index <= 9) {
              this.mentioned.push(data.data[index]);
            }
          }
        }
      });
  }
  getNewGraph() {
    this.model
      .common_api(
        'user/market/sentiments',
        {
          topic: 'alltickers',
          size: '15',
          page: '1',
          filter: this.sentiments_filter,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.replaceKeys(data.data.total);
          this.sentimentsScore = data.data.total.SentimentScore;
          // this.TotalNegative = data.data.total.TotalNegative;
          // this.TotalNeutral = data.data.total.TotalNeutral;
          // this.TotalPositive = data.data.total.TotalPositive;
          var total =
            data.data.total.TotalPositive +
            data.data.total.TotalNegative +
            data.data.total.TotalNeutral;

          this.TotalPositive = (
            (data.data.total.TotalPositive / total) *
            100
          ).toFixed(2);
          this.TotalNegative = (
            (data.data.total.TotalNegative / total) *
            100
          ).toFixed(2);
          this.TotalNeutral = (
            (data.data.total.TotalNeutral / total) *
            100
          ).toFixed(2);
        }
      });
  }
  setSentiment(filter) {
    this.sentiments_filter = filter;
    this.getNewGraph();
  }
  getSemTotal(item, type) {
    var total =
      item.positive_mentions + item.neutral_mentions + item.negative_mentions;
    if (type == 'positive') {
      return ((item.positive_mentions / total) * 100).toFixed(2);
    }
    if (type == 'neutral') {
      return ((item.neutral_mentions / total) * 100).toFixed(2);
    }
    if (type == 'negative') {
      return ((item.negative_mentions / total) * 100).toFixed(2);
    }
    return 0;
  }
  replaceKeys(object) {
    Object.keys(object).forEach(function (key, value) {
      var newKey = key.replace(/\s+/g, '');
      if (object[key] && typeof object[key] === 'object') {
        this.replaceKeys(object[key]);
      }
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
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

  onItemSelect(symbol, index) {
    var s = new Date();
    var ss = s.setDate(s.getDate() - 2);
    var start_date = this.formatDate(ss);
    var url = '';
    var e = new Date();
    var end_date = this.formatDate(e);
    this.model
      .getMultiGraph(
        'https://api.twelvedata.com/time_series?symbol=' +
          symbol +
          '&interval=30min&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
          start_date +
          '&end_date=' +
          end_date
      )
      .subscribe((data: any) => {
        if (data.status == 'ok') {
          this.ketMetricSymbol[index].data = data;
        }
      });
  }
  getBiggestMover() {
    console.clear();
    this.model
      .getMultiGraph(
        'https://api.twelvedata.com/market_movers/stocks?&apikey=1056c69761fe4804a57ae7863552b96d&source=docs'
      )
      .subscribe((data: any) => {
        this.biggerMoverStocks = [];
        if (data.status == 'error') {
        } else {
          for (let i = 0; i < data.values.length; i++) {
            // if (i < 6) {
            this.biggerMoverStocks.push(data.values[i]);
            this.getMoverData(data.values[i].symbol, i);
            // }
          }
        }
      });
  }
  goTodetails(symbol) {
    if (this.vestLogin) {
      this.router.navigateByUrl('/app/market-detail/' + symbol);
    } else {
      this.router.navigateByUrl('/home/market-detail/' + symbol);
    }
  }
  getMoverData(symbol, i) {
    var s = new Date();
    var ss = s.setDate(s.getDate() - 2);
    var start_date = this.formatDate(ss);
    var url = '';
    var e = new Date();
    var end_date = this.formatDate(e);
    url =
      'https://api.twelvedata.com/time_series?symbol=' +
      symbol +
      '&interval=1min&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        if (data.values) {
          var revMyArr = [].concat(data.values).reverse();
          this.biggerMoverStocks[i].graphdata = revMyArr;
          this.biggerMoverStocks[i].data = revMyArr[revMyArr.length - 1];
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
  getHigherData(symbol) {
    var url = '';
    url =
      'https://api.twelvedata.com/quote?symbol=' +
      symbol +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      this.higherData.push(data);
    });
  }
  getMultiHigh() {
    this.model
      .getMultiGraph(
        'https://api.twelvedata.com/market_movers/etf?&apikey=1056c69761fe4804a57ae7863552b96d&source=docs'
      )
      .subscribe((data: any) => {
        this.multiIndex = [];
        if (data.status == 'error') {
        } else {
          for (let i = 0; i < data.values.length; i++) {
            // if (i < 4) {
            this.multiIndex.push(data.values[i]);
            // }
          }

          // for (let i = 0; i < Object.keys(data).length; i++) {
          //   this.multiIndex.push(data[Object.keys(data)[i]]);
          // }
        }
      });
  }
  userDetails(e) {
    for (let i = 0; i < this.symbols.length; i++) {
      if (e.name == this.symbols[i].symbol) {
        this.symbols[i].data = e.data[e.data.length - 1];
      }
    }
  }
  allWidgetData() {
    this.model
      .getMultiGraph(
        'https://api.twelvedata.com/quote?symbol=AAPL,TSLA,GOOG,AMZN,MSFT,META,JPM,JNJ,ADA,WMT,NVDA&apikey=1056c69761fe4804a57ae7863552b96d&source=docs'
      )
      .subscribe(
        (data: any) => {
          this.trendingStocks2 = [];
          if (data.status != 'error') {
            this.trendingStocks2 = Object.values(data);
            this.temp = [...this.trendingStocks2];
            this.rows = this.trendingStocks2;
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  widgetData() {
    this.model
      .common_api(
        'user/market/widget-data',
        {
          user_uid: this.vestLogin.user_uid,
          size: 10,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.trendingStocks = data.data;
            for (const key in this.trendingStocks) {
              this.getChartData(this.trendingStocks[key].Symbol, key);
            }
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getChartData(symbol, key) {
    this.model
      .common_api(
        'user/market/graph-data-by-symbol',
        {
          user_uid: this.vestLogin.user_uid,
          symbol: symbol,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          if (data.data.length > 0) {
            this.trendingStocks[key].graph = data.data;
            this.stockCount += 1;
            if (this.stockCount <= 6) {
              this.newStocks.push(this.trendingStocks[key]);
            }
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getGraph(value, i) {
    for (let index = 0; index < this.timeSlot.length; index++) {
      this.timeSlot[index].color = false;
    }
    this.timeSlot[i].color = true;
    this.duration = value;
  }
  getIndexPercentage(item) {
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
}
