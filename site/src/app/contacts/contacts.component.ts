import { Component, OnInit } from '@angular/core';
import {ContactsService} from './service/contacts/contacts.service';
import {ConfigurationModel} from '../shared/model/configuration.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AlertService} from '../shared/services/alert.service';
import {Router} from '@angular/router';
import {StorageEnum} from '../shared/storage.enum';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  public form: FormGroup;

  constructor(
      private service: ContactsService,
      private formBuilder: FormBuilder,
      private alert: AlertService,
      private router: Router
  ) { }

  public ngOnInit(): void {
    this.form = this.contactForm;
  }

  public sendMessage(): void {
    this.service.sendMessage(this.form.getRawValue()).subscribe(
        () => this.manageSuccessMessageSent()
    );
  }

  private manageSuccessMessageSent(): void {
    this.alert.success('Sucesso ao enviar sua mensagem. Entraremos em contato assim que possível! :)');
    this.router.navigateByUrl('/home');
  }

  public redirectToSocialMedia(url: string): void {
    window.open(url, '_blank');
  }

  get contactForm(): FormGroup {
    return this.formBuilder.group({
      fullname: [null],
      email: [null],
      phone: [null],
      subject: [null],
      message: [null]
    });
  }

  get siteInfo(): ConfigurationModel {
    return this.service.siteInfoStorage;
  }

  get banner(): string {
    const banner = JSON.stringify(localStorage.getItem(StorageEnum.BANNER));
    return `background-image:url(${banner});`;
  }

}
