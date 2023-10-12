import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  vestLogin: any;
  allTrendingData: any;
  stockData: any = [];
  allStockData: any = [];
  allStockSymbolData: any = [];
  allLikesStocks: any = [];
  allLikesSymbolStocks: any = [];
  showFollowing = false;
  public columns: Array<object>;
  public columns2: Array<object>;
  StocksNews: any = [];
  username: any;
  isUsername = false;
  userCreateList: any = [];
  list_uid: any;
  profile_img_path: any;
  userDetail: any = [];
  constructor(
    public model: ModelService,
    public alertController: AlertController,
    public router: Router,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  customStocks = ['AAPL', 'MSFT', 'GOOG', 'COIN'];
  isAddList = false;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.ionViewWillEnter();
  }
  ionViewWillEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.allLikesStocks = [];
    this.allStockData = [];
    this.stockData = [];
    this.columns = [
      { prop: 'name', name: 'Name', type: 'text', class: 's', width: '60' },
      { prop: 'symbol', name: 'Symbol', type: 'text', class: 'p', width: '60' },
      {
        prop: 'close',
        name: 'Price',
        type: 'currency',
        class: 's',
        width: '100',
      },
      {
        prop: 'close',
        name: 'Today',
        type: 'function',
        class: 'p',
        width: '60',
      },
      { prop: 'volume', name: 'Volume', type: 'm', class: 's', width: '100' },
      {
        prop: 'close',
        name: 'Market cap',
        type: 'currency',
        class: 's',
        width: '100',
      },
    ];
    this.columns2 = [
      { prop: 'name', name: 'Name', type: 'text', class: 's', width: '60' },
      { prop: 'symbol', name: 'Symbol', type: 'text', class: 'p', width: '60' },
      {
        prop: 'close',
        name: 'Price',
        type: 'currency',
        class: 's',
        width: '100',
      },
      {
        prop: 'close',
        name: 'Today',
        type: 'function',
        class: 'p',
        width: '60',
      },
      { prop: 'volume', name: 'Volume', type: 'm', class: 's', width: '100' },
      {
        prop: 'close',
        name: 'Market cap',
        type: 'currency',
        class: 's',
        width: '100',
      },
      {
        prop: 'close',
        name: 'Action',
        type: 'function2',
        class: 's',
        width: '100',
      },
    ];
    this.getChartData('AAPL');
    this.getCryptoNews('AAPL');
    if (this.vestLogin) {
      this.getUserDetail();
      this.getFollowStock();
      this.getLikesStock();
      this.getGraphStock();
      this.getUserCreateList();
    } else {
      for (let index = 0; index < this.customStocks.length; index++) {
        this.getSymbolProfile(this.customStocks[index]);
      }
    }
  }
  getUserDetail() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/details',
        {
          user_uid: this.vestLogin.user_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          if (data.status == 1) {
            this.userDetail = data.data;
            this.profile_img_path = data.profile_img_path;
            if (!this.userDetail.cover_image) {
              this.userDetail.cover_image = '/1.jpeg';
            } else {
              this.userDetail.cover_image = '/' + this.userDetail.cover_image;
            }
            if (!this.userDetail.profile_image) {
              this.userDetail.profile_image = '/2.svg';
            } else {
              this.userDetail.profile_image =
                '/' + this.userDetail.profile_image;
            }
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
            for (let i = 0; i < this.userCreateList.length; i++) {
              this.userCreateList[i].data = [];
              for (
                let j = 0;
                j < this.userCreateList[i].list_item.length;
                j++
              ) {
                this.getSymbolProfileForUserList(
                  this.userCreateList[i].list_item[j].item_name,
                  i,
                  j
                );
              }
            }
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getSymbolProfileForUserList(symbol, i, j) {
    var url =
      'https://api.twelvedata.com/quote?symbol=' +
      symbol +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      } else {
        const d1 = {
          ...data,
          v1: this.userCreateList[i].list_item[j].uli_uid,
          v2: this.userCreateList[i].list_item[j].item_type,
        };
        this.userCreateList[i].data.push(d1);
      }
    });
  }
  goToDraft() {
    if (this.vestLogin) {
      this.router.navigateByUrl('/app/draft');
    } else {
      this.presentAlert2();
    }
  }
  async presentAlert2() {
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
  editUserList() {
    this.isUsername = true;
    this.model
      .common_api(
        'user/lists/add',
        {
          user_uid: this.vestLogin.user_uid,
          name: this.username,
          list_uid: this.list_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.isUsername = false;
          console.log(data);
          if (data.status == 1) {
            this.model.alertsuccess(data.message);
            this.setOpen(false);
            this.getUserCreateList();
          }
        },
        (err: any) => {
          this.isUsername = false;
          this.model.alerterror('System generated errors');
        }
      );
  }
  createUserList() {
    this.isUsername = true;
    this.model
      .common_api(
        'user/lists/add',
        {
          user_uid: this.vestLogin.user_uid,
          name: this.username,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.isUsername = false;
          console.log(data);
          if (data.status == 1) {
            this.model.alertsuccess(data.message);
            this.setOpen(false);
            this.getUserCreateList();
          }
        },
        (err: any) => {
          this.isUsername = false;
          this.model.alerterror('System generated errors');
        }
      );
  }
  removeUserList(list_uid) {
    this.model
      .common_api(
        'user/lists/remove',
        {
          user_uid: this.vestLogin.user_uid,
          list_uid: list_uid,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.alertsuccess(data.message);
          this.getUserCreateList();
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  async presentAlert(list_uid) {
    const alert = await this.alertController.create({
      subHeader: 'Are you sure, You want to remove this',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {},
        },
        {
          text: 'Remove',

          handler: () => {
            this.removeUserList(list_uid);
          },
        },
      ],
    });

    await alert.present();
  }
  setOpen(isOpen: boolean) {
    this.username = '';
    this.list_uid = '';
    this.isAddList = isOpen;
  }
  setOpen2(item) {
    this.username = item.user_list_name;
    this.list_uid = item.user_list_uid;
    this.isAddList = true;
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
        this.StocksNews = data;
        for (let index = 0; index < this.StocksNews.feed.length; index++) {
          this.StocksNews.feed[index].readmore = false;
        }
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
          size: '5',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.allStockData = [];
          if (data.status == 1) {
            this.showFollowing = false;
            // this.allStockData = data.data;
            this.allStockSymbolData = data.data;
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
      } else {
        this.allStockData.push(data);
      }
    });
  }
  getLikesStock() {
    this.model
      .common_api(
        'user/stock/like-list-by-user',
        {
          user_uid: this.vestLogin.user_uid,
          stock_type: 'stock',
          page: '0',
          size: '5',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.allLikesStocks = [];
          if (data.status == 1) {
            //console.log(data);
            this.allLikesSymbolStocks = data.data;
            for (let i = 0; i < data.data.length; i++) {
              this.getSymbolLikeProfile(data.data[i].stock_name);
            }
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getSymbolLikeProfile(symbol) {
    var url =
      'https://api.twelvedata.com/quote?symbol=' +
      symbol +
      '&apikey=1056c69761fe4804a57ae7863552b96d&source=docs';
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        this.allLikesStocks.push(data);
      }
    });
  }
  getGraphStock() {
    this.model
      .common_api(
        'user/stock/graph-list-by-user',
        {
          user_uid: this.vestLogin.user_uid,
          stock_type: 'stock',
          page: '0',
          size: '3',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.stockData = [];
          if (data.status == 1) {
            //console.log(data);
            this.stockData = data.data;
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getChartData(symbol) {
    this.model
      .common_api(
        'user/market/symbol-details',
        {
          symbol: symbol,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.allTrendingData = '';
          if (data.status == 1) {
            this.allTrendingData = data.data;
          } else {
            this.allTrendingData = 0;
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  openUrl(e) {
    window.open(e, '_blank');
  }
  getPercentageCrypto(item) {
    const values = ((item.Open - item.VWAP) / item.Open) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
  getPercentageStocks(item) {
    const values = ((item.OpenPrice - item.VWAP) / item.OpenPrice) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
  goTodetails(symbol) {
    if (this.vestLogin) {
      this.router.navigateByUrl('/app/market-detail/' + symbol);
    } else {
      this.router.navigateByUrl('/home/market-detail/' + symbol);
    }
  }
  logout() {
    localStorage.removeItem('vest_login');
    localStorage.removeItem('user-theme');
    window.location.assign('/new-design');
  }
  getPercentageStocks2(item) {
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
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
}
