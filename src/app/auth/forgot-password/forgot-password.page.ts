import { Component, ElementRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';
import { CustomValidators } from '../signup/custom-validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  isApiSend = false;
  orderForm: FormGroup;
  items: FormArray;
  isSubmitted: boolean = false;
  user_uid: any;

  orderForm2: FormGroup;
  items2: FormArray;
  isSubmitted2: boolean = false;

  isEightCharater: boolean = false;
  oneUpperLowerCase: boolean = false;
  oneNumber: boolean = false;
  oneSpecial: boolean = false;

  password: string = 'password';
  password2: string = 'password';
  otp: any;
  constructor(
    public model: ModelService,
    public router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) {
    this.route.params.subscribe((params) => {
      if (params['otp']) {
        this.otp = params['otp'];
        this.user_uid = params['user_uid'];
        this.orderForm2 = this.formBuilder.group({
          items2: this.formBuilder.array([]),
        });
        this.addItem2();
      }
    });
  }
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  get orderFormControl(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  get orderFormControl2(): FormArray {
    return this.orderForm2.get('items2') as FormArray;
  }

  ngOnInit(): void {
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
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),
        ],
      ],
      user_choice: ['phone'],
    });
  }

  addItem2(): void {
    this.items2 = this.orderForm2.get('items2') as FormArray;
    this.items2.push(this.createItem2());
  }
  createItem2(): FormGroup {
    return this.formBuilder.group(
      {
        otp: [this.otp],
        user_uid: [this.user_uid],
        password: [
          null,
          Validators.compose([
            Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true,
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true,
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true,
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true,
              }
            ),
            Validators.minLength(8),
          ]),
        ],
        con_password: [null, Validators.compose([Validators.required])],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
  verifyAPI() {
    if (this.items.invalid) {
      this.isSubmitted = true;
      return;
    } else {
      this.model.showspinner();
      this.model
        .common_api('user/forgot-password', this.items.value[0], '')
        .subscribe(
          (data: any) => {
            //console.log(data)
            this.model.hidespinner();
            if (data.status == 1) {
              this.isApiSend = true;
              // this.user_uid = data.user_uid;
              // this.addItem2();
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
  }
  login() {
    if (this.items2.invalid) {
      this.isSubmitted2 = true;
      return;
    } else {
      this.model.showspinner();
      this.model
        .common_api('user/reset-password', this.items2.value[0], '')
        .subscribe(
          (data: any) => {
            //console.log(data)
            this.model.hidespinner();
            if (data.status == 1) {
              this.model.alertsuccess(data.message);
              this.router.navigateByUrl('/login');
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
  showPassword(e: any) {
    this.password = e;
  }
  showPassword2(e: any) {
    this.password2 = e;
  }
  checkValue() {
    if (this.items2.value[0].password.length >= 8) {
      this.isEightCharater = true;
    } else {
      this.isEightCharater = false;
    }
    if (
      this.items2.value[0].password.match(/[A-Z]/) &&
      this.items2.value[0].password.match(/[a-z]/)
    ) {
      this.oneUpperLowerCase = true;
    } else {
      this.oneUpperLowerCase = false;
    }
    if (this.items2.value[0].password.match(/\d/)) {
      this.oneNumber = true;
    } else {
      this.oneNumber = false;
    }
    if (
      this.items2.value[0].password.match(
        /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
      )
    ) {
      this.oneSpecial = true;
    } else {
      this.oneSpecial = false;
    }
  }
}
