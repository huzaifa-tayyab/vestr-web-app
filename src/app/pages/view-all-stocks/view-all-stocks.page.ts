import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-view-all-stocks',
  templateUrl: './view-all-stocks.page.html',
  styleUrls: ['./view-all-stocks.page.scss'],
})
export class ViewAllStocksPage implements OnInit {
  multiIndex: any = [];
  symbolName: any;
  higherDataArray = ['AAPL', 'TSLA', 'COIN', 'GME'];
  higherData: any = [];
  constructor(
    public model: ModelService,
    public route: ActivatedRoute,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ionViewWillEnter() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.symbolName = params['id'];
        if (this.symbolName == 'high') {
          this.getMultiHigh();
        }
        if (this.symbolName == 'trending') {
          for (let index = 0; index < this.higherDataArray.length; index++) {
            this.getHigherData(this.higherDataArray[index]);
          }
        }
      }
    });
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
  ngOnInit() {}
  getMultiHigh() {
    this.model.showspinner();
    this.model
      .getMultiGraph(
        'https://api.twelvedata.com/market_movers/etf?&apikey=1056c69761fe4804a57ae7863552b96d&source=docs'
      )
      .subscribe((data: any) => {
        this.model.hidespinner();
        this.multiIndex = [];
        if (data.status == 'error') {
        } else {
          for (let i = 0; i < data.values.length; i++) {
            this.multiIndex.push(data.values[i]);
          }
        }
      });
  }
}
