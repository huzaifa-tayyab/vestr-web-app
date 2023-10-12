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
import { ModelService } from "src/app/services/model.service";

@Component({
  selector: "app-dynamic-datalist",
  templateUrl: "./dynamic-datalist.component.html",
  styleUrls: ["./dynamic-datalist.component.scss"],
})
export class DynamicDatalistComponent implements OnInit {
  @Input() dataList: any;
  @Input() maindata;
  any;
  @Input() columns: any;
  @Input() title: any;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ColumnMode = ColumnMode;
  rows = [];
  temp = [];
  vestLogin: any;
  constructor(public router: Router, public model: ModelService) {}
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem("vest_login"));
    this.temp = [...this.dataList];
    this.rows = this.dataList;
    console.log(this.dataList);
  }
  goToMarketPage(symbol) {
    if (this.vestLogin) {
      if (symbol.v2 == "stock") {
        this.router.navigateByUrl("/app/market-detail/" + symbol.symbol);
      } else {
        this.router.navigateByUrl("/app/crypto-detail/" + symbol.symbol);
      }
    } else {
      if (symbol.v2 == "stock") {
        this.router.navigateByUrl("/home/market-detail/" + symbol.symbol);
      } else {
        this.router.navigateByUrl("/home/crypto-detail/" + symbol.symbol);
      }
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
  removeItemList(row) {
    this.model
      .common_api(
        "user/lists/remove-item",
        {
          user_uid: this.vestLogin.user_uid,
          list_item_uid: row.v1,
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.rows = this.arrayRemove(this.rows, row.v1);
          this.model.alertsuccess(data.message);
        },
        (err: any) => {
          this.model.alerterror("System generated errors");
        }
      );
  }
  arrayRemove(array, rowName) {
    return array.filter(function (element) {
      if (element.v1 == rowName) {
        console.log(element);
      }

      return element.v1 != rowName;
    });
  }
}
