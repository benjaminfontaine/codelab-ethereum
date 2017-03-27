import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import template from './pari.template.html';
import MonTierce from "../../../../../contracts/MonTierce.sol";
import { MonTierceService } from '../../services/montierce/monTierce.service';

@Component({
  selector: 'post-list',
  template: template,
  styleUrls: ['css/app.css'],
})
export class PariComponent {
  constructor(formBuilder: FormBuilder, serviceTierce : MonTierceService, changeDetect : ChangeDetectorRef) {
    this._builder = formBuilder;
    this._serviceTierce = serviceTierce;
    this._changeDetect = changeDetect;
    this.pariForm = this._builder.group({
      _id: [''],
      idCourse:1,
      premierCourse: [1, Validators.required],
      secondCourse: [2, Validators.required],
      troisiemeCourse: [3, Validators.required],
      misePari:0
    });
    this.estEnErreur=false;
    this.message='';
    this.courses= serviceTierce.getCourses();
    this.chevauxEnCourse = serviceTierce.getChevauxExistants();
  }

  ngOnInit() {

  }

   parier(formulaire){
     console.log("Pari");
     console.log(formulaire);
     if(formulaire.premierCourse != formulaire.secondCourse && formulaire.secondCourse != formulaire.troisiemeCourse && formulaire.troisiemeCourse != formulaire.premierCourse ){
       this._serviceTierce.parier(formulaire.idCourse, [formulaire.premierCourse, formulaire.secondCourse, formulaire.troisiemeCourse], formulaire.misePari).then((error, data) => {
         this.message="Le pari a bien été pris en compte.";
         this._changeDetect.detectChanges();
       })
       .catch((err) => {
         this.message="Une erreur s'est produite " + err;
         this.estEnErreur= true;
         this._changeDetect.detectChanges();
       });
     }else{
       this.message="Vous devez sélectionner trois chevaux différents";
       this.estEnErreur= true;
     }
  }
}
