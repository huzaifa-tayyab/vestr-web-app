import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  NgxNotificationDirection,
  NgxNotificationMsgService,
  NgxNotificationStatusMsg,
} from 'ngx-notification-msg';
import { ToastrService } from 'ngx-toastr';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: '',
  }),
};
const httpOption = {
  headers: new HttpHeaders({
    Authorization: '',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  public url: string;
  constructor(
    private readonly ngxNotificationMsgService: NgxNotificationMsgService,
    public spinner: NgxSpinnerService,
    public http: HttpClient,
    private toastr: ToastrService,
    private alertController: AlertController
  ) {
    this.url = environment.url;
  }
  getBundle() {
    return this.http.get(this.url + 'transunion/get/bundle', httpOptions);
  }
  getMultiGraph(url) {
    return this.http.get(url);
  }
  getData(url, token) {
    const newhttpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(this.url + url, newhttpOptions);
  }
  uploadFile(opost: any, token): Observable<any> {
    const newhttpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      this.url + 'global-upload-file',
      opost,
      newhttpOptions
    );
  }
  uploadAgreementFile(opost: any): Observable<any> {
    return this.http.post(
      this.url + 'global/upload-file/file',
      opost,
      httpOption
    );
  }
  uploadImages(opost: any): Observable<any> {
    return this.http.post(this.url + 'uploadfile', opost, httpOption);
  }
  uploadany_id(opost: any): Observable<any> {
    return this.http.post(
      this.url + 'global/upload-file/any-bs',
      opost,
      httpOption
    );
  }
  uploadVideos(opost: any): Observable<any> {
    return this.http.post(
      this.url + 'global/upload-file/video',
      opost,
      httpOption
    );
  }
  uploadAudio(opost: any): Observable<any> {
    return this.http.post(
      this.url + 'global/upload-file/audio',
      opost,
      httpOption
    );
  }
  getCountry(): Observable<any> {
    return this.http.get('assets/json/country.json');
  }
  getHtml(url): Observable<any> {
    return this.http.get(url, { responseType: 'text' });
  }
  getAllNews(e): Observable<any> {
    return this.http.get(e);
  }
  common_api(api_name: any, opost: any, token: any): Observable<any> {
    const newhttpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(this.url + api_name, opost, newhttpOptions);
  }
  showspinner() {
    this.spinner.show();
  }
  hidespinner() {
    this.spinner.hide();
  }
  async presentAlert(e: any, ee: any) {
    const alert = await this.alertController.create({
      header: ee,
      mode: 'ios',
      message: e,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async alertsuccess(e) {
    this.toastr.success(e, 'Success');
  }
  async alerterror(e) {
    this.toastr.error(e, 'Failure');
  }
}
