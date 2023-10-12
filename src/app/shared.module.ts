import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ThemeSetComponent } from './auth/theme-set/theme-set.component';
import { NgPipesModule } from 'ngx-pipes';
import { FeedComponent } from './components/feed/feed.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { GraphComponent } from './components/graph/graph.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { DatalistComponent } from './components/datalist/datalist.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MultiGraphComponent } from './components/multi-graph/multi-graph.component';
import { TwelveGraphComponent } from './components/twelve-graph/twelve-graph.component';
import { DynamicDatalistComponent } from './components/dynamic-datalist/dynamic-datalist.component';
import { QuillModule } from 'ngx-quill';
import { DraftFeedComponent } from './components/draft-feed/draft-feed.component';

@NgModule({
  declarations: [
    ThemeSetComponent,
    FeedComponent,
    GraphComponent,
    DatalistComponent,
    MultiGraphComponent,
    TwelveGraphComponent,
    DynamicDatalistComponent,
    DraftFeedComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    QuillModule,
    NgPipesModule,
    FormsModule,
    HighchartsChartModule,
    IonicModule,
    NgxDatatableModule,
  ],
  exports: [
    ThemeSetComponent,
    FeedComponent,
    GraphComponent,
    DatalistComponent,
    MultiGraphComponent,
    TwelveGraphComponent,
    DraftFeedComponent,
    DynamicDatalistComponent,
  ],
})
export class SharedModule {}
