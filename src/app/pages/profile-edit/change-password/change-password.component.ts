import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomValidators } from "./custom-validators";
import { Location } from "@angular/common";
import { ModelService } from "src/app/services/model.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  password: string = "password";
  password2: string = "password";
  password3: string = "password";
  items: FormArray;
  orderForm: FormGroup;
  isSubmitted: boolean = false;

  isEightCharater: boolean = false;
  oneUpperLowerCase: boolean = false;
  oneNumber: boolean = false;
  oneSpecial: boolean = false;

  basicDetails: any;
  constructor(
    private _location: Location,
    public model: ModelService,
    public router: Router,
    private formBuilder: FormBuilder
  ) {}

  get orderFormControl(): FormArray {
    return this.orderForm.get("items") as FormArray;
  }
  backClicked() {
    this._location.back();
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
  addItem(): void {
    this.items = this.orderForm.get("items") as FormArray;
    this.items.push(this.createItem());
  }
  removeItem(i: any) {
    this.items.removeAt(i);
  }
  ngOnInit() {
    this.basicDetails = JSON.parse(localStorage.getItem("vest_login"));
    // localStorage.removeItem('basicDetails');
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.addItem();
  }
  createItem(): FormGroup {
    return this.formBuilder.group(
      {
        user_uid: [this.basicDetails.user_uid],
        old_password: ["", [Validators.required]],
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
        new_password: [null, Validators.compose([Validators.required])],
      },
      {
        validator: CustomValidators.passwordMatchValidator,
      }
    );
  }
  submit() {
    if (this.items.invalid) {
      this.isSubmitted = true;
    } else {
      this.isSubmitted = false;
      this.model.showspinner();
      this.model
        .common_api(
          "user/change-password",
          this.items.value[0],
          this.basicDetails.token
        )
        .subscribe(
          (data: any) => {
            //console.log(data);
            this.model.hidespinner();
            if (data.status == 1) {
              this.model.presentAlert(data.message, "Success");
              // this.router.navigateByUrl('/settings');
            } else {
              this.model.presentAlert(data.message, "Error");
            }
          },
          (err: any) => {
            this.model.hidespinner();
            this.model.presentAlert("System generated errors", "Error");
          }
        );
    }
  }
  showPassword(e) {
    //console.log(this.orderForm.get('items')['controls'][0].controls.password.errors?.minlength)
    this.password = e;
  }
  showPassword2(e) {
    this.password2 = e;
  }
  showPassword3(e) {
    this.password3 = e;
  }
}
