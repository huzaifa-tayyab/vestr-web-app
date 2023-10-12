import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModelService } from 'src/app/services/model.service';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginPage implements OnInit {
  password: string = 'password';
  orderForm: FormGroup;
  items: FormArray;
  isSubmitted: boolean = false;

  isEightCharater: boolean = false;
  oneUpperLowerCase: boolean = false;
  oneNumber: boolean = false;
  oneSpecial: boolean = false;
  constructor(
    public model: ModelService,
    public router: Router,
    private formBuilder: FormBuilder,
    private elementRef: ElementRef
  ) {}
  ionViewDidLeave() {
    this.elementRef.nativeElement.remove();
  }
  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.addItem();
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
    });
  }
  login() {
    if (this.items.invalid) {
      this.isSubmitted = true;
      return;
    } else {
      this.model.showspinner();
      this.model.common_api('user/login', this.items.value[0], '').subscribe(
        (data: any) => {
          //console.log(data)
          this.model.hidespinner();
          if (data.status == 1) {
            localStorage.setItem('vest_login', JSON.stringify(data.data));
            this.model.alertsuccess(data.message);
            this.router.navigateByUrl('/app');
          } else {
            if (data.is_not_verified == 1) {
              // localStorage.setItem("vest_demo_login", JSON.stringify(data));
              // this.model.alertsuccess(data.message);
              // this.router.navigateByUrl("/otp");
              localStorage.setItem('vest_login', JSON.stringify(data.data));
              this.model.alertsuccess(data.message);
              this.router.navigateByUrl('/app');
            } else {
              this.model.alerterror(data.message);
            }
          }
        },
        (err: any) => {
          this.model.hidespinner();
          this.model.alerterror('System generated errors');
        }
      );
    }
  }
  get orderFormControl(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  showPassword(e: any) {
    this.password = e;
  }
  checkValue() {
    if (this.items.value[0].password.length >= 8) {
      this.isEightCharater = true;
    } else {
      this.isEightCharater = false;
    }
    if (
      this.items.value[0].password.match(/[A-Z]/) &&
      this.items.value[0].password.match(/[a-z]/)
    ) {
      this.oneUpperLowerCase = true;
    } else {
      this.oneUpperLowerCase = false;
    }
    if (this.items.value[0].password.match(/\d/)) {
      this.oneNumber = true;
    } else {
      this.oneNumber = false;
    }
    if (
      this.items.value[0].password.match(
        /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
      )
    ) {
      this.oneSpecial = true;
    } else {
      this.oneSpecial = false;
    }
  }
}
