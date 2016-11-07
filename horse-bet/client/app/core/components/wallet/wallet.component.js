import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './wallet.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";

@Component({
  selector: 'wallet',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletComponent {

  @Input() currentBalance;
  constructor(formBuilder: FormBuilder) {
    this._builder = formBuilder;
    this.walletForm = this._builder.group({
      _id: [''],
      premierCourse: ['', Validators.required],
    });
    this.currentBalanceEventEmitter = new EventEmitter();
    this.currentBalance = 0;
    window.addEventListener('load', function() {
      // Supports Metamask and Mist, and other wallets that provide 'web3'.
      if (typeof web3 !== 'undefined') {
        // Use the Mist/wallet provider.
        window.web3 = new Web3(web3.currentProvider);
      } else {
        // No web3 detected. Show an error to the user or use Infura: https://infura.io/
      }
    });
    MonTierce.setProvider(window.web3.currentProvider);
    var contratTierce = MonTierce.deployed();

    this.chevauxEnCourse = ["cheval1", "cheval2", "cheval3","cheval4", "cheval5", "cheval6","cheval7", "cheval8", "cheval9"]; // List of cities
    this.chevauxExistants = ["cheval1", "cheval2", "cheval3","cheval4", "cheval5", "cheval6","cheval7", "cheval8", "cheval9", "cheval10", "cheval11", "cheval12", "cheval13","cheval14", "cheval15", "cheval16", "cheval17", "cheval18", "cheval19", "cheval20"]; // List of cities

    this.currentAddress =web3.eth.defaultAccount;
    web3.eth.getBalance(this.currentAddress, (error, result) => {
      if(!error){
        console.log(this);
        this.currentBalance = result.toNumber();
        this.currentBalanceEventEmitter.emit(this.currentBalance);
        console.log(this);
      }
      else{
        console.error(error);
      }
    });


  }

  ngOnInit() {

  }

}
