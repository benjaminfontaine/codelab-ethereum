import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './wallet.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";

@Component({
  selector: 'wallet',
  template: template
})
export class WalletComponent {

  @Input() currentBalance;
  constructor(formBuilder: FormBuilder) {
    this.currentBalanceEventEmitter = new EventEmitter();
    this.currentBalance = 0;
    this.currentAddress = "pas d'adresse trouvée";
    if (typeof web3 !== 'undefined') {
      window.addEventListener('load', () => {
        this.currentAddress = 'changement adresse';
        console.log("on devrait changer d'adresse");
        // // Supports Metamask and Mist, and other wallets that provide 'web3'.
        //   // Use the Mist/wallet provider.
        //   window.web3 = new Web3(web3.currentProvider);
        //   MonTierce.setProvider(window.web3.currentProvider);
        //   var contratTierce = MonTierce.deployed();
        //   this.currentAddress =web3.eth.defaultAccount;
        //   alert(this.currentAddress);
        //   web3.eth.getBalance(this.currentAddress, (error, result) => {
        //     if(!error){
        //       console.log(this);
        //       this.currentBalance = result.toNumber();
        //       this.currentBalanceEventEmitter.emit(this.currentBalance);
        //       console.log(this);
        //     } else {
        //       console.error(error);
        //     }
        //   });
    });
    } else {
      console.log("on devrait changer d'adresse");
      setTimeout(()=>{
        this.currentAddress = 'changement adresse';
      },500);
      this.errorMessage="Le plugin Metamask doit étre installé et configuré sur votre navigateur.";
    }
  }

  ngOnInit() {

  }

}
