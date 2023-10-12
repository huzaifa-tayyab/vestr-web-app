import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import Highcharts from "highcharts";
import { ModelService } from "src/app/services/model.service";

@Component({
  selector: "app-twelve-graph",
  templateUrl: "./twelve-graph.component.html",
  styleUrls: ["./twelve-graph.component.scss"],
})
export class TwelveGraphComponent implements OnInit {
  @Input() index: number;
  @Input() graphdata: any;
  @Input() type: any;
  @Input() height: number;
  @Input() duration: string;
  @Input() content: boolean;
  @Output() changeAmount = new EventEmitter<any>();
  Highcharts: typeof Highcharts = Highcharts;
  getGraphData: any = [];
  chartOptions: Highcharts.Options = {};
  vestLogin: any;
  allTrendingData: any;
  showOption = false;
  constructor(public model: ModelService) {}
  chartCallback: Highcharts.ChartCallbackFunction = function (chart): void {
    setTimeout(() => {
      chart.reflow();
    }, 0);
  };
  ngOnChanges() {
    if (this.showOption) {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem("vest_login"));
    this.showOption = true;
    this.getChart(this.graphdata);
    setInterval(() => {
      const updatedData = JSON.parse(localStorage.getItem("updatedData"));
      if (updatedData) {
        this.changeAmount.emit(updatedData);
        localStorage.removeItem("updatedData");
      }
    }, 500);
  }
  getChart(items) {
    // //console.log(items);
    var newDate = [];
    var amount = [];
    for (const key in items) {
      amount.push(parseFloat(items[key].close));
      newDate.push(items[key].datetime);
    }
    this.chartOptions = {
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      subtitle: {
        text: "",
      },
      xAxis: {
        crosshair: {
          color: "grey",
          dashStyle: "Dash",
          width: 2,
        },
        type: "datetime",
        categories: newDate,
        visible: false,
        labels: {
          enabled: false,
        },
      },
      yAxis: {
        visible: this.content,
        title: {
          text: "",
        },
        gridLineColor: "none",
        labels: {
          enabled: true,
        },
      },
      chart: {
        backgroundColor: "transparent",
        height: this.height,
      },
      plotOptions: {
        series: {
          threshold: parseFloat(items[0].close),
        },
      },
      tooltip: {
        useHTML: true,
        formatter() {
          localStorage.setItem(
            "updatedData",
            JSON.stringify(items[this.point.index])
          );
          // this.changeAmount(items[this.point.index]);
          return "<b>$" + this.y.toFixed(2) + "<b/><br/>" + this.x;
        },

        pointFormat: "<b>${point.y}</b><br/>",
        valueDecimals: 2,
        // split: true,
      },
      series: [
        {
          name: "",
          type: "line",
          data: amount,
          marker: {
            enabled: false,
          },
          showInLegend: false,
          color: "#1DCF5B",
          negativeColor: "#eb445a",
        },
      ],
    };
  }
}
