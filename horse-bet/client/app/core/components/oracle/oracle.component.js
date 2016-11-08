import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './oracle.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";

@Component({
  selector: 'oracle',
  template: template,
  styleUrls: ['css/oracle.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OracleComponent {

  @Input() currentBalance;
  constructor(formBuilder: FormBuilder) {
    this._builder = formBuilder;
    this.oracleForm = this._builder.group({
      _id: [''],
      chevauxParticipants: [[], Validators.required],
    });
    this.chevauxExistants = [
      {id:1, name:"petit tonnerre"}, {id:2, name:"jolly jumper"},
      {id:3, name:"rantanplan"},{id:4, name:"the cheval"},
      {id:5, name:"chevaldireàmamère"}, {id:6, name:"canne à son"},
      {id:7, name:"K2000"}, {id:8, name:"mack"},
      {id:9, name:"ben hur"}, {id:10, name:"luke"},
      {id:11, name:"dark vador"}, {id:12, name:"j'ai plus d'idée"},
      {id:12, name:"un cheval"}, {id:14, name:"un autre cheval"},
      {id:15, name:"et encore un"}, {id:15, name:"allez le dernier"},
     ];
  }

  ngOnInit() {

  }
  creerCourse(formulaire){
    console.log(formulaire);
    MonTierce.setProvider(window.web3.currentProvider);
    var contratTierce = MonTierce.deployed();
    contratTierce.initialiserCourse(formulaire.chevauxEnCourse, { gas: 2000000, from: window.web3.eth.defaultAccount});
  }
}
