import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ColumnMode } from "@swimlane/ngx-datatable";

@Component({
  selector: "app-datalist",
  templateUrl: "./datalist.component.html",
  styleUrls: ["./datalist.component.scss"],
})
export class DatalistComponent implements OnInit {
  @Input() dataList: any;
  @Input() columns: any;
  @Input() title: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  rows = [];
  temp = [];
  vestLogin: any;
  constructor(public router: Router) {}
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem("vest_login"));
    this.temp = [...this.dataList];
    this.rows = this.dataList;
    //console.log(this.dataList);
  }
  goToMarketPage(symbol) {
    if (this.vestLogin) {
      this.router.navigateByUrl("/app/market-detail/" + symbol);
    } else {
      this.router.navigateByUrl("/home/market-detail/" + symbol);
    }
  }
  getPercentageStocks(item) {
    const values = ((item.open - item.close) / item.open) * 100;
    if (values >= 0) {
      return { value: values, key: true };
    } else {
      return { value: values, key: false };
    }
  }
}
