import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './pari.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";

@Component({
  selector: 'post-list',
  template: template,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PariComponent {

  @Input() currentBalance;
  constructor(formBuilder: FormBuilder) {
    this._builder = formBuilder;
    this.pariForm = this._builder.group({
      _id: [''],
      idCourse:1,
      premierCourse: [2, Validators.required],
      secondCourse: [4, Validators.required],
      troisiemeCourse: [8, Validators.required],
      misePari:0
    });
    this.courses= [{id:1, name:"course de Longchamps"}, {id:2, name:"la grosse course"}, {id:3, name:"course contre la montre"}];
    this.chevauxEnCourse = [{id:1, name:"petit tonnerre"}, {id:2, name:"jolly jumper"}, {id:3, name:"rantanplan"},{id:4, name:"the cheval"}, {id:5, name:"chevaldireàmamère"}, {id:6, name:"canne à son"}, {id:7, name:"K2000"}, {id:8, name:"mack"} ];
  }

  ngOnInit() {

  }

   parier(formulaire){
     console.log(formulaire);
     MonTierce.setProvider(window.web3.currentProvider);
     var contratTierce = MonTierce.deployed();
     if(formulaire.premierCourse != formulaire.secondCourse && formulaire.secondCourse != formulaire.troisiemeCourse && formulaire.troisiemeCourse != formulaire.premierCourse ){
       contratTierce.parier(formulaire.idCourse, [formulaire.premierCourse, formulaire.secondCourse, formulaire.troisiemeCourse], {value: formulaire.misePari, gas: 2000000, from: window.web3.eth.defaultAccount});
     }
  }
}
