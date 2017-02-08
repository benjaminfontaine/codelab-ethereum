import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, NgZone, ChangeDetectorRef, ApplicationRef } from '@angular/core';


import template from './wallet.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";
import { MonTierceService } from '../../services/montierce/monTierce.service';

@Component({
  selector: 'wallet',
  template: template,
  styleUrls: ['css/wallet.css']
})
export class WalletComponent {

  constructor(changeDetect: ChangeDetectorRef, ngZone: NgZone, ref: ApplicationRef, serviceTierce: MonTierceService) {
    this.currentBalance = 0;
    this.currentAddress = "pas d'adresse trouvée";
    this.contractAddress = "pas d'adresse trouvée";
    this.contractBalance = 0;
    this._ngZone = ngZone;
    this._ref = ref;
    this._changeDetectorRef = changeDetect;
    this._service = serviceTierce;
  }

  ngOnInit() {
    //called after the constructor and called  after the first ngOnChanges() 
    if (typeof web3 !== 'undefined') {
      this.currentAddress = this._service.getDefaultAddress();
      this.contractAddress = this._service.getContractAddress();
      window.addEventListener('load', () => {
        this._ngZone.run(() => {
          this.refreshCurrentAccountBalance();
        });
      });

      var accountInterval = setInterval(() => {
        console.log("Rafraîchissement des soldes");
        if (web3.eth.accounts[0] !== this.currentAddress) {
          console.log("update address and balance");
          this.currentAddress = web3.eth.accounts[0];
          this._changeDetectorRef.detectChanges();
          this._ngZone.run(() => {
            this.refreshCurrentAccountBalance();
          });
        }
        this.refreshContractBalance();
      }, 1000);
    } else {
      this.errorMessage = "Le plugin Metamask doit étre installé et configuré sur votre navigateur.";
    }
  }

  refreshContractBalance(){
     web3.eth.getBalance(this.contractAddress, (error, result) => {
          if (!error) {
            this.contractBalance = web3.fromWei(result.toNumber(), 'ether');;
          } else {
            this.errorMessage = error;
          }
    });
  }

    refreshCurrentAccountBalance(){
     web3.eth.getBalance(this.currentAddress, (error, result) => {
          if (!error) {
            this.currentBalance = web3.fromWei(result.toNumber(), 'ether');;
          } else {
            this.errorMessage = error;
          }
    });
  }


}
