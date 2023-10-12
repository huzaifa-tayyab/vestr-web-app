import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, PopoverController } from '@ionic/angular';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
// import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { ModelService } from 'src/app/services/model.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit {
  // @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  formattedaddress = ' ';
  options: Options = {
    bounds: undefined,
    fields: ['address_component'],
    strictBounds: false,
    types: ['address'],
    origin: undefined,
    componentRestrictions: undefined,
  };
  basicDetails: any;
  items: FormArray;
  orderForm: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private alertController: AlertController,
    private popoverController: PopoverController,
    public model: ModelService,
    public router: Router,
    private formBuilder: FormBuilder
  ) {}

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
  public AddressChange(address: any) {
    this.formattedaddress = address.formatted_address;
    //console.log(this.formattedaddress)
    var add: any = '';
    //console.log(address.address_components)
    for (let i = 0; i < address.address_components.length; i++) {
      for (let j = 0; j < address.address_components[i].types.length; j++) {
        //console.log(address.address_components[i].types[j])
        if (
          address.address_components[i].types[j] === 'street_number' ||
          address.address_components[i].types[j] === 'route' ||
          address.address_components[i].types[j] === 'neighborhood'
        ) {
          add += address.address_components[i].long_name + ' ';
        }
        if (address.address_components[i].types[j] === 'postal_code') {
          this.orderForm
            .get('items')
            ['controls'][0].controls.zip.patchValue(
              address.address_components[i].long_name
            );
        }
        if (
          address.address_components[i].types[j] ===
          'administrative_area_level_1'
        ) {
          this.orderForm
            .get('items')
            ['controls'][0].controls.state.patchValue(
              address.address_components[i].long_name
            );
        }
        if (address.address_components[i].types[j] === 'locality') {
          this.orderForm
            .get('items')
            ['controls'][0].controls.city.patchValue(
              address.address_components[i].long_name
            );
        }
      }
    }
    this.orderForm
      .get('items')
      ['controls'][0].controls.address_1.patchValue(add);
  }
  ngOnInit() {
    this.basicDetails = JSON.parse(localStorage.getItem('vest_login'));
    this.orderForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.addItem();
    this.model
      .common_api(
        'user/details',
        { user_uid: this.basicDetails.user_uid },
        this.basicDetails.token
      )
      .subscribe(
        (data: any) => {
          //console.log(data);
          this.model.hidespinner();
          if (data.status == 1) {
            this.orderForm
              .get('items')
              ['controls'][0].controls.address_1.patchValue(
                data.address.address_1
              );
            this.orderForm
              .get('items')
              ['controls'][0].controls.city.patchValue(data.address.city);
            this.orderForm
              .get('items')
              ['controls'][0].controls.state.patchValue(data.address.state);
            this.orderForm
              .get('items')
              ['controls'][0].controls.zip.patchValue(data.address.zip);
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
      user_uid: [this.basicDetails.user_uid],
      address_1: [null, [Validators.required]],
      city: [null, [Validators.required]],
      state: [null, [Validators.required]],
      zip: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.pattern('^(0|[1-9][0-9]*)$'),
        ],
      ],
    });
  }
  addItem(): void {
    this.items = this.orderForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  submit() {
    if (this.items.invalid) {
      this.isSubmitted = true;
    } else {
      this.isSubmitted = false;
      this.model.showspinner();
      this.model
        .common_api(
          'user/update-address',
          this.items.value[0],
          this.basicDetails.token
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
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Congratulations, you are now registered!',
      mode: 'ios',
      subHeader: 'Click the start button to begin your Collect experience',
      message: '<br/><img src="assets/icon/favicon.png" />',
      buttons: [
        {
          text: 'Start',
          handler: () => {
            this.router.navigateByUrl('/home');
          },
        },
      ],
    });

    await alert.present();
  }
}
