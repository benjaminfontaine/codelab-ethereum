import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, NgZone, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './wallet.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";
import { MonTierceService } from '../../services/montierce/monTierce.service';

@Component({
  selector: 'wallet',
  template: template,
  styleUrls: ['css/wallet.css']
})
export class WalletComponent {

  @Input() currentBalance;
  constructor(formBuilder: FormBuilder, changeDetect : ChangeDetectorRef, serviceTierce : MonTierceService) {
    this.currentBalance = 0;
    this.currentAddress = "pas d'adresse trouvée";
    this.contractAddress = "pas d'adresse trouvée";
    this.contractBalance = 0;

    if (typeof web3 !== 'undefined') {
      this.currentAddress = serviceTierce.getDefaultAddress();
      this.contractAddress = serviceTierce.getContractAddress();
      window.addEventListener('load', () => {
        serviceTierce.getBalance(this.currentAddress).subscribe(data => {
          this.currentBalance = data;
          changeDetect.detectChanges();
        });

        serviceTierce.getBalance(this.contractAddress).subscribe(data => {
          this.contractBalance = data;
          changeDetect.detectChanges();
        });
      });
    } else {
      this.errorMessage="Le plugin Metamask doit étre installé et configuré sur votre navigateur.";
    }
  }

  ngOnInit() {

  }

}
