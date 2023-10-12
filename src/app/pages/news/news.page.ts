import { Component, ElementRef, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  segmentValue = 'frontpage';
  items = [
    {
      name: 'Front Page',
      value: 'home',
      url: 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw',
    },
    // {
    //   name: 'Markets',
    //   value: 'markets',
    //   url: 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw'
    // },
    {
      name: 'U.S.',
      value: 'us',
      url: 'https://api.nytimes.com/svc/topstories/v2/us.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw',
    },
    {
      name: 'World',
      value: 'world',
      url: 'https://api.nytimes.com/svc/topstories/v2/world.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw',
    },
    {
      name: 'Politics',
      value: 'politics',
      url: 'https://api.nytimes.com/svc/topstories/v2/politics.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw',
    },
    {
      name: 'Tech',
      value: 'technology',
      url: 'https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw',
    },
    // {
    //   name: 'Crypto',
    //   value: 'crypto',
    //   url: 'https://api.nytimes.com/svc/topstories/v2/business.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw'
    // },
    {
      name: 'Real Estate',
      value: 'realestate',
      url: 'https://api.nytimes.com/svc/topstories/v2/realestate.json?api-key=a05GGmCpyZ2UZlxnCNARrGvfzSDAEiXw',
    },
  ];
  items2: any = [];
  firsdata: any;
  secondData: any = [];
  thirdData: any = [];
  fourData: any = [];
  fiveData: any = [];
  allItems: any = [];
  evenData: any = [];
  oddData: any = [];

  dropdownList = [];
  dropdownList2 = [];
  selectedItems = [];
  dropdownSettings = {};

  keyWordStocksNews: any = [];
  searchItem: any;
  searchString = [];
  constructor(public model: ModelService, private elementRef: ElementRef) {}
  ionViewDidLeave() {
    this.dropdownList = [];
    this.selectedItems = [];
    this.searchItem = '';
    this.elementRef.nativeElement.remove();
  }
  ionViewDidEnter() {
    const saveData = JSON.parse(localStorage.getItem('saveSearch'));
    if (saveData) {
      this.dropdownList2 = saveData;
    }
  }
  ngOnInit() {
    this.getHomeNews(this.items[0]);
    // this.dropdownList = [{ item_id: 0, item_text: 'Apple' }];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    // ];
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      enableCheckAll: false,
      allowRemoteDataSearch: true,
    };
  }
  onFilterChange(e) {
    e.preventDefault();
    this.searchString.unshift(e.target.value);
    console.log(this.searchString.toString());
    this.model
      .common_api(
        'user/news/search-news',
        {
          keyword: this.searchString.toString(),
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data) => {
        // this.dropdownList = [];
        console.log(data.data);
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            this.keyWordStocksNews = [];
            for (let index = 0; index < data.data.length; index++) {
              this.keyWordStocksNews.push(data.data[index]);
            }
            if (data.data.length == 0) {
              this.keyWordStocksNews = [];
            }
          }
        }
      });
  }
  saveSearch() {
    if (this.dropdownList.length > 0) {
      for (let index = 0; index < this.dropdownList.length; index++) {
        this.dropdownList2.unshift(this.dropdownList[index]);
      }
      // this.dropdownList2 = this.dropdownList;
      localStorage.setItem('saveSearch', JSON.stringify(this.dropdownList2));
    }
  }
  onItemDeSelect(e) {
    console.log(e);
    if (this.selectedItems.length == 0) {
      this.keyWordStocksNews = [];
      this.dropdownList = [];
    }
  }
  getEnterData(e) {
    if (e.target.value) {
      this.dropdownList.unshift({ item_text: e.target.value });
      this.onFilterChange(e);
      this.searchItem = '';
    }
  }
  onItemSelect(item: any) {
    if (item) {
      console.log(item);
      this.model
        .common_api(
          'user/news/search-news',
          {
            keyword: item.item_text,
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe((data) => {
          // this.dropdownList = [];
          console.log(data.data);
          if (data.status == 1) {
            for (let index = 0; index < data.data.length; index++) {
              // if (index <= 9) {
              //   this.dropdownList.push({
              //     item_id: index + data.data[index].symbol,
              //     item_text:
              //       data.data[index].instrument_name +
              //       ' (' +
              //       data.data[index].exchange +
              //       ')',
              //   });
              // }
              this.keyWordStocksNews = [];
              for (let index = 0; index < data.data.length; index++) {
                this.keyWordStocksNews.push(data.data[index]);
              }
              if (data.data.length == 0) {
                this.keyWordStocksNews = [];
              }
            }
          }
        });
      // this.selectedItems = [];
      // this.selectedItems.push(item);
      // var s2 = item.item_id.substring(1);
      // this.model
      //   .common_api(
      //     'user/news/get-by-symbol',
      //     {
      //       symbol: s2,
      //       size: '15',
      //       page: '1',
      //     },
      //     'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      //   )
      //   .subscribe((data) => {
      //     if (data.status == 1) {
      //       for (let index = 0; index < data.data.length; index++) {
      //         this.keyWordStocksNews.unshift(data.data[index]);
      //       }
      //       if (data.data.length == 0) {
      //         this.keyWordStocksNews = [];
      //       }
      //       if (data.data.length > 0) {
      //         this.dropdownList = [];
      //       }
      //       console.log(this.keyWordStocksNews);
      //     }
      //   });
    }
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  openUrl(url) {
    window.open(url, '_blank');
  }
  getHomeNews(item) {
    this.items2 = [];
    this.evenData = [];
    this.oddData = [];
    this.secondData = [];
    this.thirdData = [];
    this.fourData = [];
    this.fiveData = [];
    this.firsdata = '';
    this.segmentValue = item.value;
    if (this.segmentValue == 'home') {
      this.model
        .common_api(
          'user/news/search-by-topic',
          {
            topic: 'article',
            size: '30',
            page: '1',
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe((data) => {
          console.log(data);
          if (data.status == 1) {
            this.items2 = data.data;

            for (let index = 0; index < this.items2.length; index++) {
              if (index % 2) {
                this.evenData.push(this.items2[index]);
              } else {
                if (index == 0) {
                  this.firsdata = this.items2[index];
                } else {
                  this.oddData.push(this.items2[index]);
                }
              }
            }
          }
        });
    } else {
      this.model
        .common_api(
          'user/news/get-by-topic',
          {
            topic: this.segmentValue,
            size: '10',
            page: '1',
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe((data) => {
          if (data.status == 1) {
            console.log(data);
            this.items2 = data.data.results;

            for (let index = 0; index < this.items2.length; index++) {
              if (index % 2) {
                this.evenData.push(this.items2[index]);
              } else {
                if (index == 0) {
                  this.firsdata = this.items2[index];
                } else {
                  this.oddData.push(this.items2[index]);
                }
              }
            }
            console.log(this.items2);
            console.log(this.evenData);
            console.log(this.oddData);
          }
        });
    }
  }
  removeItem(e) {
    this.dropdownList.splice(e, 1);
    if (this.dropdownList.length > 0) {
      this.model
        .common_api(
          'user/news/search-news',
          {
            keyword: this.dropdownList[0].item_text,
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe((data) => {
          // this.dropdownList = [];
          console.log(data.data);
          if (data.status == 1) {
            for (let index = 0; index < data.data.length; index++) {
              this.keyWordStocksNews = [];
              for (let index = 0; index < data.data.length; index++) {
                this.keyWordStocksNews.push(data.data[index]);
              }
              if (data.data.length == 0) {
                this.keyWordStocksNews = [];
              }
            }
          }
        });
    }
    console.log(this.dropdownList);
  }
  removeItem2() {
    this.selectedItems = [];
    this.keyWordStocksNews = [];
    this.searchItem = '';
  }
  removeItem3(e) {
    this.dropdownList2.splice(e, 1);
    localStorage.setItem('saveSearch', JSON.stringify(this.dropdownList2));
  }
}
