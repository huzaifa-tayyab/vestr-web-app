import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelService } from 'src/app/services/model.service';
import { PopoverController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Router } from '@angular/router';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [DatePipe],
})
export class ProfileComponent implements OnInit {
  vestLogin: any;
  userDetail: any;
  cover_img_path: any;
  profile_img_path: any;
  follow_to: any;
  followed_by: any;

  items: FormArray;
  orderForm: FormGroup;
  isSubmitted: boolean = false;
  dateValue = 'Birthday';

  coverImage: any;
  coverType: any;
  profileImage: any;
  profileType: any;
  isFileUpload = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  constructor(
    private popoverController: PopoverController,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    public model: ModelService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.vestLogin = JSON.parse(localStorage.getItem('vest_login'));
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.addItem();
    this.model
      .common_api(
        'user/details',
        { user_uid: this.vestLogin.user_uid },
        this.vestLogin.token
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.orderForm
              .get('items')
              ['controls'][0].controls.fname.patchValue(data.data.fname);
            this.orderForm
              .get('items')
              ['controls'][0].controls.lname.patchValue(data.data.lname);
            this.orderForm
              .get('items')
              ['controls'][0].controls.username.patchValue(data.data.username);

            this.orderForm
              .get('items')
              ['controls'][0].controls.bio.patchValue(data.data.bio);
            if (data.data.gender) {
              this.orderForm
                .get('items')
                ['controls'][0].controls.gender.patchValue(data.data.gender);
            }
            if (data.data.dob) {
              const nDate = new Date(data.data.dob);
              this.dateValue = this.datePipe.transform(nDate, 'yyyy-MM-dd');
              this.orderForm
                .get('items')
                ['controls'][0].controls.dob.patchValue(data.data.dob);
            }

            if (data.data.email != 'undefined') {
              this.orderForm
                .get('items')
                ['controls'][0].controls.email.patchValue(data.data.email);
            }
            if (data.data.phone != 'undefined') {
              this.orderForm
                .get('items')
                ['controls'][0].controls.phone.patchValue(data.data.phone);
            }
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
      user_uid: [this.vestLogin.user_uid],
      fname: [
        null,
        [
          // Validators.required
        ],
      ],
      username: ['', [Validators.required]],
      lname: [
        null,
        [
          // Validators.required
        ],
      ],
      dob: [
        null,
        [
          // Validators.required
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),
        ],
      ],
      phone: [''],
      bio: [''],
      gender: ['male', [Validators.required]],
      profile_image: [''],
      cover_image: [''],
    });
  }
  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  get orderFormControl(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  submit() {
    if (this.items.invalid) {
      this.isSubmitted = true;
    } else {
      this.isSubmitted = false;
      if (this.profileImage) {
        this.orderForm
          .get('items')
          ['controls'][0].controls.profile_image.patchValue(this.profileImage);
      }
      if (this.coverImage) {
        this.orderForm
          .get('items')
          ['controls'][0].controls.cover_image.patchValue(this.coverImage);
      }

      this.model.showspinner();
      this.model
        .common_api(
          'user/update-details',
          this.items.value[0],
          this.vestLogin.token
        )
        .subscribe(
          (data: any) => {
            //console.log(data);
            this.model.hidespinner();
            if (data.status == 1) {
              this.model.presentAlert(data.message, 'Success');
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
  coverUploadFile(e: any) {
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
          this.coverImage = data.filename;
          this.coverType = data.type;
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
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    // event.blob can be used to upload the cropped image
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  getBlob(e) {
    console.log(e);
  }
  profileUploadFile(e: any) {
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
          this.profileImage = data.filename;
          this.profileType = data.type;
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
  formatDate(value: any) {
    this.popoverController.dismiss();
    return format(parseISO(value), 'yyyy-MM-dd');
  }
}
