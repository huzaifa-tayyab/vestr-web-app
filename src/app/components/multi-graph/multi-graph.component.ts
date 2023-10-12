import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Highcharts from 'highcharts';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-multi-graph',
  templateUrl: './multi-graph.component.html',
  styleUrls: ['./multi-graph.component.scss'],
})
export class MultiGraphComponent implements OnInit {
  @Input() index: string;
  @Input() symbol: any[];
  @Input() type: any;
  @Input() duration: any;
  seriesCounter = 0;
  Highcharts: typeof Highcharts = Highcharts;
  getGraphData: any = [];
  chartOptions: Highcharts.Options = {};
  vestLogin: any;
  allTrendingData: any;
  seriesOptions: any = [];
  showGraph = false;
  showOption = false;
  @Output() userDetails = new EventEmitter<any>();
  constructor(public model: ModelService) {}
  ngOnChanges() {
    if (this.showOption) {
      this.ngOnInit();
    }
  }
  chartCallback: Highcharts.ChartCallbackFunction = function (chart): void {
    setTimeout(() => {
      chart.reflow();
    }, 0);
  };
  ngOnInit() {
    this.showGraph = false;
    this.showOption = true;
    this.seriesCounter = 0;
    this.seriesOptions = [];
    //console.log(this.chartOptions);
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    if (this.type == 'crypto') {
      for (let i = 0; i < this.symbol.length; i++) {
        this.getAllPost(this.symbol[i].name, this.symbol[i].color);
      }
    }
    if (this.type == 'stock') {
      // this.getMultiGraph();
      this.getNewGraph();
      // for (let i = 0; i < this.symbol.length; i++) {
      //   this.getChartData(this.symbol[i].name,this.symbol[i].color);
      // }
    }
  }
  getNewGraph() {
    this.model
      .common_api(
        'user/market/sentiments',
        {
          topic: 'alltickers',
          size: '15',
          page: '1',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        var newDate = [];
        if (data.status == 1) {
          var negative = [];
          var positive = [];
          var neutral = [];
          var sentiment_score = [];
          Object.keys(data.data.data).forEach((key) => {
            newDate.unshift(key);
            negative.unshift(data.data.data[key].Negative);
            sentiment_score.unshift(data.data.data[key].sentiment_score);
            positive.unshift(data.data.data[key].Positive);
            neutral.unshift(data.data.data[key].Neutral);
          });
          this.seriesOptions.push({
            name: 'Negative',
            data: negative,
            color: '#ca222c',
            showInLegend: false,
          });
          this.seriesOptions.push({
            name: 'sentiment_score',
            data: sentiment_score,
            color: '#fff',
            showInLegend: false,
          });
          this.seriesOptions.push({
            name: 'Positive',
            data: positive,
            color: '#1dcf5b',
            showInLegend: false,
          });
          this.seriesOptions.push({
            name: 'Neutral',
            data: neutral,
            color: '#cbcf1d',
            showInLegend: false,
          });
          this.getChart(newDate);
          this.showGraph = true;
        }
      });
  }
  replaceKeys(object) {
    Object.keys(object).forEach((key) => {
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
  getMultiGraph() {
    var url = '';
    var e = new Date();
    var end_date = this.formatDate(e);
    if (this.duration == 'live') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 1);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=1min&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }
    if (this.duration == '1_hour') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 1);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=1min&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }
    if (this.duration == '1_day') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 1);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=30min&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }
    if (this.duration == '1_week') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 7);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=2h&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }
    if (this.duration == '3_month') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 90);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=1day&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }
    if (this.duration == '1_year') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 365);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=1week&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }
    if (this.duration == 'all_time') {
      var s = new Date();
      var ss = s.setDate(s.getDate() - 1825);
      var start_date = this.formatDate(ss);
      //console.log(start_date);
      url =
        'https://api.twelvedata.com/time_series?symbol=SPX,IXIC,DJI,RUT&interval=1month&apikey=1056c69761fe4804a57ae7863552b96d&type=Index&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
    }

    //console.log(url);
    this.model.getMultiGraph(url).subscribe((data: any) => {
      console.log(data);
      if (data.status == 'error') {
        this.model.alerterror(data.message);
      }
      {
        if (data.SPX.status == 'ok') {
          this.userDetails.emit({ name: 'SPX', data: data.SPX.values });
          var amount = [];
          var newDate = [];
          var revMyArr = [].concat(data.SPX.values).reverse();
          //console.log(revMyArr);
          for (const key in revMyArr) {
            // amount.push(parseFloat(revMyArr[key].close));
            amount.push(this.getPercentage2(revMyArr[key]));
            newDate.push(revMyArr[key].datetime);
          }
          console.log(amount);
          console.log(newDate);
          this.seriesOptions.push({
            name: 'SPX',
            data: amount,
            color: this.symbol[0].color,
            showInLegend: false,
          });
          this.getChart(newDate);
        }
        if (data.IXIC.status == 'ok') {
          this.userDetails.emit({ name: 'IXIC', data: data.IXIC.values });
          var amount = [];
          var newDate = [];
          var revMyArr = [].concat(data.IXIC.values).reverse();
          for (const key in revMyArr) {
            // amount.push(parseFloat(revMyArr[key].close));
            amount.push(this.getPercentage2(revMyArr[key]));
            newDate.push(revMyArr[key].datetime);
          }
          this.seriesOptions.push({
            name: 'IXIC',
            data: amount,
            color: this.symbol[1].color,
            showInLegend: false,
          });
          this.getChart(newDate);
        }
        if (data.DJI.status == 'ok') {
          this.userDetails.emit({ name: 'DJI', data: data.DJI.values });
          var amount = [];
          var newDate = [];
          var revMyArr = [].concat(data.DJI.values).reverse();
          for (const key in revMyArr) {
            // amount.push(parseFloat(revMyArr[key].close));
            amount.push(this.getPercentage2(revMyArr[key]));
            newDate.push(revMyArr[key].datetime);
          }
          this.seriesOptions.push({
            name: 'DJI',
            data: amount,
            color: this.symbol[2].color,
            showInLegend: false,
          });
          this.getChart(newDate);
        }
        if (data.RUT.status == 'ok') {
          this.userDetails.emit({ name: 'RUT', data: data.RUT.values });
          var amount = [];
          var newDate = [];
          var revMyArr = [].concat(data.RUT.values).reverse();
          for (const key in revMyArr) {
            // amount.push(parseFloat(revMyArr[key].close));
            amount.push(this.getPercentage2(revMyArr[key]));
            newDate.push(revMyArr[key].datetime);
          }
          this.seriesOptions.push({
            name: 'RUT',
            data: amount,
            color: this.symbol[3].color,
            showInLegend: false,
          });
          this.getChart(newDate);
          this.seriesCounter = 4;
          this.showGraph = true;
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
  getChartData(symbol, color) {
    this.model
      .common_api(
        'user/market/graph-data-by-symbol',
        {
          user_uid: this.vestLogin.user_uid,
          symbol: symbol,
          duration: this.duration,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          if (data.data.length > 0) {
            //console.log(data);
            this.allTrendingData = data.data;
            if (data.data.length > 0) {
              this.getGraphData = data.data;
              this.userDetails.emit(this.getGraphData);
              this.seriesCounter += 1;
              var amount = [];
              for (const key in this.getGraphData) {
                // amount.push(this.getPercentage(this.getGraphData[key]));
                amount.push(this.getGraphData[key].VWAP);
              }
              this.seriesOptions.push({
                name: symbol,
                data: amount,
                color: color,
                showInLegend: false,
              });
              // this.getChart(data.data, symbol);
            }
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  getPercentage2(item) {
    const values = ((item.open - item.close) / item.open) * 100;
    if (values >= 0) {
      return values;
    } else {
      return values;
    }
  }
  getPercentage(item) {
    const values = ((item.OpenPrice - item.VWAP) / item.OpenPrice) * 100;
    if (values >= 0) {
      return values;
    } else {
      return values;
    }
  }
  getAllPost(symbol, color) {
    this.model.showspinner();
    this.model
      .common_api(
        'user/market/crypto-details',
        {
          user_uid: this.vestLogin.user_uid,
          symbol: symbol,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          this.allTrendingData = '';
          if (data.status == 1) {
            this.allTrendingData = data.data;
            if (data.data.graph_data.length > 0) {
              //console.log(this.allTrendingData);
              this.userDetails.emit({
                name: this.allTrendingData.details,
                data: this.allTrendingData.graph_data,
              });
              this.seriesCounter += 1;
              var amount = [];
              for (const key in data.data.graph_data) {
                // amount.push(this.getPercentage(this.getGraphData[key]));
                amount.push(data.data.graph_data[key].VWAP);
              }
              this.seriesOptions.push({
                name: symbol,
                data: amount,
                color: color,
                showInLegend: false,
              });
              // this.getChart(data.data.graph_data, symbol);
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
  getChart(newDate) {
    this.chartOptions = {
      title: {
        text: '',
      },
      credits: {
        enabled: false,
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        crosshair: {
          color: 'grey',
          dashStyle: 'Dash',
          width: 2,
        },
        type: 'datetime',
        categories: newDate,
        visible: true,
        labels: {
          enabled: false,
        },
      },
      yAxis: {
        visible: false,
        title: {
          text: 'Amount',
        },
        labels: {
          enabled: false,
        },
        plotLines: [
          {
            value: 0,
            width: 2,
            color: 'silver',
          },
        ],
      },
      chart: {
        backgroundColor: 'transparent',
        height: 250,
      },
      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: false,
        },
        line: {
          marker: {
            enabled: false,
          },
        },
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return '<b>$' + this.y.toFixed(2) + '<b/><br/>' + this.x;
        },
        pointFormat: '<b>${point.y}</b><br/>',
        valueDecimals: 2,
        // split: true
      },
      series: this.seriesOptions,
    };
  }
}
