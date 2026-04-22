import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {SellYourPropertyService} from './service/sell-your-property.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {AlertService} from '../shared/services/alert.service';
import {Router} from '@angular/router';
import {StorageEnum} from '../shared/storage.enum';

@Component({
  selector: 'app-sell-your-property',
  templateUrl: './sell-your-property.component.html',
  styleUrls: ['./sell-your-property.component.css']
})
export class SellYourPropertyComponent implements OnInit {

  public form: FormGroup;
  public subscription: Subscription = new Subscription();

  constructor(
      private formBuilder: FormBuilder,
      private service: SellYourPropertyService,
      private alert: AlertService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formCreation;
  }

  public sendNewProperty(): void {
    const emailData = this.form.getRawValue();

    if (!emailData.fullname || !emailData.phone) {
      this.alert.error('Por favor, preencha seu nome e telefone para o envio do formulário.');
    } else {
      this.subscription.add(
          this.service.sendNewProperty(emailData)
              .subscribe(
                  res => this.manageSuccessSendForm()
              )
      );
    }
  }

  private manageSuccessSendForm(): void {
    this.alert.success('Sucesso ao enviar formulário. Entraremos em contato assim que possível! :)');
    this.router.navigateByUrl('/home');
  }

  get formCreation(): any {
    return this.formBuilder.group({
      fullname: [ null, Validators.required ],
      email: [ null ],
      phone: [ null, Validators.required ],
      address: [ null ],
      uf: [ null ],
      city: [ null ],
      neighborhood: [ null ],
      type: [ null ],
      privativeArea: [ null ],
      totalArea: [ null ],
      parking: [ null ],
      bedrooms: [ null ],
      condominium: [ null ],
      iptu: [ null ],
      finality: [ null ],
      paidout: [ null ],
      price: [ null ],
      description: [ null ],
    });
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

}
