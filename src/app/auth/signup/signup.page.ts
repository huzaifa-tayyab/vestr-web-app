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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  password: string = 'password';
  password2: string = 'password';
  orderForm: FormGroup;
  items: FormArray;
  isSubmitted: boolean = false;

  isEightCharater: boolean = false;
  oneUpperLowerCase: boolean = false;
  oneNumber: boolean = false;
  oneSpecial: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public model: ModelService,
    public router: Router,
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
    return this.formBuilder.group(
      {
        fname: [
          '',
          [
            // Validators.required
          ],
        ],
        lname: [
          '',
          [
            // Validators.required
          ],
        ],
        username: ['', [Validators.required, Validators.minLength(3)]],
        phone: [
          '',
          [
            // Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern('^(0|[1-9][0-9]*)$'),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'
            ),
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
        con_password: [null, Validators.compose([Validators.required])],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  login() {
    if (this.items.invalid) {
      this.isSubmitted = true;
      return;
    } else {
      this.model.showspinner();
      this.model.common_api('user/register', this.items.value[0], '').subscribe(
        (data: any) => {
          //console.log(data)
          this.model.hidespinner();
          if (data.status == 1) {
            localStorage.setItem('vest_login', JSON.stringify(data.data));
            this.model.alertsuccess(data.message);
            this.router.navigateByUrl('/app');
            // localStorage.setItem("vest_demo_login", JSON.stringify(data.data));
            // this.model.alertsuccess(data.message);
            // this.router.navigateByUrl("/otp");
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
  get orderFormControl(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  showPassword(e: any) {
    this.password = e;
  }
  showPassword2(e: any) {
    this.password2 = e;
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
