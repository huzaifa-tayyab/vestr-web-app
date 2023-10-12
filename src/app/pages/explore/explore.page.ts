import { Component, ElementRef, OnInit } from '@angular/core';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  darktheme = false;
  vestLogin: any;
  trending_articles: any = [];
  blog_image_path: any;
  trending_research: any = [];
  editor_pick: any = [];
  items: any = [];
  profile_image_path: any;
  dataToday: any;
  file_path: any;
  postDetailsData: any;
  sort_by = 'most_popular';
  post_date_filter = 'today';
  marketnew: any = [];
  newsIndex = 0;
  detailsNews: any = [];
  constructor(private elementRef: ElementRef, public model: ModelService) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ionViewDidEnter() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    const theme = localStorage.getItem('user-theme');
    if (theme) {
      if (theme === 'dark') {
        this.darktheme = true;
        document.body.setAttribute('color-theme', 'dark');
      } else {
        this.darktheme = false;
        document.body.setAttribute('color-theme', 'light');
      }
    } else {
      this.darktheme = false;
      document.body.setAttribute('color-theme', 'light');
    }
    this.gettrending_articlesDetails();
    this.getMarketNews();
    this.geteditor_pickDetails();
    this.gettrending_researchDetails();
    this.dataToday = this.formatDate(new Date());
    this.feed(this.dataToday);
  }
  getMarketNews() {
    this.model
      .common_api(
        'user/news/populart-events',
        {
          page: '1',
          size: '6',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        this.marketnew = [];
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            if (index <= 6) {
              this.marketnew.push(data.data[index]);
            }
          }
          this.getMarketNewsDetails(data.data[0].event_id);
        }
      });
  }
  getMarketNewsDetails(id) {
    this.model
      .common_api(
        'user/news/get-event-by-id',
        {
          page: '1',
          event_id: id,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        this.detailsNews = [];
        if (data.status == 1) {
          for (let index = 0; index < data.data.length; index++) {
            if (index <= 10) {
              this.detailsNews.push(data.data[index]);
            }
          }
        }
      });
  }
  changeNews(i, id) {
    this.newsIndex = i;
    this.getMarketNewsDetails(id);
  }
  openUrl(url) {
    window.open(url, '_blank');
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
  feed(dataToday) {
    let is_personal = '';
    if (this.vestLogin) {
      is_personal = '0';
    }
    this.model
      .common_api(
        'user/feed',
        {
          user_uid: this.vestLogin?.user_uid,
          is_personal: is_personal,
          page: '0',
          size: '10',
          sort_by: this.sort_by,
          post_date_filter: this.post_date_filter,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.items = data.data;
            this.profile_image_path = data.profile_image_path;
            //console.log(data);
            this.file_path = data.file_path;
            for (const key in this.items) {
              this.items[key].isMessage = false;
              this.items[key].isComment = false;
              this.items[key].message = '';
              if (this.items[key].post_votes.length == 0) {
                this.items[key].post_votes.push({ vote_type: 0 });
              }
            }
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  removeItem(e) {
    this.items.splice(e.id, 1);
  }
  getAllPost() {
    this.model.showspinner();
    this.model
      .common_api(
        'user/feed',
        {
          user_uid: this.vestLogin.user_uid,
          sort_by: this.sort_by,
          post_date_filter: this.post_date_filter,
          page: '0',
          size: '50',
        },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          this.model.hidespinner();
          this.items = [];
          if (data.status == 1) {
            this.items = data.data;
            this.profile_image_path = data.profile_image_path;
            //console.log(data);
            this.file_path = data.file_path;
            for (const key in this.items) {
              this.items[key].isMessage = false;
              this.items[key].isComment = false;
              this.items[key].message = '';
              if (this.items[key].post_votes.length == 0) {
                this.items[key].post_votes.push({ vote_type: 0 });
              }
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
  postDetails(e) {
    const post_uid = e.post_uid;
    const i = e.i;
    for (const key in this.items) {
      this.items[key].isMessage = false;
      this.items[key].isComment = false;
    }
    this.items[i].isMessage = !this.items[i].isMessage;
    this.items[i].isComment = !this.items[i].isComment;
    if (this.items[i].isMessage) {
      this.model
        .common_api(
          'user/post-details',
          {
            user_uid: this.vestLogin?.user_uid,
            post_uid: post_uid,
          },
          'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
        )
        .subscribe(
          (data: any) => {
            this.postDetailsData = null;
            if (data.status == 1) {
              this.postDetailsData = data.data;
              for (
                let key = 0;
                key < this.postDetailsData.comments.length;
                key++
              ) {
                if (key > 3) {
                  this.postDetailsData.comments.splice(key, 1);
                  return;
                }
                // for edit comment
                this.postDetailsData.comments[key].isMessage = false;
                this.postDetailsData.comments[key].message = '';
                // for add new comment
                this.postDetailsData.comments[key].isNewMessage = false;
                this.postDetailsData.comments[key].isNewComment = false;
                for (const j in this.postDetailsData.comments[key]
                  .child_comments.length) {
                  this.postDetailsData.comments[key].child_comments[
                    j
                  ].isMessage = false;
                  this.postDetailsData.comments[key].child_comments[
                    j
                  ].isNewComment = false;
                  this.postDetailsData.comments[key].child_comments[j].message =
                    '';
                  if (
                    this.postDetailsData.comments[key].child_comments[j]
                      .comments
                  ) {
                    for (const k in this.postDetailsData.comments[key]
                      .child_comments[j].comments.length) {
                      this.postDetailsData.comments[key].child_comments[
                        j
                      ].comments[k].isMessage = false;
                      this.postDetailsData.comments[key].child_comments[
                        j
                      ].comments[k].isNewComment = false;
                      this.postDetailsData.comments[key].child_comments[
                        j
                      ].comments[k].message = '';
                    }
                  }
                }
              }

              //console.log(this.postDetailsData);
            } else {
              this.model.alerterror(data.message);
            }
          },
          (err: any) => {
            this.model.alerterror('System generated errors');
          }
        );
    }
  }
  setVoteBlog(item, type) {
    this.model
      .common_api(
        'user/explore/blog/vote',
        {
          user_uid: this.vestLogin?.user_uid,
          blog_uid: item.blog_uid,
          vote_type: type,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            console.log(data);
            item.total_likes = data.up_vote;
            item.total_dislikes = data.down_vote;
            // if (type == 'up') {
            //   this.trending_articles[i].post_votes[0].vote_type = 1;
            // }
            // if (type == 'down') {
            //   this.trending_articles[i].post_votes[0].vote_type = 2;
            // }
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  setVote(e) {
    const post_uid = e.post_uid;
    const type = e.type;
    const item = e.item;
    const i = e.index;
    this.model
      .common_api(
        'user/vote-post',
        {
          user_uid: this.vestLogin?.user_uid,
          post_uid: post_uid,
          vote_type: type,
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe(
        (data: any) => {
          if (data.status == 1) {
            this.items[i].total_up_vote = data.up_vote;
            this.items[i].total_down_vote = data.down_vote;
            if (type == 'up') {
              this.items[i].post_votes[0].vote_type = 1;
            }
            if (type == 'down') {
              this.items[i].post_votes[0].vote_type = 2;
            }
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.alerterror('System generated errors');
        }
      );
  }
  gettrending_researchDetails() {
    this.model
      .common_api(
        'user/explore/blogs',
        {
          user_uid: this.vestLogin?.user_uid,
          blog_type: 'trending_research',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.status == 1) {
          this.trending_research = data.data;
        }
      });
  }
  geteditor_pickDetails() {
    this.model
      .common_api(
        'user/explore/blogs',
        {
          user_uid: this.vestLogin?.user_uid,
          blog_type: 'editor_pick',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.status == 1) {
          this.editor_pick = data.data;
        }
      });
  }
  gettrending_articlesDetails() {
    this.model
      .common_api(
        'user/explore/blogs',
        {
          user_uid: this.vestLogin?.user_uid,
          blog_type: 'trending_articles',
        },
        'am9obkBleGFtcGxlLmNvbTphYmMxMjM'
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.status == 1) {
          this.trending_articles = data.data;
          this.blog_image_path = data.blog_image_path;
        }
      });
  }
  ngOnInit() {}
  toggle(e: any) {
    if (e === 'light') {
      this.darktheme = true;
      document.body.setAttribute('color-theme', 'dark');
      localStorage.setItem('user-theme', 'dark');
    } else {
      this.darktheme = false;
      document.body.setAttribute('color-theme', 'light');
      localStorage.setItem('user-theme', 'light');
    }
  }
  getNowDate(e) {
    const now = new Date(e);
    return now;
  }
}
