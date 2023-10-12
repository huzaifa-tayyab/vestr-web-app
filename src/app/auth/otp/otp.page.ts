import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
  isApiSend = false;
  orderForm: FormGroup;
  items: FormArray;
  isSubmitted: boolean = false;
  basicDetails: any;
  constructor(
    public model: ModelService,
    public router: Router,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) {}
  get orderFormControl(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ngOnInit(): void {
    this.basicDetails = JSON.parse(localStorage.getItem('vest_demo_login'));
    if (!this.basicDetails) {
      this.router.navigateByUrl('/');
    }
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.addItem();
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      user_uid: [this.basicDetails.user_uid],
      phone: [
        this.basicDetails.phone,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ],
      ],
      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ],
      ],
      is_term: [false],
    });
  }
  resendOTP() {
    this.model.showspinner();
    this.model.common_api('user/resend-otp', this.items.value[0], '').subscribe(
      (data: any) => {
        //console.log(data)
        this.model.hidespinner();
        if (data.status == 1) {
          this.model.alertsuccess(data.message);
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
  verifyAPI() {
    //console.log(this.items.value[0].is_term)
    if (this.items.value[0].is_term) {
      this.model.showspinner();
      this.model.common_api('user/send-otp', this.items.value[0], '').subscribe(
        (data: any) => {
          //console.log(data)
          this.model.hidespinner();
          if (data.status == 1) {
            this.isApiSend = true;
            this.model.alertsuccess(data.message);
          } else {
            this.model.alerterror(data.message);
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
    } else {
      this.model.alerterror('Please accept term & conditions.');
    }
  }
  login() {
    if (this.items.invalid) {
      this.isSubmitted = true;
      return;
    } else {
      this.model.showspinner();
      this.model
        .common_api('user/verify-otp', this.items.value[0], '')
        .subscribe(
          (data: any) => {
            //console.log(data)
            this.model.hidespinner();
            if (data.status == 1) {
              localStorage.setItem('vest_login', JSON.stringify(data.data));
              this.model.alertsuccess(data.message);
              this.router.navigateByUrl('/app');
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
  }
}
