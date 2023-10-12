import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.page.html',
  styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage implements OnInit {
  vestLogin: any;
  items: FormArray;
  orderForm: FormGroup;
  isSubmitted: boolean = false;
  uid: any;
  isCat = '1';
  isFileUpload = false;
  file_name: any = '';
  file_type: any = '';
  roomPath: any;
  room_uid: any;
  constructor(
    public model: ModelService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.addItem();
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.uid = params['id'];
        this.room_uid = this.uid;
        this.roomPath = window.location.origin + '/app/rooms/' + this.uid;
        if (this.uid != 'create') {
          this.getEditRoom();
        }
      } else {
        this.getRoomUid();
      }
    });
  }
  copyMessage() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.roomPath;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.presentToast(this.roomPath);
  }
  async presentToast(e) {
    const toast = await this.toastController.create({
      message: 'Copy ' + e,
      duration: 1500,
      position: 'bottom',
    });

    await toast.present();
  }
  getRoomUid() {
    this.model
      .common_api(
        'user/room/generate-room-uid',
        { user_uid: this.vestLogin.user_uid },
        this.vestLogin.token
      )
      .subscribe((data) => {
        console.log(data);
        this.room_uid = data.data.room_uid;
        this.roomPath =
          window.location.origin + '/app/rooms/' + data.data.room_uid;
      });
  }
  getEditRoom() {
    this.model
      .common_api(
        'user/room/details',
        { user_uid: this.vestLogin.user_uid, room_uid: this.uid },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.orderForm
              .get('items')
              ['controls'][0].controls.room_uid.patchValue(data.data.room_uid);
            this.orderForm
              .get('items')
              ['controls'][0].controls.name.patchValue(data.data.name);
            this.orderForm
              .get('items')
              ['controls'][0].controls.username.patchValue(data.data.username);
            this.orderForm
              .get('items')
              ['controls'][0].controls.description.patchValue(
                data.data.description
              );
            this.orderForm
              .get('items')
              ['controls'][0].controls.categories.patchValue(
                data.data.categories
              );
            this.orderForm
              .get('items')
              ['controls'][0].controls.room_type.patchValue(
                data.data.room_privacy
              );
            this.orderForm
              .get('items')
              ['controls'][0].controls.password.patchValue(data.data.password);
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.presentAlert('System generated errors', 'Error');
        }
      );
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      room_uid: [''],
      user_uid: [this.vestLogin.user_uid],
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      description: [''],
      categories: [''],
      room_type: [this.isCat],
      password: [''],
      image_name: [''],
    });
  }
  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  get orderFormControl(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  message: any;
  imagePath: any;
  url: any;
  uploadFile(e: any) {
    const files = e.target.files;
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.url = reader.result;
    };
    this.model.showspinner();
    this.isFileUpload = true;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    this.model.uploadFile(formData, this.vestLogin.token).subscribe(
      (data) => {
        this.model.hidespinner();
        this.isFileUpload = false;
        //console.log(data)
        if (data.status == 1) {
          this.file_name = data.filename;
          this.file_type = data.type;
        } else {
          this.model.alerterror(data.message);
        }
      },
      (err) => {
        this.model.hidespinner();
        this.isFileUpload = false;
        this.model.alerterror('System generated errors');
      }
    );
  }
  addRoom() {
    if (this.items.invalid) {
      this.model.alerterror('Name & Username are required.');
    } else {
      if (this.items.value[0].categories) {
        this.orderForm
          .get('items')
          ['controls'][0].controls.categories.patchValue(
            this.items.value[0].categories.toString()
          );
      }

      if (this.file_name) {
        this.orderForm
          .get('items')
          ['controls'][0].controls.image_name.patchValue(this.file_name);
      }
      this.orderForm
        .get('items')
        ['controls'][0].controls.room_type.patchValue(this.isCat);
      this.isSubmitted = false;
      this.model.showspinner();
      if (this.uid) {
        this.model
          .common_api(
            'user/room/edit-room',
            this.items.value[0],
            this.vestLogin.token
          )
          .subscribe(
            (data: any) => {
              //console.log(data);
              this.model.hidespinner();
              if (data.status == 1) {
                this.model.presentAlert(data.message, 'Success');
                this.router.navigateByUrl('/app/rooms');
              } else {
                this.model.presentAlert(data.message, 'Error');
              }
            },
            (err: any) => {
              this.model.hidespinner();
              this.model.presentAlert('System generated errors', 'Error');
            }
          );
      } else {
        this.orderForm
          .get('items')
          ['controls'][0].controls.room_uid.patchValue(this.room_uid);
        this.model
          .common_api(
            'user/room/create-room',
            this.items.value[0],
            this.vestLogin.token
          )
          .subscribe(
            (data: any) => {
              //console.log(data);
              this.model.hidespinner();
              if (data.status == 1) {
                this.model.presentAlert(data.message, 'Success');
                this.router.navigateByUrl('/app/rooms');
              } else {
                this.model.presentAlert(data.message, 'Error');
              }
            },
            (err: any) => {
              this.model.hidespinner();
              this.model.presentAlert('System generated errors', 'Error');
            }
          );
      }
    }
  }
}
