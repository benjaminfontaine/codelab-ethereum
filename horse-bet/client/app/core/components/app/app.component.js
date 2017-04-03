import { Component, Inject, Input, NgZone } from '@angular/core'; // eslint-disable-line no-unused-vars
import { TranslateService } from 'ng2-translate';
import { translation } from '../../../i18n/en';
import { MonTierceService } from '../../services/montierce/monTierce.service';
import template from './app.template.html';

@Component({
  selector: 'my-app',
  template: template,
  styleUrls: ['css/app.css']

})
export class AppComponent {
  constructor(@Inject('ENVIRONMENT') environment, translate: TranslateService, ngZone: NgZone, serviceTierce: MonTierceService) {
    this.environment = environment;
    this.ownerAccount="0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1";
    this.isOwner=true;
    this._ngZone = ngZone;
    this._service = serviceTierce;
    translate.setTranslation('en', translation);
    translate.setDefaultLang('en');
    translate.use('en');
  }
  ngOnInit() {
    //called after the constructor and called  after the first ngOnChanges() 
    if (typeof web3 !== 'undefined') {
      var intervalRafraichissement = setInterval(() => {
        this.currentAddress = web3.eth.accounts[0];
        this._ngZone.run(() => {
          this.refreshIsOwner();
          this.refreshCoursesAvecPariActif()
        });
      }, 500);
    } else {
      this.errorMessage = "Le plugin Metamask doit étre installé et configuré sur votre navigateur.";
    }
  }

  refreshIsOwner() {
    this.currentAddress = web3.eth.accounts[0];
    this.isOwner = this.currentAddress === this.ownerAccount;
    //console.log("Rafraichissement owner : res= "+ this.isOwner +" " + this.currentAddress + " " + this.currentAddress );
  }

  refreshCoursesAvecPariActif() {
    this._service.recupererCoursesPourPari();
  }
}
