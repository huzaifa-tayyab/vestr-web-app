import { Component, ElementRef, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-view-all-graph',
  templateUrl: './view-all-graph.page.html',
  styleUrls: ['./view-all-graph.page.scss'],
})
export class ViewAllGraphPage implements OnInit {
  vestLogin: any;
  biggerMoverStocks: any = [];
  biggerMoverStocks2: any = [];
  constructor(public model: ModelService, private elementRef: ElementRef) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.getBiggestMover();
  }
  getBiggestMover() {
    this.model
      .getMultiGraph(
        'https://api.twelvedata.com/market_movers/stocks?&apikey=1056c69761fe4804a57ae7863552b96d&source=docs'
      )
      .subscribe((data: any) => {
        this.biggerMoverStocks = [];
        this.biggerMoverStocks2 = [];
        if (data.status == 'error') {
        } else {
          for (let i = 0; i < data.values.length; i++) {
            this.biggerMoverStocks.push(data.values[i]);
            this.getMoverData(data.values[i].symbol, i, data.values[i]);
          }
        }
      });
  }
  getMoverData(symbol, i, datapatch) {
    var s = new Date();
    var ss = s.setDate(s.getDate() - 2);
    var start_date = this.formatDate(ss);
    var url = '';
    var e = new Date();
    var end_date = this.formatDate(e);
    url =
      'https://api.twelvedata.com/time_series?symbol=' +
      symbol +
      '&interval=30min&apikey=1056c69761fe4804a57ae7863552b96d&start_date=' +
      start_date +
      '&end_date=' +
      end_date;
    this.model.getMultiGraph(url).subscribe((data: any) => {
      if (data.status == 'error') {
        // this.model.alerterror(data.message)
      }
      {
        var revMyArr = [].concat(data.values).reverse();
        this.biggerMoverStocks[i].graphdata = revMyArr;
        this.biggerMoverStocks[i].data = revMyArr[revMyArr.length - 1];
        if (this.biggerMoverStocks[i].data) {
          this.biggerMoverStocks2.push(datapatch);
        }
      }
    });
  }
  getIndexPercentage(item) {
    const values = ((item.open - item.close) / item.open) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
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
}
